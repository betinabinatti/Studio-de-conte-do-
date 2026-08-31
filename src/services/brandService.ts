import { getBrandProfile, saveBrandProfile } from "@/database/brandRepository";
import { BrandProfile } from "@/types/brand";

export const brandService = {
  get: getBrandProfile,
  save: (profile: BrandProfile) => saveBrandProfile(profile),
};
