export type Locale = "es" | "en";

export type LocalText = Readonly<{
  es: string;
  en: string;
}>;

export type PillarId = "renovacion" | "consultoria" | "publicidad";
export type NeedId = "ordenar" | "cumplir" | "crecer";

export type ServiceKind = "service" | "physical" | "entry";

export type CommercialState =
  | "public"
  | "contextual"
  | "under_review"
  | "in_development"
  | "historical";

export type TechnicalMaturity = "proven" | "accelerator" | "pattern" | "design";

export interface Pillar {
  id: PillarId;
  eyebrow: LocalText;
  title: LocalText;
  summary: LocalText;
  outcome: LocalText;
  services: LocalText[];
  technologies: string[];
  accent: "amber" | "white" | "green";
}

export interface NeedRoute {
  id: NeedId;
  label: LocalText;
  helper: LocalText;
  pillar: PillarId;
  capabilities: string[];
}

export interface CatalogItem {
  id: string;
  kind: ServiceKind;
  pillar: PillarId;
  secondaryPillars?: PillarId[];
  category: string;
  title: LocalText;
  result: LocalText;
  includes: LocalText[];
  tags: string[];
  capabilityIds?: string[];
  quoteOnly?: boolean;
  commercialState: CommercialState;
  technicalMaturity: TechnicalMaturity;
  regulated: boolean;
  requiresProfessionalReview: boolean;
  selectable: boolean;
}

export interface Capability {
  id: string;
  acronym: string;
  name: LocalText;
  problem: LocalText;
  result: LocalText;
  pillars: PillarId[];
  commercialState: CommercialState;
  technicalMaturity: TechnicalMaturity;
  regulated: boolean;
  requiresProfessionalReview: boolean;
  selectable: boolean;
  models: string[];
  searchTerms: string[];
}

export interface CapabilityFamily {
  id: string;
  title: LocalText;
  description: LocalText;
  capabilityIds: string[];
}

export interface TechnologySolution {
  id: string;
  title: LocalText;
  description: LocalText;
  outcome: LocalText;
  capabilityIds: string[];
  pillarIds: PillarId[];
  href: LocalText;
}

export interface MethodStep {
  id: string;
  number: string;
  title: LocalText;
  action: LocalText;
  outcome: LocalText;
}

export interface SearchRecord {
  id: string;
  type: "pillar" | "service" | "solution" | "capability" | "route" | "resource";
  title: LocalText;
  description: LocalText;
  href: LocalText;
  keywords: string[];
}
