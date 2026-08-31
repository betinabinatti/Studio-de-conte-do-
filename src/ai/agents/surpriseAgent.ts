import { getAIProvider } from "../getAIProvider";
import { surpriseIdeasPrompt } from "../prompts/surpriseIdeas.prompt";
import { parseAgentJson } from "../parseJson";
import { BrandProfile } from "@/types/brand";

export interface SurpriseIdea {
  id: string;
  title: string;
  angle: string;
  hook: string;
  recommendedFormat: string;
  objective: string;
}

/** Powers "✨ Me surpreenda": 5 fresh content ideas grounded in brand positioning. */
export async function runSurpriseAgent(brand?: BrandProfile): Promise<SurpriseIdea[]> {
  const provider = getAIProvider();
  const raw = await provider.generateText(surpriseIdeasPrompt(brand), {
    intent: "surprise-ideas",
    temperature: 0.9,
  });
  return parseAgentJson<SurpriseIdea[]>(raw, []);
}
