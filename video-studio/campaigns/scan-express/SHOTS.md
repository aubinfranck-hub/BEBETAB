# SCAN EXPRESS by DiagAssist — 45 s — feuille de plans

> Fichier GÉNÉRÉ par `npm run shots` depuis `campaign.json` : ne pas éditer à la main.

## 1. Références fixes à produire et valider AVANT tout plan

Placer les images validées dans `public/scan-express/references/` sous le nom de leur identifiant (ex. `REF-VEHICLE-01.png`).
Joindre les références concernées à CHAQUE génération de plan.

### REF-VEHICLE-01 (vehicle)

a silver-grey compact sedan (2015-2018 model, West African market spec), clean but lightly dusty, no visible brand badges, license plate not legible

### REF-MECHANIC-01 (mechanic)

an Ivorian man in his mid-30s, short black hair, neatly trimmed short beard, dark navy work coveralls with a thin orange stripe on the shoulders, no logo, no cap, calm confident expression

### REF-CLIENT-01 (client)

an Ivorian woman in her early 30s, braids tied back, light blue cotton shirt, small gold earrings, expressive face

### REF-LOC-GARAGE-01 (location)

a small open-air auto repair garage in Abidjan, concrete floor, corrugated metal roof, tools on a pegboard, palm trees visible outside, warm late-afternoon light

### REF-SCANNER-01 (scanner)

a compact black handheld OBD-II diagnostic scanner with a small color screen, short cable and an orange accent, no readable text

### Style commun

cinematic realistic photography, 35mm lens, shallow depth of field, natural skin tones, vertical 9:16 framing, no text, no captions, no logos, no watermark, no extra people

## 2. Plans à générer

### s01-hook — 4 s

- Fichier attendu : `public/scan-express/clips/s01-hook.mp4`
- Références à joindre : `REF-CLIENT-01`, `REF-VEHICLE-01`
- Intention : Gros plan du tableau de bord : le voyant moteur s'allume, puis la cliente inquiète au volant.
- Caméra : slow push-in from the dashboard check-engine light to the driver's worried face

```text
Inside a silver-grey compact sedan (2015-2018 model, West African market spec), clean but lightly dusty, no visible brand badges, license plate not legible, an Ivorian woman in her early 30s, braids tied back, light blue cotton shirt, small gold earrings, expressive face sits at the wheel on a busy Abidjan street. The orange check-engine warning light glows on the dashboard; she looks at it, worried. cinematic realistic photography, 35mm lens, shallow depth of field, natural skin tones, vertical 9:16 framing, no text, no captions, no logos, no watermark, no extra people
```

### s02-probleme — 8 s

- Fichier attendu : `public/scan-express/clips/s02-probleme.mp4`
- Références à joindre : `REF-CLIENT-01`, `REF-VEHICLE-01`, `REF-LOC-GARAGE-01`
- Intention : La cliente devant le capot ouvert de sa voiture, dans le garage, ne sachant pas quoi faire.
- Caméra : medium shot, slight handheld, then slow dolly-in on the open hood

```text
In a small open-air auto repair garage in Abidjan, concrete floor, corrugated metal roof, tools on a pegboard, palm trees visible outside, warm late-afternoon light, an Ivorian woman in her early 30s, braids tied back, light blue cotton shirt, small gold earrings, expressive face stands in front of a silver-grey compact sedan (2015-2018 model, West African market spec), clean but lightly dusty, no visible brand badges, license plate not legible with its hood open, looking at the engine, unsure and worried. cinematic realistic photography, 35mm lens, shallow depth of field, natural skin tones, vertical 9:16 framing, no text, no captions, no logos, no watermark, no extra people
```

### s03-solution — 8 s

- Fichier attendu : `public/scan-express/clips/s03-solution.mp4`
- Références à joindre : `REF-MECHANIC-01`, `REF-SCANNER-01`, `REF-VEHICLE-01`, `REF-LOC-GARAGE-01`
- Intention : Le mécanicien branche le scanner OBD sur la prise du véhicule (gros plan mains puis plan moyen).
- Caméra : close-up on hands plugging the scanner into the OBD port under the dashboard, then pull back to a medium shot of the mechanic

```text
In a small open-air auto repair garage in Abidjan, concrete floor, corrugated metal roof, tools on a pegboard, palm trees visible outside, warm late-afternoon light, an Ivorian man in his mid-30s, short black hair, neatly trimmed short beard, dark navy work coveralls with a thin orange stripe on the shoulders, no logo, no cap, calm confident expression leans into a silver-grey compact sedan (2015-2018 model, West African market spec), clean but lightly dusty, no visible brand badges, license plate not legible and plugs a compact black handheld OBD-II diagnostic scanner with a small color screen, short cable and an orange accent, no readable text into the OBD-II port under the steering wheel. cinematic realistic photography, 35mm lens, shallow depth of field, natural skin tones, vertical 9:16 framing, no text, no captions, no logos, no watermark, no extra people
```

### s05-resultat — 8 s

- Fichier attendu : `public/scan-express/clips/s05-resultat.mp4`
- Références à joindre : `REF-MECHANIC-01`, `REF-CLIENT-01`, `REF-VEHICLE-01`, `REF-LOC-GARAGE-01`
- Intention : Le mécanicien montre le résultat sur une tablette à la cliente, qui hoche la tête, rassurée.
- Caméra : over-the-shoulder medium shot, gentle push-in on the client's relieved smile

```text
In a small open-air auto repair garage in Abidjan, concrete floor, corrugated metal roof, tools on a pegboard, palm trees visible outside, warm late-afternoon light, an Ivorian man in his mid-30s, short black hair, neatly trimmed short beard, dark navy work coveralls with a thin orange stripe on the shoulders, no logo, no cap, calm confident expression shows a tablet to an Ivorian woman in her early 30s, braids tied back, light blue cotton shirt, small gold earrings, expressive face next to a silver-grey compact sedan (2015-2018 model, West African market spec), clean but lightly dusty, no visible brand badges, license plate not legible; she nods, reassured and smiling. cinematic realistic photography, 35mm lens, shallow depth of field, natural skin tones, vertical 9:16 framing, no text, no captions, no logos, no watermark, no extra people
```
