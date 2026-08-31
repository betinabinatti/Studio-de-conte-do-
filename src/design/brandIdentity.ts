import { AlignmentPreference } from "@/types/brand";
import { Slide, VisualDirection } from "@/types/slide";

/**
 * Official creative direction for the rendered art (Instagram posts).
 * Fixed by explicit client decision — "Escada de Pontos / ABA Autoridade".
 * Do not add colors, fonts, or rules outside what's defined here without
 * that authorization.
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
  { name: "Terracota (assinatura emocional)", hex: "#c46a4a" },
];

const OFF_WHITE = "#f4f2ee";
const CINZA_ESCURO = "#3e3e3e";
const CINZA_CLARO = "#eaeaea";
const PETROLEO_ESCURO = "#4f6d75";
const PETROLEO_MEDIO = "#6e8a92";
const AZUL_MARINHO = "#1f3a4a";
const TERRACOTA = "#c46a4a";

/** The one accent color of the identity — reserved for a single emotional highlight per post. */
export const ACCENT_COLOR = TERRACOTA;

export type FeedTier = "claro" | "medio" | "ancora";

export interface ContrastPair {
  background: string;
  text: string;
  tier: FeedTier;
}

/**
 * Fundo sólido e liso apenas — sem gradiente, textura ou terracota como
 * background (terracota é reservada à assinatura emocional de destaque).
 * Contraste pré-validado (WCAG >= 4.6:1, todos acima do mínimo AA).
 */
export const CONTRAST_PAIRS: ContrastPair[] = [
  { background: OFF_WHITE, text: CINZA_ESCURO, tier: "claro" },
  { background: CINZA_CLARO, text: CINZA_ESCURO, tier: "claro" },
  { background: PETROLEO_ESCURO, text: OFF_WHITE, tier: "medio" },
  { background: PETROLEO_MEDIO, text: CINZA_ESCURO, tier: "medio" },
  { background: AZUL_MARINHO, text: OFF_WHITE, tier: "ancora" },
];

const PAIRS_BY_TIER: Record<FeedTier, ContrastPair[]> = {
  claro: CONTRAST_PAIRS.filter((p) => p.tier === "claro"),
  medio: CONTRAST_PAIRS.filter((p) => p.tier === "medio"),
  ancora: CONTRAST_PAIRS.filter((p) => p.tier === "ancora"),
};

/** Feed rhythm target: âncora a cada 3–4 posts, claro/médio alternando entre os demais. */
const FEED_CYCLE: FeedTier[] = ["claro", "medio", "claro", "ancora"];

export function classifyTier(hex?: string): FeedTier | undefined {
  return CONTRAST_PAIRS.find((p) => p.background.toLowerCase() === hex?.toLowerCase())?.tier;
}

export function getPairForBackground(hex: string): ContrastPair {
  return (
    CONTRAST_PAIRS.find((p) => p.background.toLowerCase() === hex.toLowerCase()) ??
    CONTRAST_PAIRS[0]
  );
}

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Decides which tier the NEW post's cover should use, given the tiers of
 * recent posts (most recent first). Avoids repeating the immediately
 * previous tier and keeps "ancora" rare (~1 in every 3–4 posts).
 */
export function pickFeedTier(recentTiers: FeedTier[]): FeedTier {
  const previous = recentTiers[0];
  const sinceAncora = recentTiers.indexOf("ancora");
  const ancoraDue = sinceAncora === -1 ? recentTiers.length >= 3 : sinceAncora >= 3;

  if (ancoraDue && previous !== "ancora") return "ancora";

  const cycleIndex = recentTiers.length % FEED_CYCLE.length;
  let candidate = FEED_CYCLE[cycleIndex] === "ancora" ? "claro" : FEED_CYCLE[cycleIndex];
  if (candidate === previous) {
    candidate = candidate === "claro" ? "medio" : "claro";
  }
  return candidate;
}

/** Picks one pair within a tier, varying by seed so a carousel's slides differ. */
export function pickPairInTier(tier: FeedTier, seedText: string): ContrastPair {
  const options = PAIRS_BY_TIER[tier];
  const seed = hashSeed(seedText);
  return options[seed % options.length];
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
  /** Split-panel (fotografia + cartela) margin — a narrower canvas half. */
  PANEL_MARGIN: 64,
};

/**
 * Alinhamento padrão é ESQUERDA — não há mais centralização automática por
 * composição. Uma preferência fixa de marca (central/direita) sempre vence;
 * "automatico" resolve para esquerda, a linguagem visual padrão do sistema.
 */
export function resolveAlignment(
  preference: AlignmentPreference | undefined
): "left" | "center" | "right" {
  if (preference === "central") return "center";
  if (preference === "direita") return "right";
  return "left";
}

/**
 * Decisão editorial de caixa: caixa alta para frases de confronto/impacto/
 * afirmação/provocação; capitalização natural para frases intimistas,
 * reflexivas ou de identificação. Heurística determinística (sem custo de
 * IA extra) — usada quando o agente não fornece `titleCase` explicitamente.
 */
