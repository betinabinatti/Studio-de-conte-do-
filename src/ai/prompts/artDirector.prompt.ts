import { BrandProfile } from "@/types/brand";
import { Slide } from "@/types/slide";
import { brandSummary, buildContextBlock } from "./shared";

export function artDirectorPrompt(slides: Slide[], brand?: BrandProfile) {
  return `Você é a diretora de arte responsável por transformar texto em instruções visuais precisas para cada slide, respeitando a identidade da marca.

${brandSummary(brand)}
Estilos visuais da marca: ${brand?.visualStyles?.join(", ") || "clean, editorial"}.
Cores da marca: ${brand?.colors?.map((c) => c.hex).join(", ") || "usar paleta neutra elegante (bege, grafite, terracota)"}.

Para cada um dos ${slides.length} slides, defina: fundo (sólido, gradiente ou textura + cores), tipografia (tamanho do título e corpo, fonte de destaque ou não), posição do texto, alinhamento, tipo de composição, elementos gráficos, espaçamento, e se uma imagem/ilustração é realmente necessária (use com moderação).

Responda APENAS com um JSON (array, um item por slide, na mesma ordem):
[{
  "slideIndex": number,
  "background": { "type": "solid" | "gradient" | "texture", "colors": string[] },
  "typography": { "titleSize": "sm"|"md"|"lg"|"xl", "bodySize": "sm"|"md"|"lg", "titleFont": "display"|"sans" },
  "textPosition": "top"|"center"|"bottom",
  "alignment": "left"|"center"|"right",
  "composition": "gancho-central"|"texto-imagem"|"lista"|"citacao"|"comparacao"|"cta-final"|"texto-simples",
  "graphicElements": string[],
  "spacing": "compact"|"normal"|"airy",
  "imageNeeded": boolean,
  "imageDescription": string | null
}]

${buildContextBlock({ slides, brand })}`;
}
