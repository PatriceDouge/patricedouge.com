import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSchema } from "@/lib/db-schema";
import { isAdmin } from "@/lib/auth";
import type { SetLog } from "@/lib/workouts";

export async function GET(request: Request) {
  await ensureSchema();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date query param is required" }, { status: 400 });
  }

  const rows = await db.execute({
    sql: "SELECT exercise, set_index, weight, reps FROM lift_sets WHERE date = ? ORDER BY exercise, set_index",
    args: [date],
  });

  const logs: Record<string, SetLog[]> = {};
  for (const row of rows.rows) {
    const exercise = row.exercise as string;
    if (!logs[exercise]) logs[exercise] = [];
    const setIndex = row.set_index as number;
    // Fill gaps if needed
    while (logs[exercise].length <= setIndex) {
      logs[exercise].push({ weight: "", reps: "" });
    }
    logs[exercise][setIndex] = {
      weight: row.weight as string,
      reps: row.reps as string,
    };
  }

  return NextResponse.json(logs);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSchema();
  const { date, exercise, setIndex, field, value } = (await request.json()) as {
    date: string;
    exercise: string;
    setIndex: number;
    field: "weight" | "reps";
    value: string;
  };

  if (!date || !exercise || setIndex == null || !field) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Read existing row to preserve the other field
  const existing = await db.execute({
    sql: "SELECT weight, reps FROM lift_sets WHERE date = ? AND exercise = ? AND set_index = ?",
    args: [date, exercise, setIndex],
  });

  const current = existing.rows[0];
  const weight = field === "weight" ? value : (current?.weight as string) ?? "";
  const reps = field === "reps" ? value : (current?.reps as string) ?? "";

  await db.execute({
    sql: "INSERT INTO lift_sets (date, exercise, set_index, weight, reps) VALUES (?, ?, ?, ?, ?) ON CONFLICT(date, exercise, set_index) DO UPDATE SET weight = ?, reps = ?",
    args: [date, exercise, setIndex, weight, reps, weight, reps],
  });

  return NextResponse.json({ ok: true });
}
