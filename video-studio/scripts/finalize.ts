/**
 * Export final FFmpeg : MP4 1080×1920 H.264/AAC, voix calée sur les scènes, musique avec ducking
 * sous la voix, normalisation à -14 LUFS, faststart pour les réseaux sociaux.
 *
 *   npm run finalize [campagne]
 *
 * Nécessite ffmpeg >= 4.4 (option amix normalize).
 */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {buildTimeline} from '../src/lib/timeline';
import {PUBLIC_DIR, ROOT, campaignId, loadCampaign, loadVoice} from './lib/io';

function run(command: string, args: string[]): void {
  const result = spawnSync(command, args, {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} a échoué (code ${result.status})`);
}

function probe(file: string): {width: number; height: number; duration: number; audio: boolean} {
  const result = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration', '-of', 'json', file],
    {encoding: 'utf8'},
  );
  if (result.status !== 0) throw new Error(`ffprobe n'a pas pu lire ${file}`);
  const data = JSON.parse(result.stdout);
  const video = data.streams.find((stream: {codec_type: string}) => stream.codec_type === 'video');
  return {
    width: video.width,
    height: video.height,
    duration: Number(data.format.duration),
    audio: data.streams.some((stream: {codec_type: string}) => stream.codec_type === 'audio'),
  };
}

const id = campaignId();
const campaign = loadCampaign(id);
const timeline = buildTimeline(campaign);
const voice = loadVoice(id);
const {width, height, fps, durationSeconds} = campaign.format;

const rawVideo = path.join(ROOT, 'output', `${id}-raw.mp4`);
if (!fs.existsSync(rawVideo)) {
  console.error(`Vidéo brute introuvable : ${rawVideo}\nLancer d'abord : npm run render`);
  process.exit(1);
}

const inputs: string[] = ['-i', rawVideo];
const filters: string[] = [];
const voiceLabels: string[] = [];
const stereo = 'aresample=48000,aformat=channel_layouts=stereo';

for (const scene of timeline) {
  const entry = voice[scene.id];
  const file = entry ? path.join(PUBLIC_DIR, id, entry.audio) : null;
  if (!entry || !file || !fs.existsSync(file)) continue;
  const index = inputs.filter(arg => arg === '-i').length;
  const delay = Math.round(scene.start * 1000);
  inputs.push('-i', file);
  filters.push(
    `[${index}:a]${stereo},adelay=${delay}|${delay},volume=${campaign.audio.voiceVolume}[v${voiceLabels.length}]`,
  );
  voiceLabels.push(`[v${voiceLabels.length}]`);
}

const musicFile = campaign.audio.music ? path.join(PUBLIC_DIR, id, campaign.audio.music) : null;
const hasMusic = musicFile !== null && fs.existsSync(musicFile);
if (hasMusic) {
  const index = inputs.filter(arg => arg === '-i').length;
  inputs.push('-stream_loop', '-1', '-i', musicFile);
  filters.push(
    `[${index}:a]${stereo},atrim=0:${durationSeconds},asetpts=PTS-STARTPTS,` +
      `volume=${campaign.audio.musicVolume},afade=t=in:d=0.5,afade=t=out:st=${durationSeconds - 1.5}:d=1.5[music]`,
  );
}

if (voiceLabels.length > 0) {
  const joined = voiceLabels.join('');
  filters.push(
    voiceLabels.length === 1
      ? `${joined}anull[voiceraw]`
      : `${joined}amix=inputs=${voiceLabels.length}:duration=longest:dropout_transition=0:normalize=0[voiceraw]`,
  );
  // Niveau voix constant d'une campagne à l'autre : le ducking en dépend (clé du sidechain)
  filters.push('[voiceraw]loudnorm=I=-16:TP=-1.5:LRA=7[voice]');
}

let mixLabel: string | null = null;
if (voiceLabels.length > 0 && hasMusic) {
  // Ducking : la musique baisse automatiquement quand la voix parle
  filters.push('[voice]asplit=2[voice_out][voice_key]');
  const threshold = campaign.audio.duckThreshold ?? 0.03;
  const ratio = campaign.audio.duckRatio ?? 4;
  filters.push(
    `[music][voice_key]sidechaincompress=threshold=${threshold}:ratio=${ratio}:attack=15:release=400:makeup=1[ducked]`,
  );
  filters.push('[voice_out][ducked]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0[mix]');
  mixLabel = 'mix';
} else if (voiceLabels.length > 0) {
  mixLabel = 'voice';
} else if (hasMusic) {
  mixLabel = 'music';
}

const args = ['-y', ...inputs];
if (mixLabel) {
  filters.push(`[${mixLabel}]loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.95[aout]`);
  args.push('-filter_complex', filters.join(';'), '-map', '0:v:0', '-map', '[aout]');
} else {
  console.warn('Aucune voix ni musique trouvée : export sans piste audio.');
  args.push('-map', '0:v:0', '-an');
}

const outFile = path.join(ROOT, 'output', `${id}_${width}x${height}.mp4`);
args.push(
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high',
  '-pix_fmt', 'yuv420p', '-r', String(fps),
  ...(mixLabel ? ['-c:a', 'aac', '-b:a', '192k', '-ar', '48000'] : []),
  '-movflags', '+faststart',
  '-t', String(durationSeconds),
  outFile,
);

if (process.env.DEBUG_FFMPEG) console.log(`ffmpeg ${args.map(arg => JSON.stringify(arg)).join(' ')}`);
run('ffmpeg', args);

const result = probe(outFile);
const problems: string[] = [];
if (result.width !== width || result.height !== height) {
  problems.push(`dimensions ${result.width}×${result.height} au lieu de ${width}×${height}`);
}
if (Math.abs(result.duration - durationSeconds) > 0.2) {
  problems.push(`durée ${result.duration.toFixed(2)} s au lieu de ${durationSeconds} s`);
}
if (mixLabel && !result.audio) problems.push('piste audio absente');
if (problems.length > 0) {
  console.error(`Export invalide : ${problems.join(' ; ')}`);
  process.exit(1);
}
console.log(
  `OK -> ${path.relative(ROOT, outFile)} (${result.width}×${result.height}, ${result.duration.toFixed(2)} s, ` +
    `audio : ${result.audio ? 'oui' : 'non'})`,
);
