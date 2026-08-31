import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-xl2 border border-ink/5 bg-white/70 shadow-soft",
        className
      )}
      {...props}
    />
  );
}

export function SelectableCard({
  selected,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      className={clsx(
        "rounded-xl2 border px-4 py-3.5 text-left transition-all",
        selected
          ? "border-ink bg-ink text-paper shadow-card"
          : "border-ink/10 bg-white/60 text-ink hover:border-ink/30",
        className
      )}
      {...props}
    />
  );
}
