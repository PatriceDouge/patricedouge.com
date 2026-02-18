export type WorkoutCategory = "run" | "lift" | "race";
export type CompletionStatus = "completed" | "partial" | "missed";

export interface Workout {
  date: string;
  category: WorkoutCategory;
  label: string;
  summary: string;
  description: string;
}

export interface TrainingWeek {
  label: string;
  start: string;
  end: string;
  miles: string;
  note?: string;
}

export const trainingWeeks: TrainingWeek[] = [
  { label: "Re-entry", start: "2026-02-12", end: "2026-02-15", miles: "19–23" },
  { label: "W1", start: "2026-02-16", end: "2026-02-22", miles: "38–42" },
  { label: "W2", start: "2026-02-23", end: "2026-03-01", miles: "39–44" },
  { label: "W3", start: "2026-03-02", end: "2026-03-08", miles: "30–40", note: "10K Race — Sat 3/7" },
  { label: "W4", start: "2026-03-09", end: "2026-03-15", miles: "35–41", note: "Recover + Rebuild" },
  { label: "W5", start: "2026-03-16", end: "2026-03-22", miles: "30–40", note: "Half Marathon — Sat 3/21" },
  { label: "W6", start: "2026-03-23", end: "2026-03-29", miles: "38–44", note: "Rebuild" },
  { label: "W7", start: "2026-03-30", end: "2026-04-05", miles: "41–47", note: "Build" },
  { label: "W8", start: "2026-04-06", end: "2026-04-12", miles: "39–45", note: "10-Miler Sharpening" },
  { label: "W9", start: "2026-04-13", end: "2026-04-19", miles: "30–40", note: "10-Miler — Sat 4/18" },
];

