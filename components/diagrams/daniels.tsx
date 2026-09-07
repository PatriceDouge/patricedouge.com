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
// VDOTFlowDiagram
// ────────────────────────────────────

export function VDOTFlowDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 380;

  // Layout coordinates
  const raceBoxY = 30;
  const vdotBoxY = 120;
  const paceStartY = 220;
  const paceGap = 30;

  const centerX = W / 2;

  // Pace zone data
  const paces = [
    { label: "E", name: "Easy", color: "#22c55e" },
    { label: "M", name: "Marathon", color: "#06b6d4" },
    { label: "T", name: "Threshold", color: "#f59e0b" },
    { label: "I", name: "Interval", color: "#f97316" },
    { label: "R", name: "Repetition", color: "#ef4444" },
  ];

  const paceWidth = 80;
  const totalPaceWidth = paces.length * paceWidth + (paces.length - 1) * 8;
  const paceStartX = (W - totalPaceWidth) / 2;

  return (
    <Figure caption="The VDOT system: a single race result maps to a VDOT number, which determines all five training paces. No guesswork required.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Race Result box */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <rect
            x={centerX - 90}
            y={raceBoxY}
            width={180}
            height={44}
            rx={6}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1.5}
          />
          <text
            x={centerX}
            y={raceBoxY + 18}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.08em"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            RACE RESULT
          </text>
          <text
            x={centerX}
            y={raceBoxY + 34}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            style={{ ...mono, fill: "var(--foreground)" }}
          >
            5K / 10K / Half / Marathon
          </text>
        </motion.g>

        {/* Arrow: Race → VDOT */}
        <motion.line
          x1={centerX}
          y1={raceBoxY + 44}
          x2={centerX}
          y2={vdotBoxY}
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
        <motion.polygon
          points={`${centerX - 4},${vdotBoxY - 2} ${centerX + 4},${vdotBoxY - 2} ${centerX},${vdotBoxY + 4}`}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.8, duration: 0.3 }}
        />

        {/* VDOT box */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        >
          <rect
            x={centerX - 60}
            y={vdotBoxY}
            width={120}
            height={50}
            rx={8}
            fill="#06b6d4"
            opacity={0.12}
            stroke="#06b6d4"
            strokeWidth={1.5}
          />
          <text
            x={centerX}
            y={vdotBoxY + 20}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.1em"
            style={{ ...mono, fill: "#06b6d4" }}
          >
            VDOT
          </text>
          <text
            x={centerX}
            y={vdotBoxY + 38}
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            style={{ ...mono, fill: "var(--foreground)" }}
          >
            30 — 85
          </text>
        </motion.g>

        {/* Fan-out lines: VDOT → Pace zones */}
        {paces.map((p, i) => {
          const paceX = paceStartX + i * (paceWidth + 8) + paceWidth / 2;
          return (
            <motion.line
              key={p.label}
              x1={centerX}
              y1={vdotBoxY + 50}
              x2={paceX}
              y2={paceStartY}
              stroke={p.color}
              strokeWidth={1}
              strokeDasharray="3 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 0.4 } : {}}
              transition={{ delay: 1.0 + i * 0.1, duration: 0.5 }}
            />
          );
        })}

        {/* Pace zone boxes */}
        {paces.map((p, i) => {
          const paceX = paceStartX + i * (paceWidth + 8);
          return (
            <motion.g
              key={p.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 1.2 + i * 0.12,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <rect
                x={paceX}
                y={paceStartY}
                width={paceWidth}
                height={40}
                rx={5}
                fill={p.color}
                opacity={0.1}
                stroke={p.color}
                strokeWidth={1}
              />
              <text
                x={paceX + paceWidth / 2}
                y={paceStartY + 17}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                style={{ ...mono, fill: p.color }}
              >
                {p.label}
              </text>
              <text
                x={paceX + paceWidth / 2}
                y={paceStartY + 32}
                textAnchor="middle"
                fontSize="8"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {p.name}
              </text>
            </motion.g>
          );
        })}

        {/* Example VDOT values */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8, duration: 0.5 }}
        >
          {/* VDOT 45 example */}
          <text
            x={paceStartX + 10}
            y={paceStartY + 60}
            fontSize="8"
            fontWeight="600"
            style={{ ...mono, fill: "#06b6d4" }}
          >
            VDOT 45
          </text>
          <text
            x={paceStartX + 10}
            y={paceStartY + 72}
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            5K: 21:51 | E: 10:00-11:07/mi | T: 8:38/mi
          </text>

          {/* VDOT 55 example */}
          <text
            x={paceStartX + 10}
            y={paceStartY + 88}
            fontSize="8"
            fontWeight="600"
            style={{ ...mono, fill: "#06b6d4" }}
          >
            VDOT 55
          </text>
          <text
            x={paceStartX + 10}
            y={paceStartY + 100}
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            5K: 18:21 | E: 8:08-9:02/mi | T: 7:03/mi
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// PaceZoneBars
// ────────────────────────────────────

export function PaceZoneBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const zones = [
    {
      label: "E — Easy",
      percent: 75,
      color: "#22c55e",
      vo2: "59-74% VO2max",
      hr: "65-79% HRmax",
      purpose: "Aerobic base, mitochondrial development, recovery",
      volume: "~75% of weekly volume",
    },
    {
      label: "M — Marathon",
      percent: 10,
      color: "#06b6d4",
      vo2: "75-84% VO2max",
      hr: "80-85% HRmax",
      purpose: "Race-specific endurance, glycogen utilization",
      volume: "Long run segments",
    },
    {
      label: "T — Threshold",
      percent: 10,
      color: "#f59e0b",
      vo2: "83-88% VO2max",
      hr: "86-92% HRmax",
      purpose: "Lactate clearance, sustained speed",
      volume: "Max 10% of weekly mileage",
    },
    {
      label: "I — Interval",
      percent: 8,
      color: "#f97316",
      vo2: "95-100% VO2max",
      hr: "95-100% HRmax",
      purpose: "VO2max development, aerobic power",
      volume: "Max 8% of weekly mileage",
    },
    {
      label: "R — Repetition",
      percent: 5,
      color: "#ef4444",
      vo2: "105%+ VO2max",
      hr: "N/A (too short)",
      purpose: "Speed, economy, neuromuscular power",
      volume: "Max 5% of weekly mileage",
    },
  ];

  return (
    <Figure caption="Daniels' five pace zones, each targeting a distinct physiological system. The vast majority of training volume stays in the Easy zone.">
      <div ref={ref} className="space-y-6">
        {zones.map((z, i) => (
          <motion.div
            key={z.label}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className="text-sm font-medium text-foreground"
                style={mono}
              >
                {z.label}
              </span>
              <span
                className="text-xs text-muted-foreground"
                style={mono}
              >
                {z.volume}
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
                  delay: 0.3 + i * 0.12,
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
                {z.vo2}
              </span>
              <span
                className="text-[11px] text-muted-foreground"
                style={mono}
              >
                HR: {z.hr}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {z.purpose}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// PeriodizationDiagram
// ────────────────────────────────────

export function PeriodizationDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 260;

  const phases = [
    {
      num: "I",
      name: "Foundation",
      abbr: "FI",
      desc: "E pace + strides",
      color: "#22c55e",
      stress: 25,
    },
    {
      num: "II",
      name: "Early Quality",
      abbr: "EQ",
      desc: "R + light T work",
      color: "#06b6d4",
      stress: 50,
    },
    {
      num: "III",
      name: "Transition",
      abbr: "TQ",
      desc: "I + T emphasis",
      color: "#f59e0b",
      stress: 85,
    },
    {
      num: "IV",
      name: "Final Quality",
      abbr: "FQ",
      desc: "Race prep, sharpen",
      color: "#ef4444",
      stress: 65,
    },
  ];

  const pad = { top: 30, right: 20, bottom: 60, left: 20 };
  const blockGap = 12;
  const usableW = W - pad.left - pad.right - blockGap * (phases.length - 1);
  const blockW = usableW / phases.length;
  const blockH = 90;
  const blockY = pad.top + 30;

  // Stress curve
  const stressY = blockY + blockH + 30;
  const stressCurveH = 50;

  return (
    <Figure caption="Daniels' four-phase periodization builds from aerobic foundation to race-specific sharpening. Phase III is the hardest; Phase IV allows the body to peak.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Phase label */}
        <motion.text
          x={pad.left}
          y={pad.top + 10}
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.1em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          TRAINING PHASES
        </motion.text>

        {/* Phase blocks */}
        {phases.map((p, i) => {
          const x = pad.left + i * (blockW + blockGap);
          return (
            <motion.g
              key={p.num}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <rect
                x={x}
                y={blockY}
                width={blockW}
                height={blockH}
                rx={6}
                fill={p.color}
                opacity={0.1}
                stroke={p.color}
                strokeWidth={1}
              />
              {/* Phase number */}
              <text
                x={x + blockW / 2}
                y={blockY + 22}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                style={{ ...mono, fill: p.color }}
              >
                {p.num}
              </text>
              {/* Phase name */}
              <text
                x={x + blockW / 2}
                y={blockY + 40}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                style={{ ...mono, fill: "var(--foreground)" }}
              >
                {p.name}
              </text>
              {/* Phase abbreviation */}
              <text
                x={x + blockW / 2}
                y={blockY + 54}
                textAnchor="middle"
                fontSize="8"
                style={{ ...mono, fill: p.color }}
              >
                ({p.abbr})
              </text>
              {/* Description */}
              <text
                x={x + blockW / 2}
                y={blockY + 72}
                textAnchor="middle"
                fontSize="7.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {p.desc}
              </text>

              {/* Connection arrow to next phase */}
              {i < phases.length - 1 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 0.4 } : {}}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.3 }}
                >
                  <line
                    x1={x + blockW + 2}
                    y1={blockY + blockH / 2}
                    x2={x + blockW + blockGap - 2}
                    y2={blockY + blockH / 2}
                    stroke="var(--muted-foreground)"
                    strokeWidth={1}
                  />
                  <polygon
                    points={`${x + blockW + blockGap - 5},${blockY + blockH / 2 - 3} ${x + blockW + blockGap - 5},${blockY + blockH / 2 + 3} ${x + blockW + blockGap - 1},${blockY + blockH / 2}`}
                    fill="var(--muted-foreground)"
                  />
                </motion.g>
              )}
            </motion.g>
          );
        })}

        {/* Stress curve label */}
        <motion.text
          x={pad.left}
          y={stressY - 6}
          fontSize="7"
          letterSpacing="0.08em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          TRAINING STRESS
        </motion.text>

        {/* Stress curve */}
        <motion.path
          d={phases
            .map((p, i) => {
              const x = pad.left + i * (blockW + blockGap) + blockW / 2;
              const y = stressY + stressCurveH - (p.stress / 100) * stressCurveH;
              return `${i === 0 ? "M" : "L"}${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#06b6d4"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
          transition={{ delay: 1.1, duration: 1.0, ease: "easeInOut" }}
        />

        {/* Stress dots */}
        {phases.map((p, i) => {
          const x = pad.left + i * (blockW + blockGap) + blockW / 2;
          const y = stressY + stressCurveH - (p.stress / 100) * stressCurveH;
          return (
            <motion.circle
              key={`dot-${p.num}`}
              cx={x}
              cy={y}
              r={3.5}
              fill="#06b6d4"
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 0.8, scale: 1 } : {}}
              transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
            />
          );
        })}

        {/* Baseline for stress */}
        <motion.line
          x1={pad.left}
          y1={stressY + stressCurveH}
          x2={W - pad.right}
          y2={stressY + stressCurveH}
          stroke="var(--border)"
          strokeWidth={0.5}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.0, duration: 0.3 }}
        />

        {/* Timeline arrow */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <text
            x={W / 2}
            y={H - 6}
            textAnchor="middle"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Training Timeline (weeks 1 — 24) →
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// WeeklyStructureTimeline (2Q format)
// ────────────────────────────────────

export function WeeklyStructureTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const days = [
    {
      label: "Mon",
      session: "E run 40-50 min",
      color: "#22c55e",
      intensity: "easy",
    },
    {
      label: "Tue",
      session: "E run 40-50 min",
      color: "#22c55e",
      intensity: "easy",
    },
    {
      label: "Wed",
      session: "Q1: Intervals / Tempo",
      color: "#06b6d4",
      intensity: "quality",
    },
    {
      label: "Thu",
      session: "E run 40-50 min",
      color: "#22c55e",
      intensity: "easy",
    },
    {
      label: "Fri",
      session: "E run 30-40 min",
      color: "#22c55e",
      intensity: "easy",
    },
    {
      label: "Sat",
      session: "Q2: Long run w/ pace",
      color: "#06b6d4",
      intensity: "quality",
    },
    {
      label: "Sun",
      session: "E run or rest",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
  ];

  return (
    <Figure caption="Daniels' 2Q (two quality) weekly structure. Only two hard days per week — the rest is easy running to absorb and recover from quality sessions.">
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
                      ? "#06b6d4"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </div>
                <div
                  className="rounded-md py-4 px-1 border"
                  style={{
                    borderColor: isQuality
                      ? "#06b6d4"
                      : "var(--border)",
                    background: isQuality
                      ? "#06b6d4"
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
                        ? "#06b6d4"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isQuality && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#06b6d4" }}
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
                    ? "#06b6d4"
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
                      ? "#06b6d4"
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
                {isQuality && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "#06b6d4" }}
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
// WorkoutCards
// ────────────────────────────────────

export function WorkoutCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const workouts = [
    {
      name: "Cruise Intervals",
      badge: "Daniels' Signature",
      structure: "4-6 x 1 mile at T pace, 1 min rest",
      target: "Comfortably hard — you could hold this for 50-60 min in a race",
      purpose: "Improve lactate clearance at sustained speed. The short rest keeps you at threshold without full recovery, maximizing time at the target intensity.",
      zone: "T Pace",
      color: "#f59e0b",
    },
    {
      name: "VO2max Intervals",
      badge: "Aerobic Power",
      structure: "5 x 1000m at I pace, 3 min jog recovery",
      target: "Hard, controlled effort — 95-100% VO2max",
      purpose: "Develop maximal aerobic capacity. Recovery must be long enough to maintain quality — if pace drops more than 3-5 seconds, the interval is no longer productive.",
      zone: "I Pace",
      color: "#f97316",
    },
    {
      name: "Mixed-Pace Long Run",
      badge: "Marathon Prep",
      structure: "2mi E + 4x1mi T + 8mi E + 20min T + 2mi E",
      target: "Smooth transitions between paces, no rushing",
      purpose: "Combine aerobic endurance with race-specific pace work on tired legs. The threshold segments at the end simulate late-race demands.",
      zone: "E + T Pace",
      color: "#06b6d4",
    },
    {
      name: "Repetitions",
      badge: "Speed & Economy",
      structure: "8-12 x 200m at R pace, full recovery (200m jog)",
      target: "Fast, smooth, relaxed — not straining",
      purpose: "Improve running economy and neuromuscular coordination at speed. Full recovery is critical — these are not meant to be aerobically taxing.",
      zone: "R Pace",
      color: "#ef4444",
    },
  ];

  return (
    <Figure caption="Daniels' core workouts. Each targets a specific physiological system at a specific intensity — no junk miles allowed.">
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
              <div>
                <h4
                  className="text-sm font-semibold text-foreground"
                  style={mono}
                >
                  {w.name}
                </h4>
                <span
                  className="text-[10px] text-muted-foreground"
                  style={mono}
                >
                  {w.badge}
                </span>
              </div>
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
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div>
                <span className="text-muted-foreground/60">Structure: </span>
                {w.structure}
              </div>
              <div>
                <span className="text-muted-foreground/60">Effort: </span>
                {w.target}
              </div>
              <div>
                <span className="text-muted-foreground/60">Why: </span>
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
// VolumeCapDiagram
// ────────────────────────────────────

export function VolumeCapDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 180;
  const pad = { top: 30, right: 30, bottom: 40, left: 50 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const caps = [
    { label: "T Pace", cap: 10, color: "#f59e0b", desc: "~4-6 mi/week" },
    { label: "I Pace", cap: 8, color: "#f97316", desc: "~3-5 mi/week" },
    { label: "R Pace", cap: 5, color: "#ef4444", desc: "~2-3 mi/week" },
  ];

  const barWidth = cw / (caps.length * 2);
  const barGap = cw / (caps.length * 2);

  return (
    <Figure caption="Daniels' quality volume caps as percentage of weekly mileage. More is not better — exceeding these limits increases injury risk without proportional benefit.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Title */}
        <text
          x={pad.left}
          y={pad.top - 10}
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.1em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          MAX WEEKLY VOLUME AT EACH QUALITY PACE
        </text>

        {/* Baseline */}
        <line
          x1={pad.left}
          y1={pad.top + ch}
          x2={W - pad.right}
          y2={pad.top + ch}
          stroke="var(--border)"
          strokeWidth={1}
        />

        {/* Bars */}
        {caps.map((c, i) => {
          const x = pad.left + barGap / 2 + i * (barWidth + barGap);
          const barH = (c.cap / 12) * ch;
          const y = pad.top + ch - barH;

          return (
            <motion.g
              key={c.label}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
            >
              {/* Background bar */}
              <rect
                x={x}
                y={pad.top}
                width={barWidth}
                height={ch}
                rx={4}
                fill={c.color}
                opacity={0.06}
              />
              {/* Filled bar */}
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                rx={4}
                fill={c.color}
                opacity={0.3}
                initial={{ height: 0, y: pad.top + ch }}
                animate={
                  inView
                    ? { height: barH, y }
                    : { height: 0, y: pad.top + ch }
                }
                transition={{
                  delay: 0.4 + i * 0.15,
                  duration: 0.7,
                  ease: "easeOut",
                }}
              />
              {/* Cap label */}
              <motion.text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                style={{ ...mono, fill: c.color }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
              >
                {c.cap}%
              </motion.text>
              {/* Zone label */}
              <text
                x={x + barWidth / 2}
                y={pad.top + ch + 16}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                style={{ ...mono, fill: "var(--foreground)" }}
              >
                {c.label}
              </text>
              {/* Description */}
              <text
                x={x + barWidth / 2}
                y={pad.top + ch + 28}
                textAnchor="middle"
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {c.desc}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// DanielsArticle (main export)
// ────────────────────────────────────
