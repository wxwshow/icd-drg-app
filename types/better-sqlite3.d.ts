// Minimal typings for better-sqlite3 (the package ships no types of its own).
declare module 'better-sqlite3' {
  namespace Database {
    interface Statement {
      all(...params: unknown[]): any[];
      get(...params: unknown[]): any;
      run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    }

    interface Database {
      prepare(sql: string): Statement;
      exec(sql: string): this;
      pragma(source: string): unknown;
      transaction<F extends (...args: any[]) => any>(fn: F): F;
      close(): this;
    }
  }

  interface DatabaseConstructor {
    new (filename: string, options?: Record<string, unknown>): Database.Database;
    (filename: string, options?: Record<string, unknown>): Database.Database;
  }

  const Database: DatabaseConstructor;
  export default Database;
}