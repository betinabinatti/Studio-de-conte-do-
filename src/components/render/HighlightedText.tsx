export function HighlightedText({
  text,
  highlightWords = [],
  accentColor,
}: {
  text: string;
  highlightWords?: string[];
  accentColor: string;
}) {
  if (!highlightWords.length) return <>{text}</>;

  const pattern = new RegExp(
    `(${highlightWords
      .filter(Boolean)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "gi"
  );
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) =>
        highlightWords.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} style={{ color: accentColor, fontWeight: 700 }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
