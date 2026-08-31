import clsx from "clsx";
import { ToneOfVoice, TONE_LABELS } from "@/types/brief";
import { Wand2 } from "lucide-react";

const TONES = Object.keys(TONE_LABELS) as ToneOfVoice[];

export function TonePicker({
  value,
  onChange,
}: {
  value: ToneOfVoice;
  onChange: (value: ToneOfVoice) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TONES.map((tone) => (
        <button
          key={tone}
          type="button"
          onClick={() => onChange(tone)}
          className={clsx(
            "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors",
            value === tone
              ? "border-ink bg-ink text-paper"
              : "border-ink/12 bg-white/60 text-ink/70 hover:border-ink/30",
            tone === "marca" && "border-dashed"
          )}
        >
          {tone === "marca" && <Wand2 size={14} />}
          {TONE_LABELS[tone]}
        </button>
      ))}
    </div>
  );
}
