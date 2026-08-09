// check-db.cjs — Check Supabase database tables
const { createClient } = require('@supabase/supabase-js');

const URL = 'https://yphswvqrivqjsvemtiab.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaHN3dnFyaXZxanN2ZW10aWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjI2Mjc3NSwiZXhwIjoyMTAxODM4Nzc1fQ.KJdeaXhTMyqDJIU-BegZGAhUGpUGSm8a0q4MEsq4cdQ';

const supabase = createClient(URL, KEY);

async function main() {
  // Try querying each table
  for (const table of ['icd_codes', 'drg_groups', 'icd_drg_mappings']) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`${table}: NOT FOUND — ${error.message}`);
    } else {
      console.log(`${table}: EXISTS — ${count} rows`);
    }
  }
}

main().catch(console.error);
