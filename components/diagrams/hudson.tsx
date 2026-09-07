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
// FourAdaptationsDiagram
// ────────────────────────────────────

export function FourAdaptationsDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 400;
  const cx = W / 2;
  const cy = H / 2;

  const rings = [
    {
      label: "SEASONAL",
      sublabel: "Evolve year to year",
      radius: 170,
      color: "#ec4899",
      opacity: 0.08,
      strokeOpacity: 0.25,
      delay: 0.3,
    },
    {
      label: "DAILY",
      sublabel: "Adjust to today's readiness",
      radius: 130,
      color: "#ec4899",
      opacity: 0.1,
      strokeOpacity: 0.35,
      delay: 0.6,
    },
    {
      label: "INDIVIDUAL",
      sublabel: "Adapt to your unique profile",
      radius: 90,
      color: "#ec4899",
      opacity: 0.14,
      strokeOpacity: 0.45,
      delay: 0.9,
    },
    {
      label: "TARGETED",
      sublabel: "Train for the goal race",
      radius: 50,
      color: "#ec4899",
      opacity: 0.2,
      strokeOpacity: 0.6,
      delay: 1.2,
    },
  ];

  // Label positions for each ring
  const labelPositions = [
    { x: cx, y: cy - 170 - 10 },   // Seasonal - top
    { x: cx + 130 + 8, y: cy + 4 }, // Daily - right
    { x: cx, y: cy + 90 + 16 },     // Individual - bottom
    { x: cx, y: cy + 4 },           // Targeted - center
  ];

  return (
    <Figure caption="Hudson's four adaptive dimensions. Training decisions flow inward from seasonal context to daily readiness, filtered through individual needs and the specific goal race.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Concentric rings */}
        {rings.map((ring, i) => (
          <motion.g key={ring.label}>
            <motion.circle
              cx={cx}
              cy={cy}
              r={ring.radius}
              fill={ring.color}
              stroke={ring.color}
              strokeWidth="1.5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      scale: 1,
                    }
                  : {}
              }
              transition={{
                delay: ring.delay,
                duration: 0.6,
                ease: "easeOut",
              }}
              style={{
                fillOpacity: ring.opacity,
                strokeOpacity: ring.strokeOpacity,
                transformOrigin: `${cx}px ${cy}px`,
              }}
            />
          </motion.g>
        ))}

        {/* Ring labels */}
        {rings.map((ring, i) => (
          <motion.g
            key={`label-${ring.label}`}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: ring.delay + 0.3, duration: 0.4 }}
          >
            <text
              x={labelPositions[i].x}
              y={labelPositions[i].y}
              textAnchor={i === 1 ? "start" : "middle"}
              fontSize="9"
              fontWeight="600"
              letterSpacing="0.08em"
              style={{ ...mono, fill: "#ec4899" }}
            >
              {ring.label}
            </text>
            <text
              x={labelPositions[i].x}
              y={labelPositions[i].y + 12}
              textAnchor={i === 1 ? "start" : "middle"}
              fontSize="7.5"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
            >
              {ring.sublabel}
            </text>
          </motion.g>
        ))}

        {/* Connecting arrows from outer to inner */}
        {[45, 135, 225, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * 160;
          const y1 = cy + Math.sin(rad) * 160;
          const x2 = cx + Math.cos(rad) * 60;
          const y2 = cy + Math.sin(rad) * 60;
          return (
            <motion.line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ec4899"
              strokeWidth="1"
              strokeDasharray="4 3"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={inView ? { opacity: 0.3, pathLength: 1 } : {}}
              transition={{ delay: 1.6 + i * 0.1, duration: 0.5 }}
            />
          );
        })}
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// TrainingCategoriesBars
// ────────────────────────────────────

