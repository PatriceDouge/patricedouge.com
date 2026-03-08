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
  { label: "W1", start: "2026-03-09", end: "2026-03-15", miles: "44", note: "Rebuild + heat-adjusted effort" },
  { label: "W2", start: "2026-03-16", end: "2026-03-22", miles: "43–45", note: "Half Marathon — Sat 3/21" },
  { label: "W3", start: "2026-03-23", end: "2026-03-29", miles: "46–48", note: "Post-race rebuild" },
  { label: "W4", start: "2026-03-30", end: "2026-04-05", miles: "49–51", note: "Build" },
  { label: "W5", start: "2026-04-06", end: "2026-04-12", miles: "50–53", note: "10-Miler specific" },
  { label: "W6", start: "2026-04-13", end: "2026-04-19", miles: "44–47", note: "10-Miler — Sat 4/18" },
  { label: "W7", start: "2026-04-20", end: "2026-04-26", miles: "46–49", note: "Half Marathon — Sun 4/26" },
];

// [date, category, label, summary, description]
const data: [string, WorkoutCategory, string, string, string][] = [
  // W1 (Mar 9–15)
  ["2026-03-09", "run", "LT1", "7mi total · 5×6:00 @ LT1", "1 mi WU + drills/strides, 5×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-03-10", "run", "Easy + Lift A", "6mi easy + Lift A", "6 mi easy (8:55–9:45/mi). PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-03-11", "run", "LT2", "7mi total · 4×1mi @ T", "1 mi WU, 4×1 mi @ T (7:20–7:35/mi) w/75s jog, 1 mi CD, easy to 7 total."],
  ["2026-03-12", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-03-13", "run", "Easy Run", "6mi easy", "6 mi easy (last 10–15 min steady optional at 8:05–8:40/mi)."],
  ["2026-03-14", "run", "Long Run", "10mi long easy", "10 mi long run at easy effort; keep first 8 mi relaxed, finish steady only if smooth."],
  ["2026-03-15", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C: Bulgarian Split Squat · Dips · Chin-Ups/Pulldown · Sandbag Pickup."],
  // W2 (Mar 16–22) — Half Marathon race Sat 3/21
  ["2026-03-16", "run", "LT1", "6.5mi total · 4×6:00 @ LT1", "1 mi WU + drills, 4×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 6.5 total."],
  ["2026-03-17", "run", "Easy + Lift A", "5mi easy + Lift A", "5 mi easy (8:55–9:45/mi). PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-03-18", "run", "LT2", "6.5mi total · 4mi @ HM", "1 mi WU, 4 mi continuous @ HM effort (7:15–7:25/mi), 1 mi CD, easy to 6.5 total."],
  ["2026-03-19", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy + 4×20s strides. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-03-20", "run", "Shakeout + Strides", "3.5mi easy + strides", "3.5 mi easy + 4×20s strides; keep legs fresh."],
  ["2026-03-21", "race", "RACE: Half", "15mi total · WU + Half + CD", "1.5 mi WU + drills/strides, Half Marathon race, 0.4–1 mi CD."],
  ["2026-03-22", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi very easy recovery (9:30–10:30+/mi). PM Lift C light/moderate or skip legs if needed."],
  // W3 (Mar 23–29)
  ["2026-03-23", "run", "LT1", "8mi total · 4×8:00 @ LT1", "1 mi WU + drills, 4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8 total."],
  ["2026-03-24", "run", "Easy + Lift A", "6mi easy + Lift A", "6 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-03-25", "run", "LT2", "8mi total · 5×1mi @ T", "1 mi WU, 5×1 mi @ T (7:20–7:35/mi) w/75s jog, 1 mi CD, easy to 8 total."],
  ["2026-03-26", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-03-27", "run", "Easy Run", "6mi easy", "6 mi easy (8:55–9:45/mi)."],
  ["2026-03-28", "run", "Long Run", "11mi long easy", "11 mi long run easy; last 2 mi steady optional if you feel good."],
  ["2026-03-29", "run", "Recovery + Lift C", "3.5mi recovery + Lift C", "3.5 mi recovery (9:30–10:30+/mi). PM Lift C light/moderate."],
  // W4 (Mar 30–Apr 5)
  ["2026-03-30", "run", "LT1", "8.5mi total · 3×10:00 @ LT1", "1 mi WU + drills, 3×10:00 @ LT1 (7:45–8:05/mi) w/2:00 jog, 1 mi CD, easy to 8.5 total."],
  ["2026-03-31", "run", "Easy + Lift A", "6.5mi easy + Lift A", "6.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-01", "run", "LT2", "9mi total · 2×2mi + 1×1mi @ HM/T", "1 mi WU, 2×2 mi + 1×1 mi @ HM/T (7:15–7:30/mi) w/2:30 jog, 1 mi CD, easy to 9 total."],
  ["2026-04-02", "run", "Easy + Lift B", "5.5mi easy + Lift B", "5.5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-03", "run", "Easy/Steady", "7mi easy, steady finish", "7 mi easy with last 15–20 min steady (8:05–8:40/mi)."],
  ["2026-04-04", "run", "Long Run", "11mi long, last 3 steady", "11 mi long run: keep easy early, finish last 3 mi at steady effort."],
  ["2026-04-05", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C light/moderate."],
  // W5 (Apr 6–12) — 10-miler specific
  ["2026-04-06", "run", "LT1", "9mi total · 4×8:00 @ LT1", "1 mi WU + drills, 4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 9 total."],
  ["2026-04-07", "run", "Easy + Lift A", "6.5mi easy + Lift A", "6.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-08", "run", "LT2", "9.5mi total · 3×2mi @ HM", "1 mi WU, 3×2 mi @ HM effort (7:15–7:25/mi) w/3:00 jog, 1 mi CD, easy to 9.5 total."],
  ["2026-04-09", "run", "Easy + Lift B", "5.5mi easy + Lift B", "5.5 mi easy + 4–6×20s strides. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-10", "run", "Easy Run", "7mi easy", "7 mi easy (8:55–9:45/mi)."],
  ["2026-04-11", "run", "Long Run", "11.5mi w/ 2×2mi @ 10M", "11.5 mi total: 6–7 mi easy, then 2×2 mi @ 10M goal pace (7:05–7:15/mi) w/3:00 easy, finish easy."],
  ["2026-04-12", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C light/moderate."],
  // W6 (Apr 13–19) — 10-Miler race Sat 4/18
  ["2026-04-13", "run", "LT1", "8mi total · 3×8:00 @ LT1", "1 mi WU + drills, 3×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8 total."],
  ["2026-04-14", "run", "Easy + Lift A", "5.5mi easy + Lift A", "5.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-15", "run", "LT2", "7.5mi total · 5×4:00 @ T", "1 mi WU, 5×4:00 @ T (7:20–7:35/mi) w/90s jog, 1 mi CD, easy to 7.5 total."],
  ["2026-04-16", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-17", "run", "Shakeout + Strides", "3.5mi easy + strides", "3.5 mi easy + 4×20s strides; stay relaxed for race day."],
  ["2026-04-18", "race", "RACE: 10-Mi", "12mi total · WU + 10M + CD", "1.5 mi WU + drills/strides, 10-mile race (target 7:05–7:15/mi), 0.5 mi CD."],
  ["2026-04-19", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C very light or upper-focused."],
  // W7 (Apr 20–26) — Half Marathon race Sun 4/26
  ["2026-04-20", "run", "LT1", "7mi total · 3×8:00 @ LT1", "1 mi WU + drills, 3×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-04-21", "run", "Easy + Lift A", "5.5mi easy + Lift A", "5.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-22", "run", "LT2", "8mi total · 3×2mi @ HM", "1 mi WU, 3×2 mi @ HM effort (7:15–7:25/mi) w/3:00 jog, 1 mi CD, easy to 8 total."],
  ["2026-04-23", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy + 4×20s strides. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-24", "run", "Easy Run", "5.5mi easy", "5.5 mi easy (8:55–9:45/mi)."],
  ["2026-04-25", "run", "Shakeout + Strides", "3mi easy + strides", "3 mi shakeout + 4×20s strides."],
  ["2026-04-26", "race", "RACE: Half", "14.5–15mi total · WU + Half + CD", "1–1.5 mi WU + drills/strides, Half Marathon race (target ~7:15/mi), 0.4–0.8 mi CD."],
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
