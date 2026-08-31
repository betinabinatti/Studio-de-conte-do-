"use client";

import { useEffect, useState } from "react";
import { BrandProfile, emptyBrandProfile } from "@/types/brand";
import { BrandForm } from "@/components/brand/BrandForm";

export default function BrandPage() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);

  useEffect(() => {
    fetch("/api/brand")
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setProfile(emptyBrandProfile()));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl text-ink">Identidade da minha marca</h1>
        <p className="mt-3 text-lg text-ink/55">
          Configure uma vez — toda geração de conteúdo usará este contexto automaticamente.
        </p>
      </div>
      {profile && <BrandForm initial={profile} />}
    </div>
  );
}
