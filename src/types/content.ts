import { ContentBrief } from "./brief";
import { ContentStrategy } from "./strategy";
import { Slide, VisualDirection } from "./slide";
import { Caption, CTA } from "./caption";

export type ContentStatus = "rascunho" | "pronto" | "publicado";

export interface ReviewNote {
  area: "conteudo" | "copy" | "marca" | "visual";
  issue: string;
  fixed: boolean;
  resolution?: string;
}

export interface GeneratedContent {
  id: string;
  title: string;
  brief: ContentBrief;
  strategy: ContentStrategy;
  slides: Slide[];
  visualDirections: VisualDirection[];
  caption: Caption;
  cta: CTA;
  reviewNotes: ReviewNote[];
  status: ContentStatus;
  exportedImages: string[];
  createdAt: string;
  updatedAt: string;
}
