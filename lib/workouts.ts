export type WorkoutCategory = "run" | "lift" | "race";
export type CompletionStatus = "completed" | "partial" | "missed";

export interface Workout {
  date: string;
  category: WorkoutCategory;
  label: string;
  summary: string;
  description: string;
  /** Optional loggable lift template key (e.g. "upperA"), shown alongside the run. */
  lift?: string;
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

  // ===== Summer Half block — Goal: Half Marathon Sat Sep 5, 2026 (HMP ~7:25) =====
  { label: "W1", start: "2026-06-01", end: "2026-06-07", miles: "40", note: "Transition · Mon 6mi done, Sat rest" },
  { label: "W2", start: "2026-06-08", end: "2026-06-14", miles: "44", note: "Base build" },
  { label: "W3", start: "2026-06-15", end: "2026-06-21", miles: "47", note: "Base build" },
  { label: "W4", start: "2026-06-22", end: "2026-06-28", miles: "50", note: "Base build" },
  { label: "W5", start: "2026-06-29", end: "2026-07-05", miles: "42", note: "Down week · reduce Lower volume" },
  { label: "W6", start: "2026-07-06", end: "2026-07-12", miles: "49", note: "Strength · 3×14′ sub-T + HMP-finish long" },
  { label: "W7", start: "2026-07-13", end: "2026-07-19", miles: "52", note: "Strength · 3×2mi threshold + progressive long" },
  { label: "W8", start: "2026-07-20", end: "2026-07-26", miles: "52", note: "Strength · 3×18min sub-T long" },
  { label: "W9", start: "2026-07-27", end: "2026-08-02", miles: "45", note: "Down week · reduce Lower volume" },
  { label: "W10", start: "2026-08-03", end: "2026-08-09", miles: "42", note: "Tune-up 10K Sat 8/8 · no Lower/Upper B" },
  { label: "W11", start: "2026-08-10", end: "2026-08-16", miles: "51", note: "Specific · LT tempo + HMP long-run reps" },
  { label: "W12", start: "2026-08-17", end: "2026-08-23", miles: "52", note: "Peak specific · HMP work" },
  { label: "W13", start: "2026-08-24", end: "2026-08-30", miles: "43", note: "Taper begins · last full Lower (Wed)" },
  { label: "W14", start: "2026-08-31", end: "2026-09-06", miles: "35", note: "Race week · GOAL HALF Sat 9/5 · no Lower/Upper B" },
];

