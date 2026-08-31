import { CompositionType } from "@/types/slide";
import { AlignmentPreference } from "@/types/brand";

/**
 * Official brand identity for the rendered art (Instagram posts/slides).
 * Fixed by explicit client decision — do not add colors, fonts, or spacing
 * values outside what's defined here without that authorization.
 */

export interface PaletteColor {
  name: string;
  hex: string;
}

export const OFFICIAL_PALETTE: PaletteColor[] = [
  { name: "Petróleo escuro", hex: "#4f6d75" },
  { name: "Petróleo médio", hex: "#6e8a92" },
  { name: "Cinza escuro", hex: "#3e3e3e" },
  { name: "Cinza claro", hex: "#eaeaea" },
  { name: "Off-white", hex: "#f4f2ee" },
  { name: "Azul-marinho", hex: "#1f3a4a" },
  { name: "Terracota (destaque)", hex: "#c46a4a" },
];

const OFF_WHITE = "#f4f2ee";
const CINZA_ESCURO = "#3e3e3e";
const CINZA_CLARO = "#eaeaea";
const PETROLEO_ESCURO = "#4f6d75";
const PETROLEO_MEDIO = "#6e8a92";
const AZUL_MARINHO = "#1f3a4a";
const TERRACOTA = "#c46a4a";

/**
 * Background/text combinations, pre-vetted for WCAG contrast (>= 3:1, the
 * large-bold-text threshold every one of these carries at title sizes).
 * `weight` biases how often a pair is picked — terracota and the medium
 * petróleo are rarer, per "não usar terracota em excesso".
 */
export interface ContrastPair {
  background: string;
  text: string;
  weight: number;
}

export const CONTRAST_PAIRS: ContrastPair[] = [
  { background: OFF_WHITE, text: CINZA_ESCURO, weight: 3 },
  { background: CINZA_CLARO, text: CINZA_ESCURO, weight: 2 },
  { background: PETROLEO_ESCURO, text: OFF_WHITE, weight: 2 },
  { background: AZUL_MARINHO, text: OFF_WHITE, weight: 2 },
  { background: CINZA_ESCURO, text: OFF_WHITE, weight: 1 },
  { background: PETROLEO_MEDIO, text: OFF_WHITE, weight: 1 },
  { background: TERRACOTA, text: OFF_WHITE, weight: 1 },
];

const WEIGHTED_PAIRS: ContrastPair[] = CONTRAST_PAIRS.flatMap((pair) =>
  Array(pair.weight).fill(pair)
);

/** The one accent color of the identity — used sparingly for highlights/CTAs. */
export const ACCENT_COLOR = TERRACOTA;

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic per-slide background/text pair — stable across re-renders. */
export function pickBackgroundPair(slideIndex: number, seedText = ""): ContrastPair {
  const seed = hashSeed(seedText);
  return WEIGHTED_PAIRS[(seed + slideIndex) % WEIGHTED_PAIRS.length];
}

/** Terracota is the accent everywhere except when it's already the background. */
export function getAccentColor(backgroundHex: string): string {
  return backgroundHex.toLowerCase() === TERRACOTA ? AZUL_MARINHO : ACCENT_COLOR;
}

const SPACING = { xs: 16, sm: 28, md: 44, lg: 68, xl: 100 } as const;
export type SpacingTier = keyof typeof SPACING;
export { SPACING };

/** Grid reference: every format in this app is 1080px wide. */
export const GRID = {
  CANVAS_WIDTH: 1080,
  SAFE_MARGIN_X: 100,
  SAFE_MARGIN_TOP: 100,
  SAFE_MARGIN_BOTTOM: 100,
  get CONTENT_MAX_WIDTH() {
    return this.CANVAS_WIDTH - this.SAFE_MARGIN_X * 2;
  },
  TITLE_MAX_WIDTH: 660,
};

interface AlignmentHeuristicInput {
  composition: CompositionType;
  bodyLength: number;
  imageNeeded: boolean;
  isFirst: boolean;
  isLast: boolean;
  slideIndex: number;
}

/**
 * Resolves the "AUTO" alignment decision: a fixed brand preference always
 * wins; otherwise the composition, text volume and image presence decide.
 */
export function resolveAlignment(
  preference: AlignmentPreference | undefined,
  input: AlignmentHeuristicInput
): "left" | "center" | "right" {
  if (preference === "esquerda") return "left";
  if (preference === "direita") return "right";
  if (preference === "central") return "center";

  if (input.imageNeeded || input.composition === "texto-imagem") {
    return input.slideIndex % 2 === 0 ? "left" : "right";
  }
  if (input.composition === "gancho-central" || input.composition === "cta-final") {
    return "center";
  }
  if (input.composition === "lista" || input.composition === "comparacao") {
    return "left";
  }
  if (input.bodyLength > 0 && input.bodyLength < 60) {
    return "center";
  }
  if (input.isFirst || input.isLast) {
    return "center";
  }
  return "left";
}

/**
 * Balanced multi-line title formatting: greedy-wraps to a target width, then
 * rebalances a lone final word into the line above so titles never end on an
 * orphan. The title is always forced to uppercase here — the one place that
 * matters, since export renders straight from these lines.
 */
export function formatTitleLines(rawTitle: string, maxCharsPerLine: number): string[] {
  const words = rawTitle.trim().toUpperCase().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [words.join("")];

  const lines: string[] = [];
  let current: string[] = [];
  let currentLen = 0;

  for (const word of words) {
    const addedLen = current.length ? currentLen + 1 + word.length : word.length;
    if (addedLen > maxCharsPerLine && current.length) {
      lines.push(current.join(" "));
      current = [word];
      currentLen = word.length;
    } else {
      current.push(word);
      currentLen = addedLen;
    }
  }
  if (current.length) lines.push(current.join(" "));

  const lastLine = lines[lines.length - 1];
  const previousLine = lines[lines.length - 2];
  if (lines.length >= 2 && lastLine.split(" ").length === 1 && previousLine.split(" ").length > 1) {
    const previousWords = previousLine.split(" ");
    const movedWord = previousWords.pop() as string;
    lines[lines.length - 2] = previousWords.join(" ");
    lines[lines.length - 1] = `${movedWord} ${lastLine}`;
  }

  return lines;
}

/** Rough average glyph width for Montserrat Bold uppercase, as a fraction of font size. */
export const TITLE_CHAR_WIDTH_RATIO = 0.66;

export function estimateMaxCharsPerLine(fontSize: number, maxWidth = GRID.TITLE_MAX_WIDTH): number {
  return Math.max(6, Math.floor(maxWidth / (fontSize * TITLE_CHAR_WIDTH_RATIO)));
}

/**
 * A title with many words would otherwise stack into a tall column of short
 * lines at full size — step the font size down so long titles stay
 * compositionally balanced instead of dominating (or overflowing) the art.
 */
export function resolveTitleFontSize(basePx: number, title: string): number {
  const wordCount = title.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 10) return Math.round(basePx * 0.62);
  if (wordCount > 6) return Math.round(basePx * 0.78);
  return basePx;
}
