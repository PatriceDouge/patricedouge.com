import { db } from "./db";

export async function ensureSchema() {
  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS workout_statuses (
        date        TEXT PRIMARY KEY,
        status      TEXT NOT NULL,
        category    TEXT DEFAULT '',
        label       TEXT DEFAULT '',
        summary     TEXT DEFAULT '',
        description TEXT DEFAULT '',
        notes       TEXT DEFAULT ''
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS lift_sets (
        date      TEXT NOT NULL,
        exercise  TEXT NOT NULL,
        set_index INTEGER NOT NULL,
        weight    TEXT NOT NULL DEFAULT '',
        reps      TEXT NOT NULL DEFAULT '',
        PRIMARY KEY (date, exercise, set_index)
      )`,
      args: [],
    },
  ]);

  // Migrations for existing DBs — SQLite errors on duplicate ADD COLUMN, so catch and ignore
  const newColumns = ["category", "label", "summary", "description", "notes"];
  for (const col of newColumns) {
    try {
      await db.execute({
        sql: `ALTER TABLE workout_statuses ADD COLUMN ${col} TEXT DEFAULT ''`,
        args: [],
      });
    } catch {
      // column already exists — ignore
    }
  }
}
