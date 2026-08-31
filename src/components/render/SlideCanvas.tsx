import { forwardRef } from "react";
import { Slide, VisualDirection } from "@/types/slide";
import { BrandProfile } from "@/types/brand";
import { CTA } from "@/types/caption";
import { withAlpha } from "@/utils/colors";
import {
  GRID,
  SPACING,
  pickBackgroundPair,
  getAccentColor,
  resolveAlignment,
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
 * Deterministic HTML/CSS rendering of one slide — this IS the final art,
 * not a description of one. Colors and alignment are resolved here from the
 * official brand identity (src/design/brandIdentity.ts) rather than trusted
 * verbatim from the art-director agent, so every export stays on-brand
 * regardless of provider (mock or real AI). An image model is only ever
 * consulted (via direction.imageUrl) for a background photo/illustration,
 * never for text.
 */
export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(
  ({ slide, direction, brand, width, height, totalSlides, scale = 1, showCta }, ref) => {
    const seedText = `${slide.title}::${totalSlides}`;
    const pair = pickBackgroundPair(slide.index, seedText);
    const textColor = pair.text;
    const accentColor = getAccentColor(pair.background);

    const hasImage = Boolean(direction.imageUrl) && direction.composition === "texto-imagem";
    const background = direction.background.type === "gradient"
      ? `linear-gradient(135deg, ${pair.background} 0%, ${pair.background} 55%, ${withAlpha(accentColor, 0.14)} 100%)`
      : pair.background;

    const alignment = resolveAlignment(brand?.alignmentPreference, {
      composition: direction.composition,
      bodyLength: slide.body?.length ?? 0,
      imageNeeded: hasImage,
      isFirst: slide.index === 0,
      isLast: slide.index === totalSlides - 1,
      slideIndex: slide.index,
    });

    const justify =
      direction.textPosition === "center"
        ? "center"
        : direction.textPosition === "bottom"
        ? "flex-end"
        : "flex-start";
    const align = alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start";

    const verticalPadding = VERTICAL_PADDING[direction.spacing] ?? GRID.SAFE_MARGIN_TOP;
    const titleSize = resolveTitleFontSize(TITLE_SIZES[direction.typography.titleSize] || 64, slide.title);
    const bodySize = BODY_SIZES[direction.typography.bodySize] || 36;
    const titleLines = formatTitleLines(slide.title, estimateMaxCharsPerLine(titleSize));

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
            background: hasImage
              ? `linear-gradient(180deg, rgba(31,58,74,0.25), rgba(31,58,74,0.65)), url(${direction.imageUrl}) center/cover no-repeat`
              : background,
            color: hasImage ? "#f4f2ee" : textColor,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: justify,
            alignItems: align,
            paddingTop: verticalPadding,
            paddingBottom: verticalPadding,
            paddingLeft: GRID.SAFE_MARGIN_X,
            paddingRight: GRID.SAFE_MARGIN_X,
            boxSizing: "border-box",
            fontFamily: "var(--font-art)",
          }}
        >
          {direction.background.type === "texture" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 80% 15%, ${withAlpha(accentColor, 0.13)}, transparent 55%)`,
                pointerEvents: "none",
              }}
            />
          )}

          {direction.graphicElements.includes("marca-dagua") && brand?.name && (
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

          <div
            style={{
              maxWidth: GRID.CONTENT_MAX_WIDTH,
              textAlign: alignment,
              zIndex: 1,
            }}
          >
            <h2
              style={{
                maxWidth: GRID.TITLE_MAX_WIDTH,
                marginLeft: alignment === "right" ? "auto" : alignment === "center" ? "auto" : 0,
                marginRight: alignment === "left" ? "auto" : alignment === "center" ? "auto" : 0,
                fontFamily: "var(--font-art)",
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.12,
                marginBottom: SPACING.md,
                letterSpacing: -0.5,
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {titleLines.map((line, i) => (
                <div key={i}>
                  <HighlightedText text={line} highlightWords={slide.highlightWords} accentColor={accentColor} />
                </div>
              ))}
            </h2>
            {slide.body && (
              <p
                style={{
                  fontSize: bodySize,
                  lineHeight: 1.5,
                  opacity: 0.92,
                  fontWeight: 400,
                  whiteSpace: "pre-line",
                }}
              >
                {slide.body}
              </p>
            )}

            {showCta && showCta.intent !== "nenhum" && (
              <div
                style={{
                  marginTop: SPACING.lg,
                  display: "inline-flex",
                  padding: "16px 32px",
                  borderRadius: 999,
                  border: `2px solid ${textColor}`,
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
                right: GRID.SAFE_MARGIN_X * 0.8,
                fontSize: 24,
                opacity: 0.55,
                fontWeight: 500,
              }}
            >
              {String(slide.index + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>
    );
  }
);
SlideCanvas.displayName = "SlideCanvas";
