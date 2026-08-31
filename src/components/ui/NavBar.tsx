"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Sparkles, Palette, Lightbulb, Clock } from "lucide-react";

const LINKS = [
  { href: "/", label: "Studio", icon: Sparkles },
  { href: "/ideas", label: "Ideias", icon: Lightbulb },
  { href: "/history", label: "Meus conteúdos", icon: Clock },
  { href: "/brand", label: "Minha marca", icon: Palette },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg tracking-tight text-ink">
          Studio de Conteúdo
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-ink text-paper"
                    : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                )}
              >
                <Icon size={15} strokeWidth={1.75} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