export function TrainingCategoriesBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const categories = [
    {
      name: "Aerobic Support",
      percent: 60,
      color: "#ec4899",
      description: "Easy/moderate running, steady state, long runs",
      detail: "Foundation of endurance; builds mitochondrial density and fat oxidation",
    },
    {
      name: "Neuromuscular / Muscle",
      percent: 20,
      color: "#f59e0b",
      description: "Hill sprints, strides, drills, strength work",
      detail: "Develops power, running economy, and injury resilience",
    },
    {
      name: "Specific Endurance",
      percent: 20,
      color: "#8b5cf6",
      description: "Race-pace work, progressions, tempo intervals",
      detail: "Directly simulates race demands; highest specificity",
    },
  ];

  return (
    <Figure caption="Hudson's three training categories. The balance shifts across phases: early cycles emphasize aerobic support, while sharpening phases increase specific endurance to 30-40%.">
      <div ref={ref} className="space-y-6">
        {categories.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className="text-sm font-medium text-foreground"
                style={mono}
              >
                {c.name}
              </span>
              <span
                className="text-xs text-muted-foreground"
                style={mono}
              >
                ~{c.percent}%
              </span>
            </div>

            <div className="relative h-7 rounded overflow-hidden">
              <div
                className="absolute inset-0 rounded"
                style={{ background: c.color, opacity: 0.08 }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 rounded"
                style={{ background: c.color, opacity: 0.35 }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${c.percent}%` } : { width: 0 }}
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
                {c.description}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {c.detail}
              </span>
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
  const H = 220;
  const pad = { top: 30, right: 20, bottom: 60, left: 20 };
  const barY = pad.top + 10;
  const barH = 36;
  const barW = W - pad.left - pad.right;

  const levels = [
    { level: "I", label: "Recovery", effort: "Very easy", pct: 0, color: "#6ee7b7" },
    { level: "II", label: "Steady aerobic", effort: "Easy/moderate", pct: 20, color: "#34d399" },
    { level: "III", label: "Half-marathon", effort: "Comfortably hard", pct: 45, color: "#f59e0b" },
    { level: "IV", label: "10K effort", effort: "Hard", pct: 70, color: "#f97316" },
    { level: "V", label: "5K effort", effort: "Very hard", pct: 90, color: "#ef4444" },
  ];

  return (
    <Figure caption="Hudson's five intensity levels — defined by feel, not pace charts. Athletes discover the right pace each day through perceived effort, making every session responsive to current fitness and fatigue.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Gradient background bar */}
        <defs>
          <linearGradient id="effortGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.3" />
            <stop offset="25%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#f97316" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Base gradient bar */}
        <motion.rect
          x={pad.left}
          y={barY}
          width={barW}
          height={barH}
          rx="6"
          fill="url(#effortGradient)"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: `${pad.left}px ${barY + barH / 2}px` }}
        />

        {/* Border around bar */}
        <motion.rect
          x={pad.left}
          y={barY}
          width={barW}
          height={barH}
          rx="6"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        />

        {/* Level markers and labels */}
        {levels.map((l, i) => {
          const x = pad.left + (l.pct / 100) * barW;
          return (
            <motion.g
              key={l.level}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
            >
              {/* Tick mark */}
              <line
                x1={x}
                y1={barY}
                x2={x}
                y2={barY + barH}
                stroke={l.color}
                strokeWidth="2"
                opacity="0.6"
              />

              {/* Dot */}
              <circle
                cx={x}
                cy={barY + barH / 2}
                r="4"
                fill={l.color}
                opacity="0.8"
              />

              {/* Level number above */}
              <text
                x={x}
                y={barY - 8}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                style={{ ...mono, fill: l.color }}
              >
                {l.level}
              </text>

              {/* Label below */}
              <text
                x={x}
                y={barY + barH + 16}
                textAnchor={i === 0 ? "start" : i === levels.length - 1 ? "end" : "middle"}
                fontSize="8"
                fontWeight="600"
                style={{ ...mono, fill: "var(--foreground)" }}
              >
                {l.label}
              </text>

              {/* Effort description */}
              <text
                x={x}
                y={barY + barH + 28}
                textAnchor={i === 0 ? "start" : i === levels.length - 1 ? "end" : "middle"}
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {l.effort}
              </text>
            </motion.g>
          );
        })}

        {/* Arrow indicating "by feel" */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <text
            x={W / 2}
            y={H - 8}
            textAnchor="middle"
            fontSize="8"
            letterSpacing="0.1em"
            style={{ ...mono, fill: "#ec4899" }}
          >
            EFFORT INCREASES →
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// PeriodizationPhasesDiagram
// ────────────────────────────────────

export function PeriodizationPhasesDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 280;
  const pad = { top: 40, right: 20, bottom: 50, left: 20 };
  const trackW = W - pad.left - pad.right;
  const trackY = pad.top + 30;
  const trackH = 8;

  const phases = [
    {
      name: "INTRODUCTORY",
      duration: "6-8 weeks",
      start: 0,
      end: 0.33,
      color: "#6ee7b7",
      focus: "Base building, hill sprints",
      aerobic: 75,
      neuro: 15,
      specific: 10,
    },
    {
      name: "FUNDAMENTAL",
      duration: "6-8 weeks",
      start: 0.33,
      end: 0.66,
      color: "#f59e0b",
      focus: "VO2max, aerobic power",
      aerobic: 55,
      neuro: 20,
      specific: 25,
    },
    {
      name: "SHARPENING",
      duration: "4-6 weeks",
      start: 0.66,
      end: 1.0,
      color: "#ec4899",
      focus: "Goal-pace simulation",
      aerobic: 40,
      neuro: 15,
      specific: 45,
    },
  ];

  return (
    <Figure caption="Hudson's three-phase periodization. Unlike rigid block periodization, multiple training types are mixed throughout — their proportions shift as the race approaches.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Title */}
        <motion.text
          x={W / 2}
          y={pad.top - 10}
          textAnchor="middle"
          fontSize="8"
          letterSpacing="0.1em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          TRAINING TIMELINE
        </motion.text>

        {/* Track background */}
        <motion.rect
          x={pad.left}
          y={trackY}
          width={trackW}
          height={trackH}
          rx="4"
          fill="var(--border)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : {}}
          transition={{ duration: 0.3 }}
        />

        {/* Phase segments */}
        {phases.map((p, i) => {
          const x = pad.left + p.start * trackW;
          const w = (p.end - p.start) * trackW;
          return (
            <motion.g key={p.name}>
              {/* Phase bar segment */}
              <motion.rect
                x={x}
                y={trackY}
                width={w}
                height={trackH}
                rx={i === 0 ? "4" : i === phases.length - 1 ? "4" : "0"}
                fill={p.color}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 0.5, scaleX: 1 } : {}}
                transition={{
                  delay: 0.3 + i * 0.25,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: `${x}px ${trackY + trackH / 2}px` }}
              />

              {/* Phase label */}
              <motion.g
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.25, duration: 0.4 }}
              >
                <text
                  x={x + w / 2}
                  y={trackY - 10}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  letterSpacing="0.06em"
                  style={{ ...mono, fill: p.color }}
                >
                  {p.name}
                </text>
              </motion.g>

              {/* Phase detail card area */}
              <motion.g
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.25, duration: 0.4 }}
              >
                <text
                  x={x + w / 2}
                  y={trackY + trackH + 22}
                  textAnchor="middle"
                  fontSize="7.5"
                  style={{ ...mono, fill: "var(--foreground)" }}
                >
                  {p.duration}
                </text>
                <text
                  x={x + w / 2}
                  y={trackY + trackH + 35}
                  textAnchor="middle"
                  fontSize="7"
                  style={{ ...mono, fill: "var(--muted-foreground)" }}
                >
                  {p.focus}
                </text>

                {/* Mini stacked bars showing category mix */}
                {(() => {
                  const barX = x + w / 2 - 50;
                  const barWidth = 100;
                  const barTop = trackY + trackH + 46;
                  const bh = 6;
                  const aerobicW = (p.aerobic / 100) * barWidth;
                  const neuroW = (p.neuro / 100) * barWidth;
                  const specificW = (p.specific / 100) * barWidth;
                  return (
                    <g>
                      <rect
                        x={barX}
                        y={barTop}
                        width={aerobicW}
                        height={bh}
                        rx="2"
                        fill="#ec4899"
                        opacity="0.3"
                      />
                      <rect
                        x={barX + aerobicW}
                        y={barTop}
                        width={neuroW}
                        height={bh}
                        rx="0"
                        fill="#f59e0b"
                        opacity="0.35"
                      />
                      <rect
                        x={barX + aerobicW + neuroW}
                        y={barTop}
                        width={specificW}
                        height={bh}
                        rx="2"
                        fill="#8b5cf6"
                        opacity="0.4"
                      />
                      {/* Mini legend labels */}
                      <text
                        x={barX}
                        y={barTop + bh + 10}
                        fontSize="6"
                        style={{ ...mono, fill: "var(--muted-foreground)" }}
                      >
                        Aerobic {p.aerobic}%
                      </text>
                      <text
                        x={barX + barWidth}
                        y={barTop + bh + 10}
                        textAnchor="end"
                        fontSize="6"
                        style={{ ...mono, fill: "var(--muted-foreground)" }}
                      >
                        Specific {p.specific}%
                      </text>
                    </g>
                  );
                })()}
              </motion.g>
            </motion.g>
          );
        })}

        {/* Race day marker */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.4 }}
        >
          <line
            x1={pad.left + trackW + 2}
            y1={trackY - 4}
            x2={pad.left + trackW + 2}
            y2={trackY + trackH + 4}
            stroke="#ec4899"
            strokeWidth="2"
          />
          <text
            x={pad.left + trackW + 2}
            y={trackY - 10}
            textAnchor="end"
            fontSize="8"
            fontWeight="600"
            style={{ ...mono, fill: "#ec4899" }}
          >
            RACE DAY
          </text>
        </motion.g>

        {/* Nonlinear note */}
        <motion.text
          x={W / 2}
          y={H - 8}
          textAnchor="middle"
          fontSize="7"
          letterSpacing="0.04em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          Nonlinear: all three categories present in every phase, proportions shift
        </motion.text>
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
      label: "Sun",
      type: "quality",
      session: "Progression Long Run",
      detail: "14mi easy + 3mi hard",
      color: "#ec4899",
      intensity: "quality",
    },
    {
      label: "Mon",
      type: "easy",
      session: "Rest / Easy + Hill Sprints",
      detail: "Recovery + 6-10 sprints",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Tue",
      type: "quality",
      session: "Specific Intervals",
      detail: "4x1mi at 10K effort",
      color: "#ec4899",
      intensity: "quality",
    },
    {
      label: "Wed",
      type: "easy",
      session: "Easy or Rest",
      detail: "Recovery day",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Thu",
      type: "quality",
      session: "Threshold Run",
      detail: "26-32 min continuous",
      color: "#ec4899",
      intensity: "quality",
    },
    {
      label: "Fri",
      type: "easy",
      session: "Rest / Easy + Hill Sprints",
      detail: "Recovery + 6-10 sprints",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Sat",
      type: "easy",
      session: "Easy / Moderate Run",
      detail: "Steady aerobic",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
  ];

  return (
    <Figure caption="A typical Hudson training week: three quality sessions (Sun/Tue/Thu), flexible recovery between. Hill sprints woven into easy days for neuromuscular stimulus without fatigue cost.">
      <div ref={ref}>
        {/* Desktop: horizontal strip */}
        <div className="hidden sm:grid grid-cols-7 gap-2">
          {days.map((d, i) => {
            const isQuality = d.intensity === "quality";

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
                    color: isQuality
                      ? "#ec4899"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </div>
                <div
                  className="rounded-md py-4 px-1 border"
                  style={{
                    borderColor: isQuality
                      ? "#ec4899"
                      : "var(--border)",
                    background: isQuality
                      ? "#ec4899"
                      : "transparent",
                    opacity: isQuality ? undefined : 1,
                  }}
                >
                  <div
                    className="w-full h-1 rounded-full mb-2 mx-auto"
                    style={{
                      maxWidth: "32px",
                      background: d.color,
                      opacity: isQuality ? 0.5 : 0.15,
                    }}
                  />
                  <div
                    className="text-[10px] leading-tight"
                    style={{
                      ...mono,
                      color: isQuality
                        ? "#ec4899"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isQuality && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#ec4899" }}
                      >
                        Quality
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

            return (
              <motion.div
                key={d.label}
                className="flex items-center gap-3 py-2 px-3 rounded-md border"
                style={{
                  borderColor: isQuality
                    ? "#ec4899"
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
                    color: isQuality
                      ? "#ec4899"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </span>
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: d.color,
                    opacity: isQuality ? 0.7 : 0.2,
                  }}
                />
                <div className="flex-1">
                  <span
                    className="text-xs"
                    style={{
                      ...mono,
                      color: isQuality
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {d.session}
                  </span>
                  <span
                    className="block text-[10px] text-muted-foreground"
                    style={mono}
                  >
                    {d.detail}
                  </span>
                </div>
                {isQuality && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "#ec4899" }}
                  >
                    Quality
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
      name: "Hill Sprints",
      structure: "8-10 sec all-out on 6-8% grade",
      progression: "Start with 1 rep, build to 10 over weeks",
      purpose: "Foundational neuromuscular strength without injury risk",
      tag: "Strength",
      color: "#ec4899",
    },
    {
      name: "1-2-3-2-1 Fartlek",
      structure: "1 min at 5K, 2 min at 10K, 3 min at HM + equal recovery jog",
      progression: "Reverse back down: 2 min at 10K, 1 min at 5K",
      purpose: "Multi-pace fitness; Hudson's signature mixed-intensity session",
      tag: "Signature",
      color: "#f59e0b",
    },
    {
      name: "Progression Long Run",
      structure: "14 mi easy + 3 mi building to hard",
      progression: "Final miles approach half-marathon effort",
      purpose: "Simulates late-race fatigue; teaches pace under glycogen depletion",
      tag: "Endurance",
      color: "#8b5cf6",
    },
    {
      name: "LT Continuous Run",
      structure: "26-32 min total",
      progression: "First 5-7 min at 10-15 sec/mi below LT, then LT pace",
      purpose: "Sustained threshold work with built-in warm-up progression",
      tag: "Threshold",
      color: "#6ee7b7",
    },
  ];

  return (
    <Figure caption="Hudson's signature workouts. Note the multi-pace design of the 1-2-3-2-1 fartlek — a hallmark of his belief that varied-intensity sessions build broader fitness than single-pace work.">
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
                <span className="text-muted-foreground/60">Progression: </span>
                {w.progression}
              </div>
              <div>
                <span className="text-muted-foreground/60">Purpose: </span>
                {w.purpose}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// HudsonArticle (main export)
// ────────────────────────────────────
