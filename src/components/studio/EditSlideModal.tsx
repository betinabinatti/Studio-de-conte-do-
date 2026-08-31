"use client";

import { useState } from "react";
import { Slide } from "@/types/slide";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { X } from "lucide-react";

export function EditSlideModal({
  slide,
  onSave,
  onClose,
}: {
  slide: Slide;
  onSave: (slide: Slide) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(slide.title);
  const [body, setBody] = useState(slide.body);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6 animate-fadeIn">
      <div className="w-full max-w-lg rounded-xl2 bg-paper p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl text-ink">Editar slide {slide.index + 1}</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Título">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Texto">
            <TextArea rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onSave({ ...slide, title, body })}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}
