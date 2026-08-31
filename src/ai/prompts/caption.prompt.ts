import { Slide } from "@/types/slide";
import { ContentBrief } from "@/types/brief";
import { BrandProfile } from "@/types/brand";
import { NEVER_RULES, brandSummary, briefSummary, buildContextBlock } from "./shared";

export function captionPrompt(brief: ContentBrief, slides: Slide[], brand?: BrandProfile) {
  return `Você é uma copywriter escrevendo a legenda de um post de Instagram. A legenda NÃO deve repetir os slides — ela complementa, com uma reflexão adicional, contexto ou convite à ação, em linguagem natural.

${briefSummary(brief)}
${brandSummary(brand)}

Slides do post: ${slides.map((s) => `${s.role}: ${s.title}`).join(" | ")}

${NEVER_RULES}

Responda APENAS com um JSON: { "text": string }

${buildContextBlock({ brief, slides, brand })}`;
}

export function ctaPrompt(brief: ContentBrief, brand?: BrandProfile) {
  return `Defina a chamada para ação mais adequada a este post, sem forçar um CTA quando não fizer sentido para o objetivo.

${briefSummary(brief)}
${brandSummary(brand)}

Responda APENAS com um JSON: { "intent": "salvar"|"compartilhar"|"comentar"|"enviar"|"contato"|"conhecer-servico"|"nenhum", "text": string }

${buildContextBlock({ brief, brand })}`;
}
