/**
 * Local SQLite adapter — drops in as a replacement for the Supabase client.
 */

import { getDb } from './sqlite-db';
import type { SearchResult } from './types';

// --- Query shape returned by SQLite ---
interface RawIcdRow {
  id: number;
  code: string;
  description: string;
  type: string;
  chapter_title: string | null;
  block_title: string | null;
}

interface RawDrgRow {
  id: number;
  drg_code: string;
  description: string;
  drg_type: string;
  mdc_code: string | null;
  mdc_description: string | null;
  relative_weight: number | null;
  gmlos: number | null;
  icd_codes: Array<{
    id: number;
    code: string;
    description: string;
    type: string;
    chapter_title: string | null;
    block_title: string | null;
  }>;
}

const resultKey = (r: SearchResult) => `${r.icd_code}|${r.drg_code}|${r.role}`;

function flattenIcd(rows: RawIcdRow[], includeMappings: boolean): SearchResult[] {
  const results: SearchResult[] = [];
  for (const row of rows ?? []) {
    if (!includeMappings) {
      results.push({
        icd_code: row.code, icd_description: row.description,
        icd_type: row.type as 'diagnosis' | 'procedure',
        chapter_title: row.chapter_title, block_title: row.block_title,
        drg_code: null, drg_description: null, drg_type: null,
        mdc_code: null, mdc_description: null,
        relative_weight: null, gmlos: null, role: null,
        match_source: 'icd',
      });
    } else {
      // Get mapping + DRG info
      const db = getDb();
      const maps = db.prepare(`
        SELECT m.role, d.drg_code, d.description AS drg_description,
               d.drg_type, d.mdc_code, d.mdc_description,
               d.relative_weight, d.gmlos
        FROM icd_drg_mappings m
        JOIN drg_groups d ON m.drg_group_id = d.id
        WHERE m.icd_code_id = ?
      `).all(row.id);

      for (const map of maps) {
        results.push({
          icd_code: row.code, icd_description: row.description,
          icd_type: row.type as 'diagnosis' | 'procedure',
          chapter_title: row.chapter_title, block_title: row.block_title,
          drg_code: map.drg_code, drg_description: map.drg_description,
          drg_type: map.drg_type as 'medical' | 'surgical' | 'pre',
          mdc_code: map.mdc_code, mdc_description: map.mdc_description,
          relative_weight: map.relative_weight, gmlos: map.gmlos,
          role: map.role,
          match_source: 'icd',
        });
      }
      if (maps.length === 0) {
        results.push({
          icd_code: row.code, icd_description: row.description,
          icd_type: row.type as 'diagnosis' | 'procedure',
          chapter_title: row.chapter_title, block_title: row.block_title,
          drg_code: null, drg_description: null, drg_type: null,
          mdc_code: null, mdc_description: null,
          relative_weight: null, gmlos: null, role: null,
          match_source: 'icd',
        });
      }
    }
  }
  return results;
}

function flattenDrg(rows: RawDrgRow[]): SearchResult[] {
  const results: SearchResult[] = [];
  for (const row of rows ?? []) {
    if (row.icd_codes?.length === 0) {
      results.push({
        icd_code: '', icd_description: '', icd_type: 'diagnosis',
        chapter_title: null, block_title: null,
        drg_code: row.drg_code, drg_description: row.description,
        drg_type: row.drg_type as 'medical' | 'surgical' | 'pre',
        mdc_code: row.mdc_code, mdc_description: row.mdc_description,
        relative_weight: row.relative_weight, gmlos: row.gmlos,
        role: null, match_source: 'drg',
      });
    } else {
      for (const icd of row.icd_codes) {
        results.push({
          icd_code: icd.code, icd_description: icd.description,
          icd_type: icd.type as 'diagnosis' | 'procedure',
          chapter_title: icd.chapter_title, block_title: icd.block_title,
          drg_code: row.drg_code, drg_description: row.description,
          drg_type: row.drg_type as 'medical' | 'surgical' | 'pre',
          mdc_code: row.mdc_code, mdc_description: row.mdc_description,
          relative_weight: row.relative_weight, gmlos: row.gmlos,
          role: 'principal_diagnosis', match_source: 'drg',
        });
      }
    }
  }
  return results;
}

