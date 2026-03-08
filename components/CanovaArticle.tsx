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
// FunnelPeriodizationDiagram
// ────────────────────────────────────

function FunnelPeriodizationDiagram() {
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

function TrainingPhasesDiagram() {
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

function WeeklyStructureTimeline() {
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

function SignatureWorkoutCards() {
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

function IntensitySpectrumDiagram() {
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

export function CanovaArticle() {
  return (
    <ArticleLayout
      title="The Canova Method"
      subtitle="How Renato Canova's concept of specific endurance and extending race-pace volume reshaped elite marathon training worldwide."
      accentColor="#f97316"
    >
      {/* ── Introduction ── */}
      <section>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Renato Canova was born in 1944 in Turin, Italy. A talented
            decathlete, his competitive career ended abruptly when the Italian
            athletics federation banned him from competing — the reason being
            that athletes had already started calling him
            &ldquo;Coach.&rdquo; Unable to race, Canova turned fully to
            coaching, and what followed was arguably the most successful
            career in the history of distance running. In 1998, he moved to
            Iten, Kenya, embedding himself among the world&rsquo;s greatest
            natural runners and refining a system that would produce over 50
            Olympic and World Championship medalists.
          </p>
          <p className="text-muted leading-relaxed">
            Canova&rsquo;s central question was never &ldquo;how fast can you
            run?&rdquo; but rather &ldquo;how long can you sustain race
            pace?&rdquo; This distinction is the foundation of his entire
            philosophy. He called it{" "}
            <strong>specific endurance</strong> — the progressive extension
            of the volume an athlete can handle at or near race pace.
            Traditional periodization begins with general fitness and
            introduces race-relevant intensity only in the final weeks before
            competition. Canova inverted this: race-relevant intensity is
            present from the very beginning of the training cycle, growing in
            volume as the athlete adapts.
          </p>
          <p className="text-muted leading-relaxed">
            His guiding principle was elegantly simple:{" "}
            <em>&ldquo;Training is not to replace, but to ADD.&rdquo;</em>{" "}
            New training stimuli are layered onto existing ones. No quality
            is ever abandoned — the pace spectrum simply narrows and
            intensifies as competition approaches. This concept, which Canova
            called <strong>funnel periodization</strong>, would reshape how
            coaches around the world think about preparing marathoners and
            distance runners for peak performance.
          </p>
        </div>
      </section>

      {/* ── Key stats ── */}
      <div className="my-10 grid grid-cols-3 gap-4">
        <KeyStat
          value={50}
          label="Olympic/World medals coached"
          format={(n) => `${Math.round(n)}+`}
        />
        <KeyStat
          value={95}
          label="% race pace — specific endurance target"
          format={(n) => `${Math.round(n)}%`}
        />
        <KeyStat
          value={5}
          label="Training phases in funnel periodization"
          format={(n) => `${Math.round(n)}`}
        />
      </div>

      <SectionDivider text="EXTENDING INTENSITY" />

      {/* ── Core Concept ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Funnel: From General to Specific
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Most periodization models separate the training year into distinct
            blocks: a base phase of easy aerobic running, a strength phase of
            hills and tempo work, and a sharpening phase of race-pace
            intervals. Canova rejected this linear approach because it meant
            athletes were always <em>losing</em> one quality while
            developing another. A runner building base fitness was losing
            speed. A runner sharpening speed was losing endurance volume.
          </p>
          <p className="text-muted leading-relaxed">
            His alternative was the <strong>funnel model</strong>. At the
            wide top of the funnel, during the general phase, an athlete
            trains across a broad intensity spectrum — from 80% to 115% of
            race pace. As weeks progress, the spectrum narrows: speed work
            becomes slightly slower, endurance work becomes slightly faster,
            and both converge toward race pace. By the specific phase, nearly
            all quality training falls within a tight window of 95-105% of
            the target race effort.
          </p>
          <p className="text-muted leading-relaxed">
            The genius of this approach is that the athlete never stops
            training any quality. Speed is always present; long endurance
            runs are always present. What changes is the <em>proximity</em>{" "}
            of each session to race pace. The athlete arrives at competition
            having trained every system, with the overwhelming volume of
            recent work calibrated precisely to the demands of the target
            race.
          </p>
        </div>
      </section>

      <FunnelPeriodizationDiagram />

      <SectionDivider text="PERCENTAGE-BASED TRAINING" />

      {/* ── Intensity Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Intensity Spectrum
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Canova organizes all training intensity relative to race pace —
            specifically, relative to the anaerobic threshold (AnT) or
            goal marathon pace. Every run has a defined position on a
            continuous spectrum, not in arbitrary heart rate zones. This
            race-referenced system means that as an athlete improves, the
            absolute paces shift automatically — the percentages stay
            constant, but the running gets faster.
          </p>
          <p className="text-muted leading-relaxed">
            His famous dictum captures the underlying philosophy:{" "}
            <em>
              &ldquo;The only quality you lose is the one you don&rsquo;t
              train.&rdquo;
            </em>{" "}
            By maintaining work across the full spectrum — from regeneration
            at 60% to special speed at 115% — Canova ensures no physiological
            capacity atrophies during the training cycle.
          </p>
        </div>
      </section>

      <IntensitySpectrumDiagram />

      {/* ── Intensity Bars ── */}
      <div className="my-8 space-y-3">
        <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
          Canova Intensity Zones (% of Race Pace)
        </div>
        <AnimatedBar percent={35} color="#6b7280" label="Regen" delay={0} showPercent={false} />
        <AnimatedBar percent={55} color="#3b82f6" label="Fundamental" delay={0.1} showPercent={false} />
        <AnimatedBar percent={72} color="#8b5cf6" label="Special" delay={0.2} showPercent={false} />
        <AnimatedBar percent={90} color="#f97316" label="Race-Spec" delay={0.3} showPercent={false} />
        <AnimatedBar percent={100} color="#ef4444" label="Spc Speed" delay={0.4} showPercent={false} />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1" style={mono}>
          <span>60%</span>
          <span>80%</span>
          <span>95%</span>
          <span>105%</span>
          <span>115%</span>
        </div>
      </div>

      <SectionDivider text="THE FIVE PHASES" />

      {/* ── Training Phases ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Five Phases of the Macrocycle
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Canova structures the macrocycle into five sequential phases,
            each lasting 4-10 weeks depending on the athlete&rsquo;s level
            and target race. The critical principle across all phases is
            accumulation — nothing is discarded, each phase layers new
            demands on top of the previous one.
          </p>
          <p className="text-muted leading-relaxed">
            The <strong>Transition</strong> phase (~4 weeks) follows a
            completed race cycle with active recovery and mental renewal.
            The <strong>General/Introductory</strong> phase (~4 weeks)
            rebuilds the aerobic base with easy volume and light speed work
            across a wide intensity range. The{" "}
            <strong>Fundamental</strong> phase (~6 weeks) introduces the
            signature long fast runs at 87-95% of marathon pace — the
            bedrock of Canova&rsquo;s system. The{" "}
            <strong>Special</strong> phase (~6-8 weeks) brings the
            notorious special blocks (high-volume double sessions) and begins
            to diverge training by target event. Finally, the{" "}
            <strong>Specific</strong> phase (~8-10 weeks) narrows all
            quality work to 95-105% of race pace, with decreasing volume
            and increasing precision as competition day approaches.
          </p>
        </div>
      </section>

      <TrainingPhasesDiagram />

      <SectionDivider text="THE TRAINING WEEK" />

      {/* ── Weekly Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Weekly Structure: Hard/Easy Extremes
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Canova&rsquo;s weekly structure is defined by extreme{" "}
            <strong>modulation</strong> — the gap between quality days and
            recovery days is wider than in almost any other system. Quality
            sessions occur only 1-2 times per week, separated by 2-3 days
            of genuine regeneration running at 60-70% of anaerobic threshold
            pace. This is not &ldquo;easy running&rdquo; in the casual sense;
            it is deliberately slow recovery work, often run as doubles
            (two short sessions per day) to increase blood flow without
            mechanical stress.
          </p>
          <p className="text-muted leading-relaxed">
            The rationale is physiological: the quality sessions in
            Canova&rsquo;s system are extraordinarily demanding — 30-40km
            at 90%+ of marathon pace, or double sessions totaling 50km in
            a single day. The body requires extensive recovery to absorb
            these stimuli. Attempting a second quality session too soon
            would compromise the adaptation and increase injury risk. As
            Canova puts it: the purpose of easy days is to make the hard
            days <em>possible</em>.
          </p>
        </div>
      </section>

      <WeeklyStructureTimeline />

      <SectionDivider text="SIGNATURE WORKOUTS" />

      {/* ── Key Workouts ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Signature Sessions
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Canova&rsquo;s workouts are distinctive not for their speed but
            for their <strong>volume at race-relevant intensity</strong>.
            Where a traditional coach might prescribe 6x1 mile at tempo
            pace, Canova prescribes 30-40km continuous runs at 90% of
            marathon pace, or 3x7km at 103% of marathon pace with only 1km
            of active recovery between repetitions. The sheer volume of
            quality work in a single session is what makes the system
            unique — and what makes the extended recovery between quality
            days essential.
          </p>
        </div>
      </section>

      <SignatureWorkoutCards />

      <SectionDivider text="THE ATHLETES" />

      {/* ── Athletes ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          A Record Without Equal
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The proof of Canova&rsquo;s system is its athletes.{" "}
            <strong>Abel Kirui</strong> won the World Championship marathon
            twice (2009, 2011).{" "}
            <strong>Moses Mosop</strong> ran 2:03:06 in his marathon debut —
            at the time the second-fastest marathon in history.{" "}
            <strong>Wilson Kipsang</strong> set the world record at 2:03:23
            in Berlin (2013).{" "}
            <strong>Florence Kiplagat</strong> broke the half marathon world
            record. The list extends to{" "}
            <strong>Kenenisa Bekele</strong> (who worked with Canova&rsquo;s
            methods during his marathon transition),{" "}
            <strong>Geoffrey Kirui</strong> (2017 World Championship
            marathon gold), and most recently{" "}
            <strong>Emile Cairess</strong>, who ran 2:06:46 at the 2024
            London Marathon.
          </p>
          <p className="text-muted leading-relaxed">
            Across his career, Canova has coached over{" "}
            <strong>50 Olympic and World Championship medalists</strong>{" "}
            — a number unmatched by any other distance running coach in
            history. His athletes have represented Kenya, Ethiopia, Qatar,
            Bahrain, Great Britain, and Italy, spanning events from the
            3000m steeplechase to the marathon. What unites them is not
            nationality or talent alone, but a shared training philosophy:
            extend what you can sustain at race pace, progressively, over
            months and years, without ever abandoning a quality once trained.
          </p>
          <p className="text-muted leading-relaxed">
            Canova&rsquo;s influence extends beyond his own athletes. Coaches
            worldwide — from the Hansons in Michigan to elite programs in
            Japan — have incorporated his concepts of specific endurance,
            funnel periodization, and high-modulation training weeks. His
            open sharing of training logs and philosophy on online forums
            throughout the 2000s and 2010s democratized knowledge that had
            previously been confined to elite coaching circles.
          </p>
        </div>
      </section>

      <SectionDivider text="PRACTICAL TAKEAWAYS" />

      {/* ── Takeaways ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Applying Canova&rsquo;s Principles
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Canova method was developed for elite athletes running
            120-200km per week, but its principles scale to any serious
            runner willing to train with discipline and patience:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Add new training stimuli; never abandon old ones.</strong>{" "}
              When you introduce tempo work, do not drop your speed sessions.
              When you add race-pace intervals, keep your long runs. The
              training mix narrows but never shrinks.
            </li>
            <li>
              <strong>
                Train the full pace spectrum from 80% to 115% of race pace.
              </strong>{" "}
              Every intensity serves a purpose. Recovery runs should be truly
              slow (60-70% AnT pace). Speed work should be genuinely fast
              (105-115%). The middle ground is where race fitness lives.
            </li>
            <li>
              <strong>
                Hard days harder, easy days easier.
              </strong>{" "}
              High modulation is non-negotiable. If your quality session is
              30km at 90% marathon pace, your recovery day must be genuinely
              regenerative — not a moderate effort that compromises the next
              quality day.
            </li>
            <li>
              <strong>
                Recovery is not optional: 2-3 easy days minimum between
                quality sessions.
              </strong>{" "}
              The adaptation happens during recovery, not during the workout.
              Rushing back to intensity is the most common error Canova
              identifies in self-coached athletes.
            </li>
            <li>
              <strong>
                Extend what you can sustain at race pace, progressively.
              </strong>{" "}
              This is the essence of specific endurance. If you can hold
              marathon pace for 10km in training, work toward 15km, then
              20km, then 25km. The distance at race pace is the variable
              that predicts race performance, not the speed of short
              intervals.
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
            <ExternalLink href="https://www.researchgate.net/publication/317569589_Training_Methods_of_Renato_Canova">
              Running Science — Training Methods of Renato Canova (PDF)
            </ExternalLink>
            {" "}— Comprehensive overview of Canova&rsquo;s periodization
            model, intensity zones, and workout prescriptions.
          </p>
          <p>
            <ExternalLink href="https://runningwritings.com/2012/09/renato-canova-training-methods.html">
              Running Writings — Renato Canova Training Methods Review
            </ExternalLink>
            {" "}— Detailed analysis of Canova&rsquo;s funnel periodization
            and specific endurance concepts.
          </p>
          <p>
            <ExternalLink href="https://www.sweatelite.co/the-canova-method-how-to-train-like-the-worlds-best-distance-runners/">
              SweatElite — The Canova Method
            </ExternalLink>
            {" "}— Practical guide to implementing Canova&rsquo;s principles
            for competitive runners.
          </p>
          <p>
            <ExternalLink href="https://en.wikipedia.org/wiki/Renato_Canova">
              Wikipedia — Renato Canova
            </ExternalLink>
            {" "}— Biography, coaching career, and list of notable athletes.
          </p>
          <p>
            <ExternalLink href="https://runnersconnect.net/coach-corner/special-block-training/">
              RunnersConnect — Special Block Training
            </ExternalLink>
            {" "}— Explanation of Canova&rsquo;s special block double-session
            protocol and its physiological rationale.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
