import {Img, Layout, Rect, Txt} from '@revideo/2d';
import type {AssetManifest, Brand, Campaign, TimelineScene, WordTiming} from '../types';
import {FONT, SAFE_TOP} from '../lib/theme';

export interface SegmentCtx {
  campaign: Campaign;
  brand: Brand;
  scene: TimelineScene;
  assets: AssetManifest;
  words: WordTiming[];
}

/** Petit repère de marque en haut à gauche, dans la zone de sécurité. */
export function Watermark({ctx}: {ctx: SegmentCtx}) {
  const {brand, assets} = ctx;
  if (brand.logo && assets.files.includes(brand.logo)) {
    return <Img src={`/${brand.logo}`} height={64} x={-380} y={SAFE_TOP + 40} opacity={0.9} />;
  }
  return (
    <Layout layout direction="row" alignItems="center" gap={14} x={-300} y={SAFE_TOP + 40}>
      <Rect width={14} height={44} radius={4} fill={brand.colors.primary} />
      <Txt
        text={brand.watermark.toUpperCase()}
        fontFamily={FONT}
        fontWeight={800}
        fontSize={34}
        letterSpacing={3}
        fill={brand.colors.text}
        opacity={0.9}
      />
    </Layout>
  );
}
