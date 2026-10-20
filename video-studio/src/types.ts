export interface BrandColors {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  warning: string;
  text: string;
  textMuted: string;
}

export interface Brand {
  id: string;
  name: string;
  watermark: string;
  /** Chemin sous public/, ex. "brands/diagassist/logo.png" */
  logo: string | null;
  colors: BrandColors;
}

export interface BibleEntry {
  id: string;
  identity: string;
}

export interface Bible {
  vehicle: BibleEntry;
  mechanic: BibleEntry;
  client: BibleEntry;
  location: BibleEntry;
  scanner: BibleEntry;
  style: string;
}

export interface ShotSpec {
  description: string;
  references: string[];
  camera: string;
  prompt: string;
}

export interface DtcEntry {
  code: string;
  label: string;
  cause: string;
}

export interface ObdSpec {
  title: string;
  connectLabel: string;
  rpmMax: number;
  rpmIdle: number;
  dtcs: DtcEntry[];
  analysisLabel: string;
  causeLabel: string;
}

export type SceneKind = 'clip' | 'obd' | 'cta';

export interface SceneDef {
  id: string;
  kind: SceneKind;
  /** Durée en secondes ; la somme doit égaler format.durationSeconds. */
  duration: number;
  /** Chemin relatif à public/<campagne>/ */
  clip?: string;
  /** Point de départ dans le clip, en secondes. */
  clipStart?: number;
  headline?: string;
  subheadline?: string;
  voiceover?: string;
  shot?: ShotSpec;
  obd?: ObdSpec;
}

export interface Campaign {
  id: string;
  brand: string;
  product: string;
  title: string;
  format: {width: number; height: number; fps: number; durationSeconds: number};
  audio: {
    music: string | null;
    musicVolume: number;
    voiceVolume: number;
    /** Seuil du sidechain (amplitude 0-1) : plus il est bas, plus la musique baisse tôt. Défaut 0.03. */
    duckThreshold?: number;
    /** Ratio de compression de la musique sous la voix. Défaut 4. */
    duckRatio?: number;
  };
  cta: {tagline: string; contactLabel: string; contact: string};
  bible: Bible;
  scenes: SceneDef[];
}

export interface WordTiming {
  text: string;
  /** Secondes, relatives au début de la scène. */
  start: number;
  end: number;
}

export interface SceneVoice {
  /** Chemin relatif à public/<campagne>/ */
  audio: string;
  /** Durée de la voix en secondes. */
  duration: number;
  words: WordTiming[];
  /** Empreinte texte+voix : évite de regénérer (et refacturer) une scène inchangée. */
  hash: string;
}

export type CampaignVoice = Record<string, SceneVoice>;

export interface MediaInfo {
  width: number;
  height: number;
  duration: number;
}

export interface AssetManifest {
  /** Chemins relatifs à public/, séparateur "/" */
  files: string[];
  media: Record<string, MediaInfo>;
}

export interface TimelineScene extends SceneDef {
  /** Début absolu en secondes. */
  start: number;
}