async function searchDrg(q: string): Promise<SearchResult[]> {
  const db = getDb();
  const norm = q.replace(/^DRG\s*/i, '').trim();

  // Exact match first, then partial
  const byExactCode = db.prepare(`
    SELECT d.*, json_group_array(
      json_object('id', ic.id, 'code', ic.code, 'description', ic.description,
                  'type', ic.type, 'chapter_title', ic.chapter_title, 'block_title', ic.block_title)
    ) AS icd_codes
    FROM drg_groups d
    LEFT JOIN icd_drg_mappings m ON m.drg_group_id = d.id
    LEFT JOIN icd_codes ic ON m.icd_code_id = ic.id
    WHERE d.drg_code = ?
    GROUP BY d.id
  `).all('DRG ' + norm) as RawDrgRow[];

  const runLike = async (column: 'drg_code' | 'description') => {
    // Use glob with * wildcard for simpler pattern matching
    return db.prepare(`
      SELECT d.*, json_group_array(
        json_object('id', ic.id, 'code', ic.code, 'description', ic.description,
                    'type', ic.type, 'chapter_title', ic.chapter_title, 'block_title', ic.block_title)
      ) AS icd_codes
      FROM drg_groups d
      LEFT JOIN icd_drg_mappings m ON m.drg_group_id = d.id
      LEFT JOIN icd_codes ic ON m.icd_code_id = ic.id
      WHERE d.${column} GLOB '*' || ? || '*'
      GROUP BY d.id
      LIMIT 20
    `).all(norm) as RawDrgRow[];
  };

  const [byCodeLike, byDesc] = await Promise.all([
    runLike('drg_code'),
    runLike('description'),
  ]);

  // Merge: exact match first, then deduplicate
  const merged = new Map<string, RawDrgRow>();
  if (byExactCode.length > 0) merged.set(byExactCode[0].drg_code, byExactCode[0]);
  for (const row of [...byCodeLike, ...byDesc]) merged.set(row.drg_code, row);
  return flattenDrg([...merged.values()]);
}

export async function executeSearch(
  query: string,
  type?: string,
): Promise<SearchResult[]> {
  const db = getDb();
  const q = query.trim();

  // 1. ICD search
  const isCodeQuery = /^[A-Za-z]\d/.test(q);
  let rawRows: RawIcdRow[] = [];

  if (isCodeQuery) {
    // Code-based prefix match (e.g. "A01", "J45")
    const sqlWithType = `
      SELECT id, code, description, type, chapter_title, block_title
      FROM icd_codes
      WHERE code LIKE ? ESCAPE '!'
        AND description NOT LIKE '%+%'
        ${type ? 'AND type = ?' : ''}
      ORDER BY code LIMIT 50`;
    const sqlPlain = `
      SELECT id, code, description, type, chapter_title, block_title
      FROM icd_codes
      WHERE code LIKE ? ESCAPE '!'
        AND description NOT LIKE '%+%'
      ORDER BY code LIMIT 50`;
    rawRows = db.prepare(type ? sqlWithType : sqlPlain).all(
      `${q.toUpperCase()}%`, ...(type ? [type] : [])
    ) as RawIcdRow[];
  } else {
    // Description-based text search using LIKE (better than FTS5 for Chinese)
    const escQuery = q.replace(/!/g, '!!').replace(/%/g, '!%').replace(/_/g, '!_');
    const sqlWithType = `
      SELECT id, code, description, type, chapter_title, block_title
      FROM icd_codes
      WHERE description LIKE ? ESCAPE '!'
        ${type ? 'AND type = ?' : ''}
      ORDER BY code LIMIT 50`;
    const sqlPlain = `
      SELECT id, code, description, type, chapter_title, block_title
      FROM icd_codes
      WHERE description LIKE ? ESCAPE '!'
      ORDER BY code LIMIT 50`;
    rawRows = db.prepare(type ? sqlWithType : sqlPlain).all(
      `%${escQuery}%`, ...(type ? [type] : [])
    ) as RawIcdRow[];
  }

  const results = flattenIcd(rawRows, true);

  // 2. DRG search
  if (!type || type !== 'diagnosis') {
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
