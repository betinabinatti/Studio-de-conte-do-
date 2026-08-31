export interface SourceReference {
  id: string;
  claim: string;
  source?: string;
  article?: string;
  doi?: string;
  url?: string;
  citation?: string;
  status: "sem-fonte" | "fonte-pendente" | "fonte-anexada";
}

export interface ContentStrategy {
  audienceKnowledgeLevel: "iniciante" | "intermediario" | "avancado";
  coreProblem: string;
  centralMessage: string;
  bestHook: string;
  narrativeStructure: string;
  cta: string;
  notes?: string;
  requiresSources: boolean;
  flaggedClaims: SourceReference[];
}
