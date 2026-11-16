#!/usr/bin/env node
/**
 * Initialize SQLite local database from seed files.
 * Run once:  npx tsx lib/db-init.mts
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const scriptDir = process.argv[1]?.replace(/\\/g, '/').replace(/\/[^/]*$/, '') || '.';
const ROOT = path.resolve(scriptDir, '..');
console.log('ROOT:', ROOT);
const dbPath = path.join(ROOT, 'data.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ──────────────────────────────────────────────
db.exec(`
CREATE TABLE icd_codes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  code           TEXT    NOT NULL UNIQUE,
  description    TEXT    NOT NULL,
  type           TEXT    NOT NULL DEFAULT 'diagnosis',
  chapter_code   TEXT,
  chapter_title  TEXT,
  block_range    TEXT,
  block_title    TEXT,
  category_code  TEXT    NOT NULL,
  parent_code    TEXT
);

CREATE INDEX idx_icd_codes_code     ON icd_codes(code);
CREATE INDEX idx_icd_codes_type     ON icd_codes(type);
CREATE INDEX idx_icd_codes_category ON icd_codes(category_code);

CREATE VIRTUAL TABLE icd_codes_fts USING fts5(code, description, content='icd_codes');

CREATE TABLE drg_groups (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  drg_code         TEXT    NOT NULL UNIQUE,
  description      TEXT    NOT NULL,
  mdc_code         TEXT,
  mdc_description TEXT,
  relative_weight  REAL,
  gmlos            REAL,
  drg_type         TEXT    NOT NULL CHECK(drg_type IN ('medical','surgical','pre'))
);
CREATE INDEX idx_drg_code ON drg_groups(drg_code);
CREATE INDEX idx_drg_desc ON drg_groups(description);

CREATE TABLE icd_drg_mappings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  icd_code_id INTEGER NOT NULL REFERENCES icd_codes(id) ON DELETE CASCADE,
  drg_group_id INTEGER NOT NULL REFERENCES drg_groups(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK(role IN ('principal_diagnosis','secondary_diagnosis','procedure','cc','mcc')),
  UNIQUE(icd_code_id, drg_group_id, role)
);
CREATE INDEX idx_mapping_icd ON icd_drg_mappings(icd_code_id);
CREATE INDEX idx_mapping_drg ON icd_drg_mappings(drg_group_id);
CREATE INDEX idx_mapping_role ON icd_drg_mappings(role);
`);

console.log('✓ Schema created\n');

// ── Load ICD-10 codes ──────────────────────────────────

function parseSeedSql(sql: string) {
  const records: Array<{code: string; description: string; category_code: string}> = [];
  // Pattern: ('CODE', 'DESC', 'diagnosis', 'CAT')
  const re = /\('([^']+)',\s*'([^']*)',\s*'(\w+)',\s*'([^']*)'\)/g;
  let m;
  while ((m = re.exec(sql)) !== null) {
    const [, code, desc, , cat] = m;
    if (!code || !desc || desc.length < 2 || /^[\+\*]/.test(desc)) continue;
    records.push({ code, description: desc, category_code: cat });
  }
  return records;
}

const icdSql = fs.readFileSync(path.join(ROOT, 'supabase', 'seed_icd10_codes.sql'), 'utf-8');
let recs = parseSeedSql(icdSql);

// Deduplicate
const seen = new Set();
recs = recs.filter(r => { if (seen.has(r.code)) return false; seen.add(r.code); return true; });
console.log(`Parsed ${recs.length} unique ICD-10 codes`);

const ins = db.prepare(
  'INSERT OR IGNORE INTO icd_codes (code, description, type, category_code) VALUES (?, ?, ?, ?)'
);
const batch = db.transaction((rows: typeof recs) => {
  for (const r of rows) ins.run(r.code, r.description, 'diagnosis', r.category_code);
});

for (let i = 0; i < recs.length; i += 500) batch(recs.slice(i, i + 500));
console.log(`✓ ICD-10 codes imported (${recs.length})`);

// Populate FTS5 trigger
db.exec(`
CREATE TRIGGER ai_fts AFTER INSERT ON icd_codes BEGIN
  INSERT INTO icd_codes_fts(rowid, code, description) VALUES (new.id, new.code, new.description); END;
CREATE TRIGGER ad_fts AFTER DELETE ON icd_codes BEGIN
  DELETE FROM icd_codes_fts WHERE rowid = old.id; END;
CREATE TRIGGER au_fts AFTER UPDATE ON icd_codes BEGIN
  UPDATE icd_codes_fts SET code=new.code, description=new.description WHERE rowid=new.id; END;
`);
db.prepare("INSERT INTO icd_codes_fts(rowid, code, description) SELECT id, code, description FROM icd_codes").run();

// ── Load DRG groups ────────────────────────────────────

function parseDrgInserts(sql: string) {
  const res: Array<{drg_code: string; description: string; mdc_code: string|null; mdc_description: string|null; relative_weight: number; gmlos: number; drg_type: string}> = [];
  // Match each row in VALUES clauses: ('code', 'desc', 'mdc_code', 'mdc_desc', weight, gmlos, 'type')
  const re = /\(\s*'([^']+)',\s*'([^']*)',\s*'((?:MDC\s*\d+)|(?:NULL))',\s*'([^']*)',\s*([0-9.]+),\s*([0-9.]+),\s*'([^']+)'\)/g;
  let m;
  while ((m = re.exec(sql)) !== null) {
    res.push({
      drg_code: m[1], description: m[2],
      mdc_code: m[3] === 'NULL' ? null : m[3], mdc_description: m[4],
      relative_weight: parseFloat(m[5]), gmlos: parseFloat(m[6]),
      drg_type: m[7]
    });
  }
  return res;
}

const drgSql = fs.readFileSync(path.join(ROOT, 'mysql', 'seed_drg.sql'), 'utf-8');
const drgRecs = parseDrgInserts(drgSql);
console.log(`Loaded ${drgRecs.length} DRG groups`);

const drgIns = db.prepare(
  'INSERT OR IGNORE INTO drg_groups (drg_code, description, mdc_code, mdc_description, relative_weight, gmlos, drg_type) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
const drgBatch = db.transaction((rows: typeof drgRecs) => {
  for (const r of rows) drgIns.run(r.drg_code, r.description, r.mdc_code, r.mdc_description, r.relative_weight, r.gmlos, r.drg_type);
});
drgBatch(drgRecs);
console.log(`✓ DRG groups imported\n`);

// ── Generate mappings (pure JS) ────────────────────────

// Generic prefix-based mappings (from INSERT IGNORE rules in seed_drg.sql)
const genericMappings = [
  { patterns: ['I%'], drgCode: 'DRG F11C' },
  { patterns: ['J%'], drgCode: 'DRG E04C' },
  { patterns: ['A%', 'B%'], drgCode: 'DRG S03C' },
  { patterns: ['E%'], drgCode: 'DRG K03C' },
  { patterns: ['F%'], drgCode: 'DRG T03C' },
  { patterns: ['G%'], drgCode: 'DRG B05C' },
  { patterns: ['K%'], drgCode: 'DRG G03C' },
  { patterns: ['M%'], drgCode: 'DRG I04C' },
  { patterns: ['N%'], drgCode: 'DRG L04C' },
  { patterns: ['D%'], drgCode: 'DRG Q02C' },
  { patterns: ['S%', 'T%', 'V%', 'W%', 'X%', 'Y%'], drgCode: 'DRG V02C' },
  { patterns: ['Z%'], drgCode: 'DRG V02C' },
  { patterns: ['P%'], drgCode: 'DRG P02C' },
  { patterns: ['C%'], drgCode: 'DRG Q02C' },
];

// Overrides: (code pattern(s)) → target DRG code
const overrides = [
  { from: ["I50%", "I51.0", "I51.4"], to: 'DRG F06C' },          // Heart failure → F06C
  { from: ["I10%", "I11%", "I12%"], to: 'DRG F07B' },             // Hypertension → F07B
  { from: ["I21%", "I22%", "I25%"], to: 'DRG F08B' },             // CHD/Angina → F08B
  { from: ["I47%", "I48%", "I49%"], to: 'DRG F09C' },             // Arrhythmia → F09C
  { from: ["I63%", "I64%"], to: 'DRG F10B' },                      // Stroke → F10B
  { from: ["J44%"], to: 'DRG E03B' },                               // COPD → E03B
  { from: ["J15%", "J18%"], to: 'DRG E04B' },                       // Pneumonia → E04B
  { from: ["J45%"], to: 'DRG E06C' },                                 // Asthma → E06C
  { from: ["J96%"], to: 'DRG E07C' },                                 // Resp failure → E07C
  { from: ["E10%", "E11%", "E14%"], to: 'DRG K02B' },              // Diabetes → K02B
  { from: ["N17%", "N18%", "N19%"], to: 'DRG L03B' },              // Renal failure → L03B
  { from: ["N39%"], to: 'DRG L04C' },                                 // UTI → L04C
  { from: ["N20%"], to: 'DRG L05C' },                                 // Kidney stones → L05C
  { from: ["A40%", "A41%"], to: 'DRG S02B' },                        // Sepsis → S02B
  { from: ["M17%", "S72%"], to: 'DRG I04C' },                        // OA/Fracture → I04C
  { from: ["M48%"], to: 'DRG I05C' },                                  // Spinal → I05C
  { from: ["G40%"], to: 'DRG B05C' },                                   // Epilepsy → B05C
  { from: ["G43%"], to: 'DRG B06C' },                                   // Migraine → B06C
  { from: ["F20%"], to: 'DRG T01C' },                                   // Schizophrenia → T01C
  { from: ["F32%", "F33%"], to: 'DRG T02C' },                          // Mood disorder → T02C
  { from: ["K70%", "K72%", "K74%"], to: 'DRG H03C' },                // Liver → H03C
  { from: ["K80%"], to: 'DRG H04C' },                                     // Biliary → H04C
  { from: ["K85%"], to: 'DRG H05C' },                                     // Pancreatitis → H05C
  { from: ["K25%", "K26%", "K29%"], to: 'DRG G03C' },                // GI ulcer → G03C
  { from: ["K92%"], to: 'DRG G04C' },                                   // GI bleed → G04C
];

// MCC/CC role triggers
const mccPatterns = ['A40%', 'A41%', 'J96%', 'J80%', 'J81%', 'N18.6%', 'N17%', 'I50%', 'K72%', 'R57%'];
const ccPatterns  = ['E11%', 'I10%', 'I48%', 'N18.3%', 'N18.4%', 'J44%', 'E87%'];

const checkExists = db.prepare(
  'SELECT COUNT(*) cnt FROM icd_drg_mappings WHERE icd_code_id = ? AND drg_group_id = ? AND role = ?'
);
const addMapping = db.prepare(
  'INSERT OR IGNORE INTO icd_drg_mappings (icd_code_id, drg_group_id, role) VALUES (?, ?, ?)'
);
const updateRole = db.prepare(
  'UPDATE icd_drg_mappings SET role = ? WHERE id = ?'
);

function getDrgId(drgCode: string) {
  return db.prepare('SELECT id FROM drg_groups WHERE drg_code = ?').get(drgCode) as { id: number };
}

function matchCode(code: string, patterns: string[]) {
  for (const p of patterns) {
    if (p.endsWith('%')) {
      if (code.startsWith(p.slice(0, -1))) return true;
    } else {
      if (code === p) return true;
    }
  }
  return false;
}

let totalAdded = 0;

// Step 1: generic prefix mappings
for (const rule of genericMappings) {
  const drgInfo = getDrgId(rule.drgCode);
  if (!drgInfo) continue;

  // For each pattern, find matching codes
  for (const pat of rule.patterns) {
    if (!pat.endsWith('%')) {
      const codeRow = db.prepare('SELECT id FROM icd_codes WHERE code = ?').get(pat);
      if (codeRow) {
        const exists = checkExists.get(codeRow.id, drgInfo.id, 'principal_diagnosis');
        if (!exists.cnt) { addMapping.run(codeRow.id, drgInfo.id, 'principal_diagnosis'); totalAdded++; }
      }
      continue;
    }
    const prefix = pat.slice(0, -1);
    const matches = db.prepare('SELECT id FROM icd_codes WHERE code LIKE ? ESCAPE \'!\'').all(prefix + '%');
    for (const icd of matches) {
      const exists = checkExists.get(icd.id, drgInfo.id, 'principal_diagnosis');
      if (!exists.cnt) { addMapping.run(icd.id, drgInfo.id, 'principal_diagnosis'); totalAdded++; }
    }
  }
}
console.log(`After generics: ${totalAdded} mappings`);

// Step 2: apply overrides (replace drg_group_id for existing mappings)
for (const ov of overrides) {
  const newDrg = getDrgId(ov.to);
  if (!newDrg) continue;
  for (const pat of ov.from) {
    const matches = db.prepare('SELECT id FROM icd_codes WHERE code LIKE ? ESCAPE \'!\'').all(pat.replace('%', '!%'));
    for (const icd of matches) {
      // Find ALL existing mappings for this code
      const existing = db.prepare(
        'SELECT id FROM icd_drg_mappings WHERE icd_code_id = ? AND role = \'principal_diagnosis\' ORDER BY id DESC LIMIT 1'
      ).get(icd.id);
      if (existing) {
        updateRole.run(newDrg.id, existing.id);
      } else {
        addMapping.run(icd.id, newDrg.id, 'principal_diagnosis');
        totalAdded++;
      }
    }
  }
}
console.log(`After overrides: done`);

// Step 3: CC/MCC role assignments
const getMappingByCodeAndRole = db.prepare(
  `SELECT m.id FROM icd_drg_mappings m
   JOIN icd_codes c ON m.icd_code_id = c.id
   WHERE m.role = 'principal_diagnosis' AND c.code LIKE ?`
);

for (const pat of mccPatterns) {
  const mappings = db.prepare(`
    SELECT m.id FROM icd_drg_mappings m
    JOIN icd_codes c ON m.icd_code_id = c.id
    WHERE m.role = 'principal_diagnosis' AND c.code LIKE ? ESCAPE '!'
  `).all(pat.replace('%', '!%'));
  for (const m of mappings) updateRole.run('mcc', m.id);
}

for (const pat of ccPatterns) {
  const mappings = db.prepare(`
    SELECT m.id FROM icd_drg_mappings m
    JOIN icd_codes c ON m.icd_code_id = c.id
    WHERE m.role = 'principal_diagnosis' AND c.code LIKE ? ESCAPE '!'
  `).all(pat.replace('%', '!%'));
  for (const m of mappings) updateRole.run('cc', m.id);
}

// Final stats
const stats = db.prepare(`
  SELECT 'ICD Codes'   AS tbl, CAST(COUNT(*) AS TEXT) AS cnt FROM icd_codes
  UNION ALL SELECT 'DRG Groups', CAST(COUNT(*) AS TEXT) FROM drg_groups
  UNION ALL SELECT 'Mappings',   CAST(COUNT(*) AS TEXT) FROM icd_drg_mappings
`).all();

console.log('\n┌───────────────────────┐');
stats.forEach((s: { tbl: string; cnt: string }) => console.log(`│ ${(s.tbl as string).padEnd(20)} │ ${(s.cnt as string).padStart(8)} `));
console.log('└───────────────────────┘');

db.close();
console.log('\n✓ Done! DB file:', dbPath);
