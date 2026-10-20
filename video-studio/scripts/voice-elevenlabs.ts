/**
 * Génère la voix off de chaque scène avec ElevenLabs ET les timestamps mot par mot
 * (endpoint /with-timestamps) : pas besoin de Whisper pour synchroniser les sous-titres.
 * Une scène dont le texte/la voix n'a pas changé n'est pas régénérée (pas de crédits gaspillés).
 *
 *   npm run voice [campagne] [--force]
 */
import 'dotenv/config';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type {CampaignVoice, WordTiming} from '../src/types';
import {FADE} from '../src/lib/theme';
import {mergePunctuation} from '../src/lib/timeline';
import {PUBLIC_DIR, campaignId, hasFlag, loadCampaign, loadVoice, voicePath} from './lib/io';

interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

function wordsFromAlignment(alignment: Alignment): WordTiming[] {
  const words: WordTiming[] = [];
  let text = '';
  let start = 0;
  let end = 0;
  alignment.characters.forEach((char, index) => {
    if (/\s/.test(char)) {
      if (text) words.push({text, start, end});
      text = '';
      return;
    }
    if (!text) start = alignment.character_start_times_seconds[index];
    text += char;
    end = alignment.character_end_times_seconds[index];
  });
  if (text) words.push({text, start, end});
  return words;
}

function audioDuration(file: string, fallback: number): number {
  const probe = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file],
    {encoding: 'utf8'},
  );
  const value = Number(probe.stdout);
  return probe.status === 0 && Number.isFinite(value) ? value : fallback;
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
  if (!apiKey || !voiceId) {
    console.error('ELEVENLABS_API_KEY et ELEVENLABS_VOICE_ID sont requis (voir .env.example).');
    process.exit(1);
  }

  const id = campaignId();
  const force = hasFlag('--force');
  const campaign = loadCampaign(id);
  const previous = loadVoice(id);
  const next: CampaignVoice = {};
  const outDir = path.join(PUBLIC_DIR, id, 'voice');
  fs.mkdirSync(outDir, {recursive: true});

  for (const scene of campaign.scenes) {
    const text = scene.voiceover?.trim();
    if (!text) continue;

    const relAudio = `voice/${scene.id}.mp3`;
    const file = path.join(PUBLIC_DIR, id, relAudio);
    const hash = crypto.createHash('sha1').update(`${modelId}|${voiceId}|${text}`).digest('hex');
    const cached = previous[scene.id];
    if (!force && cached?.hash === hash && fs.existsSync(file)) {
      console.log(`= ${scene.id} : inchangée, ignorée`);
      next[scene.id] = cached;
      continue;
    }

    console.log(`+ ${scene.id} : génération…`);
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {'xi-api-key': apiKey, 'Content-Type': 'application/json'},
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true},
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`ElevenLabs ${response.status} pour ${scene.id} : ${await response.text()}`);
    }
    const data = (await response.json()) as {audio_base64: string; alignment: Alignment};
    fs.writeFileSync(file, Buffer.from(data.audio_base64, 'base64'));

    const words = mergePunctuation(wordsFromAlignment(data.alignment));
    const alignedEnd = words.length ? words[words.length - 1].end : 0;
    const duration = audioDuration(file, alignedEnd);
    next[scene.id] = {audio: relAudio, duration, words, hash};

    if (duration > scene.duration - FADE) {
      console.warn(
        `  ⚠ ${scene.id} : la voix dure ${duration.toFixed(2)} s pour une scène de ${scene.duration} s ` +
          `(marge de fondu ${FADE} s). Raccourcir le texte ou allonger la scène.`,
      );
    }
  }

  fs.writeFileSync(voicePath(id), JSON.stringify(next, null, 2) + '\n');
  console.log(`voice.json écrit (${Object.keys(next).length} scène(s)).`);
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
