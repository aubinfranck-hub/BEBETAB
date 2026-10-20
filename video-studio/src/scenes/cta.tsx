import {Gradient, Img, Layout, Rect, Txt} from '@revideo/2d';
import {all, createRef, easeOutBack, easeOutCubic, waitFor} from '@revideo/core';
import type {ThreadGenerator} from '@revideo/core';
import {runCaptions} from '../lib/captions';
import {FADE, FONT, SAFE_TOP} from '../lib/theme';
import type {SegmentCtx} from './context';

export function* ctaScene(layer: Layout, ctx: SegmentCtx): ThreadGenerator {
  const {campaign, brand, assets, words} = ctx;
  const c = brand.colors;
  const total = ctx.scene.duration + FADE;
  const [first, ...rest] = campaign.product.split(' ');

  const title = createRef<Layout>();
  const by = createRef<Txt>();
  const tagline = createRef<Txt>();
  const chip = createRef<Rect>();
  const captions = createRef<Layout>();

  const hasLogo = brand.logo !== null && assets.files.includes(brand.logo);

  layer.add(
    <>
      <Rect size={'100%'} fill={c.background} />
      <Rect
        size={'100%'}
        fill={
          new Gradient({
            type: 'radial',
            from: [0, -250],
            to: [0, -250],
            fromRadius: 0,
            toRadius: 760,
            stops: [
              {offset: 0, color: `${c.primary}40`},
              {offset: 1, color: `${c.primary}00`},
            ],
          })
        }
      />
      {hasLogo ? <Img src={`/${brand.logo}`} height={96} y={SAFE_TOP + 70} /> : null}

      <Layout ref={title} layout direction="column" alignItems="center" y={-360} opacity={0} scale={0.85}>
        <Txt text={first} fontFamily={FONT} fontWeight={900} fontSize={190} fill={c.text} lineHeight={170} />
        {rest.length > 0 ? (
          <Txt text={rest.join(' ')} fontFamily={FONT} fontWeight={900} fontSize={190} fill={c.primary} lineHeight={170} />
        ) : null}
      </Layout>
      <Txt
        ref={by}
        text={`by ${brand.name}`}
        y={-150}
        fontFamily={FONT}
        fontWeight={800}
        fontSize={62}
        fill={c.accent}
        opacity={0}
      />
      <Txt
        ref={tagline}
        text={campaign.cta.tagline}
        y={-25}
        width={860}
        textWrap
        textAlign="center"
        fontFamily={FONT}
        fontWeight={700}
        fontSize={44}
        fill={c.textMuted}
        opacity={0}
      />
      <Rect ref={chip} y={140} width={860} height={190} radius={95} fill={c.primary} opacity={0} scale={0.9}>
        <Layout layout direction="column" alignItems="center" gap={4}>
          <Txt
            text={campaign.cta.contactLabel.toUpperCase()}
            fontFamily={FONT}
            fontWeight={800}
            fontSize={32}
            letterSpacing={4}
            fill={c.background}
          />
          <Txt text={campaign.cta.contact} fontFamily={FONT} fontWeight={900} fontSize={70} fill={c.background} />
        </Layout>
      </Rect>
      <Layout ref={captions} size={'100%'} />
    </>,
  );

  const sequence = function* (): ThreadGenerator {
    yield* all(title().opacity(1, 0.4), title().scale(1, 0.5, easeOutBack));
    yield* by().opacity(1, 0.3);
    yield* tagline().opacity(1, 0.4);
    yield* all(chip().opacity(1, 0.3), chip().scale(1, 0.4, easeOutCubic));
    // Pulsation douce du bouton de contact (3 cycles, finie pour que la scène se termine)
    for (let cycle = 0; cycle < 3; cycle++) {
      yield* chip().scale(1.04, 0.5);
      yield* chip().scale(1, 0.5);
    }
  };

  yield* all(sequence(), runCaptions(captions(), words, brand), waitFor(total));
}
