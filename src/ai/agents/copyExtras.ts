import { getAIProvider } from "../getAIProvider";
import { captionPrompt, ctaPrompt } from "../prompts/caption.prompt";
import { parseAgentJson } from "../parseJson";
import { BrandProfile } from "@/types/brand";
import { ContentBrief } from "@/types/brief";
import { Slide } from "@/types/slide";
import { Caption, CTA } from "@/types/caption";

export async function runCaptionWriter(
  brief: ContentBrief,
  slides: Slide[],
  brand?: BrandProfile
): Promise<Caption> {
  const provider = getAIProvider();
  const raw = await provider.generateText(captionPrompt(brief, slides, brand), {
    intent: "caption",
    temperature: 0.75,
  });
  return parseAgentJson<Caption>(raw, { text: slides[0]?.body || brief.topic });
}

export async function runCtaWriter(
  brief: ContentBrief,
  brand?: BrandProfile
): Promise<CTA> {
  const provider = getAIProvider();
  const raw = await provider.generateText(ctaPrompt(brief, brand), {
    intent: "cta",
    temperature: 0.5,
  });
  return parseAgentJson<CTA>(raw, { intent: "salvar", text: "Salve este post para não perder." });
}
