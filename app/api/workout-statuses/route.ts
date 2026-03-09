import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db-schema";
import type { CompletionStatus } from "@/lib/workouts";

export async function GET() {
  await ensureSchema();
  const rows = await db.execute("SELECT date, status FROM workout_statuses");
  const statuses: Record<string, CompletionStatus> = {};
  for (const row of rows.rows) {
    statuses[row.date as string] = row.status as CompletionStatus;
  }
  return NextResponse.json(statuses);
}

export async function PUT(request: Request) {
  await ensureSchema();
  const { date, status } = (await request.json()) as {
    date: string;
    status: CompletionStatus | null;
  };

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }

  if (status === null) {
    await db.execute({ sql: "DELETE FROM workout_statuses WHERE date = ?", args: [date] });
  } else {
    await db.execute({
      sql: "INSERT INTO workout_statuses (date, status) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET status = ?",
      args: [date, status, status],
    });
  }

  return NextResponse.json({ ok: true });
}
