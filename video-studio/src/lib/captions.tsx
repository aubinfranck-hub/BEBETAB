import {Layout, Txt} from '@revideo/2d';
import {createRef, waitFor} from '@revideo/core';
import type {ThreadGenerator} from '@revideo/core';
import type {Brand, WordTiming} from '../types';
import {CAPTION_Y, FONT} from './theme';

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

/** Sous-titres style Reels/TikTok : 3 mots à l'écran, le mot prononcé passe en couleur d'accent. */
export function* runCaptions(parent: Layout, words: WordTiming[], brand: Brand): ThreadGenerator {
  let now = 0;
  const waitUntil = function* (target: number): ThreadGenerator {
    if (target > now) {
      yield* waitFor(target - now);
      now = target;
    }
  };

  for (const group of groupWords(words)) {
    yield* waitUntil(group[0].start);

    const row = createRef<Layout>();
    const refs = group.map(() => createRef<Txt>());
    parent.add(
      <Layout
        ref={row}
        layout
        direction="row"
        wrap="wrap"
        justifyContent="center"
        gap={22}
        width={940}
        y={CAPTION_Y}
      >
        {group.map((word, index) => (
          <Txt
            ref={refs[index]}
            text={word.text.toUpperCase()}
            fontFamily={FONT}
            fontWeight={900}
            fontSize={82}
            fill={brand.colors.text}
            stroke="#000000"
            lineWidth={16}
            strokeFirst
          />
        ))}
      </Layout>,
    );

    for (let index = 0; index < group.length; index++) {
      const word = group[index];
      yield* waitUntil(word.start);
      refs[index]().fill(brand.colors.accent);
      yield* waitUntil(Math.max(word.end, word.start + 0.12));
      refs[index]().fill(brand.colors.text);
    }
    row().remove();
  }
}
