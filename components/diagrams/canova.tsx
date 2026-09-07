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
// FunnelPeriodizationDiagram
// ────────────────────────────────────

export function FunnelPeriodizationDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 340;
  const pad = { top: 30, right: 40, bottom: 50, left: 40 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  // Funnel stages from top (general) to bottom (specific/race)
  const stages = [
    { label: "GENERAL", range: "80-115%", widthPct: 100, y: 0 },
    { label: "FUNDAMENTAL", range: "85-110%", widthPct: 78, y: 0.25 },
    { label: "SPECIAL", range: "88-107%", widthPct: 55, y: 0.5 },
    { label: "SPECIFIC", range: "95-105%", widthPct: 32, y: 0.75 },
    { label: "RACE", range: "100%", widthPct: 10, y: 1.0 },
  ];

  const cx = pad.left + cw / 2;

  // Build funnel trapezoid path pairs
  const funnelLeftPoints = stages.map((s) => {
    const halfW = (s.widthPct / 100) * (cw / 2);
    return { x: cx - halfW, y: pad.top + s.y * ch };
  });
  const funnelRightPoints = stages.map((s) => {
    const halfW = (s.widthPct / 100) * (cw / 2);
    return { x: cx + halfW, y: pad.top + s.y * ch };
  });

  // Build left edge path and right edge path
  const leftPath = funnelLeftPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const rightPath = funnelRightPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // Filled funnel shape
  const funnelFillPath =
    funnelLeftPoints
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ") +
    " " +
    [...funnelRightPoints]
      .reverse()
      .map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ") +
    " Z";

  // Speed label on left, Endurance label on right
  const speedLinePoints = stages.map((s) => {
    // Speed starts wide (high % race pace) and narrows
    const offset = (1 - s.y) * (cw * 0.35);
    return { x: cx - offset * 0.3, y: pad.top + s.y * ch };
  });
  const enduranceLinePoints = stages.map((s) => {
    const offset = (1 - s.y) * (cw * 0.35);
    return { x: cx + offset * 0.3, y: pad.top + s.y * ch };
  });

  const speedPath = speedLinePoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const endurancePath = enduranceLinePoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <Figure caption="Canova's funnel periodization. The range of training intensities narrows as competition approaches, converging on race pace. Speed work slows down; endurance work speeds up.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Background grid lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          {stages.map((s, i) => (
            <line
              key={i}
              x1={pad.left}
              y1={pad.top + s.y * ch}
              x2={W - pad.right}
              y2={pad.top + s.y * ch}
              stroke="var(--border)"
              strokeWidth="0.5"
              strokeDasharray={i === stages.length - 1 ? "0" : "4 3"}
            />
          ))}
        </motion.g>

        {/* Funnel fill */}
        <motion.path
          d={funnelFillPath}
          fill="#f97316"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.08 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        />

        {/* Animated funnel left edge */}
        <motion.path
          d={leftPath}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.8 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
        />

        {/* Animated funnel right edge */}
        <motion.path
          d={rightPath}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.8 } : {}}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
        />

        {/* Speed convergence line (dashed, inside funnel) */}
        <motion.path
          d={speedPath}
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.6 } : {}}
          transition={{ delay: 1.0, duration: 1.0, ease: "easeInOut" }}
        />

        {/* Endurance convergence line (dashed, inside funnel) */}
        <motion.path
          d={endurancePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.6 } : {}}
          transition={{ delay: 1.0, duration: 1.0, ease: "easeInOut" }}
        />

        {/* Speed label (top left inside funnel) */}
        <motion.text
          x={cx - cw * 0.28}
          y={pad.top + 16}
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.05em"
          style={{ ...mono, fill: "#ef4444" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          SPEED (115%)
        </motion.text>

        {/* Endurance label (top right inside funnel) */}
        <motion.text
          x={cx + cw * 0.08}
          y={pad.top + 16}
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.05em"
          style={{ ...mono, fill: "#3b82f6" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          ENDURANCE (80%)
        </motion.text>

        {/* Stage labels on the right */}
        {stages.map((s, i) => (
          <motion.g
            key={s.label}
            initial={{ opacity: 0, x: 8 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
          >
            <text
              x={W - pad.right + 6}
              y={pad.top + s.y * ch + 4}
              fontSize="8"
              fontWeight="600"
              style={{ ...mono, fill: i === stages.length - 1 ? "#f97316" : "var(--muted-foreground)" }}
            >
              {s.label}
            </text>
            <text
              x={W - pad.right + 6}
              y={pad.top + s.y * ch + 14}
              fontSize="7"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
            >
              {s.range}
            </text>
          </motion.g>
        ))}

        {/* Center convergence label */}
        <motion.text
          x={cx}
          y={pad.top + ch + 6}
          textAnchor="middle"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.08em"
          style={{ ...mono, fill: "#f97316" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.9 } : {}}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          RACE PACE CONVERGENCE
        </motion.text>

        {/* Y-axis label */}
        <text
          x="12"
          y={pad.top + ch / 2}
          textAnchor="middle"
          fontSize="8"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          transform={`rotate(-90, 12, ${pad.top + ch / 2})`}
        >
          Training Timeline
        </text>

        {/* Arrow at bottom center */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 2.0, duration: 0.4 }}
        >
          <line
            x1={cx}
            y1={pad.top + ch + 12}
            x2={cx}
            y2={pad.top + ch + 30}
            stroke="#f97316"
            strokeWidth="1.5"
          />
          <polygon
            points={`${cx - 4},${pad.top + ch + 26} ${cx + 4},${pad.top + ch + 26} ${cx},${pad.top + ch + 32}`}
            fill="#f97316"
          />
          <text
            x={cx}
            y={pad.top + ch + 44}
            textAnchor="middle"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            COMPETITION
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// TrainingPhasesDiagram
// ────────────────────────────────────

export function TrainingPhasesDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const phases = [
    {
      name: "Transition",
      weeks: "~4 wk",
      desc: "Post-race recovery",
      color: "var(--muted-foreground)",
      widthPct: 12,
    },
    {
      name: "General",
      weeks: "~4 wk",
      desc: "Rebuilding base",
      color: "#3b82f6",
      widthPct: 12,
    },
    {
      name: "Fundamental",
      weeks: "~6 wk",
      desc: "Long fast runs, 87-95% MP",
      color: "#8b5cf6",
      widthPct: 20,
    },
    {
      name: "Special",
      weeks: "~6-8 wk",
      desc: "Special blocks, event divergence",
      color: "#f59e0b",
      widthPct: 24,
    },
    {
      name: "Specific",
      weeks: "~8-10 wk",
      desc: "Race-pace convergence",
      color: "#f97316",
      widthPct: 32,
    },
  ];

  const W = 520;
  const H = 180;
  const barY = 50;
  const barH = 28;
  const totalPad = 40;

  let cumX = totalPad;

  return (
    <Figure caption="Canova's five training phases. Each phase builds on the previous one; no quality is abandoned, only narrowed toward race specificity.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Timeline arrow */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          <line
            x1={totalPad}
            y1={barY + barH + 20}
            x2={W - totalPad}
            y2={barY + barH + 20}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <polygon
            points={`${W - totalPad - 6},${barY + barH + 16} ${W - totalPad},${barY + barH + 20} ${W - totalPad - 6},${barY + barH + 24}`}
            fill="var(--border)"
          />
          <text
            x={W - totalPad}
            y={barY + barH + 36}
            textAnchor="end"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            RACE DAY
          </text>
        </motion.g>

        {/* Phase label at top */}
        <text
          x={totalPad}
          y={20}
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.08em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          MACROCYCLE PHASES
        </text>

        {/* Phase bars */}
        {phases.map((p, i) => {
          const barW = ((W - totalPad * 2) * p.widthPct) / 100;
          const x = cumX;
          cumX += barW;

          return (
            <motion.g
              key={p.name}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: "easeOut" }}
            >
              {/* Bar background */}
              <rect
                x={x + 1}
                y={barY}
                width={barW - 2}
                height={barH}
                rx="4"
                fill={p.color}
                opacity="0.15"
              />
              {/* Animated fill */}
              <motion.rect
                x={x + 1}
                y={barY}
                height={barH}
                rx="4"
                fill={p.color}
                opacity="0.35"
                initial={{ width: 0 }}
                animate={inView ? { width: barW - 2 } : { width: 0 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.7, ease: "easeOut" }}
              />
              {/* Phase name */}
              <text
                x={x + barW / 2}
                y={barY + barH / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={barW > 60 ? "8" : "7"}
                fontWeight="600"
                style={{ ...mono, fill: p.color }}
              >
                {p.name.toUpperCase()}
              </text>
              {/* Duration below bar */}
              <text
                x={x + barW / 2}
                y={barY + barH + 12}
                textAnchor="middle"
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {p.weeks}
              </text>
              {/* Description below timeline */}
              <text
                x={x + barW / 2}
                y={barY + barH + 48}
                textAnchor="middle"
                fontSize="6.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {p.desc}
              </text>
            </motion.g>
          );
        })}
      </svg>
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
      label: "Day 1",
      type: "quality",
      session: "Long fast run or specific intervals",
      color: "#f97316",
      intensity: "quality",
    },
    {
      label: "Day 2",
      type: "regen",
      session: "Easy doubles, 60-70% AnT",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Day 3",
      type: "regen",
      session: "Regeneration run",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Day 4",
      type: "quality",
      session: "Second quality session",
      color: "#f97316",
      intensity: "quality",
    },
    {
      label: "Day 5",
      type: "regen",
      session: "Easy doubles, 60-70% AnT",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Day 6",
      type: "regen",
      session: "Regeneration run",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Day 7",
      type: "long",
      session: "Easy long run or rest",
      color: "#f97316",
      intensity: "long",
    },
  ];

  return (
    <Figure caption="A typical Canova training week: only 1-2 quality sessions surrounded by extensive regeneration. The hard/easy contrast is extreme and deliberate.">
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
                      ? "#f97316"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </div>
                <div
                  className="rounded-md py-4 px-1 border"
                  style={{
                    borderColor: highlight
                      ? "#f97316"
                      : "var(--border)",
                    background: highlight
                      ? "#f97316"
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
                        ? "#f97316"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isQuality && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#f97316" }}
                      >
                        Quality
                      </span>
                    )}
                    {isLong && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#f97316", opacity: 0.7 }}
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
                    ? "#f97316"
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
                  className="text-xs font-medium w-10 shrink-0"
                  style={{
                    ...mono,
                    color: highlight
                      ? "#f97316"
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
                    style={{ ...mono, color: "#f97316" }}
                  >
                    Quality
                  </span>
                )}
                {isLong && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "#f97316", opacity: 0.7 }}
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
// SignatureWorkoutCards
// ────────────────────────────────────

export function SignatureWorkoutCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const workouts = [
    {
      name: "Long Fast Run",
      structure: "20-40km at 87-95% marathon pace",
      purpose: "The most important Canova innovation",
      detail: "Extends race-specific endurance at sub-threshold intensity",
      color: "#f97316",
      tag: "Fundamental",
    },
    {
      name: "Special Block",
      structure: "AM: 26km + PM: 24km, low carbs between",
      purpose: "Maximum glycogen depletion stimulus",
      detail: "5-7 days of recovery required after. Simulates late-race fatigue.",
      color: "#ef4444",
      tag: "Special",
    },
    {
      name: "Progressive Run",
      structure: "90 min: start 87% → 91% → 96% MP",
      purpose: "Teaches negative splitting under fatigue",
      detail: "Develops pacing discipline and metabolic flexibility",
      color: "#8b5cf6",
      tag: "Fundamental",
    },
    {
      name: "Long Intervals",
      structure: "3x7km at 103-105% MP, 1km recovery at 98%",
      purpose: "Race-pace specificity at volume",
      detail: "Recovery is active (still fast), total quality volume 24km+",
      color: "#f59e0b",
      tag: "Specific",
    },
  ];

  return (
    <Figure caption="Canova's signature workouts. Note the extreme volume at race-relevant paces — these are not traditional interval sessions.">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="text-muted-foreground/60">Structure: </span>
                {w.structure}
              </div>
              <div>
                <span className="text-muted-foreground/60">Purpose: </span>
                {w.purpose}
              </div>
              <div>
                <span className="text-muted-foreground/60">Detail: </span>
                {w.detail}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// IntensitySpectrumDiagram
// ────────────────────────────────────

export function IntensitySpectrumDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 200;
  const pad = { top: 30, right: 30, bottom: 40, left: 30 };
  const cw = W - pad.left - pad.right;

  // Zones mapped from 60% to 115% of race pace
  const zones = [
    { label: "Regen", start: 60, end: 70, color: "#6b7280", desc: "Recovery" },
    { label: "Fundamental", start: 80, end: 87, color: "#3b82f6", desc: "Base endurance" },
    { label: "Special", start: 88, end: 95, color: "#8b5cf6", desc: "Tempo/threshold" },
    { label: "Race-Specific", start: 95, end: 105, color: "#f97316", desc: "Race pace" },
    { label: "Special Speed", start: 105, end: 115, color: "#ef4444", desc: "Above race pace" },
  ];

  const toX = (pct: number) => pad.left + ((pct - 55) / 65) * cw;
  const barY = 60;
  const barH = 32;

  return (
    <Figure caption="Canova's intensity spectrum. Unlike traditional systems, there is no 'junk zone' — every intensity has a purpose, and race pace sits at the center.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Title */}
        <text
          x={pad.left}
          y={22}
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.08em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          % OF RACE PACE
        </text>

        {/* Zone bars */}
        {zones.map((z, i) => {
          const x1 = toX(z.start);
          const x2 = toX(z.end);
          const barW = x2 - x1;

          return (
            <motion.g
              key={z.label}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            >
              {/* Background bar */}
              <rect
                x={x1 + 1}
                y={barY}
                width={barW - 2}
                height={barH}
                rx="4"
                fill={z.color}
                opacity="0.12"
              />
              {/* Animated fill */}
              <motion.rect
                x={x1 + 1}
                y={barY}
                height={barH}
                rx="4"
                fill={z.color}
                opacity="0.35"
                initial={{ width: 0 }}
                animate={inView ? { width: barW - 2 } : { width: 0 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.7, ease: "easeOut" }}
              />
              {/* Zone label */}
              <text
                x={x1 + barW / 2}
                y={barY + barH / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={barW > 70 ? "7.5" : "6.5"}
                fontWeight="600"
                style={{ ...mono, fill: z.color }}
              >
                {z.label.toUpperCase()}
              </text>
              {/* Percentage labels */}
              <text
                x={x1 + barW / 2}
                y={barY - 6}
                textAnchor="middle"
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {z.start}-{z.end}%
              </text>
              {/* Description below */}
              <text
                x={x1 + barW / 2}
                y={barY + barH + 14}
                textAnchor="middle"
                fontSize="6.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {z.desc}
              </text>
            </motion.g>
          );
        })}

        {/* Race pace marker */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <line
            x1={toX(100)}
            y1={barY - 14}
            x2={toX(100)}
            y2={barY + barH + 4}
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <text
            x={toX(100)}
            y={barY + barH + 30}
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            style={{ ...mono, fill: "#f97316" }}
          >
            100% = RACE PACE
          </text>
        </motion.g>

        {/* Scale markers */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {[60, 70, 80, 90, 100, 110, 115].map((pct) => (
            <line
              key={pct}
              x1={toX(pct)}
              y1={barY + barH + 2}
              x2={toX(pct)}
              y2={barY + barH + 6}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// CanovaArticle (main export)
// ────────────────────────────────────
