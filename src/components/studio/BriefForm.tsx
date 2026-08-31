"use client";

import { useState } from "react";
import { ContentBrief, ContentFormat, ContentObjective, ToneOfVoice } from "@/types/brief";
import { FormatPicker } from "./FormatPicker";
import { ObjectivePicker } from "./ObjectivePicker";
import { TonePicker } from "./TonePicker";
import { SlideCountPicker } from "./SlideCountPicker";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

interface BriefFormProps {
  initial?: Partial<ContentBrief>;
  onGenerate: (brief: ContentBrief) => void;
  disabled?: boolean;
}

export function BriefForm({ initial, onGenerate, disabled }: BriefFormProps) {
  const [topic, setTopic] = useState(initial?.topic || "");
  const [format, setFormat] = useState<ContentFormat>(initial?.format || "carrossel");
  const [objective, setObjective] = useState<ContentObjective>(initial?.objective || "educar");
  const [tone, setTone] = useState<ToneOfVoice>(initial?.tone || "marca");
  const [slideCount, setSlideCount] = useState(initial?.slideCount || 7);

  const canSubmit = topic.trim().length > 3 && !disabled;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onGenerate({ topic: topic.trim(), format, objective, tone, slideCount, ideaId: initial?.ideaId });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-10">
      <div>
        <label className="mb-3 block text-center font-display text-2xl text-ink">
          O que você quer comunicar?
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          placeholder='Ex.: Quero falar sobre por que "cada criança tem seu tempo" pode atrasar a busca por uma avaliação.'
          className="w-full resize-none rounded-2xl border border-ink/10 bg-white/70 px-6 py-5 text-lg text-ink placeholder:text-ink/35 outline-none transition-colors focus:border-ink/40"
        />
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-ink/50">Formato</h3>
        <FormatPicker value={format} onChange={setFormat} />
      </section>

      {format === "carrossel" && (
        <section className="space-y-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-ink/50">
            Quantidade de slides
          </h3>
          <SlideCountPicker value={slideCount} onChange={setSlideCount} />
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-ink/50">
          Objetivo do conteúdo
        </h3>
        <ObjectivePicker value={objective} onChange={setObjective} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-wide text-ink/50">Tom de voz</h3>
        <TonePicker value={tone} onChange={setTone} />
      </section>

      <div className="flex justify-center pt-4">
        <Button type="submit" size="lg" disabled={!canSubmit} className="gap-2">
          <Sparkles size={18} />
          Gerar conteúdo
        </Button>
      </div>
    </form>
  );
}
