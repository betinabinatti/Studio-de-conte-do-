import clsx from "clsx";
import { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "accent";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-sand text-ink/70",
    success: "bg-sage/15 text-sage",
    warning: "bg-accent/15 text-accent",
    accent: "bg-ink text-paper",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
