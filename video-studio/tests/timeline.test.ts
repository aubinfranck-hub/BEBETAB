import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {describe, it} from 'node:test';
import {wordsFromAlignment} from '../src/lib/alignment';
import {
  buildTimeline,
  estimateSpeechSeconds,
  estimateWords,
  expandShotPrompt,
  findPlaceholders,
  groupWords,
  mergePunctuation,
  resolveClip,
  SPEECH_FILL_LIMIT,
} from '../src/lib/timeline';
import type {Campaign} from '../src/types';

const realCampaign = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'campaigns', 'scan-express', 'campaign.json'), 'utf8'),
) as Campaign;

function campaignWith(durations: number[], total: number): Campaign {
  return {
    ...realCampaign,
    format: {...realCampaign.format, durationSeconds: total},
    scenes: durations.map((duration, index) => ({id: `s${index}`, kind: 'cta', duration})),
  };
}

describe('buildTimeline', () => {
  it('cumule les débuts de scènes', () => {
    const timeline = buildTimeline(campaignWith([4, 8, 3], 15));
    assert.deepEqual(timeline.map(scene => scene.start), [0, 4, 12]);
  });

  it('refuse une somme de durées différente de format.durationSeconds', () => {
    assert.throws(() => buildTimeline(campaignWith([4, 8, 3], 45)), /totalisent 15s/);
  });

  it('refuse une durée de scène invalide', () => {
    assert.throws(() => buildTimeline(campaignWith([4, 0, 3], 7)), /durée invalide/);
  });

  it('la campagne scan-express totalise bien 45 s', () => {
    const timeline = buildTimeline(realCampaign);
    const last = timeline[timeline.length - 1];
    assert.equal(last.start + last.duration, 45);
  });
});

describe('findPlaceholders', () => {
  it('détecte les marqueurs dans les valeurs et ignore les clés _note', () => {
    const found = findPlaceholders({
      _note: "contient XX XX mais ne compte pas",
      cta: {contact: '+225 XX XX XX', ok: 'texte normal'},
      list: ['À COMPLÉTER'],
    });
    assert.deepEqual(found.sort(), ['cta.contact', 'list[0]']);
  });

  it('la campagne livrée bloque le rendu final uniquement sur le contact', () => {
    assert.deepEqual(findPlaceholders(realCampaign), ['cta.contact']);
  });
});

describe('expandShotPrompt', () => {
  it('injecte les blocs de la bible, mot pour mot, dans chaque plan', () => {
    for (const scene of realCampaign.scenes.filter(item => item.kind === 'clip')) {
      const prompt = expandShotPrompt(realCampaign, scene);
      assert.ok(!prompt.includes('{{'), `${scene.id} : jeton non remplacé`);
      assert.ok(prompt.includes(realCampaign.bible.style), `${scene.id} : style absent`);
    }
    const hook = realCampaign.scenes.find(scene => scene.id === 's03-solution')!;
    const prompt = expandShotPrompt(realCampaign, hook);
    assert.ok(prompt.includes(realCampaign.bible.mechanic.identity));
    assert.ok(prompt.includes(realCampaign.bible.vehicle.identity));
    assert.ok(prompt.includes(realCampaign.bible.scanner.identity));
  });

  it('échoue sur un jeton inconnu', () => {
    const scene = {...realCampaign.scenes[0], shot: {...realCampaign.scenes[0].shot!, prompt: '{{PLANE}}'}};
    assert.throws(() => expandShotPrompt(realCampaign, scene), /jeton inconnu \{\{PLANE\}\}/);
  });

  it("les références d'un plan existent toutes dans la bible", () => {
    const ids = new Set(
      Object.values(realCampaign.bible)
        .filter((entry): entry is {id: string; identity: string} => typeof entry === 'object')
        .map(entry => entry.id),
    );
    for (const scene of realCampaign.scenes) {
      for (const ref of scene.shot?.references ?? []) {
        assert.ok(ids.has(ref), `${scene.id} référence ${ref}, absent de la bible`);
      }
    }
  });
});

