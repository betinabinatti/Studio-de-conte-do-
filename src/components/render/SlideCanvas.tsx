import { forwardRef } from "react";
import { Slide, VisualDirection } from "@/types/slide";
import { BrandProfile } from "@/types/brand";
import { CTA } from "@/types/caption";
import { contrastTextColor } from "@/utils/colors";
import { HighlightedText } from "./HighlightedText";

const TITLE_SIZES: Record<string, number> = { sm: 48, md: 64, lg: 84, xl: 108 };
const BODY_SIZES: Record<string, number> = { sm: 30, md: 36, lg: 42 };
const SPACING_GAP: Record<string, number> = { compact: 24, normal: 36, airy: 52 };
const SPACING_PADDING: Record<string, number> = { compact: 64, normal: 88, airy: 112 };

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
 * not a description of one. Every text, color, size and position here is
 * controlled directly; an image model is only ever consulted (via
 * direction.imageUrl) for a background photo/illustration, never for text.
 */
export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(
  ({ slide, direction, brand, width, height, totalSlides, scale = 1, showCta }, ref) => {
    const bgColors = direction.background.colors.length
      ? direction.background.colors
      : ["#FBF9F6"];
    const background =
      direction.background.type === "solid"
        ? bgColors[0]
        : `linear-gradient(135deg, ${bgColors[0]} 0%, ${bgColors[1] || bgColors[0]} 100%)`;

    const textColor = contrastTextColor(bgColors[0]);
    const accentColor =
      brand?.colors?.find((c) => c.hex.toLowerCase() !== bgColors[0].toLowerCase())?.hex ||
      "#C4622D";

    const justify =
      direction.textPosition === "center"
        ? "center"
        : direction.textPosition === "bottom"
        ? "flex-end"
        : "flex-start";
    const align =
      direction.alignment === "center"
        ? "center"
        : direction.alignment === "right"
        ? "flex-end"
        : "flex-start";

    const padding = SPACING_PADDING[direction.spacing] || 88;
    const gap = SPACING_GAP[direction.spacing] || 36;
    const titleFont =
      direction.typography.titleFont === "display" ? "var(--font-display)" : "var(--font-sans)";

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
            background:
              direction.imageUrl && direction.composition === "texto-imagem"
                ? `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55)), url(${direction.imageUrl}) center/cover no-repeat`
                : background,
            color: direction.imageUrl ? "#FBF9F6" : textColor,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: justify,
            alignItems: align,
            padding,
            boxSizing: "border-box",
            fontFamily: "var(--font-sans)",
          }}
        >
          {direction.background.type === "texture" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 80% 15%, ${accentColor}22, transparent 55%)`,
                pointerEvents: "none",
              }}
            />
          )}

          {direction.graphicElements.includes("marca-dagua") && brand?.name && (
            <div
              style={{
                position: "absolute",
                top: padding * 0.55,
                left: align === "center" ? "50%" : padding,
                transform: align === "center" ? "translateX(-50%)" : undefined,
                fontSize: 22,
                letterSpacing: 4,
                opacity: 0.6,
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {brand.name}
            </div>
          )}

          <div style={{ maxWidth: "88%", textAlign: direction.alignment, zIndex: 1 }}>
            <h2
              style={{
                fontFamily: titleFont,
                fontSize: TITLE_SIZES[direction.typography.titleSize] || 64,
                fontWeight: 600,
                lineHeight: 1.08,
                marginBottom: gap,
                letterSpacing: -0.5,
              }}
            >
              <HighlightedText
                text={slide.title}
                highlightWords={slide.highlightWords}
                accentColor={accentColor}
              />
            </h2>
            {slide.body && (
              <p
                style={{
                  fontSize: BODY_SIZES[direction.typography.bodySize] || 36,
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
                  marginTop: gap * 1.2,
                  display: "inline-flex",
                  padding: "16px 32px",
                  borderRadius: 999,
                  border: `2px solid ${textColor}`,
                  fontSize: 28,
                  fontWeight: 600,
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
                bottom: padding * 0.55,
                right: padding * 0.8,
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
