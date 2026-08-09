// init-db.ts — One-shot script to initialize Supabase database
// Run: npx tsx init-db.ts

import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PROJECT_REF = 'yphswvqrivqjsvemtiab';

// Supabase direct connection (service_role key acts as password for postgres user)
const client = new Client({
  host: `db.${PROJECT_REF}.supabase.co`,
  port: 5432,
  user: 'postgres',
  password: SERVICE_ROLE_KEY,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

async function runSql(filePath: string) {
  const sql = readFileSync(filePath, 'utf-8');
  console.log(`▶ Executing: ${filePath} (${sql.length} chars)`);
  await client.query(sql);
  console.log(`✓ Done: ${filePath}`);
}

async function main() {
  try {
    await client.connect();
    console.log('✓ Connected to Supabase PostgreSQL\n');

    // 1. Run migration (create tables + indexes)
    await runSql(join(__dirname, 'supabase', 'migrations', '001_initial_schema.sql'));

    // 2. Run seed data
    await runSql(join(__dirname, 'supabase', 'seed.sql'));

    console.log('\n🎉 Database initialized successfully!');

    // Verify row counts
    const { rows: counts } = await client.query(`
      SELECT
        (SELECT count(*) FROM icd_codes) AS icd_codes,
        (SELECT count(*) FROM drg_groups) AS drg_groups,
        (SELECT count(*) FROM icd_drg_mappings) AS mappings
    `);
    console.log(
      `\n📊 Data loaded: ${counts[0].icd_codes} ICD codes, ${counts[0].drg_groups} DRG groups, ${counts[0].mappings} mappings`
    );

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
