// setup-db.cjs — Execute SQL migration and seed data via Supabase REST API
const { readFileSync } = require('fs');

const URL = 'https://yphswvqrivqjsvemtiab.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaHN3dnFyaXZxanN2ZW10aWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI2Mjc3NSwiZXhwIjoyMTAxODM4Nzc1fQ.KJdeaXhTMyqDJIU-BegZGAhUGpUGSm8a0q4MEsq4cdQ';

async function checkTables() {
  console.log('Checking existing tables...');
  for (const table of ['icd_codes', 'drg_groups', 'icd_drg_mappings']) {
    const r = await fetch(`${URL}/rest/v1/${table}?limit=0`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
    });
    if (r.ok) {
      const count = r.headers.get('content-range') || '';
      console.log(`  ✓ ${table} exists (${count})`);
    } else {
      const err = await r.json();
      console.log(`  ✗ ${table}: ${err.message}`);
    }
  }
}

async function execSql(sql) {
  // Supabase doesn't expose a raw SQL endpoint via REST.
  // We need the Management API which requires a Personal Access Token.
  // For now, print instructions.
  console.log('\n⚠ Cannot execute SQL via REST API directly.');
  console.log('Please run the SQL files in Supabase SQL Editor:');
  console.log('  1. https://app.supabase.com → Your Project → SQL Editor');
  console.log('  2. Run: supabase/migrations/001_initial_schema.sql');
  console.log('  3. Run: supabase/seed.sql');
}

async function main() {
  console.log('=== Supabase Database Setup ===\n');
  console.log(`Project: ${URL}\n`);
  await checkTables();
}

main().catch(console.error);
