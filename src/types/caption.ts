export interface Caption {
  text: string;
}

export type CTAIntent =
  | "salvar"
  | "compartilhar"
  | "comentar"
  | "enviar"
  | "contato"
  | "conhecer-servico"
  | "nenhum";

export interface CTA {
  intent: CTAIntent;
  text: string;
}
