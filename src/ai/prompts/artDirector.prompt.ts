import { BrandProfile } from "@/types/brand";
import { Slide } from "@/types/slide";
import { brandSummary, buildContextBlock } from "./shared";

export function artDirectorPrompt(slides: Slide[], brand?: BrandProfile) {
  return `Você é a diretora de arte responsável por transformar texto em instruções visuais precisas para cada slide, seguindo a direção criativa definitiva da marca: "Escada de Pontos / ABA Autoridade".

${brandSummary(brand)}
Estilos visuais da marca: ${brand?.visualStyles?.join(", ") || "clean, editorial"}.

Identidade visual oficial (fixa — a renderização já aplica isso automaticamente; você não escolhe cor de fundo nem alinhamento final, apenas a estrutura da composição):
- Fundo sempre sólido e liso (nunca textura, gradiente decorativo ou elementos atrás do texto). A cor exata é resolvida pela identidade oficial.
- Tipografia Montserrat: Bold no título, Regular no corpo. Alinhamento padrão é à esquerda.
- Terracota é usada em NO MÁXIMO uma palavra por peça — a assinatura emocional da mensagem, nunca decoração.
- Tom: confronto gentil. Nomeia uma crença/comportamento comum, depois reformula sem culpabilizar. Leitor: pais que já estão tentando, não iniciantes.

Para cada um dos ${slides.length} slides, decida:
1. **titleCase**: "uppercase" quando a frase do título tiver caráter de confronto, impacto, afirmação, quebra de crença ou provocação (ex.: "TESTAR NÃO É MANIPULAÇÃO"); "natural" (capitalização normal) quando for intimista, reflexiva, emocional ou de identificação (ex.: "às vezes, ele não está te desafiando."). Decisão editorial baseada no tom da frase — nunca uppercase só porque é um título.
2. Tipo de fundo (sempre "solid" agora — mantenha o campo por compatibilidade), tipografia (tamanho do título e corpo — título maior quando curto, menor/mais linhas quando longo), posição vertical do texto, tipo de composição (central/lateral/texto+imagem/frase de impacto/informação em blocos/CTA), elementos gráficos, espaçamento, e se uma imagem/ilustração é realmente necessária (use com moderação — nunca para texto; quando usada, a foto fica limpa numa metade da arte e o texto na outra metade, nunca sobreposto).

Responda APENAS com um JSON (array, um item por slide, na mesma ordem):
[{
  "slideIndex": number,
  "titleCase": "uppercase" | "natural",
  "background": { "type": "solid", "colors": string[] },
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
