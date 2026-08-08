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
  { label: "W7", start: "2026-07-13", end: "2026-07-19", miles: "40", note: "Rebuild · restart · 6-day week (Mon off)" },
  { label: "W8", start: "2026-07-20", end: "2026-07-26", miles: "44", note: "Base build · 7-day weeks" },
  { label: "W9", start: "2026-07-27", end: "2026-08-02", miles: "48", note: "Base build" },
  { label: "R0", start: "2026-08-03", end: "2026-08-09", miles: "19", note: "Restart weekend · marathon ramp begins Mon 8/10" },
  // ===== Marathon block — Goal: Disney World Marathon Sun Jan 10, 2027 (~5am) =====
  // Ramp (Aug 10 – Sep 6), then Pfitzinger 18/55 (Mon Sep 7 → race Jan 10)
  { label: "R1", start: "2026-08-10", end: "2026-08-16", miles: "27", note: "Marathon ramp · consistency > volume" },
  { label: "R2", start: "2026-08-17", end: "2026-08-23", miles: "30", note: "Ramp · LT reintro 4×8:00" },
  { label: "R3", start: "2026-08-24", end: "2026-08-30", miles: "35", note: "Ramp · 12mi long run" },
  { label: "R4", start: "2026-08-31", end: "2026-09-06", miles: "29", note: "Absorb week · Pfitz 18/55 starts Mon 9/7" },
  { label: "W1", start: "2026-09-07", end: "2026-09-13", miles: "33", note: "Pfitz 18/55 · 17 wtg · Endurance block" },
  { label: "W2", start: "2026-09-14", end: "2026-09-20", miles: "35", note: "16 wtg · Endurance" },
  { label: "W3", start: "2026-09-21", end: "2026-09-27", miles: "40", note: "15 wtg · Endurance" },
  { label: "W4", start: "2026-09-28", end: "2026-10-04", miles: "42", note: "14 wtg · Endurance · hill sprints" },
  { label: "W5", start: "2026-10-05", end: "2026-10-11", miles: "45", note: "13 wtg · MP run: 16 w/8 @ MP (Sun)" },
  { label: "W6", start: "2026-10-12", end: "2026-10-18", miles: "37", note: "12 wtg · RECOVERY week" },
  { label: "W7", start: "2026-10-19", end: "2026-10-25", miles: "50", note: "11 wtg · LT+Endurance · 18mi long" },
  { label: "W8", start: "2026-10-26", end: "2026-11-01", miles: "54", note: "10 wtg · First 20-miler (Sun)" },
  { label: "W9", start: "2026-11-02", end: "2026-11-08", miles: "48", note: "9 wtg · MP run: 16 w/12 @ MP (Sun)" },
  { label: "W10", start: "2026-11-09", end: "2026-11-15", miles: "43", note: "8 wtg · RECOVERY · VO2max intro" },
  { label: "W11", start: "2026-11-16", end: "2026-11-22", miles: "55", note: "7 wtg · PEAK week · 20mi long" },
  { label: "W12", start: "2026-11-23", end: "2026-11-29", miles: "51–55", note: "6 wtg · Race prep · tune-up race (Turkey Trot option Thu 11/26)" },
  { label: "W13", start: "2026-11-30", end: "2026-12-06", miles: "52", note: "5 wtg · MP run: 18 w/14 @ MP — biggest of the plan" },
  { label: "W14", start: "2026-12-07", end: "2026-12-13", miles: "49–53", note: "4 wtg · Tune-up race Sat 12/12" },
  { label: "W15", start: "2026-12-14", end: "2026-12-20", miles: "52", note: "3 wtg · Last 20-miler (Sun)" },
  { label: "W16", start: "2026-12-21", end: "2026-12-27", miles: "43–45", note: "2 wtg · Taper begins · tune-up Sat 12/26 (or time trial)" },
  { label: "W17", start: "2026-12-28", end: "2027-01-03", miles: "32", note: "1 wtg · Taper" },
  { label: "W18", start: "2027-01-04", end: "2027-01-10", miles: "22 + race", note: "RACE WEEK · Disney Marathon Sun 1/10 · ~5am start" },
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

  // ===== Summer Half block (ENDED Aug 9 — Sep 5 half dropped, pivoted to Disney Marathon) =====
  // Template: Mon Recovery+Upper A · Tue Sub-T · Wed MLR+Lower · Thu Threshold · Fri Recovery+Upper B · Sat Easy+strides · Sun Long
  // (7 days/week — Monday is now an easy/recovery run; from Jul 13 the block restarts at 40 and rebuilds)
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
  // W7 (Jul 13–19) — 40 · rebuild (restart · 6-day, Mon off — this week only)
  // Mon 7/13 dropped; its 4 mi redistributed across Wed/Fri/Sat/Sun to keep the week at 40.
  ["2026-07-14", "run", "Sub-T", "6mi · 4×6:00 @ LT1", "1 mi WU, 4×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 6 total."],
  ["2026-07-15", "run", "MLR + Lower", "9mi · MLR easy", "9 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-07-16", "run", "Threshold", "5mi · 3×6:00 @ T", "1 mi WU, 3×6:00 @ T (7:20–7:35/mi) w/2:00 jog, 1 mi CD, easy to 5 total."],
  ["2026-07-17", "run", "Recovery + Upper B", "4mi · recovery", "4 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-07-18", "run", "Easy + Strides", "5mi · easy + strides", "5 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-07-19", "run", "Long Run", "11mi · last 2 steady", "11 mi long run: easy, last 2 mi steady (8:05–8:40/mi)."],
  // W8 (Jul 20–26) — 44 · base build
  ["2026-07-20", "run", "Recovery + Upper A", "4mi · recovery", "4 mi recovery (9:30–10:30+/mi). Easy day after Sunday long run.", "upperA"],
  ["2026-07-21", "run", "Sub-T", "7mi · 5×6:00 @ LT1", "1 mi WU, 5×6:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 7 total."],
  ["2026-07-22", "run", "MLR + Lower", "8mi · MLR easy", "8 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-07-23", "run", "Threshold", "6mi · 3×8:00 @ T", "1 mi WU, 3×8:00 @ T (7:20–7:35/mi) w/2:00 jog, 1 mi CD, easy to 6 total."],
  ["2026-07-24", "run", "Recovery + Upper B", "4mi · recovery", "4 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-07-25", "run", "Easy + Strides", "4mi · easy + strides", "4 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-07-26", "run", "Long Run", "11mi · last 3 steady", "11 mi long run: easy, last 3 mi steady (8:05–8:40/mi)."],
  // W9 (Jul 27–Aug 2) — 48 · base build
  ["2026-07-27", "run", "Easy + Upper A", "5mi · easy", "5 mi easy (8:55–9:45/mi).", "upperA"],
  ["2026-07-28", "run", "Sub-T", "8mi · 4×8:00 @ LT1", "1 mi WU, 4×8:00 @ LT1 (7:45–8:05/mi) w/90s jog, 1 mi CD, easy to 8 total."],
  ["2026-07-29", "run", "MLR + Lower", "9mi · MLR easy", "9 mi medium-long run, easy (8:55–9:45/mi).", "lower"],
  ["2026-07-30", "run", "Threshold", "6mi · 3×10:00 @ T", "1 mi WU, 3×10:00 @ T (7:20–7:35/mi) w/2:00 jog, 1 mi CD, easy to 6 total."],
  ["2026-07-31", "run", "Recovery + Upper B", "4mi · recovery", "4 mi recovery (9:30–10:30+/mi).", "upperB"],
  ["2026-08-01", "run", "Easy + Strides", "4mi · easy + strides", "4 mi easy (8:55–9:45/mi) + 4×20s strides."],
  ["2026-08-02", "run", "Long Run", "12mi · progressive", "12 mi progressive long run: easy, last 4 mi steady → HM effort (finish ~7:25/mi)."],
  // R0 (Aug 3–9) — 19 · summer plan wound down (10K skipped); easy restart weekend
  ["2026-08-06", "run", "Easy Run", "3mi · easy", "3 mi easy — backfilled after the fact."],
  ["2026-08-08", "run", "Gen Aerobic", "6mi · GA", "6 mi general aerobic (9:00–9:40/mi · HR 144–162, 72–81%). Easy restart — the marathon ramp begins Monday."],
  ["2026-08-09", "run", "Long Run", "10mi · long", "10 mi long run (8:50–9:30/mi · HR 150–168, 75–84%). Start at the slow end, finish in the faster half."],
  // ============================================================================
  // MARATHON BLOCK — Disney World Marathon, Sun Jan 10, 2027 (~5:00 a.m. start)
  // Pfitzinger 18/55 · Goal ~7:25/mi (3:14:xx) IF tune-up races confirm it
  //
  // HR zones (Pfitz Table 8.1 · max HR 200) + current pace equivalents (Aug 2026):
  //   Recovery         <76%  → <152 bpm  · ~10:00/mi
  //   Gen aerobic    72–81%  → 144–162   · ~9:00–9:40
  //   Long/Med-long  75–84%  → 150–168   · ~8:50–9:30
  //   Marathon pace  82–88%  → 164–176   · ~8:00–8:15 now → ~7:25 by race day
  //   Lactate thresh 82–91%  → 164–182   · ~7:40–7:50 now (15K–HM race effort)
  //   VO2max (5K)    93–95%  → 186–190   · ~6:50–7:00 now
  //   Strides/hill sprints: too short for HR — relaxed-fast (~mile effort) / 10s max
  // In summer heat obey HR and effort, let pace drift; paces catch up Oct–Dec.
  // Lifts: Mon Upper A + Lower on the week's other rest day (Fri, or Thu when
  // Pfitz moves the rest day). RIR 1–2 through Oct, maintenance RIR 2–3 from Nov.
  // Optional 3rd lift (Upper B) rides on Sat recovery runs through mid-Oct only.
  // ============================================================================

  // ---- RAMP R1 (Aug 10–16) — 27 · rebuild rhythm: consistency > volume ----
  ["2026-08-10", "lift", "Upper A", "Upper A · strength", "Rest from running. Upper A — Bench, Weighted Pull-Ups, Incline DB Press, 1-Arm Row, Lateral Raise, Face Pull.", "upperA"],
  ["2026-08-11", "run", "Gen Aerobic + Strides", "6mi · GA + 6×100", "6 mi general aerobic (9:00–9:40/mi · HR 144–162, 72–81%) + 6×100 m strides, full recovery between."],
  ["2026-08-13", "run", "Gen Aerobic", "7mi · GA", "7 mi general aerobic (9:00–9:40/mi · HR 144–162). Heat rule: if HR drifts over 162, slow down — the zone is the workout."],
  ["2026-08-14", "lift", "Lower", "Lower · strength", "Rest from running. Lower — Back Squat, RDL, Bulgarian Split Squat, Hip Thrust, Calf Raise. RIR 1–2; leave a little for Sunday's long run.", "lower"],
  ["2026-08-15", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152, <76%). Truly easy — this day only counts if it's slow."],
  ["2026-08-16", "run", "Long Run", "10mi · long", "10 mi long run (8:50–9:30/mi · HR 150–168, 75–84%). Start at the slow end, finish in the faster half."],
  // ---- RAMP R2 (Aug 17–23) — 30 · LT reintroduction ----
  ["2026-08-17", "lift", "Upper A", "Upper A · strength", "Rest from running. Upper A full session.", "upperA"],
  ["2026-08-18", "run", "LT Intervals", "7mi · 4×8:00 @ LT", "1.5 mi WU, 4×8:00 @ LT effort (~7:45–7:55/mi · HR 164–182, 82–91%) w/2:00 jog, CD easy to 7 total. 15K–HM race effort — comfortably hard, not a race."],
  ["2026-08-19", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152)."],
  ["2026-08-20", "run", "Gen Aerobic", "8mi · GA", "8 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-08-21", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-08-23", "run", "Long Run", "11mi · long", "11 mi long run (8:50–9:30/mi · HR 150–168). Practice fueling: gel every 30–40 min — race-day gut training starts now."],
  // ---- RAMP R3 (Aug 24–30) — 35 · biggest ramp week ----
  ["2026-08-24", "lift", "Upper A", "Upper A · strength", "Rest from running. Upper A full session.", "upperA"],
  ["2026-08-25", "run", "LT Tempo", "8mi · 2×15:00 @ LT", "1.5 mi WU, 2×15:00 @ LT (~7:40–7:55/mi · HR 164–182) w/3:00 jog, CD easy to 8 total."],
  ["2026-08-26", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152)."],
  ["2026-08-27", "run", "Gen Aerobic", "8mi · GA", "8 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-08-28", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-08-29", "run", "Recovery", "3mi · recovery", "3 mi recovery (~10:00/mi · HR <152)."],
  ["2026-08-30", "run", "Long Run", "12mi · long", "12 mi long run (8:50–9:30/mi · HR 150–168). This matches Pfitz W1's Sunday — arriving here comfortable means the plan starts on time."],
  // ---- RAMP R4 (Aug 31–Sep 6) — 29 · absorb, arrive fresh ----
  ["2026-08-31", "lift", "Upper A", "Upper A · strength", "Rest from running. Upper A full session.", "upperA"],
  ["2026-09-01", "run", "GA + Strides", "7mi · GA + 8×100", "7 mi general aerobic (9:00–9:40/mi · HR 144–162) + 8×100 m strides."],
  ["2026-09-02", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152)."],
  ["2026-09-03", "run", "Gen Aerobic", "8mi · GA", "8 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-09-04", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-09-06", "run", "Long Run + MP", "10mi · last 2–3 @ MP", "10 mi long run (HR 150–168), last 2–3 mi @ MP effort (HR 164–176, 82–88% · ~8:00–8:15/mi now). Old goal-half weekend — optional 5 a.m. start as Disney rehearsal #1."],

  // ======================= PFITZ 18/55 — Mon Sep 7 start =======================
  // W1 · 17 weeks to goal (Sep 7–13) — 33 · Endurance block
  ["2026-09-07", "lift", "Upper A", "Upper A · strength", "Labor Day. Rest or cross-train (Pfitz). Upper A full session.", "upperA"],
  ["2026-09-08", "run", "LT Run", "8mi · 4 @ LT", "1.5–2 mi WU, 4 mi continuous @ LT (~7:40–7:50/mi now · HR 164–182, 82–91%), CD easy to 8 total. 15K–HM race effort."],
  ["2026-09-10", "run", "Gen Aerobic", "9mi · GA", "9 mi general aerobic (9:00–9:40/mi · HR 144–162, 72–81%)."],
  ["2026-09-11", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-09-12", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152). Optional 3rd lift: Upper B after the run.", "upperB"],
  ["2026-09-13", "run", "Med-Long Run", "12mi · MLR", "12 mi medium-long (8:50–9:30/mi · HR 150–168, 75–84%). Start slow end, finish faster half."],
  // W2 · 16 wtg (Sep 14–20) — 35
  ["2026-09-14", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A full session.", "upperA"],
  ["2026-09-15", "run", "GA + Strides", "8mi · GA + 10×100", "8 mi general aerobic (9:00–9:40/mi · HR 144–162) + 10×100 m strides (relaxed-fast, ~mile effort, full recovery)."],
  ["2026-09-17", "run", "Gen Aerobic", "10mi · GA", "10 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-09-18", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-09-19", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152). Optional Upper B after.", "upperB"],
  ["2026-09-20", "run", "Med-Long Run", "13mi · MLR", "13 mi medium-long (8:50–9:30/mi · HR 150–168)."],
  // W3 · 15 wtg (Sep 21–27) — 40
  ["2026-09-21", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A full session.", "upperA"],
  ["2026-09-22", "run", "Gen Aerobic", "10mi · GA", "10 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-09-23", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152)."],
  ["2026-09-24", "run", "LT Run", "8mi · 4 @ LT", "1.5–2 mi WU, 4 mi @ LT (~7:40–7:50/mi · HR 164–182), CD easy to 8 total."],
  ["2026-09-25", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-09-26", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152). Optional Upper B after.", "upperB"],
  ["2026-09-27", "run", "Med-Long Run", "14mi · MLR", "14 mi medium-long (8:50–9:30/mi · HR 150–168)."],
  // W4 · 14 wtg (Sep 28–Oct 4) — 42
  ["2026-09-28", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A full session.", "upperA"],
  ["2026-09-29", "run", "GA + Hills + Strides", "8mi · hills + 8×100", "8 mi general aerobic (HR 144–162) + 6×10 sec steep hill sprints (walk-back recovery) + 8×100 m strides."],
  ["2026-09-30", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-10-01", "run", "Gen Aerobic", "10mi · GA", "10 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-10-02", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-10-03", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152). Optional Upper B after.", "upperB"],
  ["2026-10-04", "run", "Med-Long Run", "14mi · MLR", "14 mi medium-long (8:50–9:30/mi · HR 150–168)."],
  // W5 · 13 wtg (Oct 5–11) — 45 · first MP run
  ["2026-10-05", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A full session.", "upperA"],
  ["2026-10-06", "run", "LT Run", "9mi · 5 @ LT", "2 mi WU, 5 mi @ LT (~7:40–7:50/mi · HR 164–182), CD easy to 9 total."],
  ["2026-10-07", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-10-08", "run", "Gen Aerobic", "10mi · GA", "10 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-10-09", "lift", "Lower", "Lower · strength", "Rest from running. Keep it moderate (RIR 2–3) — first marathon-pace run Sunday.", "lower"],
  ["2026-10-10", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-10-11", "run", "MP Long Run", "16mi · 8 @ MP", "16 mi: 8 easy (HR 150–168), then 8 @ MP effort — HR 164–176 (82–88%), ~7:55–8:10/mi expected. Practice race fueling + drinks."],
  // W6 · 12 wtg (Oct 12–18) — 37 · RECOVERY week
  ["2026-10-12", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A — down week, drop 1 set per lift.", "upperA"],
  ["2026-10-13", "run", "GA + Strides", "8mi · GA + 8×100", "8 mi general aerobic (HR 144–162) + 8×100 m strides."],
  ["2026-10-14", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-10-15", "run", "Gen Aerobic", "8mi · GA", "8 mi general aerobic (9:00–9:40/mi · HR 144–162)."],
  ["2026-10-16", "lift", "Lower", "Lower · strength", "Rest from running. Lower — down week: drop Bulgarian Split Squat + Hip Thrust.", "lower"],
  ["2026-10-17", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152). Optional Upper B after — last optional 3rd lift of the block.", "upperB"],
  ["2026-10-18", "run", "Med-Long Run", "12mi · MLR", "12 mi medium-long (8:50–9:30/mi · HR 150–168)."],
  // W7 · 11 wtg (Oct 19–25) — 50 · LT + Endurance block begins
  ["2026-10-19", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A full session.", "upperA"],
  ["2026-10-20", "run", "LT Run", "10mi · 5 @ LT", "2 mi WU, 5 mi @ LT (~7:35–7:50/mi · HR 164–182), CD easy to 10 total."],
  ["2026-10-21", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152)."],
  ["2026-10-22", "run", "Med-Long Run", "11mi · MLR", "11 mi medium-long (8:50–9:30/mi · HR 150–168). Midweek MLRs start — early a.m. is the slot that survives work + kids."],
  ["2026-10-23", "lift", "Lower", "Lower · strength", "Rest from running. Lower full session, RIR 1–2.", "lower"],
  ["2026-10-24", "run", "GA + Strides", "7mi · GA + 8×100", "7 mi general aerobic (HR 144–162) + 8×100 m strides."],
  ["2026-10-25", "run", "Long Run", "18mi · long", "18 mi long run (8:45–9:25/mi · HR 150–168). Fuel every 30–40 min; longest run of your life to date."],
  // W8 · 10 wtg (Oct 26–Nov 1) — 54 · first 20-miler
  ["2026-10-26", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A full session.", "upperA"],
  ["2026-10-27", "run", "Recovery + Strides", "7mi · rec + 6×100", "7 mi recovery (~9:45–10:15/mi · HR <152) + 6×100 m strides."],
  ["2026-10-28", "run", "Med-Long Run", "12mi · MLR", "12 mi medium-long (8:50–9:30/mi · HR 150–168)."],
  ["2026-10-29", "lift", "Lower", "Lower · strength", "Rest from running (Pfitz rest day moves to Thu this week). Lower, RIR 2 — LT Friday + 20 Sunday.", "lower"],
  ["2026-10-30", "run", "LT Run", "10mi · 6 @ LT", "2 mi WU, 6 mi @ LT (~7:35–7:50/mi · HR 164–182), CD easy to 10 total."],
  ["2026-10-31", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-11-01", "run", "Long Run", "20mi · long", "FIRST 20-MILER. 8:45–9:25/mi · HR 150–168. Treat it like a dress rehearsal: fueling, kit, early start."],
  // W9 · 9 wtg (Nov 2–8) — 48 · big MP run
  ["2026-11-02", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A full session. From this month: maintenance mode, RIR 2–3.", "upperA"],
  ["2026-11-03", "run", "Recovery", "6mi · recovery", "6 mi recovery (~10:00/mi · HR <152)."],
  ["2026-11-04", "run", "Med-Long Run", "14mi · MLR", "14 mi medium-long (8:45–9:25/mi · HR 150–168)."],
  ["2026-11-05", "run", "Recovery", "6mi · recovery", "6 mi recovery (~10:00/mi · HR <152)."],
  ["2026-11-06", "lift", "Lower", "Lower · strength", "Rest from running. Lower, RIR 2–3 — 12 miles at MP on Sunday.", "lower"],
  ["2026-11-07", "run", "Recovery + Strides", "6mi · rec + 6×100", "6 mi recovery (HR <152) + 6×100 m strides."],
  ["2026-11-08", "run", "MP Long Run", "16mi · 12 @ MP", "16 mi: 4 easy, then 12 @ MP effort — HR 164–176, ~7:45–8:00/mi expected by now. The key fitness check of the block: note pace at HR 170."],
  // W10 · 8 wtg (Nov 9–15) — 43 · RECOVERY · VO2max intro
  ["2026-11-09", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A — down week, drop 1 set per lift.", "upperA"],
  ["2026-11-10", "run", "Gen Aerobic", "8mi · GA", "8 mi general aerobic (8:55–9:35/mi · HR 144–162)."],
  ["2026-11-11", "run", "VO2max", "8mi · 5×800 @ 5K", "2 mi WU, 5×800 m @ 5K effort (~6:50–7:00/mi → ~3:25–3:30 per rep · HR 186–190, 93–95% by rep's end), jog 50–90% of rep time, CD to 8 total."],
  ["2026-11-12", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-11-13", "lift", "Lower", "Lower · strength", "Rest from running. Lower — down week: drop Bulgarian Split Squat + Hip Thrust.", "lower"],
  ["2026-11-14", "run", "GA + Hills + Strides", "8mi · hills + 8×100", "8 mi general aerobic (HR 144–162) + 6×10 sec hill sprints + 8×100 m strides."],
  ["2026-11-15", "run", "Med-Long Run", "14mi · MLR", "14 mi medium-long (8:45–9:25/mi · HR 150–168)."],
  // W11 · 7 wtg (Nov 16–22) — 55 · PEAK WEEK
  ["2026-11-16", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A, maintenance.", "upperA"],
  ["2026-11-17", "run", "Recovery + Strides", "7mi · rec + 6×100", "7 mi recovery (HR <152) + 6×100 m strides."],
  ["2026-11-18", "run", "LT Run", "11mi · 7 @ LT", "2 mi WU, 7 mi @ LT (~7:30–7:45/mi by now · HR 164–182), CD to 11 total. Biggest LT session of the plan."],
  ["2026-11-19", "lift", "Lower", "Lower · strength", "Rest from running (Pfitz rest day is Thu this week). Lower, RIR 2–3.", "lower"],
  ["2026-11-20", "run", "Med-Long Run", "12mi · MLR", "12 mi medium-long (8:45–9:25/mi · HR 150–168)."],
  ["2026-11-21", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-11-22", "run", "Long Run", "20mi · long", "20 mi long run (8:40–9:20/mi · HR 150–168). Peak week caps here — everything after this is sharpening."],
  // W12 · 6 wtg (Nov 23–29) — 51–55 · Race Prep · tune-up race
  ["2026-11-23", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A, maintenance. Race week: no Lower.", "upperA"],
  ["2026-11-24", "run", "VO2max", "8mi · 5×600 @ 5K", "2 mi WU, 5×600 m @ 5K effort (~2:33–2:37 per rep · HR 186–190), jog 50–90% of rep time, CD to 8 total."],
  ["2026-11-25", "run", "Med-Long Run", "12mi · MLR", "12 mi medium-long (8:45–9:25/mi · HR 150–168)."],
  ["2026-11-26", "run", "Rest — or Turkey Trot", "Rest (or swap race here)", "Thanksgiving. Pfitz rest day — OR run the tune-up race today as a Turkey Trot (8K–15K all-out) and make Sat a GA day instead."],
  ["2026-11-27", "run", "Recovery + Strides", "5mi · rec + 6×100", "5 mi recovery (HR <152) + 6×100 m strides. If you raced Thursday, keep this strictly recovery."],
  ["2026-11-28", "race", "Tune-Up Race", "9–13mi · 8K–15K race", "8K–15K tune-up, all-out (total 9–13 mi w/ WU+CD). Skip if you Turkey-Trotted Thu — do 7 GA instead. Result calibrates MP: 10K time + ~45–60s/mi ≈ realistic marathon pace."],
  ["2026-11-29", "run", "Long Run", "17mi · long", "17 mi long run (8:40–9:20/mi · HR 150–168) on tired legs — that's the point."],
  // W13 · 5 wtg (Nov 30–Dec 6) — 52 · biggest MP run
  ["2026-11-30", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A, maintenance.", "upperA"],
  ["2026-12-01", "run", "Gen Aerobic", "8mi · GA", "8 mi general aerobic (8:55–9:35/mi · HR 144–162)."],
  ["2026-12-02", "run", "VO2max", "9mi · 5×1000 @ 5K", "2 mi WU, 5×1,000 m @ 5K effort (~4:15–4:20 per rep · HR 186–190), jog 50–90% of rep time, CD to 9 total."],
  ["2026-12-03", "lift", "Lower", "Lower · strength", "Rest from running. Lower, RIR 2–3 — huge MP run Sunday.", "lower"],
  ["2026-12-04", "run", "Med-Long Run", "12mi · MLR", "12 mi medium-long (8:40–9:20/mi · HR 150–168)."],
  ["2026-12-05", "run", "Recovery", "5mi · recovery", "5 mi recovery (~10:00/mi · HR <152)."],
  ["2026-12-06", "run", "MP Long Run", "18mi · 14 @ MP", "18 mi: 4 easy, then 14 @ MP — HR 164–176, target ~7:30–7:45/mi. THE rehearsal: 5 a.m. start, full race kit + fueling. If 7:25–7:30 feels controlled at ≤176, the goal is on."],
  // W14 · 4 wtg (Dec 7–13) — 49–53 · tune-up race
  ["2026-12-07", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A, maintenance. Race week: no Lower.", "upperA"],
  ["2026-12-08", "run", "VO2max", "8mi · 5×600 @ 5K", "2 mi WU, 5×600 m @ 5K effort (~2:33–2:37 · HR 186–190), jog 50–90% of rep time, CD to 8 total."],
  ["2026-12-09", "run", "Med-Long Run", "11mi · MLR", "11 mi medium-long (8:40–9:20/mi · HR 150–168)."],
  ["2026-12-11", "run", "Recovery + Strides", "4mi · rec + 6×100", "4 mi recovery (HR <152) + 6×100 m strides."],
  ["2026-12-12", "race", "Tune-Up Race", "9–13mi · 8K–15K race", "8K–15K tune-up, all-out (total 9–13 mi w/ WU+CD). Final MP calibration — lock the race number after this one."],
  ["2026-12-13", "run", "Long Run", "17mi · long", "17 mi long run (8:40–9:20/mi · HR 150–168)."],
  // W15 · 3 wtg (Dec 14–20) — 52 · last 20-miler
  ["2026-12-14", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A, maintenance.", "upperA"],
  ["2026-12-15", "run", "Recovery + Strides", "7mi · rec + 6×100", "7 mi recovery (HR <152) + 6×100 m strides."],
  ["2026-12-16", "run", "VO2max", "10mi · 4×1200 @ 5K", "2 mi WU, 4×1,200 m @ 5K effort (~5:05–5:15 per rep · HR 186–190), jog 50–90% of rep time, CD to 10 total."],
  ["2026-12-17", "lift", "Lower", "Lower · strength", "Rest from running. LAST Lower session of the block — moderate, RIR 3. Upper-only from here.", "lower"],
  ["2026-12-18", "run", "Med-Long Run", "11mi · MLR", "11 mi medium-long (8:40–9:20/mi · HR 150–168)."],
  ["2026-12-19", "run", "Recovery", "4mi · recovery", "4 mi recovery (~10:00/mi · HR <152)."],
  ["2026-12-20", "run", "Long Run", "20mi · long", "LAST 20-MILER (8:40–9:20/mi · HR 150–168). 5 a.m. start — full Disney rehearsal: kit, breakfast timing, fueling."],
  // W16 · 2 wtg (Dec 21–27) — 43–45 · taper begins
  ["2026-12-21", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A — taper: drop 1 set per lift.", "upperA"],
  ["2026-12-22", "run", "VO2max", "8mi · 5×600 @ 5K", "2 mi WU, 5×600 m @ 5K effort (~2:33–2:37 · HR 186–190), jog 50–90% of rep time, CD to 8 total."],
  ["2026-12-23", "run", "Recovery", "6mi · recovery", "6 mi recovery (~10:00/mi · HR <152)."],
  ["2026-12-25", "run", "Recovery + Strides", "4mi · rec + 6×100", "Christmas. 4 mi recovery (HR <152) + 6×100 m strides — short and social."],
  ["2026-12-26", "race", "Tune-Up Race", "9–11mi · 8K–10K race", "8K–10K tune-up (total 9–11 mi w/ WU+CD) — or a solo 5K–8K time trial if no local race. Last hard effort before Disney."],
  ["2026-12-27", "run", "Long Run", "16mi · long", "16 mi long run (8:40–9:20/mi · HR 150–168)."],
  // W17 · 1 wtg (Dec 28–Jan 3) — 32 · taper
  ["2026-12-28", "lift", "Upper A", "Upper A · strength", "Rest or cross-train. Upper A — light, drop 1 set per lift.", "upperA"],
  ["2026-12-29", "run", "Recovery + Strides", "7mi · rec + 8×100", "7 mi recovery (HR <152) + 8×100 m strides."],
  ["2026-12-30", "run", "VO2max", "8mi · 4×1200 @ 5K", "2 mi WU, 4×1,200 m @ 5K effort (~5:05–5:15 · HR 186–190), jog 50–90% of rep time, CD to 8 total. Last real workout."],
  ["2026-12-31", "lift", "Upper B", "Upper B · light", "Rest from running. Upper B — light (RIR 3–4). No lower body from here to the race.", "upperB"],
  ["2027-01-01", "run", "Recovery + Strides", "5mi · rec + 6×100", "New Year's Day. 5 mi recovery (HR <152) + 6×100 m strides."],
  ["2027-01-03", "run", "Med-Long Run", "12mi · MLR", "12 mi medium-long (8:40–9:20/mi · HR 150–168). Easy effort — fitness is banked."],
  // W18 · RACE WEEK (Jan 4–10) — 22 + race
  ["2027-01-05", "run", "Recovery + Upper A", "6mi · recovery", "6 mi recovery (~10:00/mi · HR <152). Last lift: Upper A very light (RIR 4), done by today — nothing after.", "upperA"],
  ["2027-01-06", "run", "Dress Rehearsal", "7mi · 2 @ MP", "7 mi w/ 2 @ MP (goal pace · HR 164–176). Full race kit + shoes. 5 a.m. start if possible."],
  ["2027-01-08", "run", "Recovery + Strides", "5mi · rec + 6×100", "5 mi recovery (HR <152) + 6×100 m strides. Travel/expo day logistics — stay off your feet otherwise."],
  ["2027-01-09", "run", "Recovery", "4mi · recovery", "4 mi shakeout (~10:00/mi). NO parks today — save the legs. Early dinner, ~8 p.m. lights out for the ~3 a.m. wake-up."],
  ["2027-01-10", "race", "RACE: Disney Marathon", "26.2mi · GOAL MARATHON", "Disney World Marathon, ~5:00 a.m. start. Goal ~7:25/mi (3:14:xx) if Dec confirmed it; HR discipline: ≤176 (88%) through mile 20, then race. First 3 mi 10–15s slow on purpose. Fuel from mile 4, every 30–35 min."],
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
