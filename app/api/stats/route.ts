import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlite-db';

export async function GET() {
  try {
    const db = getDb();

    const count = (table: string, type?: string) => {
      let sql = `SELECT COUNT(*) cnt FROM ${table}`;
      const params: any[] = [];
      if (type) {
        sql += ` WHERE type = ?`;
        params.push(type);
      }
      return db.prepare(sql).get(...params)?.cnt ?? 0;
    };

    const diagnosis = count('icd_codes', 'diagnosis');
    const procedure = count('icd_codes', 'procedure');
    const drgGroups = count('drg_groups');
    const mappings = count('icd_drg_mappings');

    return NextResponse.json({ diagnosis, procedure, drgGroups, mappings });
  } catch (err) {
    console.error('Stats error:', err);
    return NextResponse.json(
      { diagnosis: 0, procedure: 0, drgGroups: 0, mappings: 0 },
      { status: 500 }
    );
  }
}
