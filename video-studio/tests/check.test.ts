/** Teste scripts/check.ts dans un projet temporaire : d'abord incomplet, puis complet. */
import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {after, before, describe, it} from 'node:test';
import type {Campaign} from '../src/types';

const projectRoot = path.join(__dirname, '..');
const canRun = !spawnSync('ffmpeg', ['-version']).error && !spawnSync('ffprobe', ['-version']).error;

describe('check (projet temporaire)', {skip: !canRun && 'ffmpeg indisponible'}, () => {
  let tmp: string;
  let campaign: Campaign;

  function run(): Promise<{code: number | null; output: string}> {
    return new Promise(resolve => {
      const child = spawn(path.join(projectRoot, 'node_modules', '.bin', 'tsx'), [path.join(projectRoot, 'scripts', 'check.ts'), 'scan-express'], {
        cwd: tmp,
        env: {...process.env, VIDEO_STUDIO_ROOT: tmp, PUPPETEER_EXECUTABLE_PATH: process.execPath, ELEVENLABS_API_KEY: 'secret-check-key', ELEVENLABS_VOICE_ID: ''},
      });
      let output = '';
      child.stdout.on('data', chunk => (output += chunk));
      child.stderr.on('data', chunk => (output += chunk));
      child.on('close', code => resolve({code, output}));
    });
  }

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-test-'));
    fs.mkdirSync(path.join(tmp, 'campaigns', 'scan-express'), {recursive: true});
    fs.mkdirSync(path.join(tmp, 'brands'), {recursive: true});
    fs.copyFileSync(path.join(projectRoot, 'campaigns', 'scan-express', 'campaign.json'), path.join(tmp, 'campaigns', 'scan-express', 'campaign.json'));
    fs.copyFileSync(path.join(projectRoot, 'brands', 'diagassist.json'), path.join(tmp, 'brands', 'diagassist.json'));
    campaign = JSON.parse(fs.readFileSync(path.join(tmp, 'campaigns', 'scan-express', 'campaign.json'), 'utf8'));
  });

  after(() => fs.rmSync(tmp, {recursive: true, force: true}));

  it('signale plans et voix manquants, bloque (code 1) et ne révèle jamais la clé', async () => {
    const {code, output} = await run();
    assert.equal(code, 1, output);
    assert.match(output, /❌ Plans\s+manquants : s01-hook, s02-probleme, s03-solution, s05-resultat/);
    assert.match(output, /❌ Voix\s+s01-hook absente/);
    assert.match(output, /✅ Timeline\s+45 s, 6 scènes/);
    assert.match(output, /✅ Textes/);
    assert.match(output, /⚠️\s+Musique/);
    assert.match(output, /clé\/voix absentes/);
    assert.match(output, /Prêt pour le rendu final : NON \(2 blocages\)/);
    assert.ok(!output.includes('secret-check-key'));
  });

  it('accepte des plans en vidéo ou en image, et une voix qui tient dans sa scène', async () => {
    const clips = path.join(tmp, 'public', 'scan-express', 'clips');
    const voiceDir = path.join(tmp, 'public', 'scan-express', 'voice');
    fs.mkdirSync(clips, {recursive: true});
    fs.mkdirSync(voiceDir, {recursive: true});
    const clipScenes = campaign.scenes.filter(scene => scene.kind === 'clip');
    clipScenes.forEach((scene, index) => fs.writeFileSync(path.join(clips, `${scene.id}.${index % 2 ? 'png' : 'mp4'}`), ''));
    const voice: Record<string, unknown> = {};
    for (const scene of campaign.scenes.filter(item => item.voiceover)) {
      fs.writeFileSync(path.join(voiceDir, `${scene.id}.mp3`), '');
      voice[scene.id] = {audio: `voice/${scene.id}.mp3`, duration: 1, words: [], hash: 'x'};
    }
    fs.writeFileSync(path.join(tmp, 'campaigns', 'scan-express', 'voice.json'), JSON.stringify(voice));

    const {code, output} = await run();
    assert.equal(code, 0, output);
    assert.match(output, /✅ Plans\s+tous les plans sont présents/);
    assert.match(output, /✅ Voix/);
    assert.match(output, /Prêt pour le rendu final : OUI, 1 avertissement/);
  });

  it('bloque une voix plus longue que sa scène', async () => {
    const file = path.join(tmp, 'campaigns', 'scan-express', 'voice.json');
    const voice = JSON.parse(fs.readFileSync(file, 'utf8'));
    voice['s01-hook'].duration = 9;
    fs.writeFileSync(file, JSON.stringify(voice));
    const {code, output} = await run();
    assert.equal(code, 1, output);
    assert.match(output, /s01-hook trop longue \(9\.0 s pour 3\.7 s\)/);
  });
});
