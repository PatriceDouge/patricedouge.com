import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db-schema";
import { isAdmin } from "@/lib/auth";
import type { CompletionStatus } from "@/lib/workouts";

export type WorkoutStatusRow = {
  status: CompletionStatus;
  category: string;
  label: string;
  summary: string;
  description: string;
  notes: string;
};

export async function GET() {
  await ensureSchema();
  const rows = await db.execute(
    "SELECT date, status, category, label, summary, description, notes FROM workout_statuses"
  );
  const statuses: Record<string, WorkoutStatusRow> = {};
  for (const row of rows.rows) {
    statuses[row.date as string] = {
      status: row.status as CompletionStatus,
      category: (row.category as string) ?? "",
      label: (row.label as string) ?? "",
      summary: (row.summary as string) ?? "",
      description: (row.description as string) ?? "",
      notes: (row.notes as string) ?? "",
    };
  }
  return NextResponse.json(statuses);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSchema();
  const { date, status, category, label, summary, description } =
    (await request.json()) as {
      date: string;
      status: CompletionStatus | null;
      category?: string;
      label?: string;
      summary?: string;
      description?: string;
    };

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  if (status === null) {
    // Clear status but preserve notes if any exist
    await db.execute({
      sql: "UPDATE workout_statuses SET status = '', category = '', label = '', summary = '', description = '' WHERE date = ?",
      args: [date],
    });
  } else {
    await db.execute({
      sql: `INSERT INTO workout_statuses (date, status, category, label, summary, description)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
              status = ?,
              category = ?,
              label = ?,
              summary = ?,
              description = ?`,
      args: [
        date,
        status,
        category ?? "",
        label ?? "",
        summary ?? "",
        description ?? "",
        status,
        category ?? "",
        label ?? "",
        summary ?? "",
        description ?? "",
      ],
    });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSchema();
  const { date, notes } = (await request.json()) as {
    date: string;
    notes: string;
  };

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  // Upsert: if row doesn't exist yet, create it with empty status placeholder
  await db.execute({
    sql: `INSERT INTO workout_statuses (date, status, notes)
          VALUES (?, '', ?)
          ON CONFLICT(date) DO UPDATE SET notes = ?`,
    args: [date, notes, notes],
  });

  return NextResponse.json({ ok: true });
}
