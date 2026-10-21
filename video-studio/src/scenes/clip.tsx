import {Gradient, Img, Layout, Rect, Txt, Video} from '@revideo/2d';
import {all, createRef, easeOutCubic, linear, waitFor} from '@revideo/core';
import type {ThreadGenerator} from '@revideo/core';
import {runCaptions} from '../lib/captions';
import {FADE, FONT} from '../lib/theme';
import {IMAGE_PATTERN, resolveClip} from '../lib/timeline';
import {SegmentCtx, Watermark} from './context';

/** Carte affichée quand le clip FIMGA n'existe pas encore (rendu --draft uniquement). */
function MissingClip({ctx}: {ctx: SegmentCtx}) {
  const {brand, scene, campaign} = ctx;
  return (
    <Layout size={[campaign.format.width, campaign.format.height]}>
      <Rect size={'100%'} fill={brand.colors.surface} />
      <Txt
        text="CLIP À FOURNIR"
        y={-160}
        fontFamily={FONT}
        fontWeight={900}
        fontSize={78}
        fill={brand.colors.warning}
      />
      <Txt
        text={scene.clip ?? scene.id}
        y={-70}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={38}
        fill={brand.colors.textMuted}
      />
      <Txt
        text={scene.shot?.description ?? ''}
        y={90}
        width={820}
        textWrap
        textAlign="center"
        fontFamily={FONT}
        fontWeight={700}
        fontSize={40}
        fill={brand.colors.text}
      />
    </Layout>
  );
}

export function* clipScene(layer: Layout, ctx: SegmentCtx): ThreadGenerator {
  const {campaign, brand, scene, assets, words} = ctx;
  const {width, height} = campaign.format;
  const total = scene.duration + FADE;

  const holder = createRef<Layout>();
  const video = createRef<Video>();
  const headline = createRef<Txt>();
  const subheadline = createRef<Txt>();
  const captions = createRef<Layout>();

  const clipPath = scene.clip ? resolveClip(assets.files, campaign.id, scene.clip) : null;
  const info = clipPath ? assets.media[clipPath] : undefined;
  const isImage = clipPath !== null && IMAGE_PATTERN.test(clipPath);

  layer.add(
    <>
      <Layout ref={holder} size={[width, height]}>
        {clipPath && info && isImage ? (
          <Img
            src={`/${clipPath}`}
            // Recadrage "cover" 9:16 depuis les dimensions lues par ffprobe
            size={() => {
              const cover = Math.max(width / info.width, height / info.height);
              return [info.width * cover, info.height * cover];
            }}
          />
        ) : clipPath && info ? (
          <Video
            ref={video}
            src={`/${clipPath}`}
            // Recadrage "cover" 9:16 calculé depuis ffprobe (scripts/scan-assets.ts)
            size={() => {
              const cover = Math.max(width / info.width, height / info.height);
              return [info.width * cover, info.height * cover];
            }}
            time={scene.clipStart ?? 0}
            play={true}
            volume={0}
          />
        ) : (
          <MissingClip ctx={ctx} />
        )}
      </Layout>
      {/* Dégradés pour la lisibilité des titres et des sous-titres */}
      <Rect
        size={[width, 700]}
        y={-height / 2 + 350}
        fill={
          new Gradient({
            type: 'linear',
            from: [0, -350],
            to: [0, 350],
            stops: [
              {offset: 0, color: '#000000B3'},
              {offset: 1, color: '#00000000'},
            ],
          })
        }
      />
      <Rect
        size={[width, 800]}
        y={height / 2 - 400}
        fill={
          new Gradient({
            type: 'linear',
            from: [0, -400],
            to: [0, 400],
            stops: [
              {offset: 0, color: '#00000000'},
              {offset: 1, color: '#000000CC'},
            ],
          })
        }
      />
      <Watermark ctx={ctx} />
      <Txt
        ref={headline}
        text={scene.headline ?? ''}
        y={-470}
        width={940}
        textWrap
        textAlign="center"
        lineHeight={104}
        fontFamily={FONT}
        fontWeight={900}
        fontSize={92}
        fill={brand.colors.text}
        stroke="#000000"
        lineWidth={14}
        strokeFirst
        opacity={0}
      />
      <Txt
        ref={subheadline}
        text={scene.subheadline ?? ''}
        y={-360}
        fontFamily={FONT}
        fontWeight={800}
        fontSize={56}
        fill={brand.colors.accent}
        stroke="#000000"
        lineWidth={10}
        strokeFirst
        opacity={0}
      />
      <Layout ref={captions} size={'100%'} />
    </>,
  );

  const intro = function* (): ThreadGenerator {
    yield* waitFor(0.25);
    const headlineY = headline().y();
    headline().y(headlineY + 40);
    yield* all(
      headline().opacity(1, 0.35),
      headline().y(headlineY, 0.35, easeOutCubic),
      subheadline().opacity(1, 0.5),
    );
  };

  yield* all(
    // Zoom continu : discret sur un clip vidéo, plus marqué sur une image fixe pour donner du mouvement
    holder().scale(isImage ? 1.14 : 1.07, total, linear),
    intro(),
    runCaptions(captions(), words, brand),
    waitFor(total),
  );

  if (video()) video().pause();
}
