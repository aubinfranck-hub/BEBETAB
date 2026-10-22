/**
 * Contrôle de préparation : liste ce qui bloque (❌), ce qui est à surveiller (⚠️) et ce qui est OK (✅)
 * avant le rendu final. Sort avec le code 1 s'il y a au moins un blocage.
 *
 *   npm run check [campagne]
 *
 * Aucune clé n'est jamais affichée ; aucun appel réseau ; aucun crédit consommé.
 */
import 'dotenv/config';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import {FADE} from '../src/lib/theme';
import {buildTimeline, findPlaceholders, resolveClip} from '../src/lib/timeline';
import {PUBLIC_DIR, ROOT, campaignId, loadCampaign, loadVoice} from './lib/io';

type Level = 'ok' | 'warn' | 'fail' | 'info';
const ICON: Record<Level, string> = {ok: '✅', warn: '⚠️ ', fail: '❌', info: 'ℹ️ '};
const results: {level: Level; label: string; detail: string}[] = [];
const report = (level: Level, label: string, detail: string) => results.push({level, label, detail});

function ffmpegOutput(...args: string[]): string | null {
  const result = spawnSync('ffmpeg', ['-hide_banner', ...args], {encoding: 'utf8'});
  return result.error ? null : `${result.stdout}${result.stderr}`;
}

function checkFfmpeg() {
  const encoders = ffmpegOutput('-encoders');
  if (encoders === null || spawnSync('ffprobe', ['-version']).error) {
    report('fail', 'FFmpeg', 'ffmpeg et ffprobe doivent être installés et dans le PATH');
    return;
  }
  const filters = ffmpegOutput('-filters') ?? '';
  const amix = ffmpegOutput('-h', 'filter=amix') ?? '';
  const missing = [
    ...['libx264', 'aac'].filter(name => !new RegExp(`\\b${name}\\b`).test(encoders)),
    ...['loudnorm', 'sidechaincompress', 'alimiter'].filter(name => !new RegExp(`\\b${name}\\b`).test(filters)),
    ...(/\bnormalize\b/.test(amix) ? [] : ['amix normalize (ffmpeg ≥ 4.4)']),
  ];
  if (missing.length > 0) report('fail', 'FFmpeg', `fonctions manquantes : ${missing.join(', ')}`);
  else report('ok', 'FFmpeg', 'libx264, aac, loudnorm, sidechaincompress, amix normalize');
}

async function checkBrowser() {
  let executable = '';
  try {
    executable = await puppeteer.executablePath();
  } catch {
    /* navigateur non configuré */
  }
  if (executable && fs.existsSync(executable)) {
    report('ok', 'Chrome', `trouvé (${executable}) ; la lecture du H.264 est vérifiée au rendu`);
  } else {
    report('fail', 'Chrome', 'introuvable : lancer "npm run browser" (Chrome for Testing) ou définir PUPPETEER_EXECUTABLE_PATH');
  }
}

const id = campaignId();
const campaign = loadCampaign(id);
let timeline: ReturnType<typeof buildTimeline> = [];

async function main() {
  checkFfmpeg();
  await checkBrowser();

  try {
    timeline = buildTimeline(campaign);
    report('ok', 'Timeline', `${campaign.format.durationSeconds} s, ${timeline.length} scènes`);
  } catch (error) {
    report('fail', 'Timeline', error instanceof Error ? error.message : String(error));
  }

  const placeholders = findPlaceholders(campaign);
  if (placeholders.length > 0) report('fail', 'Textes', `texte provisoire dans : ${placeholders.join(', ')}`);
  else report('ok', 'Textes', 'aucun texte provisoire');

  const clipsDir = path.join(PUBLIC_DIR, id, 'clips');
  const files = fs.existsSync(clipsDir) ? fs.readdirSync(clipsDir).map(name => `${id}/clips/${name}`) : [];
  const missingClips = campaign.scenes.filter(scene => scene.kind === 'clip' && scene.clip && !resolveClip(files, id, scene.clip));
  if (missingClips.length > 0) {
    report('fail', 'Plans', `manquants : ${missingClips.map(scene => scene.id).join(', ')} → déposer public/${id}/clips/<nom>.(mp4|mov|webm|png|jpg|webp)`);
  } else {
    report('ok', 'Plans', 'tous les plans sont présents');
  }

  const voice = loadVoice(id);
  const voiceProblems: string[] = [];
  for (const scene of timeline.filter(item => item.voiceover)) {
    const entry = voice[scene.id];
    if (!entry || !fs.existsSync(path.join(PUBLIC_DIR, id, entry.audio))) voiceProblems.push(`${scene.id} absente`);
    else if (entry.duration > scene.duration - FADE) {
      voiceProblems.push(`${scene.id} trop longue (${entry.duration.toFixed(1)} s pour ${(scene.duration - FADE).toFixed(1)} s)`);
    }
  }
  if (voiceProblems.length > 0) report('fail', 'Voix', `${voiceProblems.join(' ; ')} → npm run voice (et raccourcir le texte si trop longue)`);
  else report('ok', 'Voix', 'générée pour chaque scène et dans la durée');

  const hasKeys = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);
  report('info', 'ElevenLabs', hasKeys ? 'clé et voix renseignées' : 'clé/voix absentes (inutile si la voix est déjà générée)');

  if (campaign.audio.music) {
    const music = path.join(PUBLIC_DIR, id, campaign.audio.music);
    if (fs.existsSync(music)) report('ok', 'Musique', campaign.audio.music);
    else report('warn', 'Musique', `public/${id}/${campaign.audio.music} absente : export sans musique (fournir un morceau licencié)`);
  }

  if (!fs.existsSync(path.join(ROOT, 'brands', `${campaign.brand}.json`))) {
    report('fail', 'Marque', `brands/${campaign.brand}.json introuvable`);
  }

  console.log(`Contrôle de « ${id} »\n`);
  for (const {level, label, detail} of results) console.log(`${ICON[level]} ${label.padEnd(10)} ${detail}`);
  const blockers = results.filter(item => item.level === 'fail').length;
  const warnings = results.filter(item => item.level === 'warn').length;
  console.log(
    `\n→ Prêt pour le rendu final : ${blockers === 0 ? 'OUI' : `NON (${blockers} blocage${blockers > 1 ? 's' : ''})`}` +
      (warnings > 0 ? `, ${warnings} avertissement${warnings > 1 ? 's' : ''}` : ''),
  );
  process.exit(blockers === 0 ? 0 : 1);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
