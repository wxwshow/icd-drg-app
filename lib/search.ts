import { getSupabaseClient } from './supabase';
import type { SearchResult } from './types';

export type CodeType = 'diagnosis' | 'procedure';

// --- ICD-driven rows (search by ICD code/description) ---
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
      gmlos: number | null;
    };
  }> | null;
}

// --- DRG-driven rows (search by DRG code/description) ---
interface RawDrgRow {
  drg_code: string;
  drg_description: string;
  drg_type: 'medical' | 'surgical' | 'pre';
  mdc_code: string | null;
  mdc_description: string | null;
  relative_weight: number | null;
  gmlos: number | null;
  icd_drg_mappings: Array<{
    role: SearchResult['role'];
    icd_codes: {
      code: string;
      description: string;
      type: 'diagnosis' | 'procedure';
      chapter_title: string | null;
      block_title: string | null;
    };
  }> | null;
}

const resultKey = (r: SearchResult) => `${r.icd_code}|${r.drg_code}|${r.role}`;

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
        gmlos: null,
        role: null,
        match_source: 'icd',
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
          gmlos: mapping.drg_groups?.gmlos ?? null,
          role: mapping.role,
          match_source: 'icd',
        });
      }
    }
  }
  return results;
}

function flattenDrgResults(data: RawDrgRow[]): SearchResult[] {
  const results: SearchResult[] = [];
  for (const row of data ?? []) {
    const mappings = row.icd_drg_mappings ?? [];
    if (mappings.length === 0) {
      // DRG with no mapped ICD codes — still surface the DRG itself
      results.push({
        icd_code: '',
        icd_description: '',
        icd_type: 'diagnosis',
        chapter_title: null,
        block_title: null,
        drg_code: row.drg_code,
        drg_description: row.drg_description,
        drg_type: row.drg_type,
        mdc_code: row.mdc_code,
        mdc_description: row.mdc_description,
        relative_weight: row.relative_weight,
        gmlos: row.gmlos,
        role: null,
        match_source: 'drg',
      });
    } else {
      for (const mapping of mappings) {
        results.push({
          icd_code: mapping.icd_codes?.code ?? '',
          icd_description: mapping.icd_codes?.description ?? '',
          icd_type: mapping.icd_codes?.type ?? 'diagnosis',
          chapter_title: mapping.icd_codes?.chapter_title ?? null,
          block_title: mapping.icd_codes?.block_title ?? null,
          drg_code: row.drg_code,
          drg_description: row.drg_description,
          drg_type: row.drg_type,
          mdc_code: row.mdc_code,
          mdc_description: row.mdc_description,
          relative_weight: row.relative_weight,
          gmlos: row.gmlos,
          role: mapping.role,
          match_source: 'drg',
        });
      }
    }
  }
  return results;
}

// ICD side: left join to DRG mappings so codes without DRG still appear
const icdSelectClause = `
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
      relative_weight,
      gmlos
    )
  )
`;

// DRG side: left join to its mapped ICD codes
const drgSelectClause = `
  drg_code,
  drg_description:description,
  drg_type,
  mdc_code,
  mdc_description,
  relative_weight,
  gmlos,
  icd_drg_mappings(
    role,
    icd_codes(
      code,
      description,
      type,
      chapter_title,
      block_title
    )
  )
`;

async function searchDrg(q: string): Promise<SearchResult[]> {
  const supabase = getSupabaseClient();
  // "DRG F06A" / "F06A" → match on the code suffix "F06A"
  const norm = q.replace(/^DRG\s*/i, '').trim();

  const run = async (column: 'drg_code' | 'description', pattern: string) => {
    const { data, error } = await supabase
      .from('drg_groups')
      .select(drgSelectClause)
      .ilike(column, pattern)
      .order('drg_code')
      .limit(20)
      .returns<RawDrgRow[]>();
    if (error) throw error;
    return data ?? [];
  };

  const [byCode, byDesc] = await Promise.all([
    run('drg_code', `%${norm}%`),
    run('description', `%${q}%`),
  ]);

  const merged = new Map<string, RawDrgRow>();
  for (const row of [...byCode, ...byDesc]) merged.set(row.drg_code, row);
  return flattenDrgResults([...merged.values()]);
}

export async function executeSearch(
  query: string,
  type?: CodeType
): Promise<SearchResult[]> {
  const supabase = getSupabaseClient();
  const q = query.trim();

  // 1. ICD search (by code prefix or description)
  const isCodeQuery = /^[A-Za-z]\d/.test(q);
  const builder = isCodeQuery
    ? supabase
        .from('icd_codes')
        .select(icdSelectClause)
        .ilike('code', `${q.toUpperCase()}%`)
    : supabase
        .from('icd_codes')
        .select(icdSelectClause)
        .ilike('description', `%${q}%`);

  const filtered = type ? builder.eq('type', type) : builder;

  const { data, error } = await filtered
    .order('code')
    .limit(50)
    .returns<RawRow[]>();

  if (error) throw error;

  const results = flattenResults(data ?? []);

  // 2. DRG search — append DRG matches (skipped when a code-type filter is active)
  if (!type) {
    const drgResults = await searchDrg(q);
    const seen = new Set(results.map(resultKey));
    for (const r of drgResults) {
      if (results.length >= 50) break;
      const k = resultKey(r);
      if (!seen.has(k)) {
        seen.add(k);
        results.push(r);
      }
    }
  }

  return results;
}
