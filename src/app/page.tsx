"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BriefForm } from "@/components/studio/BriefForm";
import { GenerationLoader } from "@/components/studio/GenerationLoader";
import { ResultView } from "@/components/studio/ResultView";
import { ContentBrief, ContentFormat, ContentObjective } from "@/types/brief";
import { GeneratedContent } from "@/types/content";
import { BrandProfile } from "@/types/brand";

type Stage = "form" | "loading" | "result";

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <StudioPageInner />
    </Suspense>
  );
}

function StudioPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stage, setStage] = useState<Stage>("form");
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [brand, setBrand] = useState<BrandProfile | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/brand")
      .then((res) => res.json())
      .then(setBrand)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const contentId = searchParams.get("contentId");
    if (!contentId) return;
    fetch(`/api/contents/${contentId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setContent(data);
          setStage("result");
        }
      });
  }, [searchParams]);

  const initialBrief: Partial<ContentBrief> = {
    topic: searchParams.get("topic") || undefined,
    format: (searchParams.get("format") as ContentFormat) || undefined,
    objective: (searchParams.get("objective") as ContentObjective) || undefined,
    ideaId: searchParams.get("ideaId") || undefined,
  };

  async function handleGenerate(brief: ContentBrief) {
    setError(null);
    setStage("loading");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      if (!res.ok) throw new Error("Falha ao gerar conteúdo");
      const data: GeneratedContent = await res.json();
      setContent(data);
      setStage("result");
      router.replace(`/?contentId=${data.id}`);
    } catch (err) {
      setError("Não foi possível gerar o conteúdo agora. Tente novamente.");
      setStage("form");
    }
  }

  async function handleRegenerateAll() {
    if (!content) return;
    await handleGenerate(content.brief);
  }

  function handleNewContent() {
    setContent(null);
    setStage("form");
    router.replace("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      {stage === "form" && (
        <>
          <div className="mb-14 text-center">
            <h1 className="font-display text-4xl text-ink sm:text-5xl">Studio de Conteúdo</h1>
            <p className="mt-3 text-lg text-ink/55">
              Transforme uma ideia em um post pronto para publicar.
            </p>
          </div>
          {error && (
            <p className="mx-auto mb-6 max-w-md rounded-xl bg-accent/10 px-4 py-3 text-center text-sm text-accent">
              {error}
            </p>
          )}
          <BriefForm initial={initialBrief} onGenerate={handleGenerate} />
        </>
      )}

      {stage === "loading" && <GenerationLoader />}

      {stage === "result" && content && (
        <>
          <ResultView
            content={content}
            brand={brand}
            onContentChange={setContent}
            onRegenerateAll={handleRegenerateAll}
          />
          <div className="mt-10 text-center">
            <button
              onClick={handleNewContent}
              className="text-sm text-ink/40 underline underline-offset-4 hover:text-ink/70"
            >
              Criar um novo conteúdo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
