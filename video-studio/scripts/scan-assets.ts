/**
 * Inventorie public/ dans src/generated/assets.json (fichiers présents + dimensions/durées via ffprobe).
 * Le montage s'en sert pour savoir quels clips existent et pour recadrer en "cover" 9:16.
 */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type {AssetManifest, MediaInfo} from '../src/types';
import {PUBLIC_DIR, ROOT} from './lib/io';

const MEDIA_EXT = new Set(['.mp4', '.mov', '.webm', '.png', '.jpg', '.jpeg', '.webp']);

function walk(dir: string, base = ''): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return walk(path.join(dir, entry.name), rel);
    return entry.name === '.gitkeep' ? [] : [rel];
  });
}

function probe(file: string): MediaInfo | null {
  const result = spawnSync(
    'ffprobe',
    [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height:format=duration',
      '-of', 'json',
      file,
    ],
    {encoding: 'utf8'},
  );
  if (result.error || result.status !== 0) return null;
  const data = JSON.parse(result.stdout);
  const stream = data.streams?.[0];
  if (!stream) return null;
  return {width: stream.width, height: stream.height, duration: Number(data.format?.duration) || 0};
}

const files = walk(PUBLIC_DIR).sort();
const media: Record<string, MediaInfo> = {};
for (const rel of files) {
  if (!MEDIA_EXT.has(path.extname(rel).toLowerCase())) continue;
  const info = probe(path.join(PUBLIC_DIR, rel));
  if (info) media[rel] = info;
  else console.warn(`ffprobe n'a pas pu lire ${rel} (ffprobe installé ? fichier valide ?)`);
}

const manifest: AssetManifest = {files, media};
const out = path.join(ROOT, 'src', 'generated', 'assets.json');
fs.mkdirSync(path.dirname(out), {recursive: true});
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`assets.json : ${files.length} fichier(s), ${Object.keys(media).length} média(s) analysé(s)`);
