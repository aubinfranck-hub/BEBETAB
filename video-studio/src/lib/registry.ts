/// <reference types="vite/client" />
import type {AssetManifest, Brand, Campaign, CampaignVoice} from '../types';

// Une nouvelle campagne = un nouveau dossier campaigns/<id>/campaign.json, aucun code à modifier.
const campaignModules = import.meta.glob('../../campaigns/*/campaign.json', {
  eager: true,
  import: 'default',
}) as Record<string, Campaign>;

const voiceModules = import.meta.glob('../../campaigns/*/voice.json', {
  eager: true,
  import: 'default',
}) as Record<string, CampaignVoice>;

const brandModules = import.meta.glob('../../brands/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Brand>;

const assetModules = import.meta.glob('../generated/assets.json', {
  eager: true,
  import: 'default',
}) as Record<string, AssetManifest>;

function folderOf(path: string): string {
  const match = path.match(/campaigns\/([^/]+)\//);
  if (!match) throw new Error(`Chemin de campagne inattendu : ${path}`);
  return match[1];
}

export function loadCampaign(id: string): Campaign {
  const entry = Object.entries(campaignModules).find(([path]) => folderOf(path) === id);
  if (!entry) {
    throw new Error(
      `Campagne "${id}" introuvable. Disponibles : ` +
        Object.keys(campaignModules).map(folderOf).join(', '),
    );
  }
  return entry[1];
}

export function loadVoice(id: string): CampaignVoice {
  const entry = Object.entries(voiceModules).find(([path]) => folderOf(path) === id);
  return entry ? entry[1] : {};
}

export function loadBrand(id: string): Brand {
  const entry = Object.entries(brandModules).find(([, brand]) => brand.id === id);
  if (!entry) throw new Error(`Marque "${id}" introuvable dans brands/`);
  return entry[1];
}

export function loadAssets(): AssetManifest {
  const manifest = Object.values(assetModules)[0];
  return manifest ?? {files: [], media: {}};
}

export const DEFAULT_CAMPAIGN = 'scan-express';
