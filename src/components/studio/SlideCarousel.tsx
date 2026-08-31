"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Slide, VisualDirection } from "@/types/slide";
import { BrandProfile } from "@/types/brand";
import { CTA } from "@/types/caption";
import { SlideCanvas } from "@/components/render/SlideCanvas";

const PREVIEW_HEIGHT = 560;
const THUMB_HEIGHT = 84;

interface SlideCarouselProps {
  slides: Slide[];
  directions: VisualDirection[];
  brand?: BrandProfile;
  width: number;
  height: number;
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  cta: CTA;
  slideRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export function SlideCarousel({
  slides,
  directions,
  brand,
  width,
  height,
  activeIndex,
  onChangeIndex,
  cta,
  slideRefs,
}: SlideCarouselProps) {
  const previewScale = PREVIEW_HEIGHT / height;
  const thumbScale = THUMB_HEIGHT / height;
  const containerRef = useRef<HTMLDivElement>(null);

  const active = slides[activeIndex];
  const activeDirection = directions[activeIndex] || directions[0];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-4">
        {slides.length > 1 && (
          <button
            type="button"
            onClick={() => onChangeIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="rounded-full border border-ink/10 p-2 text-ink/60 transition-colors hover:border-ink/30 disabled:opacity-25"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div ref={containerRef}>
          {active && activeDirection && (
            <SlideCanvas
              ref={(node) => {
                slideRefs.current[activeIndex] = node;
              }}
              slide={active}
              direction={activeDirection}
              brand={brand}
              width={width}
              height={height}
              totalSlides={slides.length}
              scale={previewScale}
              showCta={
                activeDirection.composition === "cta-final" || activeIndex === slides.length - 1
                  ? cta
                  : undefined
              }
            />
          )}
        </div>

        {slides.length > 1 && (
          <button
            type="button"
            onClick={() => onChangeIndex(Math.min(slides.length - 1, activeIndex + 1))}
            disabled={activeIndex === slides.length - 1}
            className="rounded-full border border-ink/10 p-2 text-ink/60 transition-colors hover:border-ink/30 disabled:opacity-25"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {slides.length > 1 && (
        <p className="text-sm text-ink/50">
          Slide {activeIndex + 1} / {slides.length}
        </p>
      )}

      {slides.length > 1 && (
        <div className="flex max-w-full gap-2 overflow-x-auto scrollbar-hide px-2 py-1">
          {slides.map((slide, i) => {
            const direction = directions[i];
            if (!direction) return null;
            return (
              <button
                key={slide.index}
                type="button"
                onClick={() => onChangeIndex(i)}
                className={clsx(
                  "shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 ring-offset-paper transition-all",
                  i === activeIndex ? "ring-ink" : "ring-transparent opacity-60 hover:opacity-100"
                )}
              >
                <SlideCanvas
                  ref={(node) => {
                    slideRefs.current[i] = slideRefs.current[i] || node;
                  }}
                  slide={slide}
                  direction={direction}
                  brand={brand}
                  width={width}
                  height={height}
                  totalSlides={slides.length}
                  scale={thumbScale}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
