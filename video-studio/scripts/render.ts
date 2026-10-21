/**
 * Rendu Revideo (vidéo seule, sans mixage audio) -> output/<campagne>-raw.mp4
 *
 *   npm run render [campagne] [--draft]
 *
 * Sans --draft, le rendu est refusé s'il manque des clips ou s'il reste des textes provisoires
 * (marqueurs "XX XX" / "À COMPLÉTER") : on n'exporte pas par erreur une pub avec des cartes de remplacement.
 * RANGE="0,6" restreint le rendu à une plage en secondes (aperçu rapide).
 */
import 'dotenv/config';
// Revideo envoie par défaut des événements d'usage à PostHog ; désactivé sauf demande contraire.
process.env.DISABLE_TELEMETRY ??= 'true';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
import {renderVideo} from '@revideo/renderer';
import type {AssetManifest} from '../src/types';
import {IMAGE_PATTERN, buildTimeline, findPlaceholders, resolveClip} from '../src/lib/timeline';
import {ROOT, campaignId, hasFlag, loadCampaign, readJson} from './lib/io';

/**
 * Revideo décode les clips dans le navigateur. Le Chromium de Playwright/Debian n'a pas H.264 :
 * le rendu resterait bloqué sans erreur. On vérifie donc le codec avant de lancer quoi que ce soit.
 */
async function assertBrowserPlaysH264(args: string[]) {
  const browser = await puppeteer.launch({headless: true, args});
  try {
    const page = await browser.newPage();
    const support = await page.evaluate(() =>
      document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028"'),
    );
    if (!support) {
      throw new Error(
        'Ce navigateur ne lit pas le H.264 (clips MP4). Installer Chrome for Testing avec ' +
          '"npm run browser" ou pointer PUPPETEER_EXECUTABLE_PATH vers Google Chrome.',
      );
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const id = campaignId();
  const draft = hasFlag('--draft');
  const campaign = loadCampaign(id);
  buildTimeline(campaign); // lève une erreur si les durées ne totalisent pas format.durationSeconds

  const assets = readJson<AssetManifest>(path.join(ROOT, 'src', 'generated', 'assets.json'), {
    files: [],
    media: {},
  });
  const missingClips = campaign.scenes
    .filter(scene => scene.kind === 'clip' && scene.clip && !resolveClip(Object.keys(assets.media), id, scene.clip))
    .map(scene => `public/${id}/${scene.clip} (ou une image .png/.jpg/.webp du même nom)`);
  const placeholders = findPlaceholders(campaign);

  if (missingClips.length || placeholders.length) {
    const report = [
      ...missingClips.map(file => `  - clip manquant : ${file}`),
      ...placeholders.map(field => `  - texte provisoire : ${field}`),
    ].join('\n');
    if (!draft) {
      console.error(`Rendu final refusé :\n${report}\nUtiliser --draft pour un brouillon.`);
      process.exit(1);
    }
    console.warn(`Brouillon avec éléments provisoires :\n${report}`);
  }

  const range = process.env.RANGE?.split(',').map(Number);
  const asRoot = typeof process.getuid === 'function' && process.getuid() === 0;
  if (Object.keys(assets.media).some(file => !IMAGE_PATTERN.test(file))) await assertBrowserPlaysH264(asRoot ? ['--no-sandbox'] : []);

  // Garde-fou : un rendu qui ne progresse plus ne doit pas bloquer indéfiniment un serveur.
  const timeoutMinutes = Number(process.env.RENDER_TIMEOUT_MIN || 45);
  const watchdog = setTimeout(() => {
    console.error(`Rendu interrompu : aucune fin après ${timeoutMinutes} min (RENDER_TIMEOUT_MIN).`);
    process.exit(1);
  }, timeoutMinutes * 60_000);

  const file = await renderVideo({
    projectFile: './src/project.tsx',
    variables: {campaignId: id},
    settings: {
      // Revideo cherche public/ à <outDir>/../public : outDir doit rester directement sous la racine du projet.
      outDir: path.join(ROOT, 'output'),
      outFile: `${id}-raw.mp4`,
      logProgress: true,
      workers: Number(process.env.RENDER_WORKERS || 1),
      puppeteer: asRoot ? {args: ['--no-sandbox']} : undefined,
      projectSettings: range && range.length === 2 ? {range: [range[0], range[1]]} : undefined,
    },
  });
  clearTimeout(watchdog);
  // Fichiers intermédiaires de Revideo (la vidéo brute est ${id}-raw.mp4)
  for (const suffix of ['-0.mp4', '-visuals.mp4', '-audio.wav']) {
    fs.rmSync(path.join(ROOT, 'output', `${id}-raw${suffix}`), {force: true});
  }
  console.log(`Rendu vidéo : ${file}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
