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
import { classifyTier, FeedTier } from "@/design/brandIdentity";

const RECENT_HISTORY_SIZE = 6;

/** Recent posts' cover tiers (most recent first) — the signal feed-rhythm alternation reads. */
export async function recentFeedTiers(excludeId?: string): Promise<FeedTier[]> {
  const history = await listContents();
  return history
    .filter((c) => c.id !== excludeId)
    .slice(0, RECENT_HISTORY_SIZE)
    .map((c) => classifyTier(c.visualDirections?.[0]?.background?.colors?.[0]))
    .filter((tier): tier is FeedTier => Boolean(tier));
}

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
    const recentTiers = await recentFeedTiers();
    const content = await runContentPipeline(brief, brand, onStage, recentTiers);
    await saveContent(content);
    return content;
  },

  async regenerate(id: string): Promise<GeneratedContent | undefined> {
    const existing = await getContent(id);
    if (!existing) return undefined;
    const brand = await getBrandProfile();
    const recentTiers = await recentFeedTiers(id);
    const regenerated = await runContentPipeline(existing.brief, brand, undefined, recentTiers);
    const merged = { ...regenerated, id: existing.id, createdAt: existing.createdAt };
    return saveContent(merged);
  },
};
