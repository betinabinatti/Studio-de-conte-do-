/** Real LLMs sometimes wrap JSON in markdown fences or add stray text; strip that before parsing. */
export function parseAgentJson<T>(raw: string, fallback: T): T {
  const cleaned = raw
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = cleaned.search(/[[{]/);
  if (start === -1) return fallback;

  try {
    return JSON.parse(cleaned.slice(start)) as T;
  } catch {
    return fallback;
  }
}
