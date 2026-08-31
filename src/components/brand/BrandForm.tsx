"use client";

import { useRef, useState } from "react";
import { BrandProfile } from "@/types/brand";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { ColorListEditor } from "./ColorListEditor";
import { VisualStylePicker } from "./VisualStylePicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check, Upload } from "lucide-react";

export function BrandForm({ initial }: { initial: BrandProfile }) {
  const [profile, setProfile] = useState<BrandProfile>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof BrandProfile>(key: K, value: BrandProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function handleLogoUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => update("logoUrl", reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setProfile(await res.json());
        setSaved(true);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20">
      <Card className="space-y-5 p-7">
        <h3 className="font-display text-lg text-ink">Sobre a marca</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome da marca">
            <TextInput value={profile.name} onChange={(e) => update("name", e.target.value)} />
          </Field>
          <Field label="Área de atuação">
            <TextInput
              value={profile.fieldOfWork}
              onChange={(e) => update("fieldOfWork", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Público">
          <TextInput value={profile.audience} onChange={(e) => update("audience", e.target.value)} />
        </Field>
        <Field label="Posicionamento" hint="Como a marca se posiciona no mercado e para o público.">
          <TextArea
            rows={4}
            value={profile.positioning}
            onChange={(e) => update("positioning", e.target.value)}
          />
        </Field>
      </Card>

      <Card className="space-y-5 p-7">
        <h3 className="font-display text-lg text-ink">Tom de voz</h3>
        <Field label="Tom de voz" hint="Descreva como a marca fala — direta, acolhedora, técnica...">
          <TextArea
            rows={4}
            value={profile.toneOfVoice}
            onChange={(e) => update("toneOfVoice", e.target.value)}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Palavras que gosto de usar">
            <TextArea
              rows={3}
              value={profile.wordsToUse}
              onChange={(e) => update("wordsToUse", e.target.value)}
            />
          </Field>
          <Field label="Palavras/frases que NÃO quero usar">
            <TextArea
              rows={3}
              value={profile.wordsToAvoid}
              onChange={(e) => update("wordsToAvoid", e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5 p-7">
        <h3 className="font-display text-lg text-ink">Identidade visual</h3>
        <Field label="Cores da marca">
          <ColorListEditor colors={profile.colors} onChange={(colors) => update("colors", colors)} />
        </Field>
        <Field label="Fonte principal" hint="Ex.: Fraunces, Poppins, Montserrat...">
          <TextInput
            value={profile.primaryFont}
            onChange={(e) => update("primaryFont", e.target.value)}
          />
        </Field>
        <Field label="Estilo visual" hint="Selecione um ou mais.">
          <VisualStylePicker
            value={profile.visualStyles}
            onChange={(styles) => update("visualStyles", styles)}
          />
        </Field>
        <Field label="Logo">
          <div className="flex items-center gap-4">
            {profile.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logoUrl}
                alt="Logo"
                className="h-14 w-14 rounded-lg border border-ink/10 object-contain bg-white"
              />
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={14} />
              {profile.logoUrl ? "Trocar logo" : "Enviar logo"}
            </Button>
          </div>
        </Field>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-sage">
            <Check size={15} /> Salvo
          </span>
        )}
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? "Salvando..." : "Salvar identidade da marca"}
        </Button>
      </div>
    </div>
  );
}
