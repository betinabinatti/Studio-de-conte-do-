"use client";

import { useRef, useState } from "react";
import { GeneratedContent } from "@/types/content";
import { BrandProfile } from "@/types/brand";
import { FORMAT_DIMENSIONS } from "@/types/brief";
import { SlideCarousel } from "./SlideCarousel";
import { CaptionPanel } from "./CaptionPanel";
import { EditSlideModal } from "./EditSlideModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { captureSlidePng, downloadDataUrl, slideFileName } from "@/export/exportImage";
import {
  RefreshCw,
  Pencil,
  Palette,
  Sparkles,
  Download,
  ImageDown,
  ShieldCheck,
} from "lucide-react";

interface ResultViewProps {
  content: GeneratedContent;
  brand?: BrandProfile;
  onContentChange: (content: GeneratedContent) => void;
  onRegenerateAll: () => void;
}

export function ResultView({ content, brand, onContentChange, onRegenerateAll }: ResultViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const dimensions = FORMAT_DIMENSIONS[content.brief.format];

  async function handleRegenerate() {
    setBusy("regenerate");
    try {
      const res = await fetch(`/api/contents/${content.id}/regenerate`, { method: "POST" });
      if (res.ok) onContentChange(await res.json());
    } finally {
      setBusy(null);
    }
  }

  async function handleRestyle() {
    setBusy("restyle");
    try {
      const res = await fetch(`/api/contents/${content.id}/restyle`, { method: "POST" });
      if (res.ok) onContentChange(await res.json());
    } finally {
      setBusy(null);
    }
  }

  async function handleSaveSlide(updatedSlide: GeneratedContent["slides"][number]) {
    const slides = content.slides.map((s) => (s.index === updatedSlide.index ? updatedSlide : s));
    const updated = { ...content, slides };
    setEditing(false);
    onContentChange(updated);
    await fetch(`/api/contents/${content.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  async function handleSaveImage() {
    const node = slideRefs.current[activeIndex];
    if (!node) return;
    setBusy("save-image");
    try {
      const dataUrl = await captureSlidePng(node, dimensions.width, dimensions.height);
      downloadDataUrl(
        dataUrl,
        slideFileName(content.slides[activeIndex].title, activeIndex, content.slides.length)
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleSaveCarousel() {
    setBusy("save-carousel");
    try {
      const images: string[] = [];
      for (let i = 0; i < content.slides.length; i++) {
        const node = slideRefs.current[i];
        if (!node) continue;
        const dataUrl = await captureSlidePng(node, dimensions.width, dimensions.height);
        images.push(dataUrl);
        downloadDataUrl(dataUrl, slideFileName(content.slides[i].title, i, content.slides.length));
      }
      const res = await fetch(`/api/contents/${content.id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      if (res.ok) onContentChange(await res.json());
    } finally {
      setBusy(null);
    }
  }

  const isCarousel = content.slides.length > 1;

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="font-display text-3xl text-ink">Seu conteúdo está pronto</h2>
        <p className="mt-1 text-sm text-ink/50">{content.title}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col items-center gap-6">
          <SlideCarousel
            slides={content.slides}
            directions={content.visualDirections}
            brand={brand}
            width={dimensions.width}
            height={dimensions.height}
            activeIndex={activeIndex}
            onChangeIndex={setActiveIndex}
            cta={content.cta}
            slideRefs={slideRefs}
          />

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={!!busy}>
              <RefreshCw size={14} className={busy === "regenerate" ? "animate-spin" : ""} />
              Regenerar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)} disabled={!!busy}>
              <Pencil size={14} />
              Editar conteúdo
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestyle} disabled={!!busy}>
              <Palette size={14} className={busy === "restyle" ? "animate-spin" : ""} />
              Alterar visual
            </Button>
            <Button variant="outline" size="sm" onClick={onRegenerateAll} disabled={!!busy}>
              <Sparkles size={14} />
              Regenerar tudo
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveImage} disabled={!!busy}>
              <Download size={14} />
              Salvar imagem
            </Button>
            {isCarousel && (
              <Button variant="primary" size="sm" onClick={handleSaveCarousel} disabled={!!busy}>
                <ImageDown size={14} className={busy === "save-carousel" ? "animate-spin" : ""} />
                Salvar carrossel
              </Button>
            )}
          </div>

          {content.reviewNotes.length > 0 && (
            <details className="w-full max-w-lg rounded-xl border border-sage/20 bg-sage/5 p-4 text-sm text-ink/70">
              <summary className="flex cursor-pointer items-center gap-2 font-medium text-sage">
                <ShieldCheck size={15} />
                Revisão automática — {content.reviewNotes.length} verificações
              </summary>
              <ul className="mt-3 space-y-1.5 pl-1">
                {content.reviewNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Badge tone={note.fixed ? "success" : "warning"} className="mt-0.5 shrink-0">
                      {note.area}
                    </Badge>
                    <span>{note.issue}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <div className="space-y-4">
          <CaptionPanel caption={content.caption} cta={content.cta} />
        </div>
      </div>

      {editing && (
        <EditSlideModal
          slide={content.slides[activeIndex]}
          onSave={handleSaveSlide}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}