// [date, category, label, summary, description]
const data: [string, WorkoutCategory, string, string, string][] = [
  // Re-entry (Thu Feb 12 – Sun Feb 15)
  ["2026-02-12", "run", "Easy + Strides", "6–7mi easy, 6×20s strides", "6–7 easy + 6×20s strides"],
  ["2026-02-13", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup (light)"],
  ["2026-02-14", "run", "Easy Run", "8–10mi easy", "8–10 easy (last 10 min steady optional)"],
  ["2026-02-15", "run", "Easy Run", "5–6mi easy", "5–6 easy"],
  // W1 (Feb 16–22)
  ["2026-02-16", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise"],
  ["2026-02-17", "run", "Run Q1", "10–12mi · 5–6×1mi sub-T", "10–12 mi · WU → 5–6×1 mi sub-T / 60–75s jog → CD"],
  ["2026-02-18", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps"],
  ["2026-02-19", "run", "Run Q2", "9–10mi · 10×2:00 sub-T", "9–10 mi · WU → 10×2:00 sub-T / 1:00 easy → CD"],
  ["2026-02-20", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup"],
  ["2026-02-21", "run", "Long Run", "12–13mi easy", "12–13 easy"],
  ["2026-02-22", "run", "Easy + Strides", "7–8mi easy + strides", "7–8 easy + strides"],
  // W2 (Feb 23 – Mar 1)
  ["2026-02-23", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise"],
  ["2026-02-24", "run", "Run Q1", "11–12mi · 3×2mi sub-T", "11–12 mi · WU → 3×2 mi sub-T / 2:00 jog → CD"],
  ["2026-02-25", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps"],
  ["2026-02-26", "run", "Run Q2", "9–10mi · 4×4:00 strong", "9–10 mi · WU → 4×4:00 strong / 2:00 jog → CD"],
  ["2026-02-27", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup"],
  ["2026-02-28", "run", "Long Run", "12–14mi easy", "12–14 easy"],
  ["2026-03-01", "run", "Easy + Strides", "7–8mi easy + strides", "7–8 easy + strides"],
  // W3 (Mar 2–8) — 10K race Sat 3/7
  ["2026-03-02", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise (normal)"],
  ["2026-03-03", "run", "Run Q", "10–11mi · 4×1mi sub-T", "10–11 mi · WU → 4×1 mi sub-T / 75s jog → CD"],
  ["2026-03-04", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps (moderate)"],
  ["2026-03-05", "run", "Easy + Strides", "6–8mi easy, 4–6 strides", "6–8 easy + 4–6 strides (light)"],
  ["2026-03-06", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup (light / skip legs)"],
  ["2026-03-07", "race", "RACE: 10K", "10K Race Day", "10K Race"],
  ["2026-03-08", "run", "Recovery", "3–5mi very easy / off", "3–5 very easy or off"],
  // W4 (Mar 9–15) — recover + rebuild
  ["2026-03-09", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise (light/mod)"],
  ["2026-03-10", "run", "Easy + Strides", "7–9mi easy + strides", "7–9 easy + strides"],
  ["2026-03-11", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps"],
  ["2026-03-12", "run", "Run Q2", "9–10mi · 5–6×1mi sub-T", "9–10 mi · WU → 5–6×1 mi sub-T / 60–75s jog → CD"],
  ["2026-03-13", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup"],
  ["2026-03-14", "run", "Long Run", "12–14mi easy", "12–14 easy"],
  ["2026-03-15", "run", "Easy Run", "7–8mi easy", "7–8 easy"],
  // W5 (Mar 16–22) — Half Marathon race Sat 3/21
  ["2026-03-16", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise (normal)"],
  ["2026-03-17", "run", "Run Q", "10–11mi · 3×2mi sub-T", "10–11 mi · WU → 3×2 mi sub-T / 2:00 jog → CD"],
  ["2026-03-18", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps (moderate)"],
  ["2026-03-19", "run", "Easy + Strides", "6–8mi easy, 4–6 strides", "6–8 easy + 4–6 strides (light)"],
  ["2026-03-20", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup (light / skip legs)"],
  ["2026-03-21", "race", "RACE: Half", "Half Marathon", "Half Marathon"],
  ["2026-03-22", "run", "Recovery", "3–5mi very easy / off", "3–5 very easy or off"],
  // W6 (Mar 23–29) — rebuild
  ["2026-03-23", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise (light/mod)"],
  ["2026-03-24", "run", "Run Q1", "10–12mi · 5–6×1mi sub-T", "10–12 mi · WU → 5–6×1 mi sub-T / 60–75s jog → CD"],
  ["2026-03-25", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps"],
  ["2026-03-26", "run", "Run Q2", "9–10mi · 4×4:00 strong", "9–10 mi · WU → 4×4:00 strong / 2:00 jog → CD"],
  ["2026-03-27", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup"],
  ["2026-03-28", "run", "Long Run", "12–14mi easy", "12–14 easy"],
  ["2026-03-29", "run", "Easy + Strides", "7–8mi easy + strides", "7–8 easy + strides"],
  // W7 (Mar 30 – Apr 5) — build
  ["2026-03-30", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise"],
  ["2026-03-31", "run", "Run Q1", "11–12mi · 4×2mi sub-T", "11–12 mi · WU → 4×2 mi sub-T / 2:00 jog → CD"],
  ["2026-04-01", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps"],
  ["2026-04-02", "run", "Run Q2", "9–10mi · 6×1mi sub-T", "9–10 mi · WU → 6×1 mi sub-T / 60–75s jog → CD"],
  ["2026-04-03", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup"],
  ["2026-04-04", "run", "Long Run", "14–16mi easy", "14–16 easy (last 2–3 mi steady optional)"],
  ["2026-04-05", "run", "Easy + Strides", "7–9mi easy + strides", "7–9 easy + strides"],
  // W8 (Apr 6–12) — 10-miler sharpening
  ["2026-04-06", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise"],
  ["2026-04-07", "run", "Run Q1", "11–12mi · 3×2+2×1mi sub-T", "11–12 mi · WU → 3×2 mi sub-T + 2×1 mi sub-T / short jog → CD"],
  ["2026-04-08", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps"],
  ["2026-04-09", "run", "Run Q2", "9–10mi · 6×4:00 strong", "9–10 mi · WU → 6×4:00 strong / 2:00 jog → CD"],
  ["2026-04-10", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup"],
  ["2026-04-11", "run", "Long Run", "12–14mi easy", "12–14 easy"],
  ["2026-04-12", "run", "Easy + Strides", "7–9mi easy + strides", "7–9 easy + strides"],
  // W9 (Apr 13–19) — 10-Miler race Sat 4/18
  ["2026-04-13", "lift", "Lift A", "Squat · Bench · Pull-Ups", "Squat · Bench · Pull-Ups · SS: Shoulder Press / Lat Raise (normal)"],
  ["2026-04-14", "run", "Run Q", "10–11mi · 3×2mi sub-T", "10–11 mi · WU → 3×2 mi sub-T / 2:00 jog → CD"],
  ["2026-04-15", "lift", "Lift B", "RDL · OHP · DB Row", "RDL · OHP · DB Row · SS: Curl / Band Triceps (moderate)"],
  ["2026-04-16", "run", "Easy + Strides", "6–8mi easy, 4–6 strides", "6–8 easy + 4–6 strides (light)"],
  ["2026-04-17", "lift", "Lift C", "Split Squat · Dips · Chin-Ups", "BSS · Dips · Chin-Ups · Sandbag Pickup (light / skip legs)"],
  ["2026-04-18", "race", "RACE: 10-Mi", "10-Miler Race Day", "10-Miler Race"],
  ["2026-04-19", "run", "Recovery", "3–5mi very easy / off", "3–5 very easy or off"],
];

const workoutMap = new Map<string, Workout>();
for (const [date, category, label, summary, description] of data) {
  workoutMap.set(date, { date, category, label, summary, description });
}

export function getWorkout(dateStr: string): Workout | undefined {
  return workoutMap.get(dateStr);
}

export function getTrainingWeek(dateStr: string): TrainingWeek | undefined {
  return trainingWeeks.find((w) => dateStr >= w.start && dateStr <= w.end);
}

// --- Lift templates ---

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rir?: string;
}

export interface ExerciseGroup {
  type: "single" | "superset";
  exercises: Exercise[];
}

export interface LiftTemplate {
  key: string;
  title: string;
  groups: ExerciseGroup[];
}

export interface SetLog {
  weight: string;
  reps: string;
}

export type LiftLogs = Record<string, Record<string, SetLog[]>>;
// { "2026-02-16": { "Back Squat": [{ weight: "185", reps: "6" }, ...] } }

export const liftTemplates: Record<string, LiftTemplate> = {
  A: {
    key: "A",
    title: "Squat + Push + Pull",
    groups: [
      { type: "single", exercises: [{ name: "Back Squat", sets: 5, reps: "5–8", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Bench Press (BB or DB)", sets: 5, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Pull-Ups", sets: 5, reps: "6–10", rir: "1–2" }] },
      {
        type: "superset",
        exercises: [
          { name: "DB Shoulder Press", sets: 2, reps: "15–20" },
          { name: "DB Lateral Raise", sets: 2, reps: "15–20" },
        ],
      },
    ],
  },
  B: {
    key: "B",
    title: "Hinge + Vertical Push + Row",
    groups: [
      { type: "single", exercises: [{ name: "Romanian Deadlift", sets: 5, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Overhead Press", sets: 5, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "One-Arm DB Row", sets: 5, reps: "10–15", rir: "1–2" }] },
      {
        type: "superset",
        exercises: [
          { name: "DB Curl", sets: 2, reps: "10–15" },
          { name: "Band Triceps", sets: 2, reps: "10–15" },
        ],
      },
    ],
  },
  C: {
    key: "C",
    title: "Unilateral Lower + Upper Accessories",
    groups: [
      { type: "single", exercises: [{ name: "Bulgarian Split Squat", sets: 5, reps: "8–12 / leg", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Weighted Dips", sets: 5, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Chin-Ups or Band Pulldown", sets: 5, reps: "8–12", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Sandbag Pickup", sets: 2, reps: "8–10" }] },
    ],
  },
};

export function getLiftTemplate(label: string): LiftTemplate | undefined {
  const match = label.match(/Lift ([ABC])/);
  return match ? liftTemplates[match[1]] : undefined;
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
