# Video Studio — publicités DiagAssist / TechAssist

Pipeline de montage **programmable** pour produire des publicités verticales (1080×1920, 30 fps) :

| Étape | Outil | Rôle | Commande |
|---|---|---|---|
| Séquences réalistes | **FIMGA** (générateur) | Plans cohérents : même véhicule, mêmes acteurs, mêmes décors | `npm run shots` (feuille de plans) |
| Voix off | **ElevenLabs** | Voix + timestamps mot par mot | `npm run voice` |
| Animations OBD / IA | **Revideo** (API Motion Canvas intégrée) | HUD compte-tours, code défaut, analyse IA, CTA | `src/scenes/obd.tsx` |
| Montage | **Revideo** | Fondus, titres, sous-titres synchronisés, filigrane | `npm run render` |
| Export final | **FFmpeg** | Mix voix + musique (ducking), −14 LUFS, H.264/AAC, faststart | `npm run finalize` |

> Revideo est un fork de Motion Canvas : les animations OBD utilisent déjà son API.
> Inutile d'installer Motion Canvas séparément. Editly n'est pas utilisé.

## Démarrage

Prérequis : Node 22, FFmpeg ≥ 4.4 (`ffmpeg` et `ffprobe` dans le PATH).

```bash
cd video-studio
npm install
npm run browser            # une seule fois : Chrome for Testing (nécessaire pour décoder le H.264)
cp .env.example .env       # puis renseigner ELEVENLABS_API_KEY et ELEVENLABS_VOICE_ID

npm run script             # génère campaigns/scan-express/SCRIPT.md (minutage, voix off, durée parlée estimée)
npm run shots              # génère campaigns/scan-express/SHOTS.md (références + prompts de plans)
# … produire les références et les clips, les déposer dans public/scan-express/ (voir plus bas)
npm run voice              # voix off + sous-titres calés sur la voix
npm start                  # éditeur Revideo (aperçu, sans son)
npm run build:ad           # rendu + export -> output/scan-express_1080x1920.mp4
```

Brouillon avant d'avoir tous les clips : `npm run render -- --draft` (les plans manquants sont remplacés par une
carte « CLIP À FOURNIR »). Sans `--draft`, le rendu est **refusé** s'il manque un clip ou s'il reste un texte
provisoire (`XX XX`, `À COMPLÉTER`), pour ne jamais exporter une pub avec des éléments de remplacement.
`RANGE=20,45 npm run render -- --draft` ne rend que cette plage (en secondes).

## Cohérence visuelle : références fixes, jamais d'images indépendantes

1. **Bible visuelle** dans `campaigns/scan-express/campaign.json` (`bible`) : véhicule, mécanicien, cliente, décor,
   scanner. Chaque bloc `identity` est injecté **mot pour mot** dans tous les prompts (`{{VEHICLE}}`, `{{MECHANIC}}`…)
   par `npm run shots` — un plan ne peut pas « oublier » un détail. **À valider/modifier avant toute génération** :
   les descriptions fournies sont des propositions.
2. **Fiches de référence** : générer et valider une fiche par élément (véhicule sous 4 angles, visage + tenue de
   chaque acteur, plan large du décor). Les enregistrer dans `public/scan-express/references/` sous leur identifiant
   (`REF-VEHICLE-01.png`…). Ce sont les seules images « sources ».
3. **Chaque plan** est généré en joignant les références listées dans `SHOTS.md`, d'abord en image-clé validée,
   puis animée en clip de 3 à 8 s.
4. **Continuité** : pour deux plans consécutifs d'une même scène, partir de la dernière image du précédent
   (`ffmpeg -sseof -0.1 -i clip.mp4 -frames:v 1 last.png`).
5. **Jamais de texte généré** dans l'image (les générateurs déforment les lettres) : les titres, sous-titres, logo
   et contact sont ajoutés par Revideo.
6. Déposer les plans sous le nom attendu (`public/scan-express/clips/s01-hook.mp4`…). **Vidéo ou image fixe** : le même
   nom avec `.png`, `.jpg` ou `.webp` fonctionne aussi (zoom progressif ajouté) ; la vidéo l'emporte si les deux existent.
   Le recadrage 9:16 « cover » est automatique ; privilégier des vidéos d'au moins la durée de la scène.
   Le protocole pour générer avec ChatGPT est dans `campaigns/scan-express/SHOTS.md`.

## Génération des plans (ChatGPT, Figma Weave, autre)

Le pipeline Node est **indépendant du générateur** : il lit des vidéos ou des images dans `public/<id>/clips/`. Si le
générateur est Figma Weave, le compte Figma doit d'abord être lié à Weave (<https://app.weavy.ai/settings?section=profile>).
Chaque génération consomme des crédits : à lancer après validation de la bible visuelle (voir ci-dessus).

## Structure

```
brands/<marque>.json            couleurs, nom, logo (public/brands/<marque>/)
campaigns/<id>/campaign.json    scènes, durées, voix off, titres, bible visuelle, audio
campaigns/<id>/voice.json       (généré par npm run voice) timestamps mot par mot
campaigns/<id>/SCRIPT.md        (généré par npm run script) script lisible + durées estimées
campaigns/<id>/SHOTS.md         (généré par npm run shots) feuille de plans
public/<id>/{clips,voice,music,references}/   médias (vidéos/audio non versionnés)
src/scenes/                     clip.tsx, obd.tsx, cta.tsx, ad.tsx (enchaînement)
scripts/                        render, finalize, voice, shots, scan-assets
tests/                          npm test (node:test)
```

