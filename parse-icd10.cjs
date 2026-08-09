// parse-icd10.cjs — Parse ICD-10 codes from extracted PDF text
// Outputs a clean SQL seed file for Supabase

const { readFileSync, writeFileSync } = require('fs');

const raw = readFileSync('D:/icd10_full_text.txt', 'utf-8');

// Remove page headers/footers
const cleaned = raw
  .replace(/第 \d+ 页，共 \d+ 页\n/g, '')
  .replace(/章 章代码\n范围 章的名称 节代码范\n围 节名称 \t类目代码 \t类目名称 \t亚目代码 \t亚目名称 \t诊断代码 \t诊断名称\n/g, '')
  .replace(/ICD-10医保2\.0版\n/g, '')
  .replace(/-- \d+ of \d+ --\n/g, '');

// ICD-10 diagnosis code regex
const CODE_RE = /([A-TV-Z][0-9]{2}\.[0-9]{3}(?:x[0-9]{3})?(?:[\+\*][A-Z][0-9]{2}\.[0-9]{1,3}[\*]?)?)/g;

// Find all codes with their positions
const matches = [];
let match;
while ((match = CODE_RE.exec(cleaned)) !== null) {
  matches.push({ code: match[1], index: match.index });
}

console.log(`Found ${matches.length} total code occurrences`);

// Process each code match to extract the diagnosis name
const records = new Map();

for (let i = 0; i < matches.length; i++) {
  const { code, index } = matches[i];

  // Get the base code (strip dagger/asterisk suffix like +J17.0*)
  const baseCode = code.replace(/[\+\*].*$/, '');

  // Find the diagnosis name: text right after the code, until tab/newline
  let pos = index + code.length;

  // Skip whitespace after code
  while (pos < cleaned.length && /[\t\n ]/.test(cleaned[pos])) pos++;

  // Collect name characters until we hit a tab or a structural break
  let nameEnd = pos;
  while (nameEnd < cleaned.length) {
    const ch = cleaned[nameEnd];
    if (ch === '\t') break;
    if (ch === '\n') {
      // Look ahead: stop if next line is a new record or another code
      const peek = cleaned.substring(nameEnd + 1, nameEnd + 20);
      if (/^\d{1,2}\t[A-Z]/.test(peek)) break;   // New record: chapter num + code range
      if (/^[A-Z]\d{2}\.[0-9]/.test(peek.trim())) break; // Next code
    }
    nameEnd++;
  }

  let name = cleaned.substring(pos, nameEnd)
    .replace(/\n/g, '')
    .replace(/\t/g, ' ')
    .trim();

  // Clean up trailing contamination
  // Remove trailing digits (chapter number leak: "霍乱1" → "霍乱")
  name = name.replace(/\d{1,2}$/, '');
  // Remove trailing dots/whitespace
  name = name.replace(/[.\s]+$/, '');
  // Also handle case like "name22" where 22 is chapter number
  name = name.replace(/(\D)(1[0-9]|2[0-2]|\d)$/, '$1');
  // Remove trailing dots/whitespace again
  name = name.replace(/[.\s]+$/, '');

  if (!name || name.length < 2) continue;

  // For codes with dagger/asterisk suffix, prepend the combined info
  const daggerMatch = code.match(/\+([A-Z][0-9]{2}\.[0-9]{1,3})\*?/);
  const asteriskMatch = code.match(/([A-Z][0-9]{2}\.[0-9]{1,3})\*/);
  let fullName = name;

  if (daggerMatch && !name.startsWith('+')) {
    fullName = `(+${daggerMatch[1]}*) ${name}`;
  } else if (asteriskMatch && !name.startsWith('*')) {
    fullName = `(*${asteriskMatch[1]}) ${name}`;
  }

  // Only keep unique base codes (prefer longer names)
  if (!records.has(baseCode) || name.length > records.get(baseCode).length) {
    records.set(baseCode, fullName);
  }
}

console.log(`Unique codes: ${records.size}`);

// ============================================================
// Generate SQL
// ============================================================
const entries = Array.from(records.entries())
  .sort(([a], [b]) => a.localeCompare(b));

// Batch INSERT
const BATCH_SIZE = 100;
const allSql = [];
for (let i = 0; i < entries.length; i += BATCH_SIZE) {
  const batch = entries.slice(i, i + BATCH_SIZE);
  const values = batch.map(([code, name]) => {
    const safeName = name.replace(/'/g, "''");
    const catCode = code.substring(0, 3);
    return `('${code}', '${safeName}', 'diagnosis', '${catCode}')`;
  });
  allSql.push(
    `INSERT INTO icd_codes (code, description, type, category_code) VALUES\n  ${values.join(',\n  ')};`
  );
}

// Full SQL file
const header = [
  '-- Auto-generated from ICD-10医保2.0版.pdf',
  `-- Generated: ${new Date().toISOString()}`,
  `-- Total unique codes: ${records.size}`,
  '-- ============================================================',
  '-- Clear existing data first (optional)',
  '-- DELETE FROM icd_codes WHERE type = \'diagnosis\';',
  '-- ============================================================',
  '',
].join('\n');

const output = header + '\n' + allSql.join('\n\n') + '\n';

writeFileSync('D:/1cursor/icd-drg-app/supabase/seed_icd10_codes.sql', output, 'utf-8');
console.log(`\nSQL written: supabase/seed_icd10_codes.sql`);
console.log(`Size: ${(output.length / 1024 / 1024).toFixed(2)} MB`);

// Show samples
const samples = [
  ...entries.slice(0, 5),
  ...entries.slice(Math.floor(entries.length / 4), Math.floor(entries.length / 4) + 3),
  ...entries.slice(Math.floor(entries.length / 2), Math.floor(entries.length / 2) + 3),
  ...entries.slice(-5),
];
console.log(`\n=== Sample codes (${entries.length} total) ===`);
samples.forEach(([code, name]) => console.log(`  ${code}  ${name}`));

// Chapter stats
const chapterCounts = {};
for (const [code] of entries) {
  const ch = code.charAt(0);
  chapterCounts[ch] = (chapterCounts[ch] || 0) + 1;
}
console.log(`\n=== Per-letter counts ===`);
Object.entries(chapterCounts).sort().forEach(([ch, n]) => {
  console.log(`  ${ch}: ${n}`);
});
