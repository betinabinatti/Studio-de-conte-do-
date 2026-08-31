"use client";

import { useRouter } from "next/navigation";
import { GeneratedContent } from "@/types/content";
import { BrandProfile } from "@/types/brand";
import { FORMAT_DIMENSIONS, FORMAT_LABELS } from "@/types/brief";
import { SlideCanvas } from "@/components/render/SlideCanvas";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trash2 } from "lucide-react";

const THUMB_WIDTH = 260;

const STATUS_TONE: Record<GeneratedContent["status"], "neutral" | "success" | "accent"> = {
  rascunho: "neutral",
  pronto: "success",
  publicado: "accent",
};

const STATUS_LABEL: Record<GeneratedContent["status"], string> = {
  rascunho: "Rascunho",
  pronto: "Pronto",
  publicado: "Publicado",
};

export function ContentCard({
  content,
  brand,
  onDelete,
}: {
  content: GeneratedContent;
  brand?: BrandProfile;
  onDelete: () => void;
}) {
  const router = useRouter();
  const dimensions = FORMAT_DIMENSIONS[content.brief.format];
  const scale = THUMB_WIDTH / dimensions.width;
  const slide = content.slides[0];
  const direction = content.visualDirections[0];

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => router.push(`/?contentId=${content.id}`)}
        className="block w-full text-left"
      >
        <div
          className="flex items-center justify-center overflow-hidden bg-sand"
          style={{ height: THUMB_WIDTH * (dimensions.height / dimensions.width) }}
        >
          {slide && direction && (
            <SlideCanvas
              slide={slide}
              direction={direction}
              brand={brand}
              width={dimensions.width}
              height={dimensions.height}
              totalSlides={content.slides.length}
              scale={scale}
            />
          )}
        </div>
      </button>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-display text-sm text-ink">{content.title}</h3>
          <button onClick={onDelete} className="shrink-0 text-ink/30 hover:text-accent">
            <Trash2 size={14} />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="neutral">{FORMAT_LABELS[content.brief.format]}</Badge>
          <Badge tone={STATUS_TONE[content.status]}>{STATUS_LABEL[content.status]}</Badge>
        </div>
        <p className="text-xs text-ink/40">
          {new Date(content.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </Card>
  );
}
