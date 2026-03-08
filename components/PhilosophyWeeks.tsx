"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type WorkoutType = "quality" | "easy" | "long" | "rest";

interface DayWorkout {
  label: string;
  detail: string;
  type: WorkoutType;
}

interface PhilosophyWeek {
  slug: string;
  name: string;
  phase: string;
  color: string;
  days: [DayWorkout, DayWorkout, DayWorkout, DayWorkout, DayWorkout, DayWorkout, DayWorkout];
}

const weeks: PhilosophyWeek[] = [
  {
    slug: "lydiard",
    name: "Arthur Lydiard",
    phase: "Base Phase (~100mi/wk)",
    color: "#8b5cf6",
    days: [
      { label: "Steady 15mi", detail: "3/4 effort (~75\u201380% HRR), continuous", type: "quality" },
      { label: "Easy 10mi", detail: "1/4 effort, conversational", type: "easy" },
      { label: "Fartlek 12mi", detail: "1\u20133min surges at 1/2\u20133/4 effort mixed into steady running", type: "quality" },
      { label: "Easy + Strides 10mi", detail: "1/4 effort + 6\u00d7100m strides", type: "easy" },
      { label: "Sub-threshold 12\u201315mi", detail: "1/2\u20133/4 effort (~70\u201378% HRR)", type: "quality" },
      { label: "Easy 8\u201310mi", detail: "1/4 effort, pre-long-run shakeout", type: "easy" },
      { label: "Long 22mi", detail: "3/4 effort throughout, 2.5\u20133hr", type: "long" },
    ],
  },
  {
    slug: "daniels",
    name: "Jack Daniels / VDOT",
    phase: "Phase III \u2014 Transition Quality (2Q)",
    color: "#06b6d4",
    days: [
      { label: "Easy 40\u201350min", detail: "E pace (59\u201374% VO\u2082max)", type: "easy" },
      { label: "Easy 40\u201350min", detail: "E pace, optional 4\u00d720sec strides", type: "easy" },
      { label: "Q1: Intervals + Tempo", detail: "WU 2mi E \u2192 4\u00d71200m @ I pace, 3min jog \u2192 3\u00d71mi @ T pace, 1min rest \u2192 CD 1mi", type: "quality" },
      { label: "Easy 40\u201350min", detail: "E pace, mid-week recovery", type: "easy" },
      { label: "Easy 30\u201340min", detail: "E pace, pre-Q2 shakeout", type: "easy" },
      { label: "Q2: Long w/ MP", detail: "WU 2mi E \u2192 10\u201312mi alternating 2mi E / 2mi @ M pace \u2192 CD 2mi", type: "long" },
      { label: "Easy or Rest", detail: "E pace 30min or day off", type: "rest" },
    ],
  },
  {
    slug: "canova",
    name: "Renato Canova",
    phase: "Specific Phase",
    color: "#f97316",
    days: [
      { label: "Specific Intervals", detail: "WU 3mi \u2192 5\u00d72km @ 95\u2013100% MP, 90sec jog \u2192 CD 2mi", type: "quality" },
      { label: "Regen AM + PM", detail: "AM 6mi + PM 4mi, both @ 60\u201370% AnT", type: "easy" },
      { label: "Regen Run", detail: "8\u201310mi easy, single run", type: "easy" },
      { label: "Long Fast Run", detail: "WU 3mi \u2192 12\u201314mi @ 87\u201395% MP (progressive) \u2192 CD 2mi", type: "quality" },
      { label: "Regen AM + PM", detail: "AM 6mi + PM 4mi easy", type: "easy" },
      { label: "Regen Run", detail: "8mi easy", type: "easy" },
      { label: "Easy Long 14\u201316mi", detail: "All easy aerobic, time on feet", type: "long" },
    ],
  },
  {
    slug: "pfitzinger",
    name: "Pete Pfitzinger",
    phase: "18/55 \u2014 LT + Endurance Phase",
    color: "#14b8a6",
    days: [
      { label: "Rest / Cross-train", detail: "Day off or 30\u201340min pool/bike", type: "rest" },
      { label: "GA 7\u20139mi", detail: "General Aerobic (62\u201375% HRR)", type: "easy" },
      { label: "Med-Long 11\u201313mi", detail: "Endurance pace (65\u201378% HRR), second weekly stimulus", type: "quality" },
      { label: "Recovery 4\u20135mi", detail: "< 70% HRR, very easy", type: "easy" },
      { label: "LT Tempo 8\u201310mi", detail: "WU 2mi \u2192 4\u20136mi @ LT (75\u201388% HRR, ~HM effort) \u2192 CD 2mi", type: "quality" },
      { label: "Recovery 4\u20137mi", detail: "< 70% HRR", type: "easy" },
      { label: "Long 16\u201320mi", detail: "Endurance pace, may progress to GA in final miles", type: "long" },
    ],
  },
  {
    slug: "tinman",
    name: "Tinman Schwartz",
    phase: "Build Phase",
    color: "#eab308",
    days: [
      { label: "Easy 60min", detail: "Relaxed aerobic, no pace target", type: "easy" },
      { label: "CV Intervals", detail: "WU 15min \u2192 6\u00d73min @ CV (~10K\u201315K effort), 2min jog \u2192 CD 10min", type: "quality" },
      { label: "Easy 60min", detail: "Conversational, buffer day", type: "easy" },
      { label: "Easy + Strides", detail: "50min easy + 6\u00d7100m strides", type: "easy" },
      { label: "Speed Reps", detail: "WU 15min \u2192 8\u00d7200m @ mile pace, 200m jog \u2192 CD 10min", type: "quality" },
      { label: "Long 90\u2013120min", detail: "Easy effort, may pick up final 20min", type: "long" },
      { label: "Easy / Rest", detail: "30\u201345min easy or day off", type: "rest" },
    ],
  },
  {
    slug: "hudson",
    name: "Brad Hudson",
    phase: "Fundamental Phase",
    color: "#ec4899",
    days: [
      { label: "Rest + Hill Sprints", detail: "8\u00d78sec max-effort hills, full recovery", type: "rest" },
      { label: "Specific Intervals", detail: "WU 2mi \u2192 5\u00d71000m @ Level IV (10K effort), 3min jog \u2192 CD 1mi", type: "quality" },
      { label: "Easy Run", detail: "Level II (20% effort), 45\u201360min", type: "easy" },
      { label: "Threshold Run", detail: "WU 2mi \u2192 20min @ Level III (HM effort) \u2192 CD 1mi", type: "quality" },
      { label: "Rest + Hill Sprints", detail: "8\u00d78sec hills, same as Monday", type: "rest" },
      { label: "Easy / Moderate", detail: "Level II, 50\u201360min", type: "easy" },
      { label: "Progression Long", detail: "14mi easy \u2192 final 3mi @ Level III (HM effort)", type: "long" },
    ],
  },
  {
    slug: "norwegian",
    name: "Norwegian Singles",
    phase: "General Phase",
    color: "#3b82f6",
    days: [
      { label: "Threshold \u2014 LT1", detail: "WU 15min \u2192 5\u00d76min @ ~2 mmol/L, 90sec jog \u2192 CD 10min", type: "quality" },
      { label: "Easy 50min", detail: "Zone 1, well below LT1", type: "easy" },
      { label: "Threshold \u2014 LT2", detail: "WU 15min \u2192 4\u00d78min @ ~4 mmol/L, 2min jog \u2192 CD 10min", type: "quality" },
      { label: "Easy 45min", detail: "Zone 1", type: "easy" },
      { label: "Easy 40min", detail: "Zone 1", type: "easy" },
      { label: "Long 90min", detail: "Zone 1 throughout, no uptick", type: "long" },
      { label: "Recovery 30min", detail: "Very easy jog or full rest", type: "rest" },
    ],
  },
  {
    slug: "mantz-eyestone",
    name: "Mantz / Eyestone",
    phase: "Build (~100\u2013115mi/wk)",
    color: "#10b981",
    days: [
      { label: "Easy Doubles", detail: "AM 8mi @ altitude + PM 4mi easy", type: "easy" },
      { label: "VO\u2082max Intervals", detail: "Train low \u2192 WU 3mi \u2192 6\u00d71000m @ 5K pace, 2min jog \u2192 CD 2mi", type: "quality" },
      { label: "Med-Long 12\u201314mi", detail: "Steady aerobic @ altitude", type: "quality" },
      { label: "Easy Doubles", detail: "AM 8mi @ altitude + PM 3\u20134mi easy", type: "easy" },
      { label: "Tempo 8\u201310mi", detail: "Train low \u2192 WU 2mi \u2192 5\u20136mi @ LT/HM effort \u2192 CD 2mi", type: "quality" },
      { label: "Easy 6\u20138mi", detail: "Easy @ altitude, pre-long-run", type: "easy" },
      { label: "PMP Long 20mi", detail: "12mi easy \u2192 8mi @ goal MP", type: "long" },
    ],
  },
  {
    slug: "hansons",
    name: "Hansons",
    phase: "Peak (55\u201365mi/wk)",
    color: "#f59e0b",
    days: [
      { label: "Easy 5\u20136mi", detail: "1\u20132min/mi slower than MP", type: "easy" },
      { label: "Speed (SOS)", detail: "WU 1.5mi \u2192 12\u00d7400m @ 5K pace, 400m jog \u2192 CD 1.5mi", type: "quality" },
      { label: "Easy 5\u20136mi", detail: "Easy pace, cumulative fatigue building", type: "easy" },
      { label: "Strength (SOS)", detail: "WU 1.5mi \u2192 3\u00d72mi @ MP\u201310sec, 600m jog \u2192 CD 1.5mi", type: "quality" },
      { label: "Easy 5\u20136mi", detail: "Easy pace", type: "easy" },
      { label: "Long 16mi", detail: "Easy start, GA effort; fatigued legs simulate mi 10\u201326", type: "long" },
      { label: "Rest", detail: "Full day off", type: "rest" },
    ],
  },
  {
    slug: "polarized",
    name: "Polarized 80/20",
    phase: "General Phase",
    color: "#ef4444",
    days: [
      { label: "Easy 60min", detail: "Zone 1, firmly below LT1", type: "easy" },
      { label: "Zone 3 Intervals", detail: "WU 15min \u2192 5\u00d74min @ Zone 3 (>LT2), 3min jog \u2192 CD 10min", type: "quality" },
      { label: "Easy 60min", detail: "Zone 1, no gray zone", type: "easy" },
      { label: "Easy + Strides", detail: "Zone 1 50min + 6\u00d7100m strides", type: "easy" },
      { label: "Zone 3 Tempo", detail: "WU 15min \u2192 2\u00d710min @ Zone 3, 5min jog \u2192 CD 10min", type: "quality" },
      { label: "Long 90\u2013120min", detail: "Zone 1 only, no progression", type: "long" },
      { label: "Easy / Rest", detail: "Zone 1 30\u201340min or day off", type: "rest" },
    ],
  },
];

