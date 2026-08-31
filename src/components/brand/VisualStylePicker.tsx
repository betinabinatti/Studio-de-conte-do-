import clsx from "clsx";
import { VisualStyle } from "@/types/brand";

const STYLES: { value: VisualStyle; label: string }[] = [
  { value: "minimalista", label: "Minimalista" },
  { value: "editorial", label: "Editorial" },
  { value: "organico", label: "Orgânico" },
  { value: "moderno", label: "Moderno" },
  { value: "infantil-sofisticado", label: "Infantil sofisticado" },
  { value: "clean", label: "Clean" },
  { value: "colorido", label: "Colorido" },
];

export function VisualStylePicker({
  value,
  onChange,
}: {
  value: VisualStyle[];
  onChange: (value: VisualStyle[]) => void;
}) {
  function toggle(style: VisualStyle) {
    onChange(value.includes(style) ? value.filter((s) => s !== style) : [...value, style]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STYLES.map(({ value: style, label }) => (
        <button
          key={style}
          type="button"
          onClick={() => toggle(style)}
          className={clsx(
            "rounded-full border px-4 py-2 text-sm transition-colors",
            value.includes(style)
              ? "border-ink bg-ink text-paper"
              : "border-ink/12 bg-white/60 text-ink/70 hover:border-ink/30"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
