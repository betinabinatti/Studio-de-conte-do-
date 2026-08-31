import { getBrandProfile } from "@/database/brandRepository";
import {
  deleteContent,
  getContent,
  listContents,
  saveContent,
} from "@/database/contentRepository";
import { runContentPipeline, PipelineStage } from "@/ai/pipeline";
import { ContentBrief } from "@/types/brief";
import { GeneratedContent } from "@/types/content";

export const contentService = {
  list: listContents,
  get: getContent,
  remove: deleteContent,
  save: saveContent,

  async generate(
    brief: ContentBrief,
    onStage?: (stage: PipelineStage) => void
  ): Promise<GeneratedContent> {
    const brand = await getBrandProfile();
    const content = await runContentPipeline(brief, brand, onStage);
    await saveContent(content);
    return content;
  },

  async regenerate(id: string): Promise<GeneratedContent | undefined> {
    const existing = await getContent(id);
    if (!existing) return undefined;
    const brand = await getBrandProfile();
    const regenerated = await runContentPipeline(existing.brief, brand);
    const merged = { ...regenerated, id: existing.id, createdAt: existing.createdAt };
    return saveContent(merged);
  },
};
