import {
  AIProvider,
  ImageGenerationOptions,
  ImageGenerationResult,
  TextGenerationOptions,
} from "../AIProvider";

/**
 * Demo-mode provider. Used automatically when no AI_API_KEY is configured,
 * so the whole app (strategy -> copy -> art direction -> review) is testable
 * without any external key. It reads the JSON context every prompt embeds
 * between <context> tags and produces deterministic, topic-aware content —
 * not lorem ipsum — so the flow can be judged on real output shape.
 */

function extractContext<T = any>(prompt: string): T {
  const match = prompt.match(/<context>([\s\S]*?)<\/context>/);
  if (!match) return {} as T;
  try {
    return JSON.parse(match[1]);
  } catch {
    return {} as T;
  }
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function seedFromString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const OBJECTIVE_ANGLES: Record<string, string> = {
  educar: "explicar com clareza o que está por trás do tema",
  "gerar-identificacao": "mostrar que quem lê não está sozinho nessa situação",
  "quebrar-mito": "desmontar uma crença comum com argumentos concretos",
  "gerar-autoridade": "demonstrar domínio técnico sobre o assunto",
  "atrair-pacientes": "conectar a dor do público com o serviço oferecido",
  "orientar-pais": "dar um caminho prático para os pais aplicarem hoje",
  "explicar-conceito": "traduzir um conceito técnico em linguagem acessível",
  "divulgar-servico": "apresentar o serviço a partir de um problema real",
  "criar-conexao": "aproximar a marca do dia a dia de quem lê",
};

function buildStrategy(context: any) {
  const topic: string = context.brief?.topic || "o tema proposto";
  const objective: string = context.brief?.objective || "educar";
  const angle = OBJECTIVE_ANGLES[objective] || OBJECTIVE_ANGLES.educar;
  const isChildDevTopic = /crian[çc]a|inf[aâ]ncia|desenvolvimento|filho/i.test(topic);

  const flaggedClaims =
    isChildDevTopic || /estudo|pesquisa|comprovad|cientific/i.test(topic)
      ? [
          {
            id: "claim_1",
            claim: `Qualquer dado numérico ou estudo citado sobre "${topic}" precisa de fonte antes da publicação.`,
            status: "sem-fonte",
          },
        ]
      : [];

  return {
    audienceKnowledgeLevel: "intermediario",
    coreProblem: `O público ouve a frase relacionada a "${topic}" o tempo todo, mas raramente entende onde ela ajuda e onde ela atrapalha.`,
    centralMessage: `"${topic}" precisa ser contextualizada — não é uma regra absoluta, é um ponto de partida para observar, não para esperar.`,
    bestHook: `Uma frase que parece acolhedora pode estar adiando uma decisão importante.`,
    narrativeStructure: `Abrir com a frase/crença comum, mostrar o risco de usá-la sem critério, trazer o que observar de fato, e fechar com um caminho prático — ${angle}.`,
    cta: objective === "atrair-pacientes" || objective === "divulgar-servico"
      ? "Convidar para conhecer o serviço de avaliação."
      : "Convidar a pessoa a salvar o post para revisitar quando precisar.",
    requiresSources: flaggedClaims.length > 0,
    flaggedClaims,
  };
}

const ROLE_SEQUENCES: string[][] = [
  ["gancho", "problema", "explicacao", "desenvolvimento", "exemplo", "orientacao", "conclusao-cta"],
];

function roleSequenceFor(count: number): string[] {
  const base = ROLE_SEQUENCES[0];
  if (count === base.length) return base;
  if (count < base.length) {
    return [base[0], ...base.slice(2, 2 + (count - 2)), base[base.length - 1]];
  }
  const extended = [...base];
  while (extended.length < count) {
    extended.splice(extended.length - 1, 0, "desenvolvimento");
  }
  return extended;
}

const MITO_SCRIPT: Record<string, { title: string; body: string }> = {
  gancho: {
    title: `"Cada criança tem seu tempo"`,
    body: "Essa frase já confortou muita gente. E também já atrasou muita avaliação importante.",
  },
  problema: {
    title: "Quando ela ajuda",
    body: "Ela faz sentido diante de pequenas variações: uma engatinhou antes, outra falou depois. Isso é diversidade do desenvolvimento.",
  },
  explicacao: {
    title: "Quando ela atrapalha",
    body: "O problema começa quando a frase vira desculpa para não observar sinais que se repetem e se acumulam ao longo dos meses.",
  },
  desenvolvimento: {
    title: "O que muda o cenário",
    body: "Não é a idade isolada que importa, é o conjunto: contato visual, comunicação, brincar, reação ao nome, junto com o tempo.",
  },
  exemplo: {
    title: "Na prática",
    body: "Um atraso pontual, sem outros sinais, tende a se ajustar sozinho. Vários sinais juntos, that persistem, pedem outro olhar.",
  },
  orientacao: {
    title: "O que fazer",
    body: "Observe o conjunto, registre o que chama atenção e leve isso a um profissional — avaliar cedo nunca atrapalha.",
  },
  "conclusao-cta": {
    title: "Tempo é individual. Atenção não pode esperar.",
    body: "Se algo te incomoda no desenvolvimento do seu filho, salve este post e procure uma avaliação.",
  },
};

function genericSlideCopy(role: string, topic: string, index: number, tone: string) {
  const acolhedor = tone.includes("acolhedor");
  const direto = tone.includes("direto");
  const templates: Record<string, { title: string; body: string }> = {
    gancho: {
      title: topic,
      body: direto
        ? `Vamos direto ao ponto: essa ideia sobre "${topic}" merece um olhar mais cuidadoso.`
        : `Essa é uma daquelas ideias que parecem simples — mas escondem mais camadas do que parece.`,
    },
    problema: {
      title: "O que normalmente se pensa",
      body: `Muita gente aplica "${topic}" sem parar para entender de onde ela vem e onde ela para de fazer sentido.`,
    },
    explicacao: {
      title: "O ponto que passa despercebido",
      body: `O risco não está na ideia em si, está em usá-la sem critério, ignorando o contexto de cada situação.`,
    },
    desenvolvimento: {
      title: "Olhando mais de perto",
      body: `Quando se observa o conjunto — não um detalhe isolado — a leitura muda completamente.`,
    },
    exemplo: {
      title: "Um jeito de aplicar isso",
      body: acolhedor
        ? `Pense em uma situação recente: o que mudaria se você olhasse para o conjunto, e não para um único sinal?`
        : `Compare duas situações reais: uma variação pontual e um padrão que se repete. A resposta certa muda.`,
    },
    orientacao: {
      title: "O que fazer a partir de agora",
      body: `Observe com atenção, anote o que se repete e busque orientação antes de tirar conclusões sozinha(o).`,
    },
    "conclusao-cta": {
      title: "Vale revisitar essa ideia",
      body: `Salve este post para lembrar da próxima vez que "${topic}" aparecer numa conversa.`,
    },
  };
  return templates[role] || templates.desenvolvimento;
}

function buildSlides(context: any) {
  const topic: string = context.brief?.topic || "";
  const tone: string = context.brief?.tone || "profissional";
  const count: number = context.brief?.slideCount || 7;
  const format: string = context.brief?.format || "carrossel";
  const isMito = /cada crian[çc]a tem seu tempo/i.test(topic);

  if (format === "post-unico" || format === "story" || format === "capa-reels") {
    const single = isMito ? MITO_SCRIPT["gancho"] : genericSlideCopy("gancho", topic, 0, tone);
    const closing = isMito ? MITO_SCRIPT["conclusao-cta"] : genericSlideCopy("conclusao-cta", topic, 1, tone);
    return [
      {
        index: 0,
        role: "gancho-cta",
        title: single.title,
        body: `${single.body} ${closing.body}`,
        highlightWords: extractHighlights(single.title),
      },
    ];
  }

  const roles = roleSequenceFor(count);
  return roles.map((role, index) => {
    const content = isMito
      ? MITO_SCRIPT[role] || genericSlideCopy(role, topic, index, tone)
      : genericSlideCopy(role, topic, index, tone);
    return {
      index,
      role,
      title: content.title,
      body: content.body,
      highlightWords: extractHighlights(content.title),
    };
  });
}

function extractHighlights(title: string): string[] {
  const words = title.split(" ").filter((w) => w.length > 5);
  return words.slice(0, 2);
}

const PALETTES = [
  ["#FBF9F6", "#1E1B18", "#C4622D"],
  ["#EDE6DC", "#1E1B18", "#6E7C6B"],
];

function buildVisualDirections(context: any) {
  const slides = context.slides || [];
  const brandColors: string[] = (context.brand?.colors || []).map((c: any) => c.hex);
  const palette = brandColors.length >= 2 ? brandColors : PALETTES[0];
  const flip = Math.random() > 0.5;
  const spacingOptions = ["airy", "normal"] as const;
  const spacing = pick([...spacingOptions], Math.floor(Math.random() * 2));

  return slides.map((slide: any, i: number) => {
    const isFirst = i === 0;
    const isLast = i === slides.length - 1;
    const alt = flip ? i % 2 !== 0 : i % 2 === 0;
    return {
      slideIndex: slide.index,
      background: {
        type: isFirst || isLast ? "solid" : alt ? "solid" : "gradient",
        colors: isFirst || isLast
          ? [palette[1] || "#1E1B18", palette[1] || "#1E1B18"]
          : alt
          ? [palette[0] || "#FBF9F6", palette[0] || "#FBF9F6"]
          : [palette[0] || "#FBF9F6", palette[2] || "#C4622D"],
      },
      typography: {
        titleSize: isFirst ? "xl" : isLast ? "lg" : "md",
        bodySize: "md",
        titleFont: "display",
      },
      textPosition: isFirst ? "center" : "top",
      alignment: isFirst || isLast ? "center" : "left",
      composition: isFirst ? "gancho-central" : isLast ? "cta-final" : "texto-simples",
      graphicElements: isFirst ? ["marca-dagua", "numero-slide"] : ["numero-slide"],
      spacing,
      imageNeeded: false,
    };
  });
}

function buildCaption(context: any) {
  const topic: string = context.brief?.topic || "esse tema";
  const objective: string = context.brief?.objective || "educar";
  const isMito = /cada crian[çc]a tem seu tempo/i.test(topic);

  if (isMito) {
    return {
      text:
        `"Cada criança tem seu tempo" é uma frase que carrega cuidado — mas também pode carregar demora.\n\n` +
        `Ela funciona bem para pequenas diferenças pontuais. Ela para de funcionar quando vira justificativa para não observar sinais que se repetem.\n\n` +
        `O tempo de cada criança importa. A atenção da família, também.\n\n` +
        `Se algo te incomoda no desenvolvimento do seu filho, comente "AVALIAÇÃO" que te explico como funciona o processo.`,
    };
  }

  return {
    text:
      `Falar sobre "${topic}" exige mais do que uma frase pronta.\n\n` +
      `Neste post, trago um jeito diferente de olhar para o assunto — sem clichê, com prática.\n\n` +
      (objective === "atrair-pacientes" || objective === "divulgar-servico"
        ? `Quer entender como isso se aplica ao seu caso? Chama na DM.`
        : `Salve este post para revisitar quando precisar.`),
  };
}

function buildCTA(context: any) {
  const objective: string = context.brief?.objective || "educar";
  const map: Record<string, { intent: string; text: string }> = {
    "atrair-pacientes": { intent: "contato", text: "Envie uma mensagem para conhecer o processo de avaliação." },
    "divulgar-servico": { intent: "conhecer-servico", text: "Conheça o serviço no link da bio." },
    "quebrar-mito": { intent: "salvar", text: "Salve este post para revisitar sempre que ouvir essa frase." },
    "orientar-pais": { intent: "compartilhar", text: "Compartilhe com quem também vive essa fase." },
  };
  return map[objective] || { intent: "salvar", text: "Salve este post para não perder." };
}

function buildReview(context: any) {
  return [
    { area: "conteudo", issue: "Verificação de afirmações sem fonte concluída.", fixed: true, resolution: "Nenhuma estatística ou estudo foi citado sem sinalização." },
    { area: "copy", issue: "Verificação de clichês e excesso de texto.", fixed: true, resolution: "Frases genéricas substituídas por linguagem específica ao tema." },
    { area: "marca", issue: "Aderência ao tom de voz configurado.", fixed: true },
    { area: "visual", issue: "Contraste e hierarquia entre título e corpo.", fixed: true },
  ];
}

function buildSurpriseIdeas(context: any) {
  const brand = context.brand || {};
  const field = brand.fieldOfWork || "psicologia infantil";
  const seed = seedFromString(JSON.stringify(brand) + Date.now());

  const ideas = [
    {
      title: `"Cada criança tem seu tempo"`,
      angle: "Quando essa frase deixa de ser acolhedora e passa a ser perigosa.",
      hook: "Ela já confortou muita gente. E já atrasou muita avaliação.",
      recommendedFormat: "carrossel",
      objective: "quebrar-mito",
    },
    {
      title: "O que a birra está tentando te dizer",
      angle: `Birra não é falta de educação, é comunicação em ${field}.`,
      hook: "A crise de 20 minutos no supermercado tem um motivo — e não é manha.",
      recommendedFormat: "carrossel",
      objective: "educar",
    },
    {
      title: "Sinais que passam batido na rotina",
      angle: "Coisas pequenas que, juntas, formam um padrão que vale observar.",
      hook: "Ninguém percebe sozinho. É por isso que existe avaliação.",
      recommendedFormat: "post-unico",
      objective: "gerar-autoridade",
    },
    {
      title: "O mito da criança 'mimada'",
      angle: "Por trás do rótulo, quase sempre existe uma necessidade não atendida.",
      hook: "Antes de rotular, vale entender.",
      recommendedFormat: "carrossel",
      objective: "quebrar-mito",
    },
    {
      title: "Como escolher o momento certo para buscar ajuda",
      angle: "Não existe 'cedo demais' quando o assunto é observação.",
      hook: "A pergunta certa não é 'já é hora?', é 'o que estou observando?'.",
      recommendedFormat: "story",
      objective: "orientar-pais",
    },
  ];

  return ideas.map((idea, i) => ({ ...idea, id: `idea_${seed}_${i}` }));
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAIProvider implements AIProvider {
  readonly name = "mock";
  readonly isDemo = true;

  async generateText(prompt: string, options: TextGenerationOptions = {}): Promise<string> {
    await delay(350);
    const context = extractContext(prompt);
    const intent = options.intent || "";

    switch (intent) {
      case "strategy":
        return JSON.stringify(buildStrategy(context));
      case "slides":
        return JSON.stringify(buildSlides(context));
      case "visual-direction":
        return JSON.stringify(buildVisualDirections(context));
      case "caption":
        return JSON.stringify(buildCaption(context));
      case "cta":
        return JSON.stringify(buildCTA(context));
      case "review":
        return JSON.stringify(buildReview(context));
      case "surprise-ideas":
        return JSON.stringify(buildSurpriseIdeas(context));
      default:
        return JSON.stringify({});
    }
  }

  async generateImage(
    _prompt: string,
    _options: ImageGenerationOptions
  ): Promise<ImageGenerationResult> {
    await delay(200);
    return { url: undefined, provider: "mock" };
  }
}
