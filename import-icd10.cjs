// import-icd10.cjs — Batch import ICD-10 codes via Supabase REST API
const { readFileSync } = require('fs');

const URL = 'https://yphswvqrivqjsvemtiab.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaHN3dnFyaXZxanN2ZW10aWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI2Mjc3NSwiZXhwIjoyMTAxODM4Nzc1fQ.KJdeaXhTMyqDJIU-BegZGAhUGpUGSm8a0q4MEsq4cdQ';

function cleanCode(code) {
  // Strip dagger/asterisk suffix like +J17.0* or +K77.0*
  return code.replace(/[\+\*].*$/, '').trim();
}

function cleanDescription(desc) {
  // Remove trailing chapter number contamination
  return desc.replace(/\d{1,2}$/, '').replace(/[.\s]+$/, '').trim();
}

function parseInserts(sql) {
  const records = [];
  const re = /\('([^']+)',\s*'([^']+)',\s*'diagnosis',\s*'([^']+)'\)/g;
  let m;
  while ((m = re.exec(sql)) !== null) {
    const rawCode = m[1];
    const rawDesc = m[2];
    const code = cleanCode(rawCode);
    const desc = cleanDescription(rawDesc);
    if (code && desc && desc.length >= 2 && !desc.match(/^[\+\*]/)) {
      records.push({
        code,
        description: desc,
        type: 'diagnosis',
        category_code: code.substring(0, 3),
      });
    }
  }
  return records;
}

async function insertBatch(records) {
  const res = await fetch(`${URL}/rest/v1/icd_codes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(records),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err.substring(0, 300)}`);
  }
}

async function main() {
  console.log('Reading SQL file...');
  const sql = readFileSync('D:/1cursor/icd-drg-app/supabase/seed_icd10_codes.sql', 'utf-8');
  const records = parseInserts(sql);
  console.log(`Parsed ${records.length} records`);

  // Deduplicate by code
  const seen = new Set();
  const unique = [];
  for (const r of records) {
    if (!seen.has(r.code)) {
      seen.add(r.code);
      unique.push(r);
    }
  }
  console.log(`After dedup: ${unique.length} unique codes`);

  // Show some samples
  console.log('\nSample records:');
  unique.slice(0, 5).forEach(r => console.log(`  ${r.code}  ${r.description}`));
  unique.slice(-3).forEach(r => console.log(`  ${r.code}  ${r.description}`));

  const BATCH = 500;
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < unique.length; i += BATCH) {
    const batch = unique.slice(i, i + BATCH);
    try {
      await insertBatch(batch);
      imported += batch.length;
      const pct = ((imported / unique.length) * 100).toFixed(1);
      process.stdout.write(`\r  Imported ${imported}/${unique.length} (${pct}%)`);
    } catch (e) {
      console.error(`\nBatch error at ${i}: ${e.message}`);
      errors++;
      if (errors > 5) {
        console.error('Too many errors, stopping.');
        break;
      }
    }
  }

  console.log(`\n\nDone! ${imported} of ${unique.length} records imported.`);
}

main().catch(console.error);
