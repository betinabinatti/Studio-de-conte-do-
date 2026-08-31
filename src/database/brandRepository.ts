import { readSingleton, writeSingleton } from "./db";
import { BrandProfile, emptyBrandProfile } from "@/types/brand";

const SINGLETON_KEY = "brand";

export async function getBrandProfile(): Promise<BrandProfile> {
  const stored = await readSingleton<BrandProfile>(SINGLETON_KEY, emptyBrandProfile());
  return { ...emptyBrandProfile(), ...stored };
}

export async function saveBrandProfile(profile: BrandProfile): Promise<BrandProfile> {
  const updated = { ...profile, updatedAt: new Date().toISOString() };
  await writeSingleton(SINGLETON_KEY, updated);
  return updated;
}