// [date, category, label, summary, description, lift?]
const data: [string, WorkoutCategory, string, string, string, string?][] = [
  // Pre-plan (Mar 2–8)
  ["2026-03-02", "run", "Intervals + Lift", "6.2mi · 4×1mi + Lift", "1 mi WU, 4×1 mi intervals, 1 mi CD. PM Lift: Pull-Ups · Bench · Shoulder superset."],
  ["2026-03-03", "run", "Progressive", "6.2mi · 4mi progressive", "6.2 mi total with last 4 mi progressive."],
  ["2026-03-07", "run", "Long Run", "10mi · last 3 @ 8:00/mi", "10 mi long run, last 3 mi at 8:00/mi."],
  // W1 (Mar 9–15)
  ["2026-03-09", "run", "LT1", "7mi total · 5×6:00 @ LT1", "1 mi WU,5×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-03-10", "run", "Easy + Lift A", "6mi easy + Lift A", "6 mi easy (8:55–9:45/mi). PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-03-11", "run", "LT2", "7mi total · 4×1mi @ T", "1 mi WU, 4×1 mi @ T (7:20–7:35/mi) w/75s jog, 1 mi CD, easy to 7 total."],
  ["2026-03-12", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-03-13", "run", "Easy Run", "6mi easy", "6 mi easy (last 10–15 min steady optional at 8:05–8:40/mi)."],
  ["2026-03-14", "run", "Long Run", "10mi long easy", "10 mi long run at easy effort; keep first 8 mi relaxed, finish steady only if smooth."],
  ["2026-03-15", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C: Bulgarian Split Squat · Dips · Chin-Ups/Pulldown · Sandbag Pickup."],
  // W2 (Mar 16–22) — Half Marathon race Sat 3/21
  ["2026-03-16", "run", "LT1", "6.5mi total · 4×6:00 @ LT1", "1 mi WU,4×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 6.5 total."],
  ["2026-03-17", "run", "Easy + Lift A", "5mi easy + Lift A", "5 mi easy (8:55–9:45/mi). PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-03-18", "run", "LT2", "6.5mi total · 4mi @ HM", "1 mi WU, 4 mi continuous @ HM effort (7:15–7:25/mi), 1 mi CD, easy to 6.5 total."],
  ["2026-03-19", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy + 4×20s strides. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-03-20", "run", "Shakeout + Strides", "3.5mi easy + strides", "3.5 mi easy + 4×20s strides; keep legs fresh."],
  ["2026-03-21", "race", "RACE: Half", "15mi total · WU + Half + CD", "1.5 mi WU,Half Marathon race, 0.4–1 mi CD."],
  ["2026-03-22", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi very easy recovery (9:30–10:30+/mi). PM Lift C light/moderate or skip legs if needed."],
  // W3 (Mar 23–29)
  ["2026-03-23", "run", "LT1", "8mi total · 4×8:00 @ LT1", "1 mi WU,4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8 total."],
  ["2026-03-24", "run", "Easy + Lift A", "6mi easy + Lift A", "6 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-03-25", "run", "LT2", "8mi total · 5×1mi @ T", "1 mi WU, 5×1 mi @ T (7:20–7:35/mi) w/75s jog, 1 mi CD, easy to 8 total."],
  ["2026-03-26", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-03-27", "run", "Easy Run", "6mi easy", "6 mi easy (8:55–9:45/mi)."],
  ["2026-03-28", "run", "Long Run", "11mi long easy", "11 mi long run easy; last 2 mi steady optional if you feel good."],
  ["2026-03-29", "run", "Recovery + Lift C", "3.5mi recovery + Lift C", "3.5 mi recovery (9:30–10:30+/mi). PM Lift C light/moderate."],
  // W4 (Mar 30–Apr 5)
  ["2026-03-30", "run", "LT1", "8.5mi total · 3×10:00 @ LT1", "1 mi WU,3×10:00 @ LT1 (7:45–8:05/mi) w/2:00 jog, 1 mi CD, easy to 8.5 total."],
  ["2026-03-31", "run", "Easy + Lift A", "6.5mi easy + Lift A", "6.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-01", "run", "LT2", "9mi total · 2×2mi + 1×1mi @ HM/T", "1 mi WU, 2×2 mi + 1×1 mi @ HM/T (7:15–7:30/mi) w/2:30 jog, 1 mi CD, easy to 9 total."],
  ["2026-04-02", "run", "Easy + Lift B", "5.5mi easy + Lift B", "5.5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-03", "run", "Easy/Steady", "7mi easy, steady finish", "7 mi easy with last 15–20 min steady (8:05–8:40/mi)."],
  ["2026-04-04", "run", "Long Run", "11mi · 8 easy + 3 @ HM", "11 mi long run: 8 mi easy (8:30–9:00/mi), last 3 mi at HM pace (7:15–7:25/mi)."],
  ["2026-04-05", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C light/moderate."],
  // W5 (Apr 6–12) — 10-miler specific
  ["2026-04-06", "run", "LT1", "9mi total · 4×8:00 @ LT1", "1 mi WU,4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 9 total."],
  ["2026-04-07", "run", "Easy + Lift A", "6.5mi easy + Lift A", "6.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-08", "run", "LT2", "9.5mi total · 3×2mi @ HM", "1 mi WU, 3×2 mi @ HM effort (7:15–7:25/mi) w/3:00 jog, 1 mi CD, easy to 9.5 total."],
  ["2026-04-09", "run", "Easy + Lift B", "5.5mi easy + Lift B", "5.5 mi easy + 4–6×20s strides. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-10", "run", "Easy Run", "7mi easy", "7 mi easy (8:55–9:45/mi)."],
  ["2026-04-11", "run", "Long Run", "11.5mi w/ 2×2mi @ 10M", "11.5 mi total: 6–7 mi easy, then 2×2 mi @ 10M goal pace (7:05–7:15/mi) w/3:00 easy, finish easy."],
  ["2026-04-12", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C light/moderate."],
  // W6 (Apr 13–19) — 10-Miler race Sat 4/18
  ["2026-04-13", "run", "LT1", "8mi total · 3×8:00 @ LT1", "1 mi WU,3×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8 total."],
  ["2026-04-14", "run", "Easy + Lift A", "5.5mi easy + Lift A", "5.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-15", "run", "LT2", "7.5mi total · 5×4:00 @ T", "1 mi WU, 5×4:00 @ T (7:20–7:35/mi) w/90s jog, 1 mi CD, easy to 7.5 total."],
  ["2026-04-16", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-17", "run", "Shakeout + Strides", "3.5mi easy + strides", "3.5 mi easy + 4×20s strides; stay relaxed for race day."],
  ["2026-04-18", "race", "RACE: 10-Mi", "12mi total · WU + 10M + CD", "1.5 mi WU,10-mile race (target 7:05–7:15/mi), 0.5 mi CD."],
  ["2026-04-19", "run", "Recovery + Lift C", "3mi recovery + Lift C", "3 mi recovery (9:30–10:30+/mi). PM Lift C very light or upper-focused."],
  // W7 (Apr 20–26) — Half Marathon race Sun 4/26
  ["2026-04-20", "run", "LT1", "7mi total · 3×8:00 @ LT1", "1 mi WU,3×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-04-21", "run", "Easy + Lift A", "5.5mi easy + Lift A", "5.5 mi easy. PM Lift A: Squat · Bench · Pull-Ups + shoulder superset."],
  ["2026-04-22", "run", "LT2", "8mi total · 3×2mi @ HM", "1 mi WU, 3×2 mi @ HM effort (7:15–7:25/mi) w/3:00 jog, 1 mi CD, easy to 8 total."],
  ["2026-04-23", "run", "Easy + Lift B", "5mi easy + Lift B", "5 mi easy + 4×20s strides. PM Lift B: RDL · OHP · One-Arm DB Row + curl/triceps superset."],
  ["2026-04-24", "run", "Easy Run", "5.5mi easy", "5.5 mi easy (8:55–9:45/mi)."],
  ["2026-04-25", "run", "Shakeout + Strides", "3mi easy + strides", "3 mi shakeout + 4×20s strides."],
  ["2026-04-26", "race", "RACE: Half", "14.5–15mi total · WU + Half + CD", "1–1.5 mi WU,Half Marathon race (target ~7:15/mi), 0.4–0.8 mi CD."],

  // ===== Summer Half block — Goal: Half Marathon Sat Sep 5, 2026 (HMP ~7:25) =====
  // Template: Mon Upper A · Tue Sub-T · Wed MLR+Lower · Thu Threshold · Fri Recovery+Upper B · Sat Easy+strides · Sun Long
  // W1 (Jun 1–7) — 40 · transition (Mon 6mi done, Sat rest)
  ["2026-06-01", "run", "Easy + Upper A", "6mi · easy (done)", "6 mi easy (8:55–9:45/mi) — completed. Optional Upper A strength if legs are fresh.", "upperA"],
  ["2026-06-02", "run", "Sub-T", "7mi · 4×6:00 @ LT1", "1 mi WU, 4×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-06-03", "run", "MLR + Lower", "8mi · MLR easy", "8 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-06-04", "run", "Threshold", "6mi · 3×8:00 @ T", "1 mi WU, 3×8:00 @ T (7:20–7:35/mi) w/2:00 jog, 1 mi CD, easy to 6 total."],
  ["2026-06-05", "run", "Recovery + Upper B", "4mi · recovery", "4 mi recovery (9:30–10:30+/mi).", "upperB"],
  // Sat 6/6 — rest (this week only)
  ["2026-06-07", "run", "Long Run", "9mi · easy long", "9 mi long run, easy (8:55–9:45/mi)."],
  // W2 (Jun 8–14) — 44
  ["2026-06-08", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-06-09", "run", "Sub-T", "8mi · 4×6:00 @ LT1", "1 mi WU, 4×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8 total."],
  ["2026-06-10", "run", "MLR + Lower", "9mi · MLR easy", "9 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-06-11", "run", "Threshold", "8mi · 3×10:00 @ T", "1 mi WU, 3×10:00 @ T (7:20–7:35/mi) w/2:00 jog, 1 mi CD, easy to 8 total."],
  ["2026-06-12", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-06-13", "run", "Easy + Strides", "4mi · easy + strides", "4 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-06-14", "run", "Long Run", "10mi · last 2 steady", "10 mi long run: easy, last 2 mi steady (8:05–8:40/mi)."],
  // W3 (Jun 15–21) — 47
  ["2026-06-15", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-06-16", "run", "Sub-T", "8.5mi · 5×6:00 @ LT1", "1 mi WU, 5×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8.5 total."],
  ["2026-06-17", "run", "MLR + Lower", "10mi · MLR easy", "10 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-06-18", "run", "Threshold", "8.5mi · 3×12:00 @ T", "1 mi WU, 3×12:00 @ T (7:20–7:35/mi) w/2:30 jog, 1 mi CD, easy to 8.5 total."],
  ["2026-06-19", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-06-20", "run", "Easy + Strides", "4mi · easy + strides", "4 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-06-21", "run", "Long Run", "11mi · last 3 steady", "11 mi long run: easy, last 3 mi steady (8:05–8:40/mi)."],
  // W4 (Jun 22–28) — 50
  ["2026-06-22", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-06-23", "run", "Sub-T", "9mi · 4×8:00 @ LT1", "1 mi WU, 4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 9 total."],
  ["2026-06-24", "run", "MLR + Lower", "10mi · MLR easy", "10 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-06-25", "run", "Threshold", "9mi · 4mi LT tempo", "1.5 mi WU, 4 mi continuous @ T/LT (7:25–7:35/mi), 1.5 mi CD, easy to 9 total."],
  ["2026-06-26", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-06-27", "run", "Easy + Strides", "5mi · easy + strides", "5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-06-28", "run", "Long Run", "12mi · progressive", "12 mi progressive long run: 8 mi easy, last 4 mi steady → HM effort (finish ~7:25/mi)."],
  // W5 (Jun 29–Jul 5) — 42 · down week (reduce Lower volume)
  ["2026-06-29", "lift", "Upper A", "Upper A · strength", "Upper A (down week — drop 1 set per lift). Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-06-30", "run", "Sub-T", "7mi · 4×5:00 @ LT1", "1 mi WU, 4×5:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-07-01", "run", "MLR + Lower", "8mi · MLR easy", "8 mi medium-long run, easy (8:55–9:45/mi). Down week: Lower drops Bulgarian Split Squat + Hip Thrust.", "lower"],
  ["2026-07-02", "run", "Threshold", "7mi · 2×12:00 @ T", "1 mi WU, 2×12:00 @ T (7:20–7:35/mi) w/3:00 jog, 1 mi CD, easy to 7 total."],
  ["2026-07-03", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi). Down week — drop 1 set per lift.", "upperB"],
  ["2026-07-04", "run", "Easy + Strides", "5mi · easy + strides", "5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-07-05", "run", "Long Run", "10mi · easy long", "10 mi long run, easy (8:55–9:45/mi)."],
  // W6 (Jul 6–12) — 49 · strength
  ["2026-07-06", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-07-07", "run", "Sub-T", "8.5mi · 5×6:00 @ LT1", "1 mi WU, 5×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8.5 total."],
  ["2026-07-08", "run", "MLR + Lower", "10mi · MLR easy", "10 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-07-09", "run", "Threshold", "8.5mi · 3×14:00 @ sub-T", "1 mi WU, 3×14:00 @ sub-T (7:35–7:50/mi) w/3:00 jog, 1 mi CD, easy to 8.5 total."],
  ["2026-07-10", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-07-11", "run", "Easy + Strides", "5mi · easy + strides", "5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-07-12", "run", "Long Run", "12mi · last 4 @ HMP", "12 mi long run, last 4 mi at HM pace (7:25/mi)."],
  // W7 (Jul 13–19) — 52 · strength
  ["2026-07-13", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-07-14", "run", "Sub-T", "9mi · 4×8:00 @ LT1", "1 mi WU, 4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 9 total."],
  ["2026-07-15", "run", "MLR + Lower", "11mi · MLR easy", "11 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-07-16", "run", "Threshold", "9mi · 3×2mi @ T", "1 mi WU, 3×2 mi @ T (7:20–7:35/mi) w/2:30 jog, 1 mi CD, easy to 9 total."],
  ["2026-07-17", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-07-18", "run", "Easy + Strides", "5mi · easy + strides", "5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-07-19", "run", "Long Run", "13mi · last 5 prog → HMP", "13 mi long run: easy, last 5 mi progressive to HM pace (finish ~7:25/mi)."],
  // W8 (Jul 20–26) — 52 · strength
  ["2026-07-20", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-07-21", "run", "Sub-T", "9mi · 3×10:00 @ LT1", "1 mi WU, 3×10:00 @ LT1 (7:45–8:05/mi) w/2:00 jog, 1 mi CD, easy to 9 total."],
  ["2026-07-22", "run", "MLR + Lower", "11mi · MLR easy", "11 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-07-23", "run", "Threshold", "8.5mi · 3×15:00 @ sub-T", "1 mi WU, 3×15:00 @ sub-T (7:35–7:50/mi) w/3:00 float, 1 mi CD, easy to 8.5 total."],
  ["2026-07-24", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-07-25", "run", "Easy + Strides", "5.5mi · easy + strides", "5.5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-07-26", "run", "Long Run", "13mi · 3×18:00 sub-T", "13 mi long run with 3×18:00 @ sub-T (7:45–8:05/mi) w/3:00 float (8:00–8:20/mi); easy the rest."],
  // W9 (Jul 27–Aug 2) — 45 · down week (reduce Lower volume)
  ["2026-07-27", "lift", "Upper A", "Upper A · strength", "Upper A (down week — drop 1 set per lift). Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-07-28", "run", "Sub-T", "7mi · 4×5:00 @ LT1", "1 mi WU, 4×5:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-07-29", "run", "MLR + Lower", "9mi · MLR easy", "9 mi medium-long run, easy (8:55–9:45/mi). Down week: Lower drops Bulgarian Split Squat + Hip Thrust.", "lower"],
  ["2026-07-30", "run", "Threshold", "7mi · 3×10:00 @ T", "1 mi WU, 3×10:00 @ T (7:20–7:35/mi) w/2:00 jog, 1 mi CD, easy to 7 total."],
  ["2026-07-31", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi). Down week — drop 1 set per lift.", "upperB"],
  ["2026-08-01", "run", "Easy + Strides", "5mi · easy + strides", "5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-08-02", "run", "Long Run", "12mi · last 2 steady", "12 mi long run: easy, last 2 mi steady (8:05–8:40/mi)."],
  // W10 (Aug 3–9) — 42 · TUNE-UP 10K Sat 8/8 (no Lower/Upper B)
  ["2026-08-03", "lift", "Upper A", "Upper A · light", "Upper A (keep light, race week). Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-08-04", "run", "Sub-T", "8mi · 3×6:00 @ LT1", "1 mi WU, 3×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8 total."],
  ["2026-08-05", "run", "MLR", "10mi · MLR easy", "10 mi medium-long run, easy (8:55–9:45/mi). No Lower lift — race week."],
  ["2026-08-06", "run", "Recovery + Strides", "5mi · recovery + strides", "5 mi recovery (9:30–10:30+/mi) + 4×20s strides."],
  ["2026-08-07", "run", "Shakeout", "3mi · shakeout", "3 mi easy + 4×20s strides; stay loose for race day."],
  ["2026-08-08", "race", "RACE: 10K", "~9mi · 10K race", "1.5 mi WU, 10K race (target 7:00–7:10/mi, ~43:30), 1 mi CD."],
  ["2026-08-09", "run", "Recovery", "7mi · recovery", "7 mi very easy recovery (9:30–10:30+/mi)."],
  // W11 (Aug 10–16) — 51 · specific
  ["2026-08-10", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-08-11", "run", "Sub-T", "9mi · 4×8:00 @ LT1", "1 mi WU, 4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 9 total."],
  ["2026-08-12", "run", "MLR + Lower", "11mi · MLR easy", "11 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-08-13", "run", "Threshold", "9mi · 5mi LT tempo", "1.5 mi WU, 5 mi continuous @ LT (7:25–7:35/mi), 1.5 mi CD, easy to 9 total."],
  ["2026-08-14", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-08-15", "run", "Easy + Strides", "5mi · easy + strides", "5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-08-16", "run", "Long Run", "12mi · 2×2mi @ HMP", "12 mi long run with 2×2 mi @ HM pace (7:25/mi) w/0.5 mi float; easy the rest."],
  // W12 (Aug 17–23) — 52 · peak specific
  ["2026-08-17", "lift", "Upper A", "Upper A · strength", "Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-08-18", "run", "Sub-T", "9mi · 3×10:00 @ LT1", "1 mi WU, 3×10:00 @ LT1 (7:45–8:05/mi) w/2:00 jog, 1 mi CD, easy to 9 total."],
  ["2026-08-19", "run", "MLR + Lower", "11mi · MLR easy", "11 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-08-20", "run", "Threshold", "9.5mi · 2×3mi @ HMP", "1.5 mi WU, 2×3 mi @ HM pace (7:25/mi) w/3:00 jog, 1.5 mi CD, easy to 9.5 total."],
  ["2026-08-21", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-08-22", "run", "Easy + Strides", "5.5mi · easy + strides", "5.5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-08-23", "run", "Long Run", "12mi · last 4 @ HMP", "12 mi long run, last 4 mi at HM pace (7:25/mi)."],
  // W13 (Aug 24–30) — 43 · taper begins (last full Lower Wed)
  ["2026-08-24", "lift", "Upper A", "Upper A · strength", "Upper A (taper — drop 1 set per lift). Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-08-25", "run", "Sub-T", "7mi · 3×6:00 @ LT1", "1 mi WU, 3×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-08-26", "run", "MLR + Lower", "9mi · MLR easy", "9 mi medium-long run, easy (8:55–9:45/mi). Last full Lower of the block.", "lower"],
  ["2026-08-27", "run", "Threshold", "7mi · 2×10:00 @ T", "1 mi WU, 2×10:00 @ T (7:20–7:35/mi) w/2:30 jog, 1 mi CD, easy to 7 total. Taper — controlled, sharp."],
  ["2026-08-28", "run", "Recovery + Upper B", "5mi · recovery", "5 mi recovery (9:30–10:30+/mi). Taper — drop 1 set per lift.", "upperB"],
  ["2026-08-29", "run", "Easy + Strides", "4mi · easy + strides", "4 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-08-30", "run", "Long Run", "11mi · last 3 @ HMP", "11 mi long run, last 3 mi at HM pace (7:25/mi)."],
  // W14 (Aug 31–Sep 6) — 35 · RACE WEEK · GOAL HALF Sat 9/5 (no Lower/Upper B)
  ["2026-08-31", "lift", "Upper A", "Upper A · light", "Upper A (optional, light — race week). Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-09-01", "run", "Sub-T", "6mi · 3×5:00 sharpener", "1 mi WU, 3×5:00 @ HM/LT1 effort (7:25–7:45/mi) w/90s jog, 1 mi CD, easy to 6 total. Keep it light."],
  ["2026-09-02", "run", "Easy + Strides", "6mi · easy + strides", "6 mi easy (8:55–9:45/mi) + 4×20s strides. No Lower lift — race week."],
  ["2026-09-03", "run", "Easy", "5mi · easy", "5 mi easy (8:55–9:45/mi)."],
  ["2026-09-04", "run", "Shakeout", "3mi · shakeout", "3 mi easy + 4×20s strides; stay relaxed for race day."],
  ["2026-09-05", "race", "RACE: Half", "~15mi · Half Marathon", "1.5 mi WU, Half Marathon race (goal 7:25/mi, ~1:37), 0.5 mi CD."],
  // Sun 9/6 — off / optional recovery walk
];

const workoutMap = new Map<string, Workout>();
for (const [date, category, label, summary, description, lift] of data) {
  workoutMap.set(date, { date, category, label, summary, description, ...(lift ? { lift } : {}) });
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
  upperA: {
    key: "upperA",
    title: "Upper A — Push/Pull",
    groups: [
      { type: "single", exercises: [{ name: "Bench Press", sets: 4, reps: "5–8", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Pull-Ups (weighted if able)", sets: 4, reps: "5–8", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Incline DB Bench Press", sets: 3, reps: "8–12", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "One-Arm DB Row", sets: 3, reps: "8–12", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "DB Lateral Raise", sets: 3, reps: "12–20", rir: "1" }] },
      { type: "single", exercises: [{ name: "Band Face Pull", sets: 2, reps: "15–25", rir: "1–2" }] },
    ],
  },
  lower: {
    key: "lower",
    title: "Lower",
    groups: [
      { type: "single", exercises: [{ name: "Back Squat", sets: 4, reps: "5–8", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Romanian Deadlift", sets: 4, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Bulgarian Split Squat", sets: 3, reps: "8–12 / leg", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Hip Thrust", sets: 3, reps: "8–12", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Standing Calf Raise", sets: 3, reps: "10–15", rir: "1–2" }] },
    ],
  },
  upperB: {
    key: "upperB",
    title: "Upper B — Push/Pull",
    groups: [
      { type: "single", exercises: [{ name: "Overhead Press", sets: 3, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Chin-Ups", sets: 4, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Weighted Dips", sets: 3, reps: "6–10", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "DB Row", sets: 3, reps: "10–15", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "DB Lateral Raise", sets: 3, reps: "12–20", rir: "1" }] },
      { type: "single", exercises: [{ name: "DB Curl", sets: 3, reps: "8–12", rir: "1–2" }] },
      { type: "single", exercises: [{ name: "Band Triceps Extension", sets: 3, reps: "12–20", rir: "1–2" }] },
    ],
  },
};

export function getLiftTemplate(key: string): LiftTemplate | undefined {
  return liftTemplates[key];
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
