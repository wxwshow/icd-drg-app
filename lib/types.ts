// ICD-10 / DRG Code Lookup — Type Definitions

export interface ICDCode {
  id: string;
  code: string;
  description: string;
  type: 'diagnosis' | 'procedure';
  chapter_code: string | null;
  chapter_title: string | null;
  block_range: string | null;
  block_title: string | null;
  category_code: string;
  parent_code: string | null;
}

export interface DRGGroup {
  id: string;
  drg_code: string;
  description: string;
  mdc_code: string | null;
  mdc_description: string | null;
  relative_weight: number | null;
  gmlos: number | null;
  drg_type: 'medical' | 'surgical' | 'pre';
}

export type MappingRole =
  | 'principal_diagnosis'
  | 'secondary_diagnosis'
  | 'procedure'
  | 'cc'
  | 'mcc';

export interface ICDDRGMapping {
  id: string;
  icd_code_id: string;
  drg_group_id: string;
  role: MappingRole;
}

/** Denormalized result returned by the search API */
export interface SearchResult {
  icd_code: string;
  icd_description: string;
  icd_type: 'diagnosis' | 'procedure';
  chapter_title: string | null;
  block_title: string | null;
  drg_code: string | null;
  drg_description: string | null;
  drg_type: 'medical' | 'surgical' | 'pre' | null;
  mdc_code: string | null;
  mdc_description: string | null;
  relative_weight: number | null;
  role: MappingRole | null;
}

/** Shape of the API response */
export interface SearchResponse {
  results: SearchResult[];
  query: string;
  count: number;
}
