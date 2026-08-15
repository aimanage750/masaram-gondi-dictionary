/**
 * Culture & Knowledge data model.
 *
 * Every research-based entry carries a CultureSource (name, URL, year,
 * last-verified). Statistics MUST have source_year. Nothing here is
 * invented — unverified items must be omitted or flagged.
 */

export interface CultureSource {
  source: string;
  source_url?: string;
  source_year?: string;
  last_verified: string; // YYYY-MM-DD
  /** e.g. "primary official", "secondary" */
  note?: string;
}

export type RegionId =
  | "central"
  | "east"
  | "west"
  | "south"
  | "northeast"
  | "himalaya"
  | "north"
  | "islands";

export interface StateTribal {
  state: string;
  region: RegionId;
  /** Census 2011 total population (persons). */
  total_population_2011: number;
  /** Census 2011 Scheduled Tribe population; null = no notified ST. */
  st_population_2011: number | null;
  /** ST share of the state population (%), Census 2011. */
  st_percent: number | null;
  major_communities: string[];
  major_regions: string[];
}

export interface RegionInfo {
  id: RegionId;
  name_hi: string;
  name_en: string;
  description: string;
  states: string[];
  communities: string[];
}

export interface Festival {
  name: string;
  name_hi?: string;
  community: string;
  state: string;
  season?: string;
  meaning?: string;
  activities?: string;
  source: CultureSource;
}

export interface ArtItem {
  name: string;
  category: "painting" | "dance" | "music" | "craft" | "textile" | "metal" | "architecture";
  community: string;
  state: string;
  description: string;
  source: CultureSource;
}

export interface Place {
  name: string;
  state: string;
  district?: string;
  type: string;
  why: string;
  connection: string;
  source: CultureSource;
}

export interface SacredPlace {
  name: string;
  state: string;
  association: string;
  significance: string;
  terminology_note?: string;
  source: CultureSource;
}

export interface HeritageItem {
  title: string;
  kind: "person" | "movement" | "institution" | "milestone";
  description: string;
  source: CultureSource;
}

export interface GondiStateRow {
  state: string;
  regions: string;
  districts: string;
  communities: string;
  scripts: string;
  note?: string;
  source: CultureSource;
}

export interface ScriptInfo {
  name: string;
  unicode?: string;
  period?: string;
  usage: string;
  note: string;
  source: CultureSource;
}
