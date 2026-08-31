import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { put } from "@vercel/blob";

/**
 * Storage layer with two backends behind the same read/write-collection API:
 *
 * - Redis (Upstash, via the Vercel "Redis" marketplace integration) + Vercel
 *   Blob, used automatically in production once those integrations are
 *   attached to the project (they inject their own env vars).
 * - Local JSON files under data/, used whenever those env vars are absent —
 *   keeps `npm run dev` zero-infra for local/demo use.
 *
 * Every read/write goes through this module, so repositories never know
 * which backend is active.
 */

const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
    : null;

const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

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
  if (redis) {
    const data = await redis.get<T[]>(collection);
    return data ?? [];
  }

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
  if (redis) {
    await redis.set(collection, data);
    return;
  }

  await ensureDataDir();
  await fs.writeFile(filePathFor(collection), JSON.stringify(data, null, 2), "utf-8");
}

export async function readSingleton<T>(name: string, fallback: T): Promise<T> {
  if (redis) {
    const data = await redis.get<T>(name);
    return data ?? fallback;
  }

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
  if (redis) {
    await redis.set(name, data);
    return;
  }

  await ensureDataDir();
  await fs.writeFile(filePathFor(name), JSON.stringify(data, null, 2), "utf-8");
}

export async function saveExportFile(
  contentId: string,
  fileName: string,
  base64Data: string
): Promise<string> {
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(cleanBase64, "base64");

  if (blobConfigured) {
    const blob = await put(`exports/${contentId}/${fileName}`, buffer, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return blob.url;
  }

  await ensureDataDir();
  const dir = path.join(EXPORTS_DIR, contentId);
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, fileName);
  await fs.writeFile(filePath, buffer);
  return `/api/exports/${contentId}/${fileName}`;
}
