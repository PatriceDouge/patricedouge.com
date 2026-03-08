"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArticleLayout,
  Figure,
  KeyStat,
  AnimatedBar,
  SectionDivider,
  ExternalLink,
  mono,
} from "@/components/PhilosophyShared";

// ────────────────────────────────────
// PeriodizationDiagram
// ────────────────────────────────────

function PeriodizationDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 280;
  const pad = { top: 30, right: 20, bottom: 50, left: 20 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const phases = [
    {
      name: "ENDURANCE",
      weeks: "Wk 1-5",
      color: "#14b8a6",
      widthPct: 28,
      mileage: 0.6,
      ltPct: 0.15,
      vo2Pct: 0,
      description: "Base building",
    },
    {
      name: "LT + ENDURANCE",
      weeks: "Wk 6-11",
      color: "#0d9488",
      widthPct: 33,
      mileage: 0.85,
      ltPct: 0.4,
      vo2Pct: 0.05,
      description: "Threshold work added",
    },
    {
      name: "RACE PREP",
      weeks: "Wk 12-15",
      color: "#f59e0b",
      widthPct: 22,
      mileage: 1.0,
      ltPct: 0.55,
      vo2Pct: 0.35,
      description: "VO2max & MP work",
    },
    {
      name: "TAPER",
      weeks: "Wk 16-18",
      color: "#ef4444",
      widthPct: 17,
      mileage: 0.45,
      ltPct: 0.3,
      vo2Pct: 0.15,
      description: "Volume drops 50-70%",
    },
  ];

  // Calculate phase x positions
  let runningX = pad.left;
  const phasePositions = phases.map((p) => {
    const w = (p.widthPct / 100) * cw;
    const pos = { x: runningX, w };
    runningX += w;
    return pos;
  });

  // Mileage curve points
  const mileagePoints = phases.map((p, i) => {
    const pos = phasePositions[i];
    const cx = pos.x + pos.w / 2;
    const cy = pad.top + ch * (1 - p.mileage) * 0.75;
    return [cx, cy];
  });

  const mileagePath = mileagePoints
    .map(
      (pt, i) =>
        `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`
    )
    .join(" ");

  // LT work curve
  const ltPoints = phases.map((p, i) => {
    const pos = phasePositions[i];
    const cx = pos.x + pos.w / 2;
    const cy = pad.top + ch - p.ltPct * ch * 0.7;
    return [cx, cy];
  });

  const ltPath = ltPoints
    .map(
      (pt, i) =>
        `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`
    )
    .join(" ");

  return (
    <Figure caption="Pfitzinger's four-phase periodization. Mileage builds through Race Prep, then drops sharply in the Taper. Lactate threshold and VO2max work are layered progressively.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Phase blocks */}
        {phases.map((p, i) => {
          const pos = phasePositions[i];
          return (
            <motion.g
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.15,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              {/* Phase background */}
              <rect
                x={pos.x}
                y={pad.top}
                width={pos.w}
                height={ch}
                fill={p.color}
                opacity={0.06}
                rx={3}
              />

              {/* Phase border */}
              <line
                x1={pos.x + pos.w}
                y1={pad.top}
                x2={pos.x + pos.w}
                y2={pad.top + ch}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity={i < phases.length - 1 ? 0.5 : 0}
              />

              {/* Phase label */}
              <text
                x={pos.x + pos.w / 2}
                y={H - pad.bottom + 16}
                textAnchor="middle"
                fontSize="8"
                fontWeight="600"
                letterSpacing="0.05em"
                style={{ ...mono, fill: p.color }}
              >
                {p.name}
              </text>

              {/* Weeks label */}
              <text
                x={pos.x + pos.w / 2}
                y={H - pad.bottom + 28}
                textAnchor="middle"
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {p.weeks}
              </text>

              {/* Description */}
              <text
                x={pos.x + pos.w / 2}
                y={H - pad.bottom + 40}
                textAnchor="middle"
                fontSize="6.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
                opacity={0.7}
              >
                {p.description}
              </text>
            </motion.g>
          );
        })}

        {/* Mileage curve */}
        <motion.path
          d={mileagePath}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeInOut" }}
        />

        {/* Mileage dots */}
        {mileagePoints.map((pt, i) => (
          <motion.circle
            key={`m-${i}`}
            cx={pt[0]}
            cy={pt[1]}
            r={4}
            fill="#14b8a6"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 0.8, scale: 1 } : {}}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.3 }}
          />
        ))}

        {/* LT work curve */}
        <motion.path
          d={ltPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
          transition={{ delay: 1.0, duration: 1.0, ease: "easeInOut" }}
        />

        {/* LT dots */}
        {ltPoints.map((pt, i) => (
          <motion.circle
            key={`lt-${i}`}
            cx={pt[0]}
            cy={pt[1]}
            r={3}
            fill="#f59e0b"
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 0.6, scale: 1 } : {}}
            transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
          />
        ))}

        {/* Legend */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.4 }}
        >
          <line
            x1={pad.left + 10}
            y1={pad.top - 10}
            x2={pad.left + 30}
            y2={pad.top - 10}
            stroke="#14b8a6"
            strokeWidth="2.5"
          />
          <text
            x={pad.left + 35}
            y={pad.top - 7}
            fontSize="7.5"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Mileage Volume
          </text>

          <line
            x1={pad.left + 140}
            y1={pad.top - 10}
            x2={pad.left + 160}
            y2={pad.top - 10}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          <text
            x={pad.left + 165}
            y={pad.top - 7}
            fontSize="7.5"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Quality Work Intensity
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// HRRZoneBars
// ────────────────────────────────────

function HRRZoneBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const zones = [
    {
      name: "Recovery",
      hrrRange: "< 70% HRR",
      percent: 40,
      color: "#94a3b8",
      description: "Very easy, active recovery between quality days",
      volumeShare: "~10%",
    },
    {
      name: "General Aerobic",
      hrrRange: "62-75% HRR",
      percent: 75,
      color: "#14b8a6",
      description: "The workhorse daily run, moderate aerobic effort",
      volumeShare: "~40%",
    },
    {
      name: "Endurance / Long Run",
      hrrRange: "65-78% HRR",
      percent: 78,
      color: "#0d9488",
      description: "10-20% slower than MP, sustained aerobic development",
      volumeShare: "~25%",
    },
    {
      name: "Marathon Pace",
      hrrRange: "73-84% HRR",
      percent: 84,
      color: "#f59e0b",
      description: "Goal race pace, practiced in long run finishes",
      volumeShare: "~10%",
    },
    {
      name: "Lactate Threshold",
      hrrRange: "75-88% HRR",
      percent: 88,
      color: "#f97316",
      description: "15K to half-marathon effort, sustained tempo work",
      volumeShare: "~15%",
    },
    {
      name: "VO2max",
      hrrRange: "93-97% HRR",
      percent: 97,
      color: "#ef4444",
      description: "~5K race pace, short sharp intervals",
      volumeShare: "~5%",
    },
  ];

  return (
    <Figure caption="Pfitzinger's six intensity zones defined by Heart Rate Reserve (Karvonen method). Unlike fixed HR-max zones, HRR accounts for resting heart rate, producing more individualized targets.">
      <div ref={ref} className="space-y-5">
        {zones.map((z, i) => (
          <motion.div
            key={z.name}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className="text-sm font-medium text-foreground"
                style={mono}
              >
                {z.name}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-[11px] text-muted-foreground"
                  style={mono}
                >
                  {z.volumeShare}
                </span>
                <span
                  className="text-xs text-muted-foreground"
                  style={mono}
                >
                  {z.hrrRange}
                </span>
              </div>
            </div>

            <div className="relative h-6 rounded overflow-hidden">
              <div
                className="absolute inset-0 rounded"
                style={{ background: z.color, opacity: 0.08 }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 rounded"
                style={{ background: z.color, opacity: 0.35 }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${z.percent}%` } : { width: 0 }}
                transition={{
                  delay: 0.3 + i * 0.12,
                  duration: 0.9,
                  ease: "easeOut",
                }}
              />
            </div>

            <div className="mt-1">
              <span className="text-[11px] text-muted-foreground">
                {z.description}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// WeeklyStructureTimeline
// ────────────────────────────────────

function WeeklyStructureTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const days = [
    {
      label: "Mon",
      type: "rest",
      session: "Rest / Cross-train",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Tue",
      type: "ga",
      session: "General Aerobic 7-9mi",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Wed",
      type: "medium-long",
      session: "Medium-Long 11-13mi",
      color: "#14b8a6",
      intensity: "quality",
    },
    {
      label: "Thu",
      type: "recovery",
      session: "Recovery 4-5mi",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Fri",
      type: "lt",
      session: "LT Tempo 8-10mi",
      color: "#14b8a6",
      intensity: "quality",
    },
    {
      label: "Sat",
      type: "ga",
      session: "Recovery / GA 4-7mi",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Sun",
      type: "long",
      session: "Long Run 16-20mi",
      color: "#14b8a6",
      intensity: "long",
    },
  ];

  return (
    <Figure caption="A typical Pfitzinger 18/55 week during the LT + Endurance phase. Three quality stimuli: mid-week medium-long run, Friday tempo, and Sunday long run.">
      <div ref={ref}>
        {/* Desktop: horizontal strip */}
        <div className="hidden sm:grid grid-cols-7 gap-2">
          {days.map((d, i) => {
            const isQuality = d.intensity === "quality";
            const isLong = d.intensity === "long";
            const highlight = isQuality || isLong;

            return (
              <motion.div
                key={d.label}
                className="text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.08,
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                <div
                  className="text-xs font-medium mb-2"
                  style={{
                    ...mono,
                    color: highlight
                      ? "#14b8a6"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </div>
                <div
                  className="rounded-md py-4 px-1 border"
                  style={{
                    borderColor: highlight ? "#14b8a6" : "var(--border)",
                    background: highlight ? "#14b8a6" : "transparent",
                    opacity: highlight ? undefined : 1,
                  }}
                >
                  <div
                    className="w-full h-1 rounded-full mb-2 mx-auto"
                    style={{
                      maxWidth: "32px",
                      background: d.color,
                      opacity: highlight ? 0.5 : 0.15,
                    }}
                  />
                  <div
                    className="text-[10px] leading-tight"
                    style={{
                      ...mono,
                      color: highlight
                        ? "#14b8a6"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isQuality && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#14b8a6" }}
                      >
                        Quality
                      </span>
                    )}
                    {isLong && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#14b8a6", opacity: 0.7 }}
                      >
                        Long Run
                      </span>
                    )}
                    {d.session}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: stacked list */}
        <div className="sm:hidden space-y-2">
          {days.map((d, i) => {
            const isQuality = d.intensity === "quality";
            const isLong = d.intensity === "long";
            const highlight = isQuality || isLong;

            return (
              <motion.div
                key={d.label}
                className="flex items-center gap-3 py-2 px-3 rounded-md border"
                style={{
                  borderColor: highlight ? "#14b8a6" : "var(--border)",
                }}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: i * 0.06,
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                <span
                  className="text-xs font-medium w-8 shrink-0"
                  style={{
                    ...mono,
                    color: highlight
                      ? "#14b8a6"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: d.color,
                    opacity: highlight ? 0.7 : 0.2,
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    ...mono,
                    color: highlight
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.session}
                </span>
                {isQuality && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "#14b8a6" }}
                  >
                    Quality
                  </span>
                )}
                {isLong && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "#14b8a6", opacity: 0.7 }}
                  >
                    Long
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// SignatureWorkoutsCards
// ────────────────────────────────────

function SignatureWorkoutsCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const workouts = [
    {
      name: "The Medium-Long Run",
      structure: "11-15mi at endurance pace",
      target: "65-78% HRR, 10-20% slower than MP",
      effort: "Steady, controlled, conversational",
      tag: "SIGNATURE",
      color: "#14b8a6",
      description:
        "Pfitzinger's most distinctive prescription. A mid-week second long run that provides an additional weekly endurance stimulus without the recovery cost of a true 20-miler.",
    },
    {
      name: "LT Tempo Run",
      structure: "8-12mi total, 4-5mi sustained at LT",
      target: "75-88% HRR, 15K to HM race pace",
      effort: "Comfortably hard, rhythmic breathing",
      tag: "THRESHOLD",
      color: "#f59e0b",
      description:
        "Sustained tempo at lactate threshold pace — the intensity where lactate production and clearance are balanced. Builds the metabolic capacity to hold marathon pace.",
    },
    {
      name: "Long Run with MP Finish",
      structure: "20mi total, final 8-10mi at marathon pace",
      target: "73-84% HRR for MP portion",
      effort: "Easy start, progressing to race-specific",
      tag: "RACE PREP",
      color: "#f97316",
      description:
        "The highest-fidelity race simulation. Teaches the body to produce marathon pace on glycogen-depleted legs — exactly what the final 10K of a marathon demands.",
    },
    {
      name: "VO2max Intervals",
      structure: "5 x 1000m at 5K race pace, 2-4min jog",
      target: "93-97% HRR, near maximal aerobic effort",
      effort: "Hard but controlled, not sprinting",
      tag: "VO2MAX",
      color: "#ef4444",
      description:
        "Short, sharp intervals that develop maximal oxygen uptake. Used sparingly in the Race Preparation phase to sharpen speed without undermining aerobic base.",
    },
  ];

  return (
    <Figure caption="Pfitzinger's core workouts. Each targets a specific physiological system — there is no junk mileage in the program.">
      <div ref={ref} className="space-y-4">
        {workouts.map((w, i) => (
          <motion.div
            key={w.name}
            className="rounded-md border border-border p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4
                className="text-sm font-semibold text-foreground"
                style={mono}
              >
                {w.name}
              </h4>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                style={{
                  ...mono,
                  color: w.color,
                  border: `1px solid ${w.color}`,
                  opacity: 0.7,
                }}
              >
                {w.tag}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              {w.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="text-muted-foreground/60">Structure: </span>
                {w.structure}
              </div>
              <div>
                <span className="text-muted-foreground/60">Target: </span>
                {w.target}
              </div>
              <div>
                <span className="text-muted-foreground/60">Effort: </span>
                {w.effort}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// MileageTiersDiagram
// ────────────────────────────────────

function MileageTiersDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 220;
  const pad = { top: 30, right: 30, bottom: 40, left: 60 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const tiers = [
    { plan: "18/55", peak: 55, longRun: 20, medLong: 12, color: "#14b8a6" },
    { plan: "18/70", peak: 70, longRun: 22, medLong: 14, color: "#0d9488" },
    { plan: "18/85", peak: 85, longRun: 22, medLong: 15, color: "#f59e0b" },
    { plan: "18/105", peak: 105, longRun: 22, medLong: 16, color: "#f97316" },
  ];

  const maxMPW = 110;
  const barHeight = (ch - 30) / tiers.length;
  const barGap = 6;

  return (
    <Figure caption="Pfitzinger's four plan tiers. The 18-week cycle is consistent across all tiers — only the volume and intensity of the workload scales.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={pad.left + (v / maxMPW) * cw}
                y1={pad.top}
                x2={pad.left + (v / maxMPW) * cw}
                y2={H - pad.bottom}
                stroke="var(--border)"
                strokeWidth="0.5"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <text
                x={pad.left + (v / maxMPW) * cw}
                y={H - pad.bottom + 14}
                textAnchor="middle"
                fontSize="7.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {v}
              </text>
            </g>
          ))}
          <text
            x={pad.left + cw / 2}
            y={H - 4}
            textAnchor="middle"
            fontSize="7.5"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Peak Miles Per Week
          </text>
        </motion.g>

        {/* Tier bars */}
        {tiers.map((t, i) => {
          const y = pad.top + i * barHeight + barGap / 2;
          const barW = (t.peak / maxMPW) * cw;

          return (
            <motion.g
              key={t.plan}
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              {/* Plan label */}
              <text
                x={pad.left - 8}
                y={y + (barHeight - barGap) / 2 + 4}
                textAnchor="end"
                fontSize="9"
                fontWeight="600"
                style={{ ...mono, fill: t.color }}
              >
                {t.plan}
              </text>

              {/* Bar background */}
              <rect
                x={pad.left}
                y={y}
                width={cw}
                height={barHeight - barGap}
                rx={3}
                fill={t.color}
                opacity={0.04}
              />

              {/* Animated bar */}
              <motion.rect
                x={pad.left}
                y={y}
                height={barHeight - barGap}
                rx={3}
                fill={t.color}
                opacity={0.3}
                initial={{ width: 0 }}
                animate={inView ? { width: barW } : { width: 0 }}
                transition={{
                  delay: 0.4 + i * 0.15,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />

              {/* MPW value */}
              <motion.text
                x={pad.left + barW + 6}
                y={y + (barHeight - barGap) / 2 + 3}
                fontSize="8"
                fontWeight="600"
                style={{ ...mono, fill: t.color }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.3 }}
              >
                {t.peak} mpw
              </motion.text>

              {/* Long run / med-long detail */}
              <motion.text
                x={pad.left + barW + 6}
                y={y + (barHeight - barGap) / 2 + 13}
                fontSize="6.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.7 } : {}}
                transition={{ delay: 0.9 + i * 0.15, duration: 0.3 }}
              >
                LR {t.longRun}mi / ML {t.medLong}mi
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// PfitzingerArticle (main export)
// ────────────────────────────────────

export function PfitzingerArticle() {
  return (
    <ArticleLayout
      title="Pfitzinger's Advanced Marathoning"
      subtitle="How an Olympic marathoner's science-backed system of high aerobic volume, medium-long runs, and lactate threshold work became the gold standard for serious marathon training."
      accentColor="#14b8a6"
    >
      {/* ── Introduction ── */}
      <section>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            In June 1984, Pete Pfitzinger lined up alongside Alberto Salazar at
            the U.S. Olympic Marathon Trials in Buffalo, New York. With less
            than half a mile to go, Pfitzinger surged past the heavily favored
            Salazar, winning in 2:11:43 by a single second. That gutsy kick
            earned him a spot on the Olympic team for the Los Angeles Games,
            where he finished 11th. Four years later he returned to represent
            the United States again at the Seoul Olympics, placing 14th.
          </p>
          <p className="text-muted leading-relaxed">
            But Pfitzinger&rsquo;s most lasting contribution to running came
            after his competitive career. Holding a Master&rsquo;s degree in
            exercise science and having served as a human laboratory for years
            of self-experimentation, he distilled his knowledge into{" "}
            <em>Advanced Marathoning</em>, co-authored with Scott Douglas and
            published by Human Kinetics. The book introduced a rigorous,
            science-grounded training framework where{" "}
            <strong>every workout has a specific physiological purpose</strong>{" "}
            — no junk miles, no tradition-for-tradition&rsquo;s-sake. Its
            hallmark innovation was the{" "}
            <strong>medium-long run</strong>: a mid-week run of 11 to 15 miles
            at endurance pace that provides a second weekly long-run stimulus
            without the full recovery cost of a Sunday 20-miler.
          </p>
          <p className="text-muted leading-relaxed">
            Pfitzinger&rsquo;s plans are built around Heart Rate Reserve (the
            Karvonen method), which accounts for individual differences in
            resting heart rate rather than relying on fixed percentages of
            maximum heart rate. This produces more physiologically accurate
            training zones for each athlete. The result is a system that scales
            from 55 to 105 miles per week across four plan tiers, all sharing
            the same 18-week periodized structure — making it one of the most
            widely used and trusted marathon training frameworks in the world.
          </p>
        </div>
      </section>

      {/* ── Key stats ── */}
      <div className="my-10 grid grid-cols-3 gap-4">
        <KeyStat value={22} label="mile peak long run" />
        <KeyStat value={2} label="Olympic marathons" />
        <KeyStat
          value={4}
          label="plan tiers (55-105 mpw)"
        />
      </div>

      <SectionDivider text="THE HEART RATE SYSTEM" />

      {/* ── Intensity Zones ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Training by Heart Rate Reserve
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Most training plans define intensity zones as percentages of maximum
            heart rate, but Pfitzinger recognized this approach has a
            fundamental limitation: it ignores resting heart rate. Two runners
            with the same max HR of 190 but resting HRs of 45 and 65 have very
            different cardiovascular fitness — and the same &ldquo;75%
            HRmax&rdquo; pace represents meaningfully different physiological
            demands for each.
          </p>
          <p className="text-muted leading-relaxed">
            The <strong>Heart Rate Reserve (HRR)</strong> method, also known as
            the Karvonen formula, solves this by defining intensity as a
            percentage of the <em>difference</em> between max and resting heart
            rate. The formula is: Target HR = Resting HR + (HRR percentage x
            (Max HR - Resting HR)). This produces zones that are individualized
            to each runner&rsquo;s current fitness level. As aerobic fitness
            improves and resting HR drops, the training paces recalibrate
            automatically.
          </p>
          <p className="text-muted leading-relaxed">
            Pfitzinger defines six training zones, each targeting a specific
            physiological adaptation. The zones overlap slightly at their
            boundaries — this is intentional, reflecting the continuous nature
            of metabolic transitions rather than artificial hard cutoffs.
          </p>
        </div>
      </section>

      <HRRZoneBars />

      <SectionDivider text="FOUR-PHASE PERIODIZATION" />

      {/* ── Periodization ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Building Fitness in Layers
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Pfitzinger structures every plan as an 18-week progression through
            four distinct phases. Each phase builds on the adaptations of the
            previous one, creating a layered fitness profile that peaks on race
            day. The system is conservative by design: no phase introduces more
            than one new stimulus at a time, and recovery weeks are built in at
            regular intervals.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Phase 1: Endurance (weeks 1-5)</strong> focuses on mileage
            building. Long runs and medium-long runs establish the aerobic base.
            Quality work is minimal — the goal is simply to build volume
            safely.{" "}
            <strong>Phase 2: Lactate Threshold + Endurance (weeks 6-11)</strong>{" "}
            introduces tempo runs that progressively lengthen from 4 to 7 miles
            at LT pace. Mileage continues to climb.{" "}
            <strong>Phase 3: Race Preparation (weeks 12-15)</strong> layers in
            VO2max intervals and marathon-pace segments within long runs. This
            is the hardest phase — total training stress is at its peak.{" "}
            <strong>Phase 4: Taper (weeks 16-18)</strong> drops volume by 50-70%
            while maintaining short, sharp efforts to preserve neuromuscular
            sharpness.
          </p>
        </div>
      </section>

      <PeriodizationDiagram />

      <SectionDivider text="THE TRAINING WEEK" />

      {/* ── Weekly Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Anatomy of a Pfitzinger Week
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The weekly structure in a Pfitzinger plan is meticulously
            sequenced to balance stimulus and recovery. Three days carry the
            training load: the mid-week medium-long run, a lactate threshold
            tempo, and the weekend long run. The remaining days are either full
            rest, cross-training, or easy running at recovery or general aerobic
            pace. The sequence matters: quality days are never placed back-to-back,
            and the hardest session (the long run) is positioned at the end of
            the week so the following rest day can absorb its recovery cost.
          </p>
          <p className="text-muted leading-relaxed">
            Below is a representative week from the 18/55 plan during the LT +
            Endurance phase. Note the deliberate rhythm: quality on Wednesday
            and Friday, long run on Sunday, with buffer days surrounding each.
            This pattern holds across all four plan tiers — the volume within
            each day scales, but the architecture remains constant.
          </p>
        </div>
      </section>

      <WeeklyStructureTimeline />

      <SectionDivider text="SIGNATURE WORKOUTS" />

      {/* ── Signature Workouts ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Workouts That Define the System
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Every Pfitzinger workout is prescribed with a specific physiological
            rationale. The medium-long run develops mitochondrial density and
            capillary growth. The LT tempo pushes the lactate threshold to
            higher paces. The long run with marathon-pace finish teaches the
            body to produce race effort on depleted glycogen stores. The VO2max
            intervals sharpen the top end of the aerobic system. There is no
            &ldquo;just go run&rdquo; — every session has a measurable purpose,
            and running it at the wrong intensity undermines that purpose.
          </p>
        </div>
      </section>

      <SignatureWorkoutsCards />

      <SectionDivider text="PLAN TIERS" />

      {/* ── Plan Tiers ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Four Tiers, One Architecture
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Pfitzinger offers four plan tiers, all following the same 18-week
            periodization structure. The 18/55 (55 miles per week peak) is the
            entry point, suitable for runners with a consistent 40+ mile base.
            The 18/70 adds a fifth running day and increases the medium-long
            run distance. The 18/85 and 18/105 plans are for elite-level
            athletes running 6-7 days per week, with doubles on some days at
            the highest tier.
          </p>
          <p className="text-muted leading-relaxed">
            The scaling is not simply &ldquo;more of everything.&rdquo; Higher
            tiers add volume primarily through additional easy and general
            aerobic mileage. The quality workout structure remains remarkably
            similar — the LT tempo and long run prescriptions are nearly
            identical across tiers. What changes is the aerobic support
            surrounding those key sessions.
          </p>
        </div>
      </section>

      <MileageTiersDiagram />

      <SectionDivider text="WHO IT'S FOR" />

      {/* ── Who It's For ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Who This System Serves Best
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The title says <em>Advanced Marathoning</em> and means it. This is
            not a couch-to-marathon program. Even the 18/55 plan — the most
            accessible tier — assumes the runner has already built a consistent
            base of at least 40 miles per week over several months. Runners
            newer to the distance are better served by a beginner-oriented plan
            (like Hal Higdon&rsquo;s Novice programs) before graduating to
            Pfitzinger.
          </p>
          <p className="text-muted leading-relaxed">
            The ideal Pfitzinger athlete is someone who has completed at least
            one marathon, understands their body&rsquo;s response to high
            mileage, and wants to train with scientific precision. These plans
            reward runners who appreciate the <em>why</em> behind each workout
            — why the medium-long run exists, why recovery pace matters, why the
            long run must be slower than marathon pace. Runners who just want
            to be told what to do without understanding the rationale may find
            the system rigid; those who want to become students of their own
            physiology will find it transformative.
          </p>
          <p className="text-muted leading-relaxed">
            The plans also work exceptionally well for runners targeting a
            specific time goal. Because the system is built around physiological
            zones rather than fixed paces, it self-adjusts: a runner whose
            fitness improves during the 18-week cycle will naturally run faster
            at the same heart rate zones, without needing to manually recalculate
            pace targets.
          </p>
        </div>
      </section>

      <SectionDivider text="PRACTICAL TAKEAWAYS" />

      {/* ── Takeaways ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Core Principles to Apply
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Whether you follow a Pfitzinger plan verbatim or simply borrow its
            ideas, these principles are the foundation of the system:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>The medium-long run is the secret weapon.</strong> A
              second weekly endurance stimulus of 11-15 miles dramatically
              accelerates aerobic development without the recovery cost of a
              full long run. If you add one thing from Pfitzinger to your
              training, make it this.
            </li>
            <li>
              <strong>
                Every workout must target a specific physiological system.
              </strong>{" "}
              Recovery runs develop nothing if done at general aerobic pace
              — they should be genuinely easy. LT tempos should feel
              comfortably hard, not all-out. Precision of effort is more
              important than hitting an arbitrary pace.
            </li>
            <li>
              <strong>
                Long runs 10-20% slower than marathon pace.
              </strong>{" "}
              Running long runs too fast is the most common training error
              Pfitzinger identifies. The purpose of the long run is time on
              feet and glycogen depletion — not pace. Running it too fast
              compromises recovery for the week ahead.
            </li>
            <li>
              <strong>
                Use Heart Rate Reserve, not just max HR.
              </strong>{" "}
              The Karvonen method produces more individualized zones. Calculate
              your HRR (max HR minus resting HR), then apply the zone
              percentages to set your training targets.
            </li>
            <li>
              <strong>
                Recovery enables adaptation — protect it ruthlessly.
              </strong>{" "}
              Do not do quality work when you are still sore or fatigued from
              a previous session. The adaptation happens during recovery, not
              during the workout itself. Skipping a quality day to recover
              properly is always the right call.
            </li>
          </ul>
        </div>
      </section>

      <SectionDivider text="SOURCES" />

      {/* ── Sources ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Sources & Further Reading
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <ExternalLink href="https://www.humankinetics.com/products/all-products/advanced-marathoning-2nd-edition">
              Pfitzinger & Douglas — Advanced Marathoning, 2nd Edition (Human
              Kinetics)
            </ExternalLink>
            {" "}— The primary source for all plan structures, zone
            definitions, workout prescriptions, and periodization philosophy.
          </p>
          <p>
            <ExternalLink href="https://fellrnr.com/wiki/A_Comparison_of_Marathon_Training_Plans">
              Fellrnr — A Comparison of Marathon Training Plans
            </ExternalLink>
            {" "}— Detailed independent review comparing Pfitzinger&rsquo;s
            plans to Daniels, Hanson, Higdon, and others, with analysis of
            physiological rationale.
          </p>
          <p>
            <ExternalLink href="https://runninwithrock.wordpress.com/2017/11/21/pfitzinger-marathon-training-overview/">
              Running with Rock — Pfitzinger Marathon Training Overview
            </ExternalLink>
            {" "}— Practical walkthrough of the 18/55 and 18/70 plans with
            weekly mileage breakdowns and workout descriptions.
          </p>
          <p>
            <ExternalLink href="https://en.wikipedia.org/wiki/Pete_Pfitzinger">
              Wikipedia — Pete Pfitzinger
            </ExternalLink>
            {" "}— Biographical details including Olympic results, Trials
            victories, and post-competition career in exercise science.
          </p>
          <p>
            <ExternalLink href="https://runbryanrun.com/pfitzinger-training-guide/">
              RunBryanRun — Pfitzinger Training Guide
            </ExternalLink>
            {" "}— Runner&rsquo;s experience report with practical tips for
            executing the 18/55 plan, including adaptation strategies for
            the medium-long run.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
