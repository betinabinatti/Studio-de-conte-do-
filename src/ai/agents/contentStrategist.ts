import { getAIProvider } from "../getAIProvider";
import { contentStrategistPrompt } from "../prompts/contentStrategist.prompt";
import { parseAgentJson } from "../parseJson";
import { BrandProfile } from "@/types/brand";
import { ContentBrief } from "@/types/brief";
import { ContentStrategy } from "@/types/strategy";

/** Thinks about the post before any word is written: audience, hook, problem, structure, CTA. */
export async function runContentStrategist(
  brief: ContentBrief,
  brand?: BrandProfile
): Promise<ContentStrategy> {
  const provider = getAIProvider();
  const raw = await provider.generateText(contentStrategistPrompt(brief, brand), {
    intent: "strategy",
    temperature: 0.6,
  });

  return parseAgentJson<ContentStrategy>(raw, {
    audienceKnowledgeLevel: "intermediario",
    coreProblem: "",
    centralMessage: brief.topic,
    bestHook: brief.topic,
    narrativeStructure: "Gancho, desenvolvimento, conclusão.",
    cta: "Salvar o post.",
    requiresSources: false,
    flaggedClaims: [],
  });
}
