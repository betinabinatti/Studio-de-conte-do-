export type VisualStyle =
  | "minimalista"
  | "editorial"
  | "organico"
  | "moderno"
  | "infantil-sofisticado"
  | "clean"
  | "colorido";

export interface BrandColor {
  hex: string;
  label?: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  fieldOfWork: string;
  audience: string;
  positioning: string;
  toneOfVoice: string;
  wordsToUse: string;
  wordsToAvoid: string;
  colors: BrandColor[];
  primaryFont: string;
  visualStyles: VisualStyle[];
  logoUrl?: string;
  updatedAt: string;
}

export const emptyBrandProfile = (): BrandProfile => ({
  id: "default",
  name: "",
  fieldOfWork: "",
  audience: "",
  positioning: "",
  toneOfVoice: "",
  wordsToUse: "",
  wordsToAvoid: "",
  colors: [],
  primaryFont: "",
  visualStyles: [],
  logoUrl: undefined,
  updatedAt: new Date().toISOString(),
});