const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function WeekRow({ week, index }: { week: PhilosophyWeek; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="mb-10"
    >
      <Link
        href={`/training/philosophies/${week.slug}`}
        className="group flex items-center gap-3 mb-3"
      >
        <div
          className="w-1 h-6 rounded-full shrink-0"
          style={{ background: week.color }}
        />
        <div>
          <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
            {week.name}
          </h3>
          <p className="text-xs text-muted-foreground">{week.phase}</p>
        </div>
      </Link>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 border-t border-l border-border rounded-t-md">
            {dayHeaders.map((d) => (
              <div
                key={d}
                className="text-[10px] sm:text-xs font-medium text-muted-foreground p-1.5 sm:p-2 border-r border-b border-border bg-muted-foreground/5 text-center"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 border-l border-border rounded-b-md">
            {week.days.map((day, i) => {
              const isQuality = day.type === "quality";
              const isLong = day.type === "long";
              const isRest = day.type === "rest";

              return (
                <div
                  key={i}
                  className={`
                    min-h-[100px] sm:min-h-[130px] p-1.5 sm:p-2
                    border-r border-b border-border
                    flex flex-col gap-1
                    ${isQuality || isLong ? "border-l-4" : "border-l-4 border-l-transparent"}
                  `}
                  style={{
                    borderLeftColor:
                      isQuality || isLong ? week.color : undefined,
                    background: isQuality
                      ? `${week.color}0F`
                      : isLong
                        ? `${week.color}0A`
                        : undefined,
                  }}
                >
                  <span
                    className={`
                      text-[10px] sm:text-xs font-semibold leading-tight
                      ${isRest ? "text-muted-foreground/50" : ""}
                      ${!isQuality && !isLong && !isRest ? "text-foreground" : ""}
                    `}
                    style={{
                      color: isQuality || isLong ? week.color : undefined,
                    }}
                  >
                    {day.label}
                  </span>
                  <span
                    className={`
                      text-[9px] sm:text-[10px] leading-snug
                      ${isRest ? "text-muted-foreground/40" : "text-muted-foreground"}
                    `}
                  >
                    {day.detail}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PhilosophyWeeks() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-6">Example Training Weeks</h2>
      <p className="text-sm text-muted-foreground mb-8">
        One representative week from each philosophy. Click a heading to read
        the full deep-dive.
      </p>
      {weeks.map((w, i) => (
        <WeekRow key={w.slug} week={w} index={i} />
      ))}
    </section>
  );
}
