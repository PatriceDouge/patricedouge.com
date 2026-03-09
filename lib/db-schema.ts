import { db } from "./db";

export async function ensureSchema() {
  await db.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS workout_statuses (
        date   TEXT PRIMARY KEY,
        status TEXT NOT NULL
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
}
