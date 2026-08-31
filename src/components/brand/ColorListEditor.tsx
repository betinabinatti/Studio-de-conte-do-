"use client";

import { useState } from "react";
import { BrandColor } from "@/types/brand";
import { X, Plus } from "lucide-react";

export function ColorListEditor({
  colors,
  onChange,
}: {
  colors: BrandColor[];
  onChange: (colors: BrandColor[]) => void;
}) {
  const [hex, setHex] = useState("#C4622D");

  function addColor() {
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) return;
    if (colors.some((c) => c.hex.toLowerCase() === hex.toLowerCase())) return;
    onChange([...colors, { hex }]);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {colors.map((color) => (
          <span
            key={color.hex}
            className="flex items-center gap-2 rounded-full border border-ink/10 py-1 pl-1 pr-3 text-xs"
          >
            <span
              className="h-5 w-5 rounded-full border border-ink/10"
              style={{ backgroundColor: color.hex }}
            />
            {color.hex.toUpperCase()}
            <button
              type="button"
              onClick={() => onChange(colors.filter((c) => c.hex !== color.hex))}
              className="text-ink/40 hover:text-ink"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={/^#([0-9A-Fa-f]{6})$/.test(hex) ? hex : "#C4622D"}
          onChange={(e) => setHex(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-lg border border-ink/10"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#C4622D"
          className="w-28 rounded-lg border border-ink/10 bg-white/70 px-3 py-1.5 text-sm outline-none focus:border-ink/40"
        />
        <button
          type="button"
          onClick={addColor}
          className="flex items-center gap-1 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-ink/30"
        >
          <Plus size={13} /> Adicionar
        </button>
      </div>
    </div>
  );
}
