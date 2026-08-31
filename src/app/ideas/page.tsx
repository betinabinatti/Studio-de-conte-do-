"use client";

import { useEffect, useState } from "react";
import { ContentIdea, IdeaStatus } from "@/types/idea";
import { SurpriseIdea } from "@/ai/agents/surpriseAgent";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { NewIdeaForm } from "@/components/ideas/NewIdeaForm";
import { SurpriseIdeaCard } from "@/components/ideas/SurpriseIdeaCard";
import { Button } from "@/components/ui/Button";
import { Plus, Sparkles } from "lucide-react";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [surpriseIdeas, setSurpriseIdeas] = useState<SurpriseIdea[] | null>(null);
  const [loadingSurprise, setLoadingSurprise] = useState(false);

  useEffect(() => {
    fetch("/api/ideas")
      .then((res) => res.json())
      .then(setIdeas);
  }, []);

  async function createIdea(data: { title: string; topic: string; note: string }) {
    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const idea = await res.json();
    setIdeas((prev) => [idea, ...prev]);
    setShowNewForm(false);
  }

  async function updateStatus(idea: ContentIdea, status: IdeaStatus) {
    const updated = { ...idea, status };
    setIdeas((prev) => prev.map((i) => (i.id === idea.id ? updated : i)));
    await fetch(`/api/ideas/${idea.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
  }

  async function deleteIdea(id: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
  }

  async function handleSurprise() {
    setLoadingSurprise(true);
    setSurpriseIdeas(null);
    try {
      const res = await fetch("/api/surprise", { method: "POST" });
      setSurpriseIdeas(await res.json());
    } finally {
      setLoadingSurprise(false);
    }
  }

  async function saveSurpriseIdea(idea: SurpriseIdea) {
    await createIdea({ title: idea.title, topic: idea.title, note: idea.angle });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 flex flex-col items-center gap-6 text-center">
        <div>
          <h1 className="font-display text-4xl text-ink">Ideias</h1>
          <p className="mt-3 text-lg text-ink/55">Seu banco de ideias de conteúdo.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowNewForm((v) => !v)}>
            <Plus size={16} />
            Nova ideia
          </Button>
          <Button onClick={handleSurprise} disabled={loadingSurprise}>
            <Sparkles size={16} className={loadingSurprise ? "animate-pulseSoft" : ""} />
            {loadingSurprise ? "Pensando..." : "Me surpreenda"}
          </Button>
        </div>
      </div>

      {showNewForm && (
        <div className="mx-auto mb-10 max-w-md">
          <NewIdeaForm onCreate={createIdea} onClose={() => setShowNewForm(false)} />
        </div>
      )}

      {surpriseIdeas && surpriseIdeas.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-ink/50">
            ✨ Ideias inspiradas na sua marca
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {surpriseIdeas.map((idea) => (
              <SurpriseIdeaCard key={idea.id} idea={idea} onSave={() => saveSurpriseIdea(idea)} />
            ))}
          </div>
        </section>
      )}

      <section>
        {ideas.length > 0 && (
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-ink/50">
            Suas ideias salvas
          </h2>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onStatusChange={(status) => updateStatus(idea, status)}
              onDelete={() => deleteIdea(idea.id)}
            />
          ))}
        </div>
        {ideas.length === 0 && !surpriseIdeas && (
          <p className="text-center text-sm text-ink/40">
            Nenhuma ideia salva ainda. Crie uma ou clique em &ldquo;Me surpreenda&rdquo;.
          </p>
        )}
      </section>
    </div>
  );
}