describe('sous-titres', () => {
  it('mergePunctuation recolle "?" au mot précédent et étend sa fin', () => {
    const merged = mergePunctuation([
      {text: 'allumé', start: 1, end: 1.4},
      {text: '?', start: 1.4, end: 1.5},
      {text: 'Ne', start: 1.6, end: 1.8},
    ]);
    assert.deepEqual(merged, [
      {text: 'allumé?', start: 1, end: 1.5},
      {text: 'Ne', start: 1.6, end: 1.8},
    ]);
  });

  it('mergePunctuation ne plante pas si le premier mot est une ponctuation', () => {
    assert.equal(mergePunctuation([{text: '?', start: 0, end: 0.1}]).length, 1);
  });

  it('estimateWords reste dans la scène, croît et fusionne la ponctuation', () => {
    const words = estimateWords('Voyant moteur allumé ? Ne roulez pas.', 4);
    assert.deepEqual(words.map(word => word.text), ['Voyant', 'moteur', 'allumé?', 'Ne', 'roulez', 'pas.']);
    assert.ok(words[0].start >= 0 && words[words.length - 1].end <= 4);
    for (let i = 1; i < words.length; i++) assert.ok(words[i].start >= words[i - 1].start);
  });

  it('estimateWords sur un texte vide ne renvoie rien', () => {
    assert.deepEqual(estimateWords('', 4), []);
  });

  it('groupWords fait des paquets de 3 max et coupe après la ponctuation', () => {
    const words = 'Un deux, trois quatre cinq six sept'.split(' ').map((text, i) => ({text, start: i, end: i + 1}));
    assert.deepEqual(
      groupWords(words).map(group => group.map(word => word.text)),
      [['Un', 'deux,'], ['trois', 'quatre', 'cinq'], ['six', 'sept']],
    );
  });
});

describe('wordsFromAlignment (format documenté ElevenLabs)', () => {
  const text = 'Voyant moteur allumé ?';
  const characters = [...text];
  const alignment = {
    characters,
    character_start_times_seconds: characters.map((_, i) => i * 0.05),
    character_end_times_seconds: characters.map((_, i) => (i + 1) * 0.05),
  };

  it('reconstruit les mots avec début du premier caractère et fin du dernier', () => {
    const words = wordsFromAlignment(alignment);
    assert.deepEqual(words.map(word => word.text), ['Voyant', 'moteur', 'allumé', '?']);
    assert.equal(words[0].start, 0);
    assert.ok(Math.abs(words[0].end - 0.3) < 1e-9);
    assert.ok(Math.abs(words[1].start - 0.35) < 1e-9);
  });

  it("ignore les espaces multiples et ne produit jamais de mot vide", () => {
    const spaced = [...'a  b'];
    const words = wordsFromAlignment({
      characters: spaced,
      character_start_times_seconds: spaced.map((_, i) => i),
      character_end_times_seconds: spaced.map((_, i) => i + 1),
    });
    assert.deepEqual(words.map(word => word.text), ['a', 'b']);
  });
});

describe('resolveClip (vidéo ou image fixe sous le même nom)', () => {
  const files = [
    'scan-express/clips/a.png',
    'scan-express/clips/b.mp4',
    'scan-express/clips/b.png',
    'scan-express/clips/c.JPG',
    'autre/clips/d.mp4',
  ];

  it('trouve une image quand seule une image existe, même si la campagne cite un .mp4', () => {
    assert.equal(resolveClip(files, 'scan-express', 'clips/a.mp4'), 'scan-express/clips/a.png');
  });

  it("préfère la vidéo à l'image du même nom", () => {
    assert.equal(resolveClip(files, 'scan-express', 'clips/b.mp4'), 'scan-express/clips/b.mp4');
  });

  it("ne sort pas du dossier de la campagne et renvoie null si rien n'existe", () => {
    assert.equal(resolveClip(files, 'scan-express', 'clips/d.mp4'), null);
    assert.equal(resolveClip(files, 'scan-express', 'clips/zzz.mp4'), null);
  });

  it('ignore la casse inattendue des extensions plutôt que de deviner (null)', () => {
    assert.equal(resolveClip(files, 'scan-express', 'clips/c.mp4'), null);
  });
});

describe('estimateSpeechSeconds', () => {
  it('compte les mots et les pauses de ponctuation', () => {
    assert.ok(Math.abs(estimateSpeechSeconds('Un deux trois quatre cinq.') - 2.3) < 1e-9);
    assert.ok(Math.abs(estimateSpeechSeconds('Un, deux ? Trois') - (3 / 2.5 + 0.3 + 0.15)) < 1e-9);
  });

  it("ignore les signes isolés et ne plante pas sur un texte vide", () => {
    assert.equal(estimateSpeechSeconds(''), 0);
    assert.ok(Math.abs(estimateSpeechSeconds('allumé ?') - (1 / 2.5 + 0.3)) < 1e-9);
  });

  it('la voix off de chaque scène de scan-express tient dans sa scène avec 10 % de marge (fondu inclus)', () => {
    for (const scene of realCampaign.scenes.filter(item => item.voiceover)) {
      const speech = estimateSpeechSeconds(scene.voiceover!);
      const allowed = (scene.duration - 0.3) * SPEECH_FILL_LIMIT;
      assert.ok(
        speech <= allowed,
        `${scene.id} : voix estimée ${speech.toFixed(1)} s > ${allowed.toFixed(1)} s autorisées`,
      );
    }
  });
});
