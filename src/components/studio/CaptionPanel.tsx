"use client";

import { useState } from "react";
import { Caption, CTA } from "@/types/caption";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function CaptionPanel({ caption, cta }: { caption: Caption; cta: CTA }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const fullText = cta.intent !== "nenhum" ? `${caption.text}\n\n${cta.text}` : caption.text;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card className="p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">Legenda</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:border-ink/30"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copiado" : "Copiar legenda"}
        </button>
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">{caption.text}</p>

      {cta.intent !== "nenhum" && (
        <div className="mt-4 flex items-center gap-2 border-t border-ink/5 pt-4">
          <Badge tone="accent">CTA</Badge>
          <p className="text-sm text-ink/70">{cta.text}</p>
        </div>
      )}
    </Card>
  );
}
