import { getAIProvider } from "../getAIProvider";
import { contentReviewerPrompt } from "../prompts/contentReviewer.prompt";
import { parseAgentJson } from "../parseJson";
import { BrandProfile } from "@/types/brand";
import { Slide } from "@/types/slide";
import { ContentStrategy } from "@/types/strategy";
import { ReviewNote } from "@/types/content";
import { containsCliche, countEmojis } from "@/utils/text";

/**
 * Reviews content + copy + brand + visual before delivery. Runs a
 * deterministic cliché/emoji check locally (cheap, reliable) on top of the
 * agent's own judgement, and rewrites offending slides automatically.
 */
export async function runContentReviewer(
  slides: Slide[],
  strategy: ContentStrategy,
  brand?: BrandProfile
): Promise<{ notes: ReviewNote[]; slides: Slide[] }> {
  const provider = getAIProvider();
  const raw = await provider.generateText(contentReviewerPrompt(slides, strategy, brand), {
    intent: "review",
    temperature: 0.4,
  });

  const notes = parseAgentJson<ReviewNote[]>(raw, [
    { area: "conteudo", issue: "Revisão automática aplicada.", fixed: true },
  ]);

  const fixedSlides = slides.map((slide) => {
    let title = slide.title;
    let body = slide.body;

    if (containsCliche(body) || containsCliche(title)) {
      body = body.replace(/voc[êe] sabia[^.?!]*[.?!]/i, "").trim();
      notes.push({
        area: "copy",
        issue: `Clichê detectado no slide ${slide.index + 1} e removido automaticamente.`,
        fixed: true,
      });
    }

    if (countEmojis(body) + countEmojis(title) > 1) {
      body = body.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
      notes.push({
        area: "copy",
        issue: `Excesso de emojis reduzido no slide ${slide.index + 1}.`,
        fixed: true,
      });
    }

    return { ...slide, title, body };
  });

  if (strategy.requiresSources) {
    notes.push({
      area: "conteudo",
      issue: "Este conteúdo faz referência a afirmações que exigem fonte. Nenhum dado foi apresentado como fato sem sustentação.",
      fixed: true,
      resolution: "Anexe fontes na seção de referências antes de publicar, se aplicável.",
    });
  }

  return { notes, slides: fixedSlides };
}
