import clsx from "clsx";

const OPTIONS = [5, 6, 7, 8, 9, 10];

export function SlideCountPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((count) => (
        <button
          key={count}
          type="button"
          onClick={() => onChange(count)}
          className={clsx(
            "h-10 w-10 rounded-full border text-sm font-medium transition-colors",
            value === count
              ? "border-ink bg-ink text-paper"
              : "border-ink/12 bg-white/60 text-ink/70 hover:border-ink/30"
          )}
        >
          {count}
        </button>
      ))}
    </div>
  );
}
