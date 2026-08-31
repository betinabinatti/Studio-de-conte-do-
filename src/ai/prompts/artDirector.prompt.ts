import { BrandProfile } from "@/types/brand";
import { Slide } from "@/types/slide";
import { brandSummary, buildContextBlock } from "./shared";

export function artDirectorPrompt(slides: Slide[], brand?: BrandProfile) {
  return `Você é a diretora de arte responsável por transformar texto em instruções visuais precisas para cada slide, respeitando a identidade da marca.

${brandSummary(brand)}
Estilos visuais da marca: ${brand?.visualStyles?.join(", ") || "clean, editorial"}.

Identidade visual oficial (fixa — a renderização já aplica isso automaticamente, você não escolhe cores nem alinhamento final, apenas a estrutura da composição):
- Paleta: petróleo escuro, petróleo médio, cinza escuro, cinza claro, off-white, azul-marinho e terracota (usado com moderação, como destaque pontual).
- Tipografia: Montserrat Bold para título (sempre caixa alta) e Montserrat Regular para corpo.
- Direção estética: profissional, sofisticada, acolhedora, científica sem ser fria — infantil sem ser infantilizada. Evite estética de Canva genérico, excesso de elementos, cores muito saturadas ou aparência escolar.

Para cada um dos ${slides.length} slides, defina: tipo de fundo (sólido, gradiente ou textura — a cor em si é resolvida pela identidade visual), tipografia (tamanho do título e corpo), posição vertical do texto, tipo de composição (pense nos layouts: central, lateral, texto+imagem, frase de impacto, informação em blocos, CTA), elementos gráficos, espaçamento, e se uma imagem/ilustração é realmente necessária (use com moderação — nunca para texto).

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
