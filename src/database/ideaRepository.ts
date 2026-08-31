import { readCollection, writeCollection } from "./db";
import { ContentIdea } from "@/types/idea";

const COLLECTION = "ideas";

export async function listIdeas(): Promise<ContentIdea[]> {
  const items = await readCollection<ContentIdea>(COLLECTION);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getIdea(id: string): Promise<ContentIdea | undefined> {
  const items = await readCollection<ContentIdea>(COLLECTION);
  return items.find((item) => item.id === id);
}

export async function saveIdea(idea: ContentIdea): Promise<ContentIdea> {
  const items = await readCollection<ContentIdea>(COLLECTION);
  const index = items.findIndex((item) => item.id === idea.id);
  const updated = { ...idea, updatedAt: new Date().toISOString() };
  if (index === -1) {
    items.push(updated);
  } else {
    items[index] = updated;
  }
  await writeCollection(COLLECTION, items);
  return updated;
}

export async function deleteIdea(id: string): Promise<void> {
  const items = await readCollection<ContentIdea>(COLLECTION);
  await writeCollection(
    COLLECTION,
    items.filter((item) => item.id !== id)
  );
}
