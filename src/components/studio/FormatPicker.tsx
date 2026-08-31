import { ContentFormat, FORMAT_LABELS } from "@/types/brief";
import { SelectableCard } from "@/components/ui/Card";
import { Layers, Square, Film, Smartphone } from "lucide-react";

const FORMATS: { value: ContentFormat; icon: typeof Square; hint: string }[] = [
  { value: "post-unico", icon: Square, hint: "1080 × 1080" },
  { value: "carrossel", icon: Layers, hint: "1080 × 1350" },
  { value: "capa-reels", icon: Film, hint: "1080 × 1920" },
  { value: "story", icon: Smartphone, hint: "1080 × 1920" },
];

export function FormatPicker({
  value,
  onChange,
}: {
  value: ContentFormat;
  onChange: (value: ContentFormat) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {FORMATS.map(({ value: format, icon: Icon, hint }) => (
        <SelectableCard
          key={format}
          selected={value === format}
          onClick={() => onChange(format)}
          className="flex flex-col items-start gap-2"
        >
          <Icon size={18} strokeWidth={1.75} />
          <span className="text-sm font-medium">{FORMAT_LABELS[format]}</span>
          <span className={value === format ? "text-xs text-paper/60" : "text-xs text-ink/40"}>
            {hint}
          </span>
        </SelectableCard>
      ))}
    </div>
  );
}
