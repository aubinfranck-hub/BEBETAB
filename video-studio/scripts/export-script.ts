/**
 * Génère campaigns/<id>/SCRIPT.md : le script lisible (minutage, voix off, texte à l'écran, plan)
 * avec une estimation de la durée parlée par scène. Fichier GÉNÉRÉ depuis campaign.json.
 *
 *   npm run script [campagne]
 */
import fs from 'node:fs';
import path from 'node:path';
import {SPEECH_FILL_LIMIT, buildTimeline, estimateSpeechSeconds} from '../src/lib/timeline';
import {FADE} from '../src/lib/theme';
import {ROOT, campaignId, loadCampaign} from './lib/io';

const id = campaignId();
const campaign = loadCampaign(id);
const timeline = buildTimeline(campaign);
const clock = (seconds: number) => `0:${String(Math.round(seconds)).padStart(2, '0')}`;
const cell = (text: string) => text.replace(/\n/g, ' ').replace(/\|/g, '\\|');

const rows = timeline.map(scene => {
  const speech = scene.voiceover ? estimateSpeechSeconds(scene.voiceover) : 0;
  const room = scene.duration - FADE;
  const status = !scene.voiceover ? '—' : speech <= room * SPEECH_FILL_LIMIT ? '✅' : speech <= room ? '⚠️ juste' : '⚠️ trop long';
  const screen = [scene.headline, scene.subheadline].filter(Boolean).join(' / ');
  const visual = scene.kind === 'obd' ? 'Animation OBD + analyse IA (code)' : scene.kind === 'cta' ? 'Carte finale (code)' : scene.shot?.description ?? '';
  return (
    `| ${scene.id} | ${clock(scene.start)}–${clock(scene.start + scene.duration)} | ${cell(scene.voiceover ?? '')} | ` +
    `${cell(screen)} | ${cell(visual)} | ${speech.toFixed(1)} s / ${room.toFixed(1)} s ${status} |`
  );
});

const spoken = timeline.reduce((sum, scene) => sum + (scene.voiceover ? estimateSpeechSeconds(scene.voiceover) : 0), 0);
const lines = [
  `# ${campaign.title} — script`,
  '',
  '> Fichier GÉNÉRÉ par `npm run script` depuis `campaign.json` : modifier le JSON, pas ce fichier.',
  '',
  `Durée ${campaign.format.durationSeconds} s · format ${campaign.format.width}×${campaign.format.height} · voix estimée au total ≈ ${spoken.toFixed(0)} s.`,
  'L\'estimation (≈ 150 mots/min + pauses, ±20 %) sert à repérer un texte trop long avant de payer la voix ; la durée réelle vient de `npm run voice`.',
  '',
  '| Scène | Temps | Voix off | À l\'écran | Plan | Voix estimée / disponible |',
  '|---|---|---|---|---|---|',
  ...rows,
  '',
  `Contact affiché : ${campaign.cta.contact} · Tagline : « ${campaign.cta.tagline} »`,
  '',
  '## À valider avant diffusion',
  '',
  '- **Contact** : le numéro/lien est encore un marqueur (`XX XX`) ; le rendu final reste bloqué tant qu\'il n\'est pas renseigné.',
  '- **Promesses commerciales** : aucun prix, délai chiffré ni garantie n\'est cité (pas de « rapide » dans la voix : le nom « Express » le suggère déjà). À vous d\'ajouter ce que vous pouvez tenir.',
  '- **« Notre intelligence artificielle »** : à garder seulement si l\'analyse IA fait bien partie du service livré.',
  '- **Cas OBD (P0300, bougie ou bobine)** : exemple illustratif ; le faire valider par un technicien.',
  '- **Prononciation** : écouter « DiagAssist », « SCAN EXPRESS » et « OBD » dans la voix choisie avant de valider.',
  '- **Musique** : fournir un morceau licencié (`audio.music`).',
  '',
];

const out = path.join(ROOT, 'campaigns', id, 'SCRIPT.md');
fs.writeFileSync(out, lines.join('\n'));
console.log(`Écrit : ${path.relative(ROOT, out)}`);
