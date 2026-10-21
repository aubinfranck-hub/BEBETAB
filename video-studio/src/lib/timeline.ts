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

const GROUP_SIZE = 3;

/** Regroupe les mots par paquets de 3 max, en coupant après la ponctuation. */
export function groupWords(words: WordTiming[]): WordTiming[][] {
  const groups: WordTiming[][] = [];
  let current: WordTiming[] = [];
  for (const word of words) {
    current.push(word);
    if (current.length >= GROUP_SIZE || /[.!?,;:]$/.test(word.text)) {
      groups.push(current);
      current = [];
    }
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm'];
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
export const IMAGE_PATTERN = /\.(png|jpe?g|webp)$/i;

/**
 * Un plan peut être fourni en vidéo OU en image fixe sous le même nom de base
 * (clips/s01-hook.mp4, .mov, .webm, .png, .jpg, .jpeg, .webp). La vidéo l'emporte si les deux existent.
 * Retourne le chemin relatif à public/ ("<campagne>/clips/s01-hook.png") ou null.
 */
export function resolveClip(files: string[], campaignId: string, clip: string): string | null {
  const base = clip.replace(/\.[^./]+$/, '');
  const present = new Set(files);
  for (const extension of [...VIDEO_EXTENSIONS, ...IMAGE_EXTENSIONS]) {
    const candidate = `${campaignId}/${base}.${extension}`;
    if (present.has(candidate)) return candidate;
  }
  return null;
}

/**
 * Durée parlée estimée d'une voix off en français (≈ 150 mots/min + pauses de ponctuation).
 * Estimation à ±20 % : sert à repérer un texte trop long AVANT de payer la synthèse vocale ;
 * la vraie durée vient de `npm run voice`.
 */
/** Part de la durée disponible qu'une voix estimée peut occuper (l'estimation est à ±20 %). */
export const SPEECH_FILL_LIMIT = 0.9;

export function estimateSpeechSeconds(text: string): number {
  const words = text.split(/\s+/).filter(token => /[\p{L}\p{N}]/u.test(token)).length;
  const strongPauses = (text.match(/[.!?…]/g) ?? []).length;
  const softPauses = (text.match(/[,;:]/g) ?? []).length;
  return words / 2.5 + strongPauses * 0.3 + softPauses * 0.15;
}
