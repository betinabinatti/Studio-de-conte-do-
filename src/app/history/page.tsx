"use client";

import { useEffect, useState } from "react";
import { GeneratedContent } from "@/types/content";
import { BrandProfile } from "@/types/brand";
import { ContentCard } from "@/components/history/ContentCard";
import Link from "next/link";

export default function HistoryPage() {
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [brand, setBrand] = useState<BrandProfile | undefined>(undefined);

  useEffect(() => {
    fetch("/api/contents")
      .then((res) => res.json())
      .then(setContents);
    fetch("/api/brand")
      .then((res) => res.json())
      .then(setBrand)
      .catch(() => undefined);
  }, []);

  async function handleDelete(id: string) {
    setContents((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/contents/${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl text-ink">Meus conteúdos</h1>
        <p className="mt-3 text-lg text-ink/55">Tudo o que você já criou no Studio.</p>
      </div>

      {contents.length === 0 ? (
        <p className="text-center text-sm text-ink/40">
          Nenhum conteúdo criado ainda.{" "}
          <Link href="/" className="underline underline-offset-4">
            Comece por aqui
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              brand={brand}
              onDelete={() => handleDelete(content.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
