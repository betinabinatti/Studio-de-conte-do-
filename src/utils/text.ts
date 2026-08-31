const CLICHE_PATTERNS: RegExp[] = [
  /voc[êe] sabia/i,
  /no mundo (de hoje|atual)/i,
  /[ée] importante lembrar/i,
  /cada crian[çc]a [ée] [úu]nica/i,
  /na correria do dia a dia/i,
  /em um mundo (cada vez mais|onde)/i,
];

export function containsCliche(text: string): boolean {
  return CLICHE_PATTERNS.some((pattern) => pattern.test(text));
}

export function countEmojis(text: string): number {
  const matches = text.match(
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu
  );
  return matches ? matches.length : 0;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
