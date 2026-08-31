import { toPng } from "html-to-image";

/**
 * Captures a full-resolution PNG from a SlideCanvas node, overriding the
 * on-screen preview `transform: scale(...)` so the export is always
 * captured at the real design resolution (e.g. 1080x1350), never the
 * shrunk preview size.
 */
export async function captureSlidePng(
  node: HTMLElement,
  width: number,
  height: number
): Promise<string> {
  return toPng(node, {
    width,
    height,
    pixelRatio: 1,
    style: { transform: "none" },
    cacheBust: true,
  });
}

export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const DIACRITICS_PATTERN = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  "g"
);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export function slideFileName(title: string, index: number, total: number): string {
  const base = slugify(title) || "slide";
  return total > 1 ? `${base}-${String(index + 1).padStart(2, "0")}.png` : `${base}.png`;
}
