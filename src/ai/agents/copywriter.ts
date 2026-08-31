import { getAIProvider } from "../getAIProvider";
import { copywriterPrompt } from "../prompts/copywriter.prompt";
import { parseAgentJson } from "../parseJson";
import { BrandProfile } from "@/types/brand";
import { ContentBrief } from "@/types/brief";
import { ContentStrategy } from "@/types/strategy";
import { Slide } from "@/types/slide";

/** Writes slide-by-slide copy following the strategy — never generic, never clichéd. */
export async function runCopywriter(
  brief: ContentBrief,
  strategy: ContentStrategy,
  brand?: BrandProfile
): Promise<Slide[]> {
  const provider = getAIProvider();
  const raw = await provider.generateText(copywriterPrompt(brief, strategy, brand), {
    intent: "slides",
    temperature: 0.75,
  });

  const slides = parseAgentJson<Slide[]>(raw, [
    { index: 0, role: "gancho", title: brief.topic, body: strategy.centralMessage },
  ]);

  return slides.map((slide, i) => ({ ...slide, index: slide.index ?? i }));
}
