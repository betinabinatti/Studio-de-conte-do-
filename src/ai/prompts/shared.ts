import { BrandProfile } from "@/types/brand";
import { ContentBrief } from "@/types/brief";

export const NEVER_RULES = `Regras que nunca podem ser quebradas:
- Nunca invente estudos, estatísticas, diagnósticos ou referências científicas.
- Nunca use frases clichê como "Você sabia que...", "No mundo de hoje...", "É importante lembrar...", "Cada criança é única...".
- Evite excesso de emojis e linguagem motivacional genérica ou artificial.
- Escreva como uma profissional real escreveria — específico, direto, sem enrolação.
- Se uma afirmação parecer uma alegação científica, sinale como "sem fonte" em vez de apresentá-la como fato.`;

export function buildContextBlock(payload: Record<string, unknown>): string {
  return `<context>\n${JSON.stringify(payload)}\n</context>`;
}

export function brandSummary(brand?: BrandProfile) {
  if (!brand || !brand.name) {
    return "Nenhuma identidade de marca configurada ainda — use um tom neutro, profissional e acolhedor.";
  }
  return `Marca: ${brand.name}. Atuação: ${brand.fieldOfWork}. Público: ${brand.audience}. Posicionamento: ${brand.positioning}. Tom de voz descrito pela marca: ${brand.toneOfVoice}. Palavras a usar: ${brand.wordsToUse}. Palavras a evitar: ${brand.wordsToAvoid}.`;
}

export function briefSummary(brief: ContentBrief) {
  return `Tema: "${brief.topic}". Formato: ${brief.format}. Objetivo: ${brief.objective}. Tom: ${brief.tone}. Quantidade de slides (se carrossel): ${brief.slideCount}.`;
}
