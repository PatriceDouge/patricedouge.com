"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import {
  Figure,
  mono,
} from "@/components/PhilosophyShared";

// ────────────────────────────────────
// LactateCurveDiagram
// ────────────────────────────────────

export function LactateCurveDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Chart area constants
  const pad = { top: 20, right: 30, bottom: 50, left: 55 };
  const W = 520;
  const H = 300;
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  // Lactate curve points (pace increasing left to right, lactate on y)
  // X: 0-100 (pace intensity), Y: 0-12 (mmol/L)
  const curvePoints = [
    [0, 0.8],
    [10, 0.9],
    [20, 1.0],
    [30, 1.2],
    [40, 1.6],
    [48, 2.0], // LT1
    [55, 2.5],
    [62, 3.2],
    [70, 4.0], // LT2
    [76, 5.2],
    [82, 6.8],
    [88, 8.5],
    [94, 10.5],
    [100, 12.0],
  ];

  const toX = (pct: number) => pad.left + (pct / 100) * cw;
  const toY = (mmol: number) => pad.top + ch - (mmol / 13) * ch;

  // Build SVG path
  const pathD = curvePoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p[0]).toFixed(1)},${toY(p[1]).toFixed(1)}`)
    .join(" ");

  // Sweet spot fill area (between LT1 x and LT2 x, under the curve)
  const lt1X = toX(48);
  const lt2X = toX(70);
  const lt1Y = toY(2.0);
  const lt2Y = toY(4.0);

  // Subset of curve between LT1 and LT2
  const sweetSpotPoints = curvePoints.filter((p) => p[0] >= 48 && p[0] <= 70);
  const sweetSpotPath =
    `M${lt1X},${toY(0)} ` +
    `L${lt1X},${lt1Y} ` +
    sweetSpotPoints
      .map((p) => `L${toX(p[0]).toFixed(1)},${toY(p[1]).toFixed(1)}`)
      .join(" ") +
    ` L${lt2X},${lt2Y} ` +
    `L${lt2X},${toY(0)} Z`;

  // Y-axis ticks
  const yTicks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <Figure caption="The exponential lactate curve. The Norwegian method targets the 'sweet spot' between LT1 and LT2 where lactate production and clearance are in dynamic equilibrium.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Grid lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          {yTicks.map((t) => (
            <line
              key={t}
              x1={pad.left}
              y1={toY(t)}
              x2={W - pad.right}
              y2={toY(t)}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          ))}
        </motion.g>

        {/* Sweet spot zone fill */}
        <motion.path
          d={sweetSpotPath}
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
        />

        {/* LT1 dashed line */}
        <motion.line
          x1={pad.left}
          y1={toY(2)}
          x2={W - pad.right}
          y2={toY(2)}
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 0.8, duration: 0.4 }}
        />

        {/* LT2 dashed line */}
        <motion.line
          x1={pad.left}
          y1={toY(4)}
          x2={W - pad.right}
          y2={toY(4)}
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.0, duration: 0.4 }}
        />

        {/* LT1 label */}
        <motion.g
          initial={{ opacity: 0, x: 8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <text
            x={W - pad.right + 4}
            y={toY(2) + 4}
            fontSize="9"
            style={{ ...mono, fill: "var(--accent)" }}
          >
            LT1
          </text>
          <text
            x={W - pad.right + 4}
            y={toY(2) + 14}
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            ~2 mmol/L
          </text>
        </motion.g>

        {/* LT2 label */}
        <motion.g
          initial={{ opacity: 0, x: 8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          <text
            x={W - pad.right + 4}
            y={toY(4) + 4}
            fontSize="9"
            style={{ ...mono, fill: "#f59e0b" }}
          >
            LT2
          </text>
          <text
            x={W - pad.right + 4}
            y={toY(4) + 14}
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            ~4 mmol/L
          </text>
        </motion.g>

        {/* Sweet spot label */}
        <motion.text
          x={(lt1X + lt2X) / 2}
          y={toY(3) - 4}
          textAnchor="middle"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.05em"
          style={{ ...mono, fill: "var(--accent)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.8 } : {}}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          SWEET SPOT
        </motion.text>

        {/* Zone labels below the x-axis region */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          {/* Zone 1 */}
          <rect
            x={toX(0)}
            y={H - pad.bottom + 18}
            width={toX(48) - toX(0)}
            height="4"
            rx="2"
            fill="var(--accent)"
            opacity="0.25"
          />
          <text
            x={(toX(0) + toX(48)) / 2}
            y={H - pad.bottom + 34}
            textAnchor="middle"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            ZONE 1 (EASY)
          </text>

          {/* Zone 2 */}
          <rect
            x={toX(48)}
            y={H - pad.bottom + 18}
            width={toX(70) - toX(48)}
            height="4"
            rx="2"
            fill="#f59e0b"
            opacity="0.4"
          />
          <text
            x={(toX(48) + toX(70)) / 2}
            y={H - pad.bottom + 34}
            textAnchor="middle"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            ZONE 2
          </text>

          {/* Zone 3 */}
          <rect
            x={toX(70)}
            y={H - pad.bottom + 18}
            width={toX(100) - toX(70)}
            height="4"
            rx="2"
            fill="#ef4444"
            opacity="0.35"
          />
          <text
            x={(toX(70) + toX(100)) / 2}
            y={H - pad.bottom + 34}
            textAnchor="middle"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            ZONE 3 (HIGH)
          </text>
        </motion.g>

        {/* Animated lactate curve */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 1.5, ease: "easeInOut" }}
        />

        {/* Y-axis labels */}
        {yTicks.map((t) => (
          <text
            key={t}
            x={pad.left - 8}
            y={toY(t) + 3}
            textAnchor="end"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            {t}
          </text>
        ))}

        {/* Y-axis title */}
        <text
          x="14"
          y={pad.top + ch / 2}
          textAnchor="middle"
          fontSize="8"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          transform={`rotate(-90, 14, ${pad.top + ch / 2})`}
        >
          Blood Lactate (mmol/L)
        </text>

        {/* X-axis title */}
        <text
          x={pad.left + cw / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize="8"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          Running Intensity (pace) →
        </text>

        {/* Axes */}
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={H - pad.bottom}
          stroke="var(--border)"
          strokeWidth="1"
        />
        <line
          x1={pad.left}
          y1={H - pad.bottom}
          x2={W - pad.right}
          y2={H - pad.bottom}
          stroke="var(--border)"
          strokeWidth="1"
        />
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// ZoneDistributionBars
// ────────────────────────────────────

export function ZoneDistributionBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const zones = [
    {
      name: "Zone 1 — Easy",
      percent: 78,
      color: "var(--accent)",
      hr: "< 75% HRmax",
      lactate: "< 2 mmol/L",
      description: "Recovery, base aerobic, long easy runs",
    },
    {
      name: "Zone 2 — Threshold",
      percent: 17,
      color: "#f59e0b",
      hr: "82-88% HRmax",
      lactate: "2-4 mmol/L",
      description: "LT1 intervals, tempo, progression runs",
    },
    {
      name: "Zone 3 — High Intensity",
      percent: 5,
      color: "#ef4444",
      hr: "> 90% HRmax",
      lactate: "> 4 mmol/L",
      description: "VO2max intervals, race-pace work",
    },
  ];

  return (
    <Figure caption="Norwegian volume distribution across a typical training week. The vast majority of work is aerobic — quality over quantity at threshold.">
      <div ref={ref} className="space-y-6">
        {zones.map((z, i) => (
          <motion.div
            key={z.name}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className="text-sm font-medium text-foreground"
                style={mono}
              >
                {z.name}
              </span>
              <span
                className="text-xs text-muted-foreground"
                style={mono}
              >
                ~{z.percent}%
              </span>
            </div>

            <div className="relative h-7 rounded overflow-hidden">
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
                  delay: 0.3 + i * 0.15,
                  duration: 0.9,
                  ease: "easeOut",
                }}
              />
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5">
              <span
                className="text-[11px] text-muted-foreground"
                style={mono}
              >
                HR: {z.hr}
              </span>
              <span
                className="text-[11px] text-muted-foreground"
                style={mono}
              >
                Lactate: {z.lactate}
              </span>
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

export function WeeklyStructureTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const days = [
    {
      label: "Mon",
      type: "threshold",
      session: "5×6 min LT1",
      color: "var(--accent)",
      intensity: "quality",
    },
    {
      label: "Tue",
      type: "easy",
      session: "Easy 50 min",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Wed",
      type: "threshold",
      session: "4×8 min LT2",
      color: "var(--accent)",
      intensity: "quality",
    },
    {
      label: "Thu",
      type: "easy",
      session: "Easy 45 min",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Fri",
      type: "easy",
      session: "Easy 40 min",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Sat",
      type: "long",
      session: "Long 90 min",
      color: "var(--accent)",
      intensity: "long",
    },
    {
      label: "Sun",
      type: "easy",
      session: "Recovery 30 min",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
  ];

  return (
    <Figure caption="A typical Norwegian week: two threshold sessions (Mon/Wed), one longer aerobic run (Sat), and four easy/recovery days. Every quality session is lactate-guided.">
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
                      ? "var(--accent)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </div>
                <div
                  className="rounded-md py-4 px-1 border"
                  style={{
                    borderColor: highlight
                      ? "var(--accent)"
                      : "var(--border)",
                    background: highlight
                      ? "var(--accent)"
                      : "transparent",
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
                        ? "var(--accent)"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isQuality && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "var(--accent)" }}
                      >
                        Quality
                      </span>
                    )}
                    {isLong && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "var(--accent)", opacity: 0.7 }}
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
                  borderColor: highlight
                    ? "var(--accent)"
                    : "var(--border)",
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
                      ? "var(--accent)"
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
                    style={{ ...mono, color: "var(--accent)" }}
                  >
                    Quality
                  </span>
                )}
                {isLong && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "var(--accent)", opacity: 0.7 }}
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
// WorkoutExamplesTable
// ────────────────────────────────────

export function WorkoutExamplesTable() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const workouts = [
    {
      name: "LT1 Intervals",
      structure: "5-6 × 6 min, 1 min jog",
      target: "~2 mmol/L lactate",
      effort: "Comfortably hard, conversational",
      zone: "Zone 2 (low)",
      color: "var(--accent)",
    },
    {
      name: "LT2 Repeats",
      structure: "4-5 × 8 min, 2 min jog",
      target: "~3.5-4 mmol/L lactate",
      effort: "Tempo pace, rhythmic",
      zone: "Zone 2 (high)",
      color: "#f59e0b",
    },
    {
      name: "Progression Long Run",
      structure: "90 min total, last 20 min at LT1",
      target: "Finish near ~2 mmol/L",
      effort: "Easy → moderate → threshold",
      zone: "Zone 1 → 2",
      color: "var(--accent)",
    },
    {
      name: "Double Threshold Day",
      structure: "AM: 5×6 min LT1 / PM: 4×5 min LT2",
      target: "AM ~2, PM ~3.5 mmol/L",
      effort: "Two controlled efforts, full recovery between",
      zone: "Zone 2",
      color: "#f59e0b",
    },
  ];

  return (
    <Figure caption="Core Norwegian workouts. Note the precise lactate targets — every quality session is measured, not guessed.">
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
                {w.zone}
              </span>
            </div>
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
// NorwegianArticle (main export)
// ────────────────────────────────────
