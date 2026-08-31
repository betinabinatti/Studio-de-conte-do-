import { LabelHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink/45">{hint}</span>}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-ink/10 bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-ink/40"
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-xl border border-ink/10 bg-white/70 px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-ink/40"
    />
  );
}
