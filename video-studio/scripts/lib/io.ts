import fs from 'node:fs';
import path from 'node:path';
import type {Brand, Campaign, CampaignVoice} from '../../src/types';

export const ROOT = path.resolve(__dirname, '..', '..');
export const PUBLIC_DIR = path.join(ROOT, 'public');

export function readJson<T>(file: string, fallback?: T): T {
  if (!fs.existsSync(file)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Fichier introuvable : ${file}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
}

export function campaignId(argv: string[] = process.argv.slice(2)): string {
  const positional = argv.filter(arg => !arg.startsWith('--'));
  return positional[0] ?? process.env.CAMPAIGN ?? 'scan-express';
}

export function loadCampaign(id: string): Campaign {
  return readJson<Campaign>(path.join(ROOT, 'campaigns', id, 'campaign.json'));
}

export function loadBrand(id: string): Brand {
  return readJson<Brand>(path.join(ROOT, 'brands', `${id}.json`));
}

export function voicePath(id: string): string {
  return path.join(ROOT, 'campaigns', id, 'voice.json');
}

export function loadVoice(id: string): CampaignVoice {
  return readJson<CampaignVoice>(voicePath(id), {});
}

export function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}
