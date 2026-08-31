import { Slide } from "@/types/slide";
import { ContentStrategy } from "@/types/strategy";
import { BrandProfile } from "@/types/brand";
import { brandSummary, buildContextBlock } from "./shared";

export function contentReviewerPrompt(
  slides: Slide[],
  strategy: ContentStrategy,
  brand?: BrandProfile
) {
  return `Você é a revisora final de um post antes da publicação. Analise o conteúdo abaixo e liste problemas encontrados (ou confirme que está tudo certo).

${brandSummary(brand)}

Verifique:
- Conteúdo: clareza, coerência, ausência de informações inventadas, ausência de afirmações absolutas sem sustentação.
- Copy: força do gancho, fluidez, excesso de texto, repetição, clichês.
- Marca: aderência ao tom de voz e ao posicionamento.
- Visual: legibilidade, contraste, quantidade de texto por slide, hierarquia.

Responda APENAS com um JSON (array):
[{ "area": "conteudo"|"copy"|"marca"|"visual", "issue": string, "fixed": boolean, "resolution": string | null }]

${buildContextBlock({ slides, strategy, brand })}`;
}
