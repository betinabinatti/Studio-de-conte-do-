export type IdeaStatus = "ideia" | "em-producao" | "pronto" | "publicado";

export interface ContentIdea {
  id: string;
  title: string;
  topic: string;
  note?: string;
  angle?: string;
  hook?: string;
  recommendedFormat?: string;
  objective?: string;
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
}

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  ideia: "Ideia",
  "em-producao": "Em produção",
  pronto: "Pronto",
  publicado: "Publicado",
};
