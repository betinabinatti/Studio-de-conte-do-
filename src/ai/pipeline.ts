import { ContentBrief, FORMAT_DIMENSIONS } from "@/types/brief";
import { BrandProfile } from "@/types/brand";
import { GeneratedContent } from "@/types/content";
import { generateId } from "@/utils/id";
import { runContentStrategist } from "./agents/contentStrategist";
import { runCopywriter } from "./agents/copywriter";
import { runArtDirector } from "./agents/artDirector";
import { runContentReviewer } from "./agents/contentReviewer";
import { runCaptionWriter, runCtaWriter } from "./agents/copyExtras";
import { runImageGenerator } from "./agents/imageGenerator";

export type PipelineStage =
  | "strategy"
  | "copy"
  | "visual-direction"
  | "rendering"
  | "review"
  | "done";

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  strategy: "Pensando no melhor ângulo…",
  copy: "Escrevendo o conteúdo…",
  "visual-direction": "Criando a direção visual…",
  rendering: "Montando sua arte…",
  review: "Fazendo a revisão final…",
  done: "Pronto!",
};

/**
 * Full editorial pipeline: Briefing -> Estratégia -> Texto -> Direção visual
 * -> (imagens quando necessário) -> Revisão -> GeneratedContent.
 * `onStage` lets the API route stream progress back to the client.
 */
export async function runContentPipeline(
  brief: ContentBrief,
  brand: BrandProfile | undefined,
  onStage?: (stage: PipelineStage) => void
): Promise<GeneratedContent> {
  onStage?.("strategy");
  const strategy = await runContentStrategist(brief, brand);

  onStage?.("copy");
  const rawSlides = await runCopywriter(brief, strategy, brand);

  onStage?.("visual-direction");
  let visualDirections = await runArtDirector(rawSlides, brand);

  onStage?.("rendering");
  const dimensions = FORMAT_DIMENSIONS[brief.format];
  visualDirections = await Promise.all(
    visualDirections.map((direction) =>
      runImageGenerator(direction, dimensions.width, dimensions.height)
    )
  );

  onStage?.("review");
  const { notes, slides } = await runContentReviewer(rawSlides, strategy, brand);
  const [caption, cta] = await Promise.all([
    runCaptionWriter(brief, slides, brand),
    runCtaWriter(brief, brand),
  ]);

  onStage?.("done");

  const now = new Date().toISOString();
  return {
    id: generateId("content"),
    title: slides[0]?.title || brief.topic,
    brief,
    strategy,
    slides,
    visualDirections,
    caption,
    cta,
    reviewNotes: notes,
    status: "rascunho",
    exportedImages: [],
    createdAt: now,
    updatedAt: now,
  };
}
