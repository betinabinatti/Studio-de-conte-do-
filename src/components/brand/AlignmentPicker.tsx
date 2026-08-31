import clsx from "clsx";
import { AlignmentPreference } from "@/types/brand";

const OPTIONS: { value: AlignmentPreference; label: string }[] = [
  { value: "automatico", label: "Automático" },
  { value: "central", label: "Central" },
  { value: "esquerda", label: "Esquerda" },
  { value: "direita", label: "Direita" },
];

export function AlignmentPicker({
  value,
  onChange,
}: {
  value: AlignmentPreference;
  onChange: (value: AlignmentPreference) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
            value === option.value
              ? "border-ink bg-ink text-paper"
              : "border-ink/12 bg-white/60 text-ink/70 hover:border-ink/30"
          )}
        >
          <span
            className={clsx(
              "h-2.5 w-2.5 rounded-full border",
              value === option.value ? "border-paper bg-paper" : "border-ink/30"
            )}
          />
          {option.label}
        </button>
      ))}
    </div>
  );
}
