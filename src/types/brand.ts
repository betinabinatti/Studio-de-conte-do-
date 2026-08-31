export type VisualStyle =
  | "minimalista"
  | "editorial"
  | "organico"
  | "moderno"
  | "infantil-sofisticado"
  | "clean"
  | "colorido";

export type AlignmentPreference = "automatico" | "central" | "esquerda" | "direita";

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
  alignmentPreference: AlignmentPreference;
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
  alignmentPreference: "automatico",
  updatedAt: new Date().toISOString(),
});
