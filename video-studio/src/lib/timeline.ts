import type {Campaign, SceneDef, TimelineScene, WordTiming} from '../types';

const EPSILON = 1e-6;

/** Calcule les débuts de scènes et vérifie que la somme des durées vaut la durée annoncée. */
export function buildTimeline(campaign: Campaign): TimelineScene[] {
  let cursor = 0;
  const scenes = campaign.scenes.map((scene): TimelineScene => {
    if (!(scene.duration > 0)) {
      throw new Error(`Scène ${scene.id} : durée invalide (${scene.duration})`);
    }
    const timed = {...scene, start: cursor};
    cursor += scene.duration;
    return timed;
  });
  if (Math.abs(cursor - campaign.format.durationSeconds) > EPSILON) {
    throw new Error(
      `Campagne ${campaign.id} : les scènes totalisent ${cursor}s, ` +
        `format.durationSeconds vaut ${campaign.format.durationSeconds}s`,
    );
  }
  return scenes;
}

/**
 * En français, "?" "!" ":" ";" sont précédés d'une espace : ils se retrouvent comme "mots" isolés.
 * On les recolle au mot précédent pour ne jamais afficher un sous-titre réduit à "?".
 */
export function mergePunctuation(words: WordTiming[]): WordTiming[] {
  const merged: WordTiming[] = [];
  for (const word of words) {
    const previous = merged[merged.length - 1];
    if (previous && /^[?!:;»…]+$/.test(word.text)) {
      previous.text += word.text;
      previous.end = Math.max(previous.end, word.end);
    } else {
      merged.push({...word});
    }
  }
  return merged;
}

/**
 * Sous-titres de secours quand la voix ElevenLabs n'a pas encore été générée :
 * répartit les mots sur la scène au prorata de leur longueur.
 */
export function estimateWords(text: string, duration: number): WordTiming[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const lead = 0.25;
  const tail = 0.4;
  const span = Math.max(0.5, duration - lead - tail);
  const weights = tokens.map(token => token.replace(/[^\p{L}\p{N}]/gu, '').length + 2);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = lead;
  return mergePunctuation(
    tokens.map((token, index) => {
      const length = (weights[index] / total) * span;
      const word = {text: token, start: cursor, end: cursor + length};
      cursor += length;
      return word;
    }),
  );
}

const PLACEHOLDER = /XX XX|À COMPLÉTER/;

/** Retourne les chemins JSON des textes encore provisoires dans la campagne. */
export function findPlaceholders(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return PLACEHOLDER.test(value) ? [path] : [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findPlaceholders(item, `${path}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([key]) => !key.startsWith('_')) // les clés "_note" documentent les marqueurs, elles ne comptent pas
      .flatMap(([key, item]) => findPlaceholders(item, path ? `${path}.${key}` : key));
  }
  return [];
}

/** Remplace {{VEHICLE}}, {{MECHANIC}}… par les blocs d'identité figés de la bible visuelle. */
export function expandShotPrompt(campaign: Campaign, scene: SceneDef): string {
  const shot = scene.shot;
  if (!shot) return '';
  const {bible} = campaign;
  const tokens: Record<string, string> = {
    VEHICLE: bible.vehicle.identity,
    MECHANIC: bible.mechanic.identity,
    CLIENT: bible.client.identity,
    LOCATION: bible.location.identity,
    SCANNER: bible.scanner.identity,
    STYLE: bible.style,
  };
  return shot.prompt.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const replacement = tokens[key];
    if (replacement === undefined) {
      throw new Error(`Scène ${scene.id} : jeton inconnu {{${key}}} dans le prompt`);
    }
    return replacement;
  });
}
