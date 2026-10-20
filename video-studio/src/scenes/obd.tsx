import {Circle, Grid, Layout, Rect, Txt} from '@revideo/2d';
import {all, createRef, createSignal, easeOutCubic, linear, waitFor} from '@revideo/core';
import type {ThreadGenerator} from '@revideo/core';
import {bindText} from '../lib/bind';
import {runCaptions} from '../lib/captions';
import {FADE, FONT, SAFE_TOP} from '../lib/theme';
import {SegmentCtx, Watermark} from './context';

const GAUGE_START = 135;
const GAUGE_SWEEP = 270;
const BAR_WIDTH = 860;

/**
 * Animation "diagnostic OBD-II + analyse IA" entièrement générée en code :
 * aucune image à produire, le contenu vient de campaign.json (scene.obd).
 * Les temps sont des fractions de la durée de la scène (calés sur 12 s).
 */
export function* obdScene(layer: Layout, ctx: SegmentCtx): ThreadGenerator {
  const {brand, scene, words} = ctx;
  const obd = scene.obd;
  if (!obd) throw new Error(`Scène ${scene.id} : bloc "obd" manquant`);
  const dtc = obd.dtcs[0];
  const c = brand.colors;
  const u = scene.duration / 12;
  const total = scene.duration + FADE;
  const frames = Math.ceil(total * ctx.campaign.format.fps);

  const rpm = createSignal(0);
  const clock = createSignal(0);
  const analysis = createSignal(0);
  // Micro-vibrations déterministes (pas de Math.random : rendu identique d'un worker à l'autre)
  const shownRpm = () => rpm() + (rpm() > 0 ? Math.sin(clock() * 18) * 35 + Math.sin(clock() * 7.3) * 20 : 0);

  const header = createRef<Txt>();
  const status = createRef<Txt>();
  const dot = createRef<Circle>();
  const digits = createRef<Txt>();
  const gaugeGroup = createRef<Layout>();
  const dtcCard = createRef<Rect>();
  const code = createRef<Txt>();
  const label = createRef<Txt>();
  const analysisGroup = createRef<Layout>();
  const percent = createRef<Txt>();
  const causeGroup = createRef<Layout>();
  const cause = createRef<Txt>();
  const captions = createRef<Layout>();

  layer.add(
    <>
      <Rect size={'100%'} fill={c.background} />
      <Grid size={'100%'} stroke={c.primary} opacity={0.1} lineWidth={2} spacing={90} />
      <Watermark ctx={ctx} />

      <Txt
        ref={header}
        text={obd.title}
        y={SAFE_TOP + 130}
        fontFamily={FONT}
        fontWeight={900}
        fontSize={50}
        letterSpacing={4}
        fill={c.accent}
        opacity={0}
      />
      <Layout layout direction="row" alignItems="center" gap={16} y={SAFE_TOP + 205}>
        <Circle ref={dot} size={22} fill={c.accent} opacity={0} />
        <Txt ref={status} text="" fontFamily={FONT} fontWeight={700} fontSize={36} fill={c.textMuted} />
      </Layout>

      <Layout ref={gaugeGroup} y={-270} opacity={0} scale={0.9}>
        <Circle
          size={400}
          startAngle={GAUGE_START}
          endAngle={GAUGE_START + GAUGE_SWEEP}
          lineWidth={34}
          stroke={c.surface}
          lineCap="round"
        />
        <Circle
          size={400}
          startAngle={GAUGE_START}
          endAngle={() => GAUGE_START + GAUGE_SWEEP * Math.min(1, shownRpm() / obd.rpmMax)}
          lineWidth={34}
          stroke={c.accent}
          lineCap="round"
        />
        <Txt
          ref={digits}
          text="0"
          fontFamily={FONT}
          fontWeight={900}
          fontSize={100}
          fill={c.text}
          y={-10}
        />
        <Txt text="TR/MIN" y={75} fontFamily={FONT} fontWeight={700} fontSize={34} letterSpacing={4} fill={c.textMuted} />
      </Layout>

      <Rect
        ref={dtcCard}
        y={5}
        width={BAR_WIDTH}
        height={190}
        radius={28}
        fill={c.surface}
        stroke={c.warning}
        lineWidth={5}
        opacity={0}
      >
        <Txt ref={code} text="" x={-390} offsetX={-1} fontFamily={FONT} fontWeight={900} fontSize={96} letterSpacing={3} fill={c.warning} />
        <Txt
          ref={label}
          text={dtc.label}
          x={215}
          width={380}
          textWrap
          textAlign="left"
          fontFamily={FONT}
          fontWeight={800}
          fontSize={38}
          fill={c.text}
          opacity={0}
        />
      </Rect>

      <Layout ref={analysisGroup} y={175} opacity={0}>
        <Txt
          text={obd.analysisLabel}
          x={-BAR_WIDTH / 2}
          y={-40}
          offsetX={-1}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={36}
          letterSpacing={4}
          fill={c.primary}
        />
        <Txt
          ref={percent}
          text="0 %"
          x={BAR_WIDTH / 2}
          y={-40}
          offsetX={1}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={36}
          fill={c.text}
        />
        <Rect width={BAR_WIDTH} height={22} radius={11} fill={c.surface} y={14} />
        <Rect
          width={() => Math.max(0.001, BAR_WIDTH * analysis())}
          height={22}
          radius={11}
          fill={c.primary}
          x={-BAR_WIDTH / 2}
          offsetX={-1}
          y={14}
        />
      </Layout>

      <Layout ref={causeGroup} y={190} opacity={0} layout direction="column" alignItems="center" gap={10}>
        <Txt
          text={obd.causeLabel}
          fontFamily={FONT}
          fontWeight={900}
          fontSize={32}
          letterSpacing={4}
          fill={c.primary}
        />
        <Txt
          ref={cause}
          text=""
          width={BAR_WIDTH}
          textWrap
          textAlign="center"
          fontFamily={FONT}
          fontWeight={800}
          fontSize={46}
          fill={c.text}
        />
      </Layout>

      <Layout ref={captions} size={'100%'} />
    </>,
  );

  const sequence = function* (): ThreadGenerator {
    yield* header().opacity(1, 0.4 * u);

    // 1) Connexion au véhicule
    dot().opacity(1);
    yield* status().text(obd.connectLabel, 1.2 * u, linear);

    // 2) Compte-tours : montée au ralenti puis coup d'accélérateur
    yield* all(gaugeGroup().opacity(1, 0.5 * u), gaugeGroup().scale(1, 0.5 * u, easeOutCubic));
    yield* rpm(obd.rpmIdle, 0.8 * u, easeOutCubic);
    yield* rpm(obd.rpmIdle * 3.6, 0.7 * u, easeOutCubic);
    yield* rpm(obd.rpmIdle, 0.9 * u, easeOutCubic);

    // 3) Code défaut
    yield* dtcCard().opacity(1, 0.3 * u);
    yield* code().text(dtc.code, 0.7 * u, linear);
    yield* all(label().opacity(1, 0.4 * u), dtcCard().stroke(c.accent, 0.4 * u));

    // 4) Analyse IA
    yield* analysisGroup().opacity(1, 0.3 * u);
    yield* analysis(1, 2.4 * u, easeOutCubic);
    yield* analysisGroup().opacity(0, 0.25 * u);

    // 5) Cause probable
    yield* causeGroup().opacity(1, 0.3 * u);
    yield* cause().text(dtc.cause, 1.2 * u, linear);
  };

  yield* all(
    sequence(),
    clock(total, total, linear),
    bindText(digits(), () => Math.round(shownRpm()).toString(), frames),
    bindText(percent(), () => `${Math.round(analysis() * 100)} %`, frames),
    runCaptions(captions(), words, brand),
    waitFor(total),
  );
}
