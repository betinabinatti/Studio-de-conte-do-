"use client";

import { ContentIdea, IDEA_STATUS_LABELS, IdeaStatus } from "@/types/idea";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import { Trash2, Sparkles } from "lucide-react";

const STATUS_TONE: Record<IdeaStatus, "neutral" | "warning" | "success" | "accent"> = {
  ideia: "neutral",
  "em-producao": "warning",
  pronto: "success",
  publicado: "accent",
};

export function IdeaCard({
  idea,
  onStatusChange,
  onDelete,
}: {
  idea: ContentIdea;
  onStatusChange: (status: IdeaStatus) => void;
  onDelete: () => void;
}) {
  const router = useRouter();

  function createContent() {
    const params = new URLSearchParams({
      topic: idea.topic || idea.title,
      ideaId: idea.id,
    });
    if (idea.recommendedFormat) params.set("format", idea.recommendedFormat);
    if (idea.objective) params.set("objective", idea.objective);
    router.push(`/?${params.toString()}`);
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base text-ink">{idea.title}</h3>
        <button onClick={onDelete} className="shrink-0 text-ink/30 hover:text-accent">
          <Trash2 size={15} />
        </button>
      </div>

      {idea.angle && <p className="text-sm text-ink/60">{idea.angle}</p>}
      {idea.note && <p className="text-xs text-ink/45">{idea.note}</p>}

      <div className="flex items-center justify-between pt-2">
        <select
          value={idea.status}
          onChange={(e) => onStatusChange(e.target.value as IdeaStatus)}
          className="rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs text-ink/70 outline-none"
        >
          {Object.entries(IDEA_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Badge tone={STATUS_TONE[idea.status]}>{IDEA_STATUS_LABELS[idea.status]}</Badge>
      </div>

      <button
        onClick={createContent}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-ink py-2 text-sm font-medium text-paper transition-opacity hover:opacity-85"
      >
        <Sparkles size={14} />
        Criar conteúdo a partir desta ideia
      </button>
    </Card>
  );
}