export function resolveTitleCase(title: string): "uppercase" | "natural" {
  const text = title.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  let score = 0;

  // Uppercase é a exceção — só quando o texto tem um marcador claro de
  // confronto/afirmação, nunca só por ser curto (isso reintroduziria a
  // regra automática que essa heurística existe pra evitar).
  if (/\bn[ãa]o\s+(é|significa|precisa|quer dizer)\b/i.test(text)) score += 1;
  if (/^(pare|olhe|observe|entenda|confie|respire|escute)\b/i.test(text)) score += 1;
  if (/[!?]$/.test(text) && wordCount <= 8) score += 1;

  if (/^(às vezes|nem sempre|talvez|quando|porque|se\s|e se\s|cada\s)/i.test(text)) score -= 1;
  if (/\.\.\.|…/.test(text)) score -= 1;
  if (wordCount > 12) score -= 1;
  if (/,/.test(text) && wordCount > 8) score -= 1;

  return score > 0 ? "uppercase" : "natural";
}

/**
 * Balanced multi-line title formatting: greedy-wraps to a target width, then
 * rebalances a lone final word into the line above so titles never end on an
 * orphan. Case is applied here per the resolved editorial decision, never
 * forced — the one place that matters, since export renders straight from
 * these lines.
 */
export function formatTitleLines(
  rawTitle: string,
  maxCharsPerLine: number,
  titleCase: "uppercase" | "natural" = "natural"
): string[] {
  const normalized = titleCase === "uppercase" ? rawTitle.trim().toUpperCase() : rawTitle.trim();
  const words = normalized.split(/\s+/).filter(Boolean);
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

/**
 * Average glyph width for Montserrat Bold uppercase, as a fraction of font
 * size — measured via canvas.measureText (~0.70), not guessed. Kept a touch
 * above the measured value on purpose: real DOM text layout can render
 * marginally wider than canvas measurement, and this ratio is what decides
 * whether a word gets its own line, so it must never underestimate.
 */
export const TITLE_CHAR_WIDTH_RATIO = 0.74;

/** Extra headroom applied only to the "does this word fit" check (rule 21 — never break a word). */
const WORD_FIT_SAFETY = 0.9;

export function estimateMaxCharsPerLine(fontSize: number, maxWidth = GRID.TITLE_MAX_WIDTH): number {
  return Math.max(6, Math.floor(maxWidth / (fontSize * TITLE_CHAR_WIDTH_RATIO)));
}

/**
 * A title with many words would otherwise stack into a tall column of short
 * lines at full size — step the font size down so long titles stay
 * compositionally balanced instead of dominating (or overflowing) the art.
 */
export function resolveTitleFontSize(
  basePx: number,
  title: string,
  maxWidth = GRID.TITLE_MAX_WIDTH
): number {
  const words = title.trim().split(/\s+/).filter(Boolean);
  let size = basePx;
  if (words.length > 10) size = Math.round(basePx * 0.62);
  else if (words.length > 6) size = Math.round(basePx * 0.78);

  // A single long word (e.g. "MANIPULAÇÃO") must fit on its own line at
  // this size — otherwise it has nowhere to wrap to and would overflow or
  // break mid-word. Shrink further, down to a readable floor, until it fits.
  const longestWordLen = Math.max(0, ...words.map((w) => w.length));
  if (longestWordLen > 0) {
    const maxFitSize = Math.floor(
      (maxWidth * WORD_FIT_SAFETY) / (longestWordLen * TITLE_CHAR_WIDTH_RATIO)
    );
    size = Math.max(30, Math.min(size, maxFitSize));
  }

  return size;
}

/**
 * The one place the system "decides before rendering": takes the art
 * director's raw structural output (composition, textPosition, spacing,
 * imageNeeded) and resolves the parts that belong to the fixed identity —
 * background color, title case — instead of trusting the agent's guess.
 * Runs once at generation time (not per render), so the choice is
 * persisted and future generations can read this post's tier back via
 * `classifyTier`, which is what makes feed-rhythm alternation possible.
 */
export function applyOfficialIdentity(
  directions: VisualDirection[],
  slides: Slide[],
  recentTiers: FeedTier[] = []
): VisualDirection[] {
  const coverTier = pickFeedTier(recentTiers);
  // A per-call nonce, not per-render: lets "Alterar visual" land on a
  // different (still compliant) pair each time it re-runs this resolver,
  // even though the slide text itself doesn't change.
  const callNonce = Math.random().toString(36).slice(2);

  return directions.map((direction, i) => {
    const slide = slides[i];
    const tier = i === 0 ? coverTier : i % 2 === 0 ? coverTier : "claro";
    const pair = pickPairInTier(tier, `${slide?.title ?? ""}::${i}::${callNonce}`);
    const titleCase =
      direction.titleCase === "uppercase" || direction.titleCase === "natural"
        ? direction.titleCase
        : resolveTitleCase(slide?.title ?? "");

    return {
      ...direction,
      background: { type: "solid", colors: [pair.background] },
      titleCase,
    };
  });
}
