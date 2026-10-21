/**
 * Teste scripts/voice-elevenlabs.ts de bout en bout contre un FAUX serveur qui reproduit le format
 * documenté de POST /v1/text-to-speech/:voice_id/with-timestamps. Ne prouve pas que l'API réelle
 * accepte la requête (aucune clé), mais vérifie le parsing, le cache, l'écriture et la reprise.
 */
import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
import os from 'node:os';
import path from 'node:path';
import {after, before, describe, it} from 'node:test';
import type {CampaignVoice} from '../src/types';

const ffmpeg = spawnSync('ffmpeg', ['-version']);
const canRun = !ffmpeg.error && ffmpeg.status === 0;
const projectRoot = path.join(__dirname, '..');

interface Recorded {
  voiceId: string;
  apiKey: string | undefined;
  body: {text: string; model_id: string};
}

describe('voice-elevenlabs (faux serveur)', {skip: !canRun && 'ffmpeg indisponible'}, () => {
  let tmp: string;
  let server: http.Server;
  let baseUrl: string;
  let mp3Base64: string;
  const requests: Recorded[] = [];
  let failTexts: string[] = [];

  const scenes = [
    {id: 'a', kind: 'cta', duration: 4, voiceover: 'Voyant moteur allumé ? Ne roulez pas.'},
    {id: 'b', kind: 'cta', duration: 3, voiceover: 'Contactez-nous maintenant.'},
  ];

  function writeCampaign(texts: [string, string]) {
    const campaign = {
      id: 'test',
      format: {width: 1080, height: 1920, fps: 30, durationSeconds: 7},
      scenes: scenes.map((scene, index) => ({...scene, voiceover: texts[index]})),
    };
    fs.writeFileSync(path.join(tmp, 'campaigns', 'test', 'campaign.json'), JSON.stringify(campaign));
  }

  function run(...args: string[]): Promise<{code: number | null; output: string}> {
    return new Promise(resolve => {
      const child = spawn(
        path.join(projectRoot, 'node_modules', '.bin', 'tsx'),
        [path.join(projectRoot, 'scripts', 'voice-elevenlabs.ts'), 'test', ...args],
        {
          cwd: tmp,
          env: {
            ...process.env,
            VIDEO_STUDIO_ROOT: tmp,
            ELEVENLABS_API_KEY: 'test-key',
            ELEVENLABS_VOICE_ID: 'voice-123',
            ELEVENLABS_BASE_URL: baseUrl,
          },
        },
      );
      let output = '';
      child.stdout.on('data', chunk => (output += chunk));
      child.stderr.on('data', chunk => (output += chunk));
      child.on('close', code => resolve({code, output}));
    });
  }

  const readVoice = (): CampaignVoice =>
    JSON.parse(fs.readFileSync(path.join(tmp, 'campaigns', 'test', 'voice.json'), 'utf8'));

  before(async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-test-'));
    fs.mkdirSync(path.join(tmp, 'campaigns', 'test'), {recursive: true});
    const mp3 = path.join(tmp, 'tone.mp3');
    const made = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'sine=frequency=300:duration=1', mp3]);
    assert.equal(made.status, 0, 'ffmpeg doit pouvoir créer un mp3 de test');
    mp3Base64 = fs.readFileSync(mp3).toString('base64');

    server = http.createServer((req, res) => {
      let raw = '';
      req.on('data', chunk => (raw += chunk));
      req.on('end', () => {
        const match = req.url?.match(/^\/v1\/text-to-speech\/([^/?]+)\/with-timestamps\?output_format=mp3_44100_128$/);
        if (req.method !== 'POST' || !match) {
          res.writeHead(404).end();
          return;
        }
        const body = JSON.parse(raw);
        requests.push({voiceId: match[1], apiKey: req.headers['xi-api-key'] as string | undefined, body});
        if (failTexts.includes(body.text)) {
          res.writeHead(500, {'Content-Type': 'application/json'}).end('{"detail":"boom"}');
          return;
        }
        const characters = [...body.text];
        res.writeHead(200, {'Content-Type': 'application/json'}).end(
          JSON.stringify({
            audio_base64: mp3Base64,
            alignment: {
              characters,
              character_start_times_seconds: characters.map((_, i) => i * 0.05),
              character_end_times_seconds: characters.map((_, i) => (i + 1) * 0.05),
            },
            normalized_alignment: null,
          }),
        );
      });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  after(() => {
    server.close();
    fs.rmSync(tmp, {recursive: true, force: true});
  });

  it('génère les deux scènes, avec clé, voix et modèle attendus', async () => {
    writeCampaign([scenes[0].voiceover, scenes[1].voiceover]);
    const {code, output} = await run();
    assert.equal(code, 0, output);
    assert.equal(requests.length, 2);
    assert.deepEqual(requests.map(r => r.voiceId), ['voice-123', 'voice-123']);
    assert.ok(requests.every(r => r.apiKey === 'test-key'));
    assert.ok(requests.every(r => r.body.model_id === 'eleven_multilingual_v2'));

    const voice = readVoice();
    assert.deepEqual(Object.keys(voice), ['a', 'b']);
    assert.deepEqual(voice.a.words.map(w => w.text), ['Voyant', 'moteur', 'allumé?', 'Ne', 'roulez', 'pas.']);
    assert.ok(fs.existsSync(path.join(tmp, 'public', 'test', voice.a.audio)));
    assert.ok(Math.abs(voice.a.duration - 1) < 0.1, `durée ffprobe attendue ~1 s, obtenue ${voice.a.duration}`);
  });

  it('ne regénère pas (ni ne refacture) une scène inchangée', async () => {
    const before = requests.length;
    const {code, output} = await run();
    assert.equal(code, 0, output);
    assert.equal(requests.length, before);
    assert.match(output, /inchangée/);
  });

  it('ne regénère que la scène dont le texte a changé', async () => {
    const before = requests.length;
    writeCampaign([scenes[0].voiceover, 'Appelez-nous dès maintenant.']);
    const {code, output} = await run();
    assert.equal(code, 0, output);
    assert.equal(requests.length, before + 1);
    assert.equal(requests[requests.length - 1].body.text, 'Appelez-nous dès maintenant.');
  });

  it('--force regénère tout', async () => {
    const before = requests.length;
    const {code} = await run('--force');
    assert.equal(code, 0);
    assert.equal(requests.length, before + 2);
  });

  it("garde les scènes déjà faites quand une scène échoue, et reprend là où ça s'est arrêté", async () => {
    fs.rmSync(path.join(tmp, 'campaigns', 'test', 'voice.json'));
    fs.rmSync(path.join(tmp, 'public'), {recursive: true});
    const failing = 'Texte qui échoue.';
    failTexts = [failing];
    writeCampaign([scenes[0].voiceover, failing]);

    const failed = await run();
    assert.notEqual(failed.code, 0);
    assert.match(failed.output, /ElevenLabs 500 pour b/);
    assert.deepEqual(Object.keys(readVoice()), ['a'], 'la scène a doit être conservée');

    failTexts = [];
    const before = requests.length;
    const resumed = await run();
    assert.equal(resumed.code, 0, resumed.output);
    assert.equal(requests.length, before + 1, 'seule la scène b doit être redemandée');
    assert.deepEqual(Object.keys(readVoice()), ['a', 'b']);
  });

  it("échoue clairement sans clé d'API", async () => {
    const result = spawnSync(
      path.join(projectRoot, 'node_modules', '.bin', 'tsx'),
      [path.join(projectRoot, 'scripts', 'voice-elevenlabs.ts'), 'test'],
      {cwd: tmp, encoding: 'utf8', env: {...process.env, VIDEO_STUDIO_ROOT: tmp, ELEVENLABS_API_KEY: '', ELEVENLABS_VOICE_ID: ''}},
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /ELEVENLABS_API_KEY et ELEVENLABS_VOICE_ID sont requis/);
  });
});