Un titre peut contenir `\n` : chaque ligne est affichée séparément et la police est réduite si la plus longue dépasse la zone de sécurité.
`npm run script` estime la durée parlée de chaque voix off et signale celles qui laissent moins de 10 % de marge,
avant de payer la synthèse vocale (estimation à ±20 % ; la vraie durée vient de `npm run voice`).

La durée totale des scènes doit égaler `format.durationSeconds` (45 s) : le rendu s'arrête avec une erreur sinon.

## Nouvelle campagne (DiagAssist, TechAssist…) sans refaire le montage

1. Copier `campaigns/scan-express/` vers `campaigns/<nouvel-id>/` et adapter `campaign.json`
   (`id` = nom du dossier ; `brand` = fichier de `brands/`).
2. Ajouter `brands/<marque>.json` si la marque est nouvelle.
3. `npm run shots -- <id>`, `npm run voice -- <id>`, `npm run render -- <id>`, `npm run finalize -- <id>`.

Les scènes disponibles sont `clip` (plan vidéo + titre + sous-titres), `obd` (animation diagnostic + IA) et `cta`.
Pour l'éditeur (`npm start`), la campagne ouverte est `DEFAULT_CAMPAIGN` dans `src/lib/registry.ts`.

## Audio

- La voix est générée **par scène** et calée sur le début de chaque scène ; une scène dont le texte n'a pas changé
  n'est pas regénérée (pas de crédits gaspillés, `--force` pour forcer).
- `npm run voice` avertit si une voix dépasse la durée de sa scène.
- La musique (`audio.music`, à fournir et à **licencier**) passe sous la voix par sidechain ; la profondeur se règle
  avec `audio.duckThreshold` / `audio.duckRatio`. **À ajuster à l'oreille avec la vraie voix.**
- Revideo ne sert qu'au visuel : le son final est entièrement mixé par FFmpeg (`DEBUG_FFMPEG=1 npm run finalize`
  affiche la commande exacte).
- ElevenLabs ne garantit pas une « voix ivoirienne » : choisir une voix de la bibliothèque avec accent adapté,
  ou un clone vocal d'un comédien qui a donné son accord, puis renseigner `ELEVENLABS_VOICE_ID`.

## Mise en route ElevenLabs (sans navigateur automatisé)

1. Dans votre compte ElevenLabs, créer une **clé d'API** (réglages du compte, section clés d'API). Si vous la restreignez,
   autoriser la synthèse vocale **et** la lecture des voix et de l'abonnement, sinon les commandes ci-dessous répondent 401.
2. Choisir une voix : dans la bibliothèque de voix du site (filtrer langue française et accent), l'ajouter à « mes voix »,
   ou créer un clone vocal d'un comédien qui a donné son accord.
3. `npm run elevenlabs -- voices --fr` liste les voix **de votre compte** avec leur identifiant, leurs labels et un lien d'écoute
   (`npm run elevenlabs -- voices <mot-clé>` pour chercher).
4. Copier `.env.example` en `.env` et renseigner `ELEVENLABS_API_KEY` et `ELEVENLABS_VOICE_ID`.
   `.env` est ignoré par git : ne jamais le committer, ne jamais coller la clé dans un chat.
5. `npm run elevenlabs -- usage` affiche vos caractères restants et le besoin de la campagne, puis `npm run voice`.

Ces commandes ne génèrent rien et ne consomment aucun crédit. Elles sont testées contre un faux serveur : le format des
réponses suit la documentation ([voix](https://elevenlabs.io/docs/api-reference/voices/search),
[abonnement](https://elevenlabs.io/docs/api-reference/user/subscription/get)) mais n'a pas été confronté à un vrai compte.

## Ce qui a été vérifié (conteneur de développement, sans vrais médias)

- Installation, `npm run typecheck`.
- Rendu complet 1080×1920, 30 fps, 45,00 s avec des clips factices (portrait, paysage, sans piste audio) : ≈ 36 s
  de rendu, 0 erreur console ; export FFmpeg validé par ffprobe (H.264 High, yuv420p, AAC 48 kHz stéréo).
- `npm test` (36 tests) : durées/timeline, marqueurs provisoires, injection de la bible dans les prompts, sous-titres,
  validité de la campagne livrée, et `scripts/voice-elevenlabs.ts` de bout en bout contre un **faux serveur** qui
  reproduit le format documenté de [`/with-timestamps`](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
  (cache par scène, `--force`, reprise après un échec en cours de route, erreur claire sans clé).
- Plans en image fixe (portrait 1024×1536, paysage 1536×1024, carré) mélangés à une vidéo : recadrage plein écran,
  zoom, 0 erreur de rendu.
- Garde-fous : rendu final refusé sans clips/avec textes provisoires ; échec en quelques secondes avec un message
  clair si le navigateur ne décode pas le H.264.
- Mixage sur signaux de test : normalisation ≈ −14 LUFS ; sidechain mesuré (musique baissée sous la voix).

## Ce qui n'a PAS été vérifié

- Aucune requête réelle vers ElevenLabs (pas de clé) : le format de réponse suit la documentation et le script est
  testé contre un faux serveur, mais l'authentification, les quotas et la voix choisie restent à confirmer au premier
  vrai appel (`npm run voice`).
- Aucun vrai clip FIMGA, aucune vraie voix, aucune vraie musique : l'aspect final, le ducking réglé sur de la
  parole réelle et la lisibilité des sous-titres sur de vraies images restent à valider.
- Les textes de `campaign.json` (voix off, titres, tagline) et les données OBD (code P0300) sont **provisoires** ;
  la palette et le wordmark sont des valeurs par défaut, pas la charte DiagAssist.
- Durée et consommation de rendu sur le VPS cible.
