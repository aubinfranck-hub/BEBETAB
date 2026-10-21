export const FONT = 'Montserrat, "Arial Black", Arial, sans-serif';

/** Durée du fondu enchaîné entre deux scènes (s). */
export const FADE = 0.3;

/**
 * Zones de sécurité 1080×1920 (origine au centre, y vers le bas).
 * L'interface TikTok/Reels/Shorts masque ~190 px en haut et ~440 px en bas.
 */
export const SAFE_TOP = -740;
export const CAPTION_Y = 380;

/**
 * Taille de police telle que la ligne la plus longue tienne dans maxWidth.
 * Montserrat Black en capitales mesure environ 0,7 em par caractère (estimation prudente).
 */
export function fitFontSize(lines: string[], maxWidth: number, baseSize: number, emPerChar = 0.7): number {
  const longest = Math.max(1, ...lines.map(line => line.length));
  return Math.min(baseSize, Math.floor(maxWidth / (longest * emPerChar)));
}
