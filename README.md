# Studio de Conteúdo

Transforme uma ideia em um post pronto para publicar. Um pequeno sistema editorial que pensa a estratégia, escreve o texto, dirige a arte e renderiza a imagem final — pronta para baixar e publicar.

## Fluxo

```
Briefing → Estratégia → Texto → Direção visual → Renderização da arte → Revisão → Resultado final
```

Nenhuma etapa é um único prompt gigante. Cada uma é um agente com responsabilidade única (veja `src/ai/agents`), e a arte final é **renderizada de forma determinística em HTML/CSS** (não descrita por um prompt de imagem) — texto, fonte, cor, alinhamento e espaçamento ficam sob controle total.

## Stack

- **Next.js 14 (App Router)** + **React 18** + **TypeScript**
- **Tailwind CSS** para o design system
- **html-to-image** para exportar a arte renderizada em HTML/CSS como PNG real
- **Armazenamento**: arquivos JSON (`data/`) localmente; Redis (Upstash, via integração da Vercel) + Vercel Blob em produção — mesma interface, troca automática por variável de ambiente
- **AIProvider**: abstração de fornecedor de IA (`src/ai/AIProvider.ts`) com implementação mock (modo demonstração) e uma implementação real via Claude (Anthropic)

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Sem nenhuma variável de ambiente configurada, o app roda em **modo demonstração**: os agentes editoriais usam dados mockados (determinísticos e específicos ao tema informado, não lorem ipsum) para que todo o fluxo — estratégia, copy, direção visual, revisão, exportação — funcione de ponta a ponta sem custo e sem chave de API.

### Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
AI_API_KEY=        # chave da Anthropic (Claude). Vazio = modo demonstração.
AI_MODEL=          # opcional, padrão claude-sonnet-4-5
IMAGE_API_KEY=      # reservado para um futuro provedor de geração de imagens
```

Com `AI_API_KEY` configurada, os agentes passam a usar Claude de verdade para estratégia, copy, direção visual e revisão. A arte continua sendo renderizada em HTML/CSS — nenhum provedor de imagem é necessário para o texto ficar legível e bem posicionado.

## Teste rápido (aceite do MVP)

1. Abra `/`, digite **"Cada criança tem seu tempo"**.
2. Formato **Carrossel**, 7 slides, objetivo **Quebrar um mito**, tom **Profissional**.
3. Clique em **Gerar conteúdo** → acompanhe as etapas (estratégia, copy, direção visual, montagem, revisão).
4. Navegue pelos 7 slides, edite um texto, clique em **Salvar carrossel** — 7 PNGs de 1080×1350 são baixados.
5. Copie a legenda gerada.

Esse fluxo foi testado ponta a ponta durante o desenvolvimento (inclusive a exportação real do PNG em resolução final).

## Deploy na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new) (framework Next.js é detectado automaticamente).
2. Em **Settings → Environment Variables**, adicione `AI_API_KEY` (sua chave da Anthropic).
3. Em **Storage**, adicione as integrações **Redis** e **Blob** — a Vercel injeta `KV_REST_API_URL`, `KV_REST_API_TOKEN` e `BLOB_READ_WRITE_TOKEN` automaticamente, sem precisar copiar nada manualmente.
4. Faça o deploy.

Sem os dois storages configurados, o app funciona (inclusive gerar conteúdo com IA), mas salvar histórico, ideias e marca não persiste de forma confiável — funções serverless têm sistema de arquivos somente leitura, e o fallback local em `data/*.json` só existe para rodar em `npm run dev`.

## Arquitetura

```
src/
  ai/
    AIProvider.ts          # interface única: generateText / generateImage
    getAIProvider.ts       # escolhe mock ou Anthropic conforme .env
    providers/              # mockProvider.ts, anthropicProvider.ts
    agents/                 # contentStrategist, copywriter, artDirector,
                             # contentReviewer, copyExtras (caption/CTA),
                             # imageGenerator, surpriseAgent
    prompts/                # prompt de cada agente, separado da lógica
    pipeline.ts             # orquestra briefing → ... → GeneratedContent
  types/                    # BrandProfile, ContentBrief, ContentStrategy,
                             # Slide, VisualDirection, GeneratedContent,
                             # Caption, CTA, ContentIdea
  database/                 # armazenamento: JSON local ou Redis/Blob (db.ts) + repositórios
  services/                 # brandService, contentService, ideaService
  components/
    ui/                     # Button, Card, Field, Badge, NavBar
    studio/                 # BriefForm, pickers, GenerationLoader,
                             # ResultView, SlideCarousel, CaptionPanel
    brand/                  # BrandForm, ColorListEditor, VisualStylePicker
    ideas/                  # IdeaCard, NewIdeaForm, SurpriseIdeaCard
    history/                # ContentCard
    render/                 # SlideCanvas — a arte final em HTML/CSS
  export/                   # exportImage.ts — captura PNG real via html-to-image
  app/
    page.tsx                # Studio (tela principal)
    brand/page.tsx           # Identidade da marca
    ideas/page.tsx           # Banco de ideias + "Me surpreenda"
    history/page.tsx         # Meus conteúdos
    api/                     # rotas: brand, contents, ideas, generate, surprise
```

### Por que renderização determinística em vez de IA de imagem

O `SlideCanvas` (`src/components/render/SlideCanvas.tsx`) monta cada slide como HTML/CSS real, nas dimensões exatas do Instagram (1080×1080, 1080×1350, 1080×1920), com cor de texto calculada automaticamente para contraste, tipografia da marca, numeração de slide e marca d'água opcional. A exportação (`src/export/exportImage.ts`) captura esse mesmo DOM em resolução real via `html-to-image` — não é uma prévia em baixa qualidade, é a arte final.

Um provedor de imagem (via `IMAGE_API_KEY`) só entraria em jogo para ilustrações/fotos de fundo que a diretora de arte (`artDirector`) sinalizar como necessárias — nunca para escrever texto dentro da imagem.

### Direção criativa definitiva — "Escada de Pontos / ABA Autoridade"

`src/design/brandIdentity.ts` fixa a direção criativa oficial da arte gerada:

- **Paleta e contraste**: 5 pares fundo/texto validados por WCAG, agrupados em 3 tiers (`claro`, `medio`, `ancora`). Fundo sempre sólido e liso — sem gradiente, textura ou terracota como background.
- **Terracota como assinatura emocional**: no máximo uma palavra em destaque por peça (nunca uma lista), reservada à parte emocionalmente mais importante da frase.
- **Tipografia Montserrat**: título em Bold, corpo em Regular. A caixa do título é uma **decisão editorial** — maiúscula para frases de confronto/impacto/afirmação, natural para frases intimistas/reflexivas — nunca automática.
- **Alinhamento padrão à esquerda** (não centraliza automaticamente), com margem segura de 100px e grid de 1080px.
- **Fotografia + cartela**: quando há imagem, o layout divide a arte em dois painéis lado a lado (foto limpa de um lado, texto sobre cor sólida do outro) — nunca texto sobreposto à foto.
- **Ritmo de feed**: cada geração real (`contentService.generate`/`regenerate`, rota `restyle`) lê os últimos posts salvos e escolhe o tier de fundo evitando repetir o anterior, com o fundo-âncora (azul-marinho) aparecendo a cada 3–4 posts.

Essas decisões são resolvidas **uma vez, na geração** (`applyOfficialIdentity`, chamado por `runArtDirector`) e persistidas no conteúdo — o `SlideCanvas` só lê o resultado já decidido, nunca re-decide cor/alinhamento a cada render. Isso é o que torna o ritmo de feed possível: gerações futuras conseguem ler o histórico real de tiers usados.

### Camada de marca

A `BrandProfile` (nome, área de atuação, público, posicionamento, tom de voz, palavras a usar/evitar, cores, fonte, estilos visuais, logo) é salva uma única vez em `/brand` e injetada automaticamente em todos os agentes a cada geração — o usuário nunca precisa reexplicar a marca.

### Regras de conteúdo profissional/saúde

`ContentStrategy.flaggedClaims` e `SourceReference` (`src/types/strategy.ts`) preparam a estrutura para anexar fonte, artigo, DOI e URL a qualquer afirmação que pareça uma alegação científica. Os agentes são instruídos a nunca inventar estudos, estatísticas ou diagnósticos, e o revisor (`contentReviewer`) sinaliza automaticamente quando uma afirmação exige fonte antes da publicação.

## O que já funciona

- Briefing completo (tema, formato, objetivo, tom, quantidade de slides para carrossel)
- Pipeline editorial completo com 5 agentes especializados + revisão automática (clichês, emojis, afirmações sem fonte)
- Renderização determinística da arte final em HTML/CSS, com preview proporcional às dimensões reais do Instagram
- Exportação de PNG real (slide único ou carrossel completo) em resolução de publicação
- Legenda e CTA gerados automaticamente, com botão de copiar
- Regenerar, editar conteúdo, alterar visual (mantendo o texto) e regenerar tudo
- Identidade de marca persistente, usada automaticamente em toda geração
- Banco de ideias com status (Ideia → Em produção → Pronto → Publicado) e criação de conteúdo a partir de uma ideia
- "✨ Me surpreenda": 5 ideias geradas a partir do posicionamento da marca
- Histórico de conteúdos com reabertura para edição
- Modo demonstração completo sem nenhuma chave de API

## Próximos passos (fora do escopo do MVP, por decisão deliberada)

- Provedor de imagem real (IMAGE_API_KEY) para ilustrações de fundo
- Login/múltiplas marcas, calendário editorial, publicação automática, métricas
- Anexar fontes/DOIs reais às afirmações sinalizadas pelo revisor

## Nota de segurança de dependências

`npm audit` reporta vulnerabilidades altas restantes em dependências transitivas do próprio Next.js 14 (pipeline interno de build) e do `eslint-config-next` (ferramentas de lint, não usadas em produção). Ambas ficam resolvidas apenas migrando para Next 15, o que está fora do escopo desta primeira versão — reavalie antes de um deploy de produção.
