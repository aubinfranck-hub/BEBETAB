/**
 * Génère campaigns/<id>/SHOTS.md : la feuille de route pour le générateur de séquences (FIMGA).
 * Les blocs d'identité de la bible visuelle sont injectés À L'IDENTIQUE dans chaque prompt,
 * ce qui évite qu'un plan change de mécanicien ou de voiture.
 *
 *   npm run shots [campagne]
 */
import fs from 'node:fs';
import path from 'node:path';
import {expandShotPrompt} from '../src/lib/timeline';
import {ROOT, campaignId, loadCampaign} from './lib/io';

const id = campaignId();
const campaign = loadCampaign(id);
const {bible} = campaign;

const lines: string[] = [
  `# ${campaign.title} — feuille de plans`,
  '',
  '> Fichier GÉNÉRÉ par `npm run shots` depuis `campaign.json` : ne pas éditer à la main.',
  '',
  '## 1. Références fixes à produire et valider AVANT tout plan',
  '',
  'Placer les images validées dans `public/' + id + '/references/` sous le nom de leur identifiant (ex. `REF-VEHICLE-01.png`).',
  'Joindre les références concernées à CHAQUE génération de plan.',
  '',
];

for (const [key, entry] of Object.entries(bible)) {
  if (typeof entry === 'string') continue;
  lines.push(`### ${entry.id} (${key})`, '', entry.identity, '');
}
lines.push(`### Style commun`, '', bible.style, '');

lines.push('## 2. Plans à générer', '');
for (const scene of campaign.scenes) {
  if (scene.kind !== 'clip' || !scene.shot) continue;
  lines.push(
    `### ${scene.id} — ${scene.duration} s`,
    '',
    `- Fichier attendu : \`public/${id}/${scene.clip}\``,
    `- Références à joindre : ${scene.shot.references.map(ref => `\`${ref}\``).join(', ')}`,
    `- Intention : ${scene.shot.description}`,
    `- Caméra : ${scene.shot.camera}`,
    '',
    '```text',
    expandShotPrompt(campaign, scene),
    '```',
    '',
  );
}

const out = path.join(ROOT, 'campaigns', id, 'SHOTS.md');
fs.writeFileSync(out, lines.join('\n'));
console.log(`Écrit : ${path.relative(ROOT, out)}`);
