import { forwardRef } from "react";
import { Slide, VisualDirection } from "@/types/slide";
import { BrandProfile } from "@/types/brand";
import { CTA } from "@/types/caption";
import {
  GRID,
  SPACING,
  ACCENT_COLOR,
  getPairForBackground,
  resolveAlignment,
  resolveTitleCase,
  formatTitleLines,
  estimateMaxCharsPerLine,
  resolveTitleFontSize,
} from "@/design/brandIdentity";
import { HighlightedText } from "./HighlightedText";

const TITLE_SIZES: Record<string, number> = { sm: 48, md: 64, lg: 84, xl: 108 };
const BODY_SIZES: Record<string, number> = { sm: 30, md: 36, lg: 42 };

/** Vertical padding around the safe-area baseline — flexes a little with density. */
const VERTICAL_PADDING: Record<string, number> = {
  compact: GRID.SAFE_MARGIN_TOP - 24,
  normal: GRID.SAFE_MARGIN_TOP,
  airy: GRID.SAFE_MARGIN_TOP + 24,
};

interface SlideCanvasProps {
  slide: Slide;
  direction: VisualDirection;
  brand?: BrandProfile;
  width: number;
  height: number;
  totalSlides: number;
  scale?: number;
  showCta?: CTA;
}

/**
 * Regra absoluta: no máximo UMA palavra/linha em terracota por peça — a
 * assinatura emocional do texto inteiro, não do título especificamente.
 * Aplica no título se o texto aparecer lá; senão tenta o corpo. Nunca nos
 * dois ao mesmo tempo.
 */
function resolveSingleHighlight(slide: Slide): { title: string[]; body: string[] } {
  const phrase = slide.highlightWords?.[0];
  if (!phrase) return { title: [], body: [] };
  const needle = phrase.toLowerCase();
  if (slide.title.toLowerCase().includes(needle)) return { title: [phrase], body: [] };
  if (slide.body?.toLowerCase().includes(needle)) return { title: [], body: [phrase] };
  return { title: [], body: [] };
}

function TitleBlock({
  slide,
  titleSize,
  titleCase,
  maxCharsPerLine,
  highlightWords,
}: {
  slide: Slide;
  titleSize: number;
  titleCase: "uppercase" | "natural";
  maxCharsPerLine: number;
  highlightWords: string[];
}) {
  const titleLines = formatTitleLines(slide.title, maxCharsPerLine, titleCase);

  return (
    <h2
      style={{
        maxWidth: GRID.TITLE_MAX_WIDTH,
        fontFamily: "var(--font-art)",
        fontSize: titleSize,
        fontWeight: 700,
        lineHeight: 1.15,
        marginBottom: SPACING.md,
        letterSpacing: titleCase === "uppercase" ? -0.5 : 0,
        overflowWrap: "break-word",
        wordBreak: "break-word",
      }}
    >
      {titleLines.map((line, i) => (
        <div key={i}>
          <HighlightedText text={line} highlightWords={highlightWords} accentColor={ACCENT_COLOR} />
        </div>
      ))}
    </h2>
  );
}

/**
 * Deterministic HTML/CSS rendering of one slide — this IS the final art,
 * not a description of one. Background color and title case are trusted
 * directly from `direction` because they were already resolved once, at
 * generation time, by `applyOfficialIdentity` — the renderer's job is just
 * to lay them out inside the grid, never to re-decide them.
 */
