import {Layout, Rect, makeScene2D} from '@revideo/2d';
import {all, createRef, useScene, waitFor} from '@revideo/core';
import {estimateWords, buildTimeline} from '../lib/timeline';
import {DEFAULT_CAMPAIGN, loadAssets, loadBrand, loadCampaign, loadVoice} from '../lib/registry';
import {FADE} from '../lib/theme';
import type {TimelineScene} from '../types';
import type {SegmentCtx} from './context';
import {clipScene} from './clip';
import {ctaScene} from './cta';
import {obdScene} from './obd';

function pickScene(kind: TimelineScene['kind']) {
  switch (kind) {
    case 'clip':
      return clipScene;
    case 'obd':
      return obdScene;
    case 'cta':
      return ctaScene;
  }
}

/**
 * Montage unique piloté par campaigns/<id>/campaign.json :
 * enchaîne les scènes avec un fondu, applique les sous-titres synchronisés sur la voix.
 */
export default makeScene2D('ad', function* (view) {
  const campaignId = useScene().variables.get('campaignId', DEFAULT_CAMPAIGN)();
  const campaign = loadCampaign(campaignId);
  const brand = loadBrand(campaign.brand);
  const voice = loadVoice(campaignId);
  const assets = loadAssets();
  const timeline = buildTimeline(campaign);

  // Les polices doivent être chargées avant la mesure du texte, sinon la mise en page est fausse.
  yield Promise.all(
    [700, 800, 900].map(weight => document.fonts.load(`${weight} 48px Montserrat`)),
  );

  view.add(<Rect size={'100%'} fill={brand.colors.background} />);

  let previous: Layout | null = null;
  for (const scene of timeline) {
    const ctx: SegmentCtx = {
      campaign,
      brand,
      scene,
      assets,
      words: voice[scene.id]?.words ?? estimateWords(scene.voiceover ?? '', scene.duration),
    };

    const layer = createRef<Layout>();
    view.add(<Layout ref={layer} size={'100%'} opacity={0} />);
    yield pickScene(scene.kind)(layer(), ctx);

    if (previous) {
      const outgoing: Layout = previous;
      yield* all(layer().opacity(1, FADE), outgoing.opacity(0, FADE));
      outgoing.remove();
    } else {
      yield* layer().opacity(1, FADE);
    }
    yield* waitFor(scene.duration - FADE);
    previous = layer();
  }
});
