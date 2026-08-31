import { readCollection, writeCollection } from "./db";
import { GeneratedContent } from "@/types/content";

const COLLECTION = "contents";

export async function listContents(): Promise<GeneratedContent[]> {
  const items = await readCollection<GeneratedContent>(COLLECTION);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getContent(id: string): Promise<GeneratedContent | undefined> {
  const items = await readCollection<GeneratedContent>(COLLECTION);
  return items.find((item) => item.id === id);
}

export async function saveContent(content: GeneratedContent): Promise<GeneratedContent> {
  const items = await readCollection<GeneratedContent>(COLLECTION);
  const index = items.findIndex((item) => item.id === content.id);
  const updated = { ...content, updatedAt: new Date().toISOString() };
  if (index === -1) {
    items.push(updated);
  } else {
    items[index] = updated;
  }
  await writeCollection(COLLECTION, items);
  return updated;
}

export async function deleteContent(id: string): Promise<void> {
  const items = await readCollection<GeneratedContent>(COLLECTION);
  await writeCollection(
    COLLECTION,
    items.filter((item) => item.id !== id)
  );
}
