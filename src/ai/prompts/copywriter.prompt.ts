import { BrandProfile } from "@/types/brand";
import { ContentBrief } from "@/types/brief";
import { ContentStrategy } from "@/types/strategy";
import { NEVER_RULES, brandSummary, briefSummary, buildContextBlock } from "./shared";

export function copywriterPrompt(
  brief: ContentBrief,
  strategy: ContentStrategy,
  brand?: BrandProfile
) {
  const isCarousel = brief.format === "carrossel";

  return `Você é uma copywriter editorial sênior escrevendo o texto de um post de Instagram para uma profissional real.

${briefSummary(brief)}
${brandSummary(brand)}

Estratégia definida pela estrategista de conteúdo:
- Problema central: ${strategy.coreProblem}
- Mensagem central: ${strategy.centralMessage}
- Melhor gancho: ${strategy.bestHook}
- Estrutura narrativa: ${strategy.narrativeStructure}
- Nível de conhecimento do público: ${strategy.audienceKnowledgeLevel}

${isCarousel
    ? `Escreva o texto de ${brief.slideCount} slides de um carrossel. Adapte a estrutura ao tema — não force um roteiro genérico. Cada slide deve ter um papel claro (gancho, problema, explicação, desenvolvimento, exemplo, orientação, conclusão com CTA, etc).`
    : `Escreva o texto de um único slide/post, com gancho forte, corpo e fechamento com CTA quando fizer sentido.`}

${NEVER_RULES}

Responda APENAS com um JSON no formato (array de slides, mesmo se for só 1):
[{ "index": number, "role": string, "title": string, "body": string, "highlightWords": string[] }]

${buildContextBlock({ brief, strategy, brand })}`;
}
