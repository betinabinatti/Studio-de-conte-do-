export type ContentFormat = "post-unico" | "carrossel" | "capa-reels" | "story";

export type ContentObjective =
  | "educar"
  | "gerar-identificacao"
  | "quebrar-mito"
  | "gerar-autoridade"
  | "atrair-pacientes"
  | "orientar-pais"
  | "explicar-conceito"
  | "divulgar-servico"
  | "criar-conexao";

export type ToneOfVoice =
  | "marca"
  | "profissional"
  | "acolhedor"
  | "direto"
  | "didatico"
  | "provocativo"
  | "sofisticado"
  | "conversacional";

export interface ContentBrief {
  topic: string;
  format: ContentFormat;
  objective: ContentObjective;
  tone: ToneOfVoice;
  slideCount: number;
  ideaId?: string;
}

export const FORMAT_LABELS: Record<ContentFormat, string> = {
  "post-unico": "Post único",
  carrossel: "Carrossel",
  "capa-reels": "Capa de Reels",
  story: "Story",
};

export const OBJECTIVE_LABELS: Record<ContentObjective, string> = {
  educar: "Educar",
  "gerar-identificacao": "Gerar identificação",
  "quebrar-mito": "Quebrar um mito",
  "gerar-autoridade": "Gerar autoridade",
  "atrair-pacientes": "Atrair novos pacientes",
  "orientar-pais": "Orientar pais",
  "explicar-conceito": "Explicar um conceito",
  "divulgar-servico": "Divulgar serviço",
  "criar-conexao": "Criar conexão",
};

export const TONE_LABELS: Record<ToneOfVoice, string> = {
  marca: "Usar tom da minha marca",
  profissional: "Profissional",
  acolhedor: "Acolhedor",
  direto: "Direto",
  didatico: "Didático",
  provocativo: "Provocativo",
  sofisticado: "Sofisticado",
  conversacional: "Conversacional",
};

export const FORMAT_DIMENSIONS: Record<ContentFormat, { width: number; height: number }> = {
  "post-unico": { width: 1080, height: 1080 },
  carrossel: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
  "capa-reels": { width: 1080, height: 1920 },
};
