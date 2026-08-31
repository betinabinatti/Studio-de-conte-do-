import { BrandProfile } from "@/types/brand";
import { brandSummary, buildContextBlock } from "./shared";

export function surpriseIdeasPrompt(brand?: BrandProfile) {
  return `Você é uma estrategista de conteúdo. Gere 5 ideias originais de conteúdo alinhadas ao posicionamento da marca abaixo, cada uma com ângulo, gancho, formato recomendado e objetivo.

${brandSummary(brand)}

Responda APENAS com um JSON (array de 5 itens):
[{ "id": string, "title": string, "angle": string, "hook": string, "recommendedFormat": "post-unico"|"carrossel"|"capa-reels"|"story", "objective": string }]

${buildContextBlock({ brand })}`;
}
