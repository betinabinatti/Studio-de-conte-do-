import { promises as fs } from "fs";
import path from "path";

/**
 * File-based JSON store. Good enough for a local/single-user MVP and keeps
 * the app runnable with zero external infra. Every read/write goes through
 * this module, so swapping it for a real database later (Postgres, etc.)
 * only means rewriting this file — repositories keep their same signatures.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const EXPORTS_DIR = path.join(DATA_DIR, "exports");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(EXPORTS_DIR, { recursive: true });
}

function filePathFor(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`);
}

export async function readCollection<T>(collection: string): Promise<T[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(filePathFor(collection), "utf-8");
    return JSON.parse(raw) as T[];
  } catch (error: any) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePathFor(collection), JSON.stringify(data, null, 2), "utf-8");
}

export async function readSingleton<T>(name: string, fallback: T): Promise<T> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(filePathFor(name), "utf-8");
    return JSON.parse(raw) as T;
  } catch (error: any) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function writeSingleton<T>(name: string, data: T): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(filePathFor(name), JSON.stringify(data, null, 2), "utf-8");
}

export async function saveExportFile(
  contentId: string,
  fileName: string,
  base64Data: string
): Promise<string> {
  await ensureDataDir();
  const dir = path.join(EXPORTS_DIR, contentId);
  await fs.mkdir(dir, { recursive: true });
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const filePath = path.join(dir, fileName);
  await fs.writeFile(filePath, Buffer.from(cleanBase64, "base64"));
  return `/api/exports/${contentId}/${fileName}`;
}
