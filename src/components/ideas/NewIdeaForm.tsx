"use client";

import { useState } from "react";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function NewIdeaForm({
  onCreate,
  onClose,
}: {
  onCreate: (data: { title: string; topic: string; note: string }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  return (
    <Card className="space-y-4 p-6">
      <Field label="Título da ideia">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </Field>
      <Field label="Observação" hint="Opcional">
        <TextArea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          size="sm"
          disabled={!title.trim()}
          onClick={() => {
            onCreate({ title: title.trim(), topic: title.trim(), note: note.trim() });
            setTitle("");
            setNote("");
          }}
        >
          Salvar ideia
        </Button>
      </div>
    </Card>
  );
}
