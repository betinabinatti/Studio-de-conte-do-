import clsx from "clsx";
import { ContentObjective, OBJECTIVE_LABELS } from "@/types/brief";

const OBJECTIVES = Object.keys(OBJECTIVE_LABELS) as ContentObjective[];

export function ObjectivePicker({
  value,
  onChange,
}: {
  value: ContentObjective;
  onChange: (value: ContentObjective) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OBJECTIVES.map((objective) => (
        <button
          key={objective}
          type="button"
          onClick={() => onChange(objective)}
          className={clsx(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            value === objective
              ? "border-ink bg-ink text-paper"
              : "border-ink/12 bg-white/60 text-ink/70 hover:border-ink/30"
          )}
        >
          {OBJECTIVE_LABELS[objective]}
        </button>
      ))}
    </div>
  );
}
