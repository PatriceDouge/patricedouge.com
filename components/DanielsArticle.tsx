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
// VDOTFlowDiagram
// ────────────────────────────────────

function VDOTFlowDiagram() {
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

function PaceZoneBars() {
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

function PeriodizationDiagram() {
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

function WeeklyStructureTimeline() {
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

function WorkoutCards() {
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

function VolumeCapDiagram() {
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

export function DanielsArticle() {
  return (
    <ArticleLayout
      title="Jack Daniels' Running Formula"
      subtitle="How physiological pace zones, the VDOT system, and purpose-driven training revolutionized the science of coaching distance runners."
      accentColor="#06b6d4"
    >
      {/* ── Introduction ── */}
      <section>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Jack Daniels (1933&ndash;2025) was an exercise physiologist, Olympic
            pentathlete, and arguably the most influential running coach of the
            modern era. A two-time Olympic medalist in modern pentathlon
            &mdash; silver in Melbourne (1956) and bronze in Rome (1960)
            &mdash; Daniels pivoted from competing to studying the science of
            endurance performance. He earned his PhD in exercise physiology from
            the University of Wisconsin-Madison, where his doctoral research
            on the aerobic profiles of elite distance runners laid the
            groundwork for everything that followed. Runner&rsquo;s World would
            eventually name him the &ldquo;World&rsquo;s Best Running
            Coach&rdquo; &mdash; a title earned not through charisma or dogma,
            but through a relentless commitment to evidence.
          </p>
          <p className="text-muted leading-relaxed">
            Daniels&rsquo; central innovation was bridging the gap between
            laboratory science and practical coaching. He observed that two
            runners could have the same VO2max yet race at vastly different
            speeds &mdash; because running economy (the oxygen cost of running
            at a given pace) varied enormously between individuals. To solve
            this, he created{" "}
            <strong>VDOT</strong> &mdash; a single index that combines VO2max
            and running economy into one number derived purely from race
            results. No lab required. A runner&rsquo;s 5K time could predict
            their marathon potential, and more importantly, it could generate
            five precise training paces, each targeting a distinct physiological
            system. The result was a coaching framework where every workout had
            a clear purpose and every pace had a scientific rationale.
          </p>
          <p className="text-muted leading-relaxed">
            Over a career spanning five decades, Daniels coached at the
            collegiate, elite, and recreational levels. His tenure at SUNY
            Cortland produced eight NCAA Division III national cross-country
            championships. His textbook,{" "}
            <em>Daniels&rsquo; Running Formula</em>, now in its fourth edition,
            became the most widely referenced training manual in the sport. His
            philosophy can be distilled to a single principle that runs through
            every page: <strong>&ldquo;Train the right system, at the right
            intensity, for the right duration.&rdquo;</strong> Every run must
            have a purpose. If you cannot articulate what physiological
            adaptation a workout is designed to produce, you should not be
            doing it.
          </p>
        </div>
      </section>

      {/* ── Key stats ── */}
      <div className="my-10 grid grid-cols-3 gap-4">
        <KeyStat
          value={5}
          label="Training pace zones"
          format={(n) => `${Math.round(n)}`}
        />
        <KeyStat
          value={8}
          label="NCAA championships"
          format={(n) => `${Math.round(n)}`}
        />
        <KeyStat
          value={80}
          label="% easy volume target"
          format={(n) => `${Math.round(n)}%`}
        />
      </div>

      <SectionDivider text="THE VDOT SYSTEM" />

      {/* ── VDOT Explained ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          One Number to Rule Them All
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The VDOT system is Daniels&rsquo; most enduring contribution to the
            sport. Traditional coaching relied on arbitrary percentages of
            race pace or vague effort descriptors like &ldquo;comfortably
            hard.&rdquo; Daniels replaced this with a lookup table: enter your
            most recent race result at any standard distance, find your VDOT
            number, and read off five precisely calibrated training paces.
          </p>
          <p className="text-muted leading-relaxed">
            The elegance of VDOT lies in what it accounts for implicitly. Two
            runners might both have a VO2max of 60 ml/kg/min, but if one runs
            with significantly better economy &mdash; less oxygen consumed per
            mile &mdash; that runner will race faster and will have a higher
            VDOT. By anchoring training paces to <em>race performance</em>{" "}
            rather than lab-measured VO2max, Daniels ensures that each
            athlete&rsquo;s training is calibrated to their actual current
            fitness, not their theoretical ceiling.
          </p>
          <p className="text-muted leading-relaxed">
            A critical rule: VDOT should be recalculated after every race or
            time trial. Training paces that were appropriate three months ago
            may be too slow (or too fast) today. Daniels was emphatic that
            runners should train at their <em>current</em> ability level, not
            at the level they wish they were at. Setting paces too aggressively
            is one of the most common mistakes recreational runners make, and
            it leads to overtraining, injury, and stagnation. &ldquo;Never
            train at a VDOT you have not earned,&rdquo; he cautioned.
          </p>
        </div>
      </section>

      <VDOTFlowDiagram />

      <SectionDivider text="FIVE PACE ZONES" />

      {/* ── Pace Zones ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Five Zones, Five Purposes
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Unlike training systems that define zones purely by heart rate or
            subjective effort, Daniels built each zone around a specific{" "}
            <strong>physiological adaptation</strong>. Easy pace develops the
            aerobic engine. Marathon pace rehearses race-day fueling and pacing.
            Threshold pace improves lactate clearance. Interval pace builds
            VO2max. Repetition pace sharpens neuromuscular speed and economy.
            Each zone has a well-defined intensity range, a clear purpose, and
            &mdash; crucially &mdash; a volume cap.
          </p>
          <p className="text-muted leading-relaxed">
            The volume caps are essential to Daniels&rsquo; philosophy. Running
            more miles at threshold pace does not produce more adaptation beyond
            a certain point &mdash; it just produces more fatigue. Daniels
            specified that no more than 10% of weekly mileage should be at T
            pace, no more than 8% at I pace, and no more than 5% at R pace.
            The remaining 75-80% should be genuinely easy running. This is
            not laziness; it is strategic. The easy running develops the aerobic
            base while allowing the body to absorb and adapt to the quality
            sessions.
          </p>
        </div>
      </section>

      <PaceZoneBars />

      <VolumeCapDiagram />

      <SectionDivider text="FOUR-PHASE PERIODIZATION" />

      {/* ── Training Phases ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Building Fitness in Layers
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Daniels organizes a training season into four sequential phases,
            each lasting approximately six weeks. The progression follows a
            logical arc: build the aerobic foundation first, then layer on
            speed, then add the most stressful race-specific work, and finally
            sharpen for competition. Skipping phases or jumping ahead is one
            of the most common mistakes coaches make.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Phase I (Foundation &amp; Injury Prevention)</strong> is
            entirely about easy running and building structural resilience.
            The only quality work is strides &mdash; short accelerations of
            20-30 seconds at the end of easy runs that introduce neuromuscular
            speed without metabolic stress. Volume builds gradually, following
            Daniels&rsquo; rule that weekly mileage should not increase by more
            than one mile per session per week.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Phase II (Early Quality)</strong> introduces repetition
            pace work to develop speed and economy, along with light threshold
            work. The emphasis is still aerobic, but the body begins adapting
            to faster running mechanics. This phase is about teaching the legs
            to turn over efficiently before asking them to sustain hard efforts.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Phase III (Transition Quality)</strong> is the most
            demanding phase. Interval and threshold work reach peak volume.
            This is where VO2max development and lactate clearance improvement
            are the primary targets. Daniels warns that this phase requires the
            most discipline &mdash; the temptation is to pile on more hard work,
            but exceeding the prescribed quality limits leads to diminishing
            returns and elevated injury risk.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Phase IV (Final Quality)</strong> shifts the focus to
            race-specific preparation and sharpening. Volume decreases while
            intensity remains high but targeted. The workouts simulate race
            demands: tempo segments at goal pace, race-pace repetitions, and
            dress rehearsal efforts. The body is allowed to consolidate the
            fitness built in earlier phases and arrive at the starting line
            fresh, confident, and ready.
          </p>
        </div>
      </section>

      <PeriodizationDiagram />

      <SectionDivider text="THE TRAINING WEEK" />

      {/* ── Weekly Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The 2Q Weekly Framework
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Daniels popularized the &ldquo;2Q&rdquo; system &mdash; two
            quality sessions per week, spaced roughly 72 hours apart, with
            easy running filling the remaining days. This structure reflects
            a fundamental physiological reality: adaptation happens during
            recovery, not during the workout itself. The quality sessions
            provide the stimulus; the easy days provide the environment for
            the body to respond.
          </p>
          <p className="text-muted leading-relaxed">
            Quality day one (Q1, typically midweek) is usually an interval or
            tempo session targeting a single physiological system. Quality day
            two (Q2, typically the weekend long run) often combines easy miles
            with pace segments &mdash; threshold pickups within a long run, or
            marathon-pace miles sandwiched between easy warmup and cooldown.
            This approach allows runners to accumulate significant volume at
            quality paces within the context of a long aerobic effort, closely
            mimicking race conditions.
          </p>
          <p className="text-muted leading-relaxed">
            The non-quality days are sacred. Daniels was emphatic that easy
            runs should be truly easy &mdash; conversational pace, 65-79%
            of maximum heart rate. &ldquo;The purpose of easy days is to
            facilitate recovery from quality days,&rdquo; he wrote. Running
            them too fast produces no additional aerobic benefit but
            significantly increases recovery time, creating a negative feedback
            loop where the athlete is perpetually too tired to perform well on
            quality days.
          </p>
        </div>
      </section>

      <WeeklyStructureTimeline />

      <SectionDivider text="KEY WORKOUTS" />

      {/* ── Key Workouts ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Core Workouts
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Daniels designed a relatively small set of workout templates, each
            precisely targeted at a specific adaptation. His genius was in the
            constraints: he specified not only the pace but the maximum volume
            at that pace, the recovery duration, and the progression logic.
            His most famous creation &mdash; the cruise interval &mdash;
            exemplifies this approach. Rather than running a single 20-minute
            tempo, athletes break the threshold work into mile-long repeats
            with brief rest periods. This allows them to accumulate more total
            time at threshold intensity with better mechanical form and less
            central nervous system fatigue than a continuous effort.
          </p>
          <p className="text-muted leading-relaxed">
            Every workout in the Daniels system follows a strict
            hierarchy of priorities: first, maintain the correct intensity;
            second, accumulate the prescribed volume at that intensity; third
            (and only third), consider extending the session if the first two
            conditions are met and the body feels good. If pace begins to slip,
            the workout is over. &ldquo;Never sacrifice quality for
            quantity,&rdquo; Daniels wrote. A session where you complete four
            strong repeats at the correct pace is superior to six repeats where
            the last two were above target intensity.
          </p>
        </div>
      </section>

      <WorkoutCards />

      <SectionDivider text="CORE PRINCIPLES" />

      {/* ── Core Principles ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Laws of Training
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Daniels articulated several training principles that he considered
            non-negotiable. These were not arbitrary preferences but
            conclusions drawn from decades of research and coaching thousands
            of athletes:
          </p>
          <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
            <li>
              <strong>The body responds to stress.</strong> Improvement comes
              from applying a specific physiological stress and then allowing
              the body to adapt. The stress must be sufficient to provoke
              adaptation but not so great that it exceeds the body&rsquo;s
              ability to recover. This is the foundation of all training theory,
              and Daniels built his entire system around calibrating that stress
              precisely.
            </li>
            <li>
              <strong>Specificity of training.</strong> The body adapts to the
              specific demands placed upon it. Running at threshold pace
              improves lactate clearance. Running at interval pace improves
              VO2max. Running slowly for a long time improves aerobic
              endurance. You cannot improve a system you do not train, and you
              cannot train a system by running at the wrong intensity.
            </li>
            <li>
              <strong>Diminishing returns.</strong> The relationship between
              training volume and fitness gain is not linear. There is an
              optimal amount of quality work at each intensity &mdash; beyond
              that point, additional volume produces less adaptation per mile
              and more fatigue per mile. This is why Daniels capped quality
              volume so rigorously.
            </li>
            <li>
              <strong>Personal limits.</strong> Every individual has different
              physiological ceilings, different injury thresholds, and different
              life constraints. Daniels designed his system to be individualized
              through VDOT &mdash; each runner gets paces calibrated to their
              current fitness, not some idealized standard.
            </li>
            <li>
              <strong>Maintenance of achievement.</strong> Fitness gained at
              one level of training can be maintained at a lower volume if
              intensity is preserved. This principle drives Daniels&rsquo;
              periodization: once aerobic base is established in Phase I, it
              can be maintained with easy running while intensity shifts to
              threshold and interval work in later phases.
            </li>
          </ul>
        </div>
      </section>

      <SectionDivider text="DANIELS VS. OTHER METHODS" />

      {/* ── Comparison ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          How Daniels Compares
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Daniels&rsquo; five-zone system occupies a distinct position among
            major training philosophies. Compared to the Norwegian method, which
            emphasizes two zones of threshold work (LT1 and LT2) with
            lactate-guided precision, Daniels offers a broader palette of
            intensities but relies on pace tables rather than real-time lactate
            measurement. Compared to traditional polarized training (the 80/20
            model), Daniels is less dogmatic about avoiding the &ldquo;middle
            zone&rdquo; &mdash; his threshold and marathon paces live precisely
            in the territory that polarized advocates warn against, but Daniels
            caps their volume carefully.
          </p>
        </div>

        <div className="my-8 space-y-3">
          <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
            Daniels&rsquo; Volume Distribution
          </div>
          <AnimatedBar percent={75} color="#22c55e" label="E (Easy)" delay={0} />
          <AnimatedBar percent={10} color="#06b6d4" label="M (Marathon)" delay={0.1} />
          <AnimatedBar percent={10} color="#f59e0b" label="T (Threshold)" delay={0.2} />
          <AnimatedBar percent={8} color="#f97316" label="I (Interval)" delay={0.3} />
          <AnimatedBar percent={5} color="#ef4444" label="R (Reps)" delay={0.4} />

          <div className="text-xs text-muted-foreground mb-2 mt-6 font-medium uppercase tracking-wider">
            Traditional Polarized (80/20)
          </div>
          <AnimatedBar percent={80} color="#22c55e" label="Easy" delay={0.5} />
          <AnimatedBar percent={5} color="#f59e0b" label="Moderate" delay={0.6} />
          <AnimatedBar percent={15} color="#ef4444" label="High" delay={0.7} />
        </div>

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The practical difference is meaningful: a Daniels-trained runner
            distributes quality work across multiple energy systems (speed,
            threshold, VO2max), while a polarized athlete concentrates quality
            work above LT2. Daniels argued that this broader approach produces
            more well-rounded fitness and translates better across race
            distances &mdash; the same athlete can race competitively from the
            mile to the marathon with adjustments to race-specific preparation,
            not wholesale changes to training philosophy.
          </p>
        </div>
      </section>

      <SectionDivider text="PRACTICAL TAKEAWAYS" />

      {/* ── Takeaways ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Applying Daniels&rsquo; Principles
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            You do not need a PhD in exercise physiology to benefit from
            Daniels&rsquo; framework. The system was designed to be accessible:
            run a race (or a time trial), look up your VDOT, and train at the
            prescribed paces. But several principles deserve special emphasis:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Every run needs a clear purpose.</strong> Before you lace
              up, know what system you are training. If the answer is
              &ldquo;I&rsquo;m just going for a run,&rdquo; then it is an
              easy day &mdash; and it must be run at easy pace. Eliminate junk
              miles: the vague medium-effort runs that are too hard to be
              recovery and too easy to be quality.
            </li>
            <li>
              <strong>Use recent race results to set paces.</strong> Do not
              train at a VDOT you have not earned. Update your paces after
              every race or time trial. Training at paces that are 10-15
              seconds per mile too fast feels heroic in the moment but
              undermines the entire training cycle.
            </li>
            <li>
              <strong>Cap quality volume ruthlessly.</strong> No more than 10%
              of weekly mileage at T pace. No more than 8% at I pace. No more
              than 5% at R pace. If you are running 50 miles per week, that
              means no more than 5 miles at threshold &mdash; roughly one
              quality session of cruise intervals.
            </li>
            <li>
              <strong>Easy runs are truly easy.</strong> 65-79% of maximum
              heart rate. Fully conversational. Slower than you think. The
              aerobic adaptations from easy running are significant: increased
              capillary density, improved mitochondrial efficiency, greater
              fat oxidation. You do not need to run hard to trigger these
              adaptations.
            </li>
            <li>
              <strong>Do not exceed what is needed.</strong> Daniels&rsquo;
              overriding principle was to apply the <em>least training stress
              necessary</em> to achieve the desired adaptation. More is not
              always better. The goal is maximum benefit with minimum cost
              &mdash; not maximum suffering.
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
            <ExternalLink href="https://coacheseducation.com/endur/daniels-fitness-index.htm">
              CoachesEducation.com &mdash; Determining Your Current Level of
              Fitness
            </ExternalLink>
            {" "}&mdash; Daniels&rsquo; original VDOT tables and explanation of
            the fitness index concept.
          </p>
          <p>
            <ExternalLink href="https://fellrnr.com/wiki/Jack_Daniels%27_Running_Formula">
              Fellrnr.com &mdash; Jack Daniels&rsquo; Running Formula Review
            </ExternalLink>
            {" "}&mdash; Comprehensive analysis and critique of Daniels&rsquo;
            training system, with comparisons to other methodologies.
          </p>
          <p>
            <ExternalLink href="https://runningwithrock.com/jack-daniels-training-explained/">
              Running with Rock &mdash; Jack Daniels Training Explained
            </ExternalLink>
            {" "}&mdash; Practical breakdown of the five pace zones and workout
            prescriptions for recreational runners.
          </p>
          <p>
            <ExternalLink href="https://rundna.com/vdot-training-tables">
              RunDNA &mdash; VDOT Training Tables
            </ExternalLink>
            {" "}&mdash; Interactive VDOT calculator with pace charts across all
            five training zones.
          </p>
          <p>
            <ExternalLink href="https://us.humankinetics.com/blogs/excerpt/basic-laws-of-running-according-to-jack-daniels">
              Human Kinetics &mdash; Basic Laws of Running According to Jack
              Daniels
            </ExternalLink>
            {" "}&mdash; Excerpt from <em>Daniels&rsquo; Running Formula</em>{" "}
            covering the foundational training principles.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
