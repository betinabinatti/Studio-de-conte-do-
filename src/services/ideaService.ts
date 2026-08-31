import { deleteIdea, getIdea, listIdeas, saveIdea } from "@/database/ideaRepository";
import { getBrandProfile } from "@/database/brandRepository";
import { runSurpriseAgent } from "@/ai/agents/surpriseAgent";
import { generateId } from "@/utils/id";
import { ContentIdea } from "@/types/idea";

export const ideaService = {
  list: listIdeas,
  get: getIdea,
  save: saveIdea,
  remove: deleteIdea,

  async create(input: Partial<ContentIdea>): Promise<ContentIdea> {
    const now = new Date().toISOString();
    return saveIdea({
      id: generateId("idea"),
      title: input.title || "Nova ideia",
      topic: input.topic || input.title || "",
      note: input.note,
      angle: input.angle,
      hook: input.hook,
      recommendedFormat: input.recommendedFormat,
      objective: input.objective,
      status: input.status || "ideia",
      createdAt: now,
      updatedAt: now,
    });
  },

  async surprise() {
    const brand = await getBrandProfile();
    return runSurpriseAgent(brand);
  },
};
