export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export function relativeLuminance(hex: string): number {
  try {
    const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
    const [rl, gl, bl] = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
  } catch {
    return 0.5;
  }
}

/** Returns the ink color that stays legible over a given background color. */
export function contrastTextColor(backgroundHex: string): string {
  return relativeLuminance(backgroundHex) > 0.55 ? "#1E1B18" : "#FBF9F6";
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
