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
// LactateCurveDiagram
// ────────────────────────────────────

function LactateCurveDiagram() {
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

function ZoneDistributionBars() {
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

function WeeklyStructureTimeline() {
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

function WorkoutExamplesTable() {
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

export function NorwegianArticle() {
  return (
    <ArticleLayout
      title="The Norwegian Singles Method"
      subtitle="How lactate-guided threshold training reshaped distance running — from Marius Bakken's lab to Jakob Ingebrigtsen's world records."
      accentColor="#3b82f6"
    >
      {/* ── Introduction ── */}
      <section>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            In the late 1990s, a Norwegian distance runner named Marius Bakken
            began asking a deceptively simple question: what if the key to
            running faster was not running harder, but running{" "}
            <em>more precisely</em>? Working with exercise physiologists at the
            Norwegian School of Sport Sciences in Oslo, Bakken developed a
            training framework built on a single metric — blood lactate
            concentration — measured repeatedly across thousands of sessions.
          </p>
          <p className="text-muted leading-relaxed">
            The result was a philosophy that would eventually become known as the
            Norwegian method, or more specifically, the &ldquo;Norwegian
            singles&rdquo; approach to threshold training. Its core insight is
            counterintuitive: the fastest path to racing faster is not to do more
            high-intensity work, but to do more{" "}
            <em>controlled threshold work</em> — training at intensities that
            sit precisely between the first and second lactate thresholds,
            accumulating volume in a narrow physiological window that maximizes
            adaptation while minimizing recovery cost.
          </p>
          <p className="text-muted leading-relaxed">
            What began as one athlete&rsquo;s research project has since become
            the dominant paradigm in Norwegian distance running, producing a
            generation of world-class athletes from 1500 meters to the marathon.
          </p>
        </div>
      </section>

      {/* ── Key stats ── */}
      <div className="my-10 grid grid-cols-3 gap-4">
        <KeyStat
          value={5500}
          label="Lactate tests conducted"
          format={(n) => `${Math.round(n / 100) * 100 >= 1000 ? Math.round(n).toLocaleString() + "+" : Math.round(n).toLocaleString()}`}
        />
        <KeyStat
          value={2.5}
          label="mmol/L sweet spot"
          format={(n) => n.toFixed(1)}
        />
        <KeyStat
          value={78}
          label="% easy volume"
          format={(n) => `${Math.round(n)}%`}
        />
      </div>

      <SectionDivider text="THE SCIENCE" />

      {/* ── The Physiology ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Why Lactate Thresholds Matter
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Every runner has two critical metabolic inflection points. The first,
            known as <strong>LT1</strong> (the first lactate threshold or
            aerobic threshold), occurs at roughly 2 mmol/L of blood lactate. Below
            this intensity, lactate production and clearance are easily balanced
            — you can run here all day. The second,{" "}
            <strong>LT2</strong> (the anaerobic threshold or MLSS — maximal
            lactate steady state), occurs around 4 mmol/L. Above this point,
            lactate accumulates exponentially and fatigue follows rapidly.
          </p>
          <p className="text-muted leading-relaxed">
            The Norwegian insight was that the zone{" "}
            <em>between</em> LT1 and LT2 is where the most potent aerobic
            adaptations occur. Training in this range — typically 2 to 4 mmol/L
            — provides a powerful stimulus to mitochondrial biogenesis, capillary
            density, and lactate shuttle enzyme activity, without the systemic
            fatigue cost of true high-intensity (VO2max) work. The body learns to
            produce more energy aerobically at faster paces, and critically, to{" "}
            <em>clear lactate more efficiently</em> while doing so.
          </p>
          <p className="text-muted leading-relaxed">
            This is the mechanism behind what exercise physiologists call a
            &ldquo;rightward shift&rdquo; of the lactate curve — the ability to
            run faster before lactate begins its exponential rise. Over months
            and years of consistent threshold training, the curve shifts
            substantially, meaning paces that once produced 4 mmol/L now produce
            only 2.5 mmol/L. The athlete gets faster without necessarily getting
            fitter in VO2max terms.
          </p>
        </div>
      </section>

      <LactateCurveDiagram />

      <SectionDivider text="THE THREE-ZONE MODEL" />

      {/* ── Zone Model ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Three Zones, Strict Boundaries
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Unlike the five- or seven-zone models common in many training
            systems, the Norwegian approach simplifies intensity into{" "}
            <strong>three zones</strong> defined by lactate concentration. This
            simplicity is intentional — it forces a binary decision on every run:
            are you below LT1 (easy), between LT1 and LT2 (threshold), or above
            LT2 (high intensity)?
          </p>
          <p className="text-muted leading-relaxed">
            The critical discipline is that easy running must be{" "}
            <em>truly easy</em> — comfortably below 2 mmol/L, often well below
            75% of maximum heart rate. Many athletes fail with this system not
            because they cannot handle the threshold work, but because they
            refuse to run easy enough on recovery days, chronically elevating
            their baseline fatigue and blunting the adaptation from quality
            sessions.
          </p>
          <p className="text-muted leading-relaxed">
            The distribution is striking: approximately 75-80% of total training
            volume falls in Zone 1, 15-20% in Zone 2 (threshold), and only about
            5% in Zone 3 (above LT2). This is not polarized training in the
            traditional sense — the threshold zone is the primary quality zone,
            not the VO2max zone.
          </p>
        </div>
      </section>

      <ZoneDistributionBars />

      <SectionDivider text="THE TRAINING WEEK" />

      {/* ── Weekly Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Structure of a Norwegian Week
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The weekly structure reflects the philosophy&rsquo;s core tension:
            high frequency of quality work paired with ruthless protection of
            easy days. A typical week features two dedicated threshold sessions
            (often Monday and Wednesday), a longer aerobic run on Saturday, and
            four genuinely easy recovery days. Some elite athletes push this to
            three threshold sessions or incorporate the famous &ldquo;double
            threshold day&rdquo; — an AM session at LT1 pace and a PM session at
            LT2 pace, separated by 6-8 hours of rest.
          </p>
          <p className="text-muted leading-relaxed">
            The key innovation is that threshold work is done as{" "}
            <strong>singles</strong> — single-effort intervals (typically 5-10
            minutes each) with short recovery jogs, rather than continuous tempo
            runs. This structure allows athletes to accumulate more total time at
            threshold intensity with better form and more consistent lactate
            readings than they could sustain in one continuous effort.
          </p>
        </div>
      </section>

      <WeeklyStructureTimeline />

      <SectionDivider text="KEY WORKOUTS" />

      {/* ── Workout Examples ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Core Workouts
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Every quality session in the Norwegian system is defined not by pace
            or heart rate alone, but by{" "}
            <strong>blood lactate concentration</strong>. Athletes prick their
            finger between intervals, feed the sample into a portable lactate
            analyzer, and adjust pace in real time. The target is the number, not
            the clock. If 3:20/km produces 2.1 mmol/L on Monday but altitude,
            heat, or fatigue means the same effort yields 2.8 mmol/L on
            Wednesday, the pace drops. The physiology dictates the training, not
            the training plan.
          </p>
        </div>
      </section>

      <WorkoutExamplesTable />

      <SectionDivider text="NOTABLE ATHLETES" />

      {/* ── Athletes ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Athletes Who Proved It
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Norwegian method&rsquo;s most visible success story is the{" "}
            <strong>Ingebrigtsen family</strong> — three brothers, all
            world-class middle-distance runners, trained by their father Gjert
            using a system heavily influenced by the Norwegian threshold
            philosophy. The youngest,{" "}
            <strong>Jakob Ingebrigtsen</strong>, became Olympic champion at
            1500m in Tokyo (2021) and has since broken world records at the mile
            (3:43.73) and 2 miles. His training logs reveal an extraordinary
            commitment to the threshold zone: even as a 1500m specialist, a
            large percentage of his quality work sits at LT1 and LT2 paces, not
            at race pace or above.
          </p>
          <p className="text-muted leading-relaxed">
            What makes Jakob&rsquo;s case compelling is that he runs the majority
            of his training at intensities that would feel &ldquo;too slow&rdquo;
            to most competitive middle-distance runners. His easy days are
            genuinely easy — often 5:00-5:30/km for someone who races 1500m in
            under 3:30. The discipline to train below capacity on most days is
            what allows the quality sessions to be truly productive.
          </p>
          <p className="text-muted leading-relaxed">
            Beyond the Ingebritsens, the method has influenced{" "}
            <strong>Karsten Warholm</strong> (400m hurdles world record holder,
            who uses lactate-guided threshold work for aerobic development),{" "}
            and a growing number of marathon runners worldwide. Coaches like{" "}
            <strong>Renato Canova</strong> have noted parallels between the
            Norwegian threshold emphasis and the tempo-heavy training long
            practiced by East African runners — suggesting the model may be less
            a Norwegian invention than a Norwegian{" "}
            <em>quantification</em> of principles that elite endurance athletes
            have intuitively followed for decades.
          </p>
        </div>
      </section>

      {/* ── Adaptation for Marathon ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Adapting the Model for the Marathon
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            While the Norwegian method originated in middle-distance running,
            its principles transfer naturally to the marathon. Marathon pace for
            a well-trained runner typically falls near or just below LT1 — the
            exact zone that Norwegian training emphasizes. By building an
            enormous aerobic base through high-volume easy running and
            layering in frequent threshold work, athletes develop the metabolic
            machinery to sustain faster paces for 26.2 miles.
          </p>
          <p className="text-muted leading-relaxed">
            The key adaptation for marathon training is extending the{" "}
            <strong>progression long run</strong>. Rather than running long runs
            entirely easy, the Norwegian-influenced marathoner finishes the last
            20-30 minutes at LT1 pace. This teaches the body to produce
            threshold-quality work on tired legs — a direct simulation of the
            final miles of a marathon where glycogen is depleted and the ability
            to clear lactate becomes the limiting factor.
          </p>
          <p className="text-muted leading-relaxed">
            The double threshold day also proves valuable for marathon athletes.
            By splitting threshold work into two shorter sessions separated by
            hours of recovery, a runner can accumulate 40-50 minutes of quality
            threshold volume in a single day — far more than most could sustain
            in a single session — without the mechanical stress of a single
            prolonged tempo effort.
          </p>
        </div>
      </section>

      <SectionDivider text="COMPARISON" />

      {/* ── Norwegian vs Traditional ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Norwegian vs. Traditional Polarized
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Norwegian method is sometimes conflated with{" "}
            <strong>polarized training</strong> (the 80/20 model), but the two
            differ in a critical way. Traditional polarized training places
            quality work <em>above</em> LT2 — in the VO2max zone. The middle
            zone (threshold) is treated as a &ldquo;no man&rsquo;s land&rdquo;
            that produces fatigue without sufficient stimulus. The Norwegian
            model inverts this: the threshold zone{" "}
            <em>is</em> the primary quality zone, and VO2max work is used
            sparingly, typically only 5% of total volume.
          </p>
        </div>

        <div className="my-8 space-y-3">
          <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
            Traditional Polarized (80/20)
          </div>
          <AnimatedBar percent={80} color="var(--accent)" label="Easy" delay={0} />
          <AnimatedBar percent={5} color="#f59e0b" label="Threshold" delay={0.1} />
          <AnimatedBar percent={15} color="#ef4444" label="VO2max+" delay={0.2} />

          <div className="text-xs text-accent mb-2 mt-6 font-medium uppercase tracking-wider">
            Norwegian Model
          </div>
          <AnimatedBar percent={78} color="var(--accent)" label="Easy" delay={0.3} />
          <AnimatedBar percent={17} color="#f59e0b" label="Threshold" delay={0.4} />
          <AnimatedBar percent={5} color="#ef4444" label="VO2max+" delay={0.5} />
        </div>

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The practical difference is substantial. A polarized athlete might do
            two VO2max interval sessions per week (e.g., 5x1000m at 3K pace)
            and recover with easy running. A Norwegian-trained athlete instead
            does two threshold sessions (e.g., 5x6min at LT1, 4x8min at LT2)
            that produce less acute fatigue, enable faster recovery, and allow
            for higher weekly training consistency. Over months, the Norwegian
            athlete accumulates far more total time at meaningful aerobic
            intensities.
          </p>
        </div>
      </section>

      <SectionDivider text="PRACTICAL TAKEAWAYS" />

      {/* ── Takeaways ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Applying Norwegian Principles
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            You do not need a portable lactate analyzer to benefit from the
            Norwegian philosophy (though they have become increasingly accessible
            and affordable). The core principles can be applied with perceived
            effort and heart rate:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Easy runs truly easy.</strong> If you can&rsquo;t
              comfortably hold a conversation, you are running too hard. Aim for
              below 75% HRmax on all non-quality days.
            </li>
            <li>
              <strong>Threshold as singles, not tempos.</strong> Break threshold
              work into 5-8 minute intervals with 1-2 minutes of easy jogging.
              This accumulates more quality volume than a continuous effort.
            </li>
            <li>
              <strong>Two quality days per week minimum.</strong> Consistency of
              threshold stimulus matters more than any single heroic session.
            </li>
            <li>
              <strong>Progression long runs.</strong> Finish your long run with
              15-25 minutes at a comfortably hard (LT1-range) pace rather than
              running the entire distance easy.
            </li>
            <li>
              <strong>Measure, do not guess.</strong> Whether via lactate, heart
              rate, or pace drift, have an objective metric guiding intensity.
              The Norwegian method works because it removes ego from training.
            </li>
          </ul>
        </div>
      </section>

      <SectionDivider text="SOURCES" />

      {/* ── Sources ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Sources & Further Reading</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <ExternalLink href="https://www.mariusbakken.com/the-norwegian-model.html">
              Marius Bakken — The Norwegian Model
            </ExternalLink>
            {" "}— Original description of the lactate-guided threshold training
            system, including workout prescriptions and physiological rationale.
          </p>
          <p>
            <ExternalLink href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10890813/">
              Casado et al. (2024) — &ldquo;The Training Intensity Distribution
              in Middle- and Long-Distance Runners&rdquo;
            </ExternalLink>
            {" "}— Systematic review of training intensity distribution across
            elite endurance athletes, with analysis of threshold-focused models.
          </p>
          <p>
            <ExternalLink href="https://www.frontiersin.org/articles/10.3389/fphys.2022.1078662/full">
              Haugen et al. (2022) — &ldquo;The Training Characteristics of
              World-Class Distance Runners&rdquo;
            </ExternalLink>
            {" "}— Analysis of Norwegian national team training data including
            lactate-guided protocols.
          </p>
          <p>
            <ExternalLink href="https://www.scienceofultra.com/podcasts/norwegian-training-model">
              Science of Ultra — Norwegian Training Model
            </ExternalLink>
            {" "}— Podcast discussion of the Norwegian system&rsquo;s application
            across endurance events.
          </p>
          <p>
            <ExternalLink href="https://www.worldathletics.org/athletes/norway/jakob-ingebrigtsen-14628129">
              World Athletics — Jakob Ingebrigtsen Profile
            </ExternalLink>
            {" "}— Competition results and records for the method&rsquo;s most
            prominent athlete.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
