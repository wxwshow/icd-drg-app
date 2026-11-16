/**
 * SQLite database adapter — single-file local DB for ICD-DRG app.
 *
 * Local dev: opens ./data.db directly (WAL mode).
 * Serverless (Vercel/Lambda): the deployment bundle is read-only, so the
 * bundled DB is copied into the writable temp dir once per instance.
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import os from 'os';
import path from 'path';

let _db: Database.Database | null = null;

const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
);

function resolveDbPath(): string {
  const bundledPath = path.join(process.cwd(), 'data.db');

  if (!isServerless) return bundledPath;

  const tempPath = path.join(os.tmpdir(), 'icd-drg-data.db');
  if (!fs.existsSync(tempPath)) {
    if (!fs.existsSync(bundledPath)) {
      throw new Error(
        `data.db not found in deployment bundle (looked in ${bundledPath})`,
      );
    }
    fs.copyFileSync(bundledPath, tempPath);
  }
  return tempPath;
}

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(resolveDbPath());

  // Enable WAL mode for better concurrent read performance
  _db.pragma('journal_mode = WAL');
  // Set foreign keys ON
  _db.pragma('foreign_keys = ON');

  return _db;
}