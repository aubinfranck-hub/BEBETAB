import type {WordTiming} from '../types';

/** Alignement caractère par caractère renvoyé par ElevenLabs (/with-timestamps). */
export interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

/** Regroupe les caractères en mots (séparés par des espaces) avec leurs temps de début et de fin. */
export function wordsFromAlignment(alignment: Alignment): WordTiming[] {
  const words: WordTiming[] = [];
  let text = '';
  let start = 0;
  let end = 0;
  alignment.characters.forEach((char, index) => {
    if (/\s/.test(char)) {
      if (text) words.push({text, start, end});
      text = '';
      return;
    }
    if (!text) start = alignment.character_start_times_seconds[index];
    text += char;
    end = alignment.character_end_times_seconds[index];
  });
  if (text) words.push({text, start, end});
  return words;
}