export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(
  ({ slide, direction, brand, width, height, totalSlides, scale = 1, showCta }, ref) => {
    const pair = getPairForBackground(direction.background.colors[0] || "#f4f2ee");
    const titleCase = direction.titleCase ?? resolveTitleCase(slide.title);
    const alignment = resolveAlignment(brand?.alignmentPreference);
    const align = alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start";

    const justify =
      direction.textPosition === "center"
        ? "center"
        : direction.textPosition === "bottom"
        ? "flex-end"
        : "flex-start";

    const verticalPadding = VERTICAL_PADDING[direction.spacing] ?? GRID.SAFE_MARGIN_TOP;
    const titleSize = resolveTitleFontSize(TITLE_SIZES[direction.typography.titleSize] || 64, slide.title);
    const bodySize = BODY_SIZES[direction.typography.bodySize] || 36;

    // Fotografia + cartela: nunca texto sobreposto à foto. Painéis lado a
    // lado, alternando o lado da foto por slide para variar a composição.
    const showPhotoSplit = Boolean(direction.imageUrl) && direction.composition === "texto-imagem";
    const photoOnRight = slide.index % 2 === 0;
    const highlight = resolveSingleHighlight(slide);

    const textPanel = (
      <div
        style={{
          flex: showPhotoSplit ? "0 0 50%" : "1 1 auto",
          width: showPhotoSplit ? "50%" : "100%",
          height: "100%",
          background: pair.background,
          color: pair.text,
          display: "flex",
          flexDirection: "column",
          justifyContent: justify,
          alignItems: align,
          paddingTop: verticalPadding,
          paddingBottom: verticalPadding,
          paddingLeft: showPhotoSplit ? GRID.PANEL_MARGIN : GRID.SAFE_MARGIN_X,
          paddingRight: showPhotoSplit ? GRID.PANEL_MARGIN : GRID.SAFE_MARGIN_X,
          boxSizing: "border-box",
          fontFamily: "var(--font-art)",
          position: "relative",
        }}
      >
        {direction.graphicElements.includes("marca-dagua") && brand?.name && !showPhotoSplit && (
          <div
            style={{
              position: "absolute",
              top: verticalPadding * 0.55,
              left: align === "center" ? "50%" : GRID.SAFE_MARGIN_X,
              right: align === "flex-end" ? GRID.SAFE_MARGIN_X : undefined,
              transform: align === "center" ? "translateX(-50%)" : undefined,
              fontSize: 22,
              letterSpacing: 4,
              opacity: 0.6,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {brand.name}
          </div>
        )}

        <div style={{ maxWidth: showPhotoSplit ? "100%" : GRID.CONTENT_MAX_WIDTH, textAlign: alignment, zIndex: 1 }}>
          <TitleBlock
            slide={slide}
            titleSize={showPhotoSplit ? Math.round(titleSize * 0.75) : titleSize}
            titleCase={titleCase}
            maxCharsPerLine={estimateMaxCharsPerLine(
              showPhotoSplit ? Math.round(titleSize * 0.75) : titleSize,
              showPhotoSplit ? width / 2 - GRID.PANEL_MARGIN * 2 : GRID.TITLE_MAX_WIDTH
            )}
            highlightWords={highlight.title}
          />
          {slide.body && (
            <p
              style={{
                fontSize: showPhotoSplit ? Math.round(bodySize * 0.85) : bodySize,
                lineHeight: 1.5,
                opacity: 0.92,
                fontWeight: 400,
                whiteSpace: "pre-line",
              }}
            >
              <HighlightedText text={slide.body} highlightWords={highlight.body} accentColor={ACCENT_COLOR} />
            </p>
          )}

          {showCta && showCta.intent !== "nenhum" && (
            <div
              style={{
                marginTop: SPACING.lg,
                display: "inline-flex",
                padding: "16px 32px",
                borderRadius: 999,
                border: `2px solid ${pair.text}`,
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {showCta.text}
            </div>
          )}
        </div>

        {direction.graphicElements.includes("numero-slide") && totalSlides > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: verticalPadding * 0.55,
              right: showPhotoSplit ? GRID.PANEL_MARGIN * 0.6 : GRID.SAFE_MARGIN_X * 0.8,
              fontSize: 24,
              opacity: 0.55,
              fontWeight: 500,
            }}
          >
            {String(slide.index + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </div>
        )}
      </div>
    );

    return (
      <div
        style={{
          width: width * scale,
          height: height * scale,
          overflow: "hidden",
          borderRadius: scale < 1 ? 16 : 0,
        }}
        className="shadow-card"
      >
        <div
          ref={ref}
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            display: "flex",
            flexDirection: showPhotoSplit && !photoOnRight ? "row-reverse" : "row",
            boxSizing: "border-box",
          }}
        >
          {textPanel}
          {showPhotoSplit && (
            <div
              style={{
                flex: "0 0 50%",
                width: "50%",
                height: "100%",
                background: `url(${direction.imageUrl}) center/cover no-repeat`,
              }}
            />
          )}
        </div>
      </div>
    );
  }
);
SlideCanvas.displayName = "SlideCanvas";
