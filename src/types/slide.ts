export type CompositionType =
  | "gancho-central"
  | "texto-imagem"
  | "lista"
  | "citacao"
  | "comparacao"
  | "cta-final"
  | "texto-simples";

export interface Slide {
  index: number;
  role: string;
  title: string;
  body: string;
  highlightWords?: string[];
}

export interface VisualDirection {
  slideIndex: number;
  background: {
    type: "solid" | "gradient" | "texture";
    colors: string[];
  };
  typography: {
    titleSize: "sm" | "md" | "lg" | "xl";
    bodySize: "sm" | "md" | "lg";
    titleFont: "display" | "sans";
  };
  textPosition: "top" | "center" | "bottom";
  alignment: "left" | "center" | "right";
  composition: CompositionType;
  graphicElements: string[];
  spacing: "compact" | "normal" | "airy";
  imageNeeded: boolean;
  imageDescription?: string;
  imageUrl?: string;
  /** Decisão editorial: caixa alta (confronto/impacto) ou natural (intimista/reflexivo). */
  titleCase?: "uppercase" | "natural";
}
