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

lines.push(
  '## 2. Fournir un plan : vidéo ou image fixe',
  '',
  `Chaque plan est lu sous \`public/${id}/clips/<nom>\` avec **n'importe laquelle** de ces extensions : ` +
    '`.mp4` `.mov` `.webm` (vidéo) ou `.png` `.jpg` `.jpeg` `.webp` (image fixe). Si les deux existent, la vidéo gagne. ' +
    'Une image fixe reçoit un zoom progressif pour donner du mouvement.',
  '',
  '### Générer avec ChatGPT (images)',
  '',
  '1. Travailler dans **une seule conversation** : y générer d\'abord les fiches de référence, les valider, puis ne plus en sortir.',
  '2. Pour chaque plan, **joindre les images de référence** listées (véhicule, acteurs, décor) et écrire explicitement ' +
    '« même personnage / même véhicule que les images jointes ».',
  '3. Coller le prompt du plan tel quel (les blocs d\'identité sont déjà injectés). Demander **sujet centré** et de la marge ' +
    'sur les côtés : une image 1024×1536 (2:3) est recadrée en 9:16 et perd environ 16 % de sa largeur (8 % de chaque côté).',
  '4. Aucun texte, logo ni sous-titre dans l\'image : ils sont ajoutés au montage.',
  '5. Enregistrer sous le nom exact du plan (ex. `s01-hook.png`) dans `public/' + id + '/clips/`, puis `npm run render -- --draft`.',
  '',
  'Aucun générateur ne garantit l\'identité parfaite d\'un plan à l\'autre : comparer les plans côte à côte et refaire celui qui dérive.',
  '',
);

lines.push('## 3. Plans à générer', '');
for (const scene of campaign.scenes) {
  if (scene.kind !== 'clip' || !scene.shot) continue;
  lines.push(
    `### ${scene.id} — ${scene.duration} s`,
    '',
    `- Fichier attendu : \`public/${id}/${scene.clip}\` (ou même nom en .png/.jpg/.webp)`,
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
