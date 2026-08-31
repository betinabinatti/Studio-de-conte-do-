import { getAIProvider } from "../getAIProvider";
import { artDirectorPrompt } from "../prompts/artDirector.prompt";
import { parseAgentJson } from "../parseJson";
import { BrandProfile } from "@/types/brand";
import { Slide } from "@/types/slide";
import { VisualDirection } from "@/types/slide";
import { applyOfficialIdentity, FeedTier } from "@/design/brandIdentity";

/** Turns finished copy into per-slide visual instructions that respect brand identity. */
export async function runArtDirector(
  slides: Slide[],
  brand?: BrandProfile,
  recentTiers: FeedTier[] = []
): Promise<VisualDirection[]> {
  const provider = getAIProvider();
  const raw = await provider.generateText(artDirectorPrompt(slides, brand), {
    intent: "visual-direction",
    temperature: 0.6,
  });

  const fallback: VisualDirection[] = slides.map((slide) => ({
    slideIndex: slide.index,
    background: { type: "solid", colors: ["#FBF9F6"] },
    typography: { titleSize: "md", bodySize: "md", titleFont: "display" },
    textPosition: "top",
    alignment: "left",
    composition: "texto-simples",
    graphicElements: ["numero-slide"],
    spacing: "normal",
    imageNeeded: false,
  }));

  const parsed = parseAgentJson<VisualDirection[]>(raw, fallback);
  const directions = parsed.length === slides.length ? parsed : fallback;
  return applyOfficialIdentity(directions, slides, recentTiers);
}
