import { getSupabaseClient } from './supabase';
import type { SearchResult } from './types';

interface RawRow {
  icd_code: string;
  icd_description: string;
  icd_type: 'diagnosis' | 'procedure';
  chapter_title: string | null;
  block_title: string | null;
  icd_drg_mappings: Array<{
    role: SearchResult['role'];
    drg_groups: {
      drg_code: string;
      drg_description: string;
      drg_type: 'medical' | 'surgical' | 'pre';
      mdc_code: string | null;
      mdc_description: string | null;
      relative_weight: number | null;
    };
  }> | null;
}

function flattenResults(data: RawRow[]): SearchResult[] {
  const results: SearchResult[] = [];
  for (const row of data ?? []) {
    const mappings = row.icd_drg_mappings ?? [];
    if (mappings.length === 0) {
      // Show the ICD code even without DRG mappings
      results.push({
        icd_code: row.icd_code,
        icd_description: row.icd_description,
        icd_type: row.icd_type,
        chapter_title: row.chapter_title,
        block_title: row.block_title,
        drg_code: null,
        drg_description: null,
        drg_type: null,
        mdc_code: null,
        mdc_description: null,
        relative_weight: null,
        role: null,
      });
    } else {
      for (const mapping of mappings) {
        results.push({
          icd_code: row.icd_code,
          icd_description: row.icd_description,
          icd_type: row.icd_type,
          chapter_title: row.chapter_title,
          block_title: row.block_title,
          drg_code: mapping.drg_groups?.drg_code ?? null,
          drg_description: mapping.drg_groups?.drg_description ?? null,
          drg_type: mapping.drg_groups?.drg_type ?? null,
          mdc_code: mapping.drg_groups?.mdc_code ?? null,
          mdc_description: mapping.drg_groups?.mdc_description ?? null,
          relative_weight: mapping.drg_groups?.relative_weight ?? null,
          role: mapping.role,
        });
      }
    }
  }
  return results;
}

// Left join: returns ICD codes even if they have no DRG mappings
const selectClause = `
  icd_code:code,
  icd_description:description,
  icd_type:type,
  chapter_title,
  block_title,
  icd_drg_mappings(
    role,
    drg_groups(
      drg_code,
      drg_description:description,
      drg_type,
      mdc_code,
      mdc_description,
      relative_weight
    )
  )
`;

export async function executeSearch(query: string): Promise<SearchResult[]> {
  const supabase = getSupabaseClient();
  const q = query.trim();

  const isCodeQuery = /^[A-Za-z]\d/.test(q);

  if (isCodeQuery) {
    const upperQ = q.toUpperCase();
    const pattern = `${upperQ}%`;

    const { data, error } = await supabase
      .from('icd_codes')
      .select(selectClause)
      .ilike('code', pattern)
      .order('code')
      .limit(50)
      .returns<RawRow[]>();

    if (error) throw error;
    return flattenResults(data ?? []);
  } else {
    const pattern = `%${q}%`;

    const { data, error } = await supabase
      .from('icd_codes')
      .select(selectClause)
      .ilike('description', pattern)
      .order('code')
      .limit(50)
      .returns<RawRow[]>();

    if (error) throw error;
    return flattenResults(data ?? []);
  }
}
