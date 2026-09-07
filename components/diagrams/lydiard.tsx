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
// LydiardPyramidDiagram
// ────────────────────────────────────

export function LydiardPyramidDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 380;
  const centerX = W / 2;

  // Phases from bottom (widest) to top (narrowest)
  const phases = [
    {
      label: "AEROBIC BASE",
      weeks: "8–24 weeks",
      color: "#8b5cf6",
      widthPct: 0.92,
      height: 80,
      description: "High-volume steady running at 3/4 effort",
    },
    {
      label: "HILL RESISTANCE",
      weeks: "4 weeks",
      color: "#10b981",
      widthPct: 0.72,
      height: 60,
      description: "Bounding, springing, hill circuits",
    },
    {
      label: "ANAEROBIC DEV.",
      weeks: "4–6 weeks",
      color: "#f59e0b",
      widthPct: 0.54,
      height: 55,
      description: "Repetitions, 50/50 sprints, time trials",
    },
    {
      label: "COORDINATION",
      weeks: "4–6 weeks",
      color: "#3b82f6",
      widthPct: 0.38,
      height: 50,
      description: "Sharpening race pace, race simulations",
    },
    {
      label: "PEAK / RACE",
      weeks: "1–2 weeks",
      color: "#ef4444",
      widthPct: 0.22,
      height: 42,
      description: "Taper and compete",
    },
  ];

  // Calculate y positions bottom-up
  const padding = 28;
  const totalHeight = phases.reduce((acc, p) => acc + p.height, 0);
  const startY = padding + (H - 2 * padding - totalHeight) / 2 + totalHeight;

  const blocks: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    weeks: string;
    color: string;
    description: string;
    delay: number;
  }[] = [];

  let currentY = startY;
  phases.forEach((phase, i) => {
    const blockW = (W - 80) * phase.widthPct;
    currentY -= phase.height;
    blocks.push({
      x: centerX - blockW / 2,
      y: currentY,
      w: blockW,
      h: phase.height - 4,
      label: phase.label,
      weeks: phase.weeks,
      color: phase.color,
      description: phase.description,
      delay: (phases.length - 1 - i) * 0.15,
    });
  });

  return (
    <Figure caption="The Lydiard Pyramid: sequential periodization from the bottom up. Each phase builds on the one below. The aerobic base is always the largest block — it is the foundation that supports all faster work above.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Connecting lines (pyramid outline) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.15 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {/* Left edge */}
          <line
            x1={blocks[0].x}
            y1={blocks[0].y + blocks[0].h}
            x2={blocks[blocks.length - 1].x}
            y2={blocks[blocks.length - 1].y}
            stroke="var(--foreground)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {/* Right edge */}
          <line
            x1={blocks[0].x + blocks[0].w}
            y1={blocks[0].y + blocks[0].h}
            x2={blocks[blocks.length - 1].x + blocks[blocks.length - 1].w}
            y2={blocks[blocks.length - 1].y}
            stroke="var(--foreground)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </motion.g>

        {/* Phase blocks */}
        {blocks.map((b, i) => (
          <motion.g
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.3 + b.delay,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            {/* Block fill */}
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="4"
              fill={b.color}
              opacity="0.15"
            />
            {/* Block border */}
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="4"
              fill="none"
              stroke={b.color}
              strokeWidth="1.5"
              opacity="0.5"
            />
            {/* Phase label */}
            <text
              x={centerX}
              y={b.y + b.h / 2 - (i === 0 ? 4 : 2)}
              textAnchor="middle"
              fontSize={i === 0 ? "11" : "10"}
              fontWeight="600"
              letterSpacing="0.05em"
              style={{ ...mono, fill: b.color }}
            >
              {b.label}
            </text>
            {/* Weeks label */}
            <text
              x={centerX}
              y={b.y + b.h / 2 + (i === 0 ? 10 : 10)}
              textAnchor="middle"
              fontSize="8"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
            >
              {b.weeks}
            </text>
            {/* Description (only for base phase to avoid clutter) */}
            {i === 0 && (
              <text
                x={centerX}
                y={b.y + b.h / 2 + 22}
                textAnchor="middle"
                fontSize="7.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
                opacity="0.7"
              >
                {b.description}
              </text>
            )}
          </motion.g>
        ))}

        {/* Arrow on the left indicating "build up" */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <line
            x1={28}
            y1={blocks[0].y + blocks[0].h - 5}
            x2={28}
            y2={blocks[blocks.length - 1].y + 5}
            stroke="var(--muted-foreground)"
            strokeWidth="1"
            markerEnd="url(#arrowUp)"
          />
          <defs>
            <marker
              id="arrowUp"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <path
                d="M0,6 L3,0 L6,6"
                fill="none"
                stroke="var(--muted-foreground)"
                strokeWidth="1"
              />
            </marker>
          </defs>
          <text
            x={24}
            y={(blocks[0].y + blocks[0].h + blocks[blocks.length - 1].y) / 2}
            textAnchor="middle"
            fontSize="7"
            letterSpacing="0.1em"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
            transform={`rotate(-90, 24, ${(blocks[0].y + blocks[0].h + blocks[blocks.length - 1].y) / 2})`}
          >
            TIME →
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// EffortScaleDiagram
// ────────────────────────────────────

export function EffortScaleDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 200;
  const barY = 60;
  const barH = 40;
  const pad = { left: 50, right: 30 };
  const barW = W - pad.left - pad.right;

  const efforts = [
    {
      label: "1/4",
      fraction: 0.25,
      color: "#8b5cf6",
      opacity: 0.2,
      desc: "Easy aerobic",
      hr: "~65–70% HRR",
    },
    {
      label: "1/2",
      fraction: 0.5,
      color: "#8b5cf6",
      opacity: 0.35,
      desc: "Strong aerobic",
      hr: "~70–75% HRR",
    },
    {
      label: "3/4",
      fraction: 0.75,
      color: "#8b5cf6",
      opacity: 0.5,
      desc: "Hard aerobic",
      hr: "~75–80% HRR",
    },
    {
      label: "7/8",
      fraction: 0.875,
      color: "#8b5cf6",
      opacity: 0.7,
      desc: "Near max aerobic",
      hr: "~80–85% HRR",
    },
  ];

  return (
    <Figure caption="Lydiard's effort scale. Training intensity is governed by perceived effort fractions, not pace. The majority of base-phase running sits at 3/4 effort — 'strong but not straining.'">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Title */}
        <text
          x={W / 2}
          y={20}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.08em"
          style={{ ...mono, fill: "var(--foreground)" }}
        >
          LYDIARD EFFORT SCALE
        </text>

        {/* Background bar */}
        <rect
          x={pad.left}
          y={barY}
          width={barW}
          height={barH}
          rx="4"
          fill="var(--foreground)"
          opacity="0.04"
        />

        {/* Effort zone markers */}
        {efforts.map((e, i) => (
          <motion.g
            key={e.label}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
          >
            {/* Filled bar up to this effort level */}
            <motion.rect
              x={pad.left}
              y={barY}
              height={barH}
              rx="4"
              fill={e.color}
              opacity={e.opacity}
              initial={{ width: 0 }}
              animate={inView ? { width: barW * e.fraction } : { width: 0 }}
              transition={{
                delay: 0.3 + i * 0.2,
                duration: 0.7,
                ease: "easeOut",
              }}
            />

            {/* Marker line */}
            <motion.line
              x1={pad.left + barW * e.fraction}
              y1={barY - 2}
              x2={pad.left + barW * e.fraction}
              y2={barY + barH + 2}
              stroke={e.color}
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.8 } : {}}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.3 }}
            />

            {/* Effort label above */}
            <text
              x={pad.left + barW * e.fraction}
              y={barY - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              style={{ ...mono, fill: e.color }}
            >
              {e.label}
            </text>

            {/* Description and HR below */}
            <text
              x={pad.left + barW * e.fraction}
              y={barY + barH + 18}
              textAnchor="middle"
              fontSize="7.5"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
            >
              {e.desc}
            </text>
            <text
              x={pad.left + barW * e.fraction}
              y={barY + barH + 30}
              textAnchor="middle"
              fontSize="7"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
              opacity="0.7"
            >
              {e.hr}
            </text>
          </motion.g>
        ))}

        {/* Left label: REST */}
        <text
          x={pad.left - 6}
          y={barY + barH / 2 + 3}
          textAnchor="end"
          fontSize="8"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          REST
        </text>

        {/* Right label: MAX */}
        <text
          x={pad.left + barW + 6}
          y={barY + barH / 2 + 3}
          textAnchor="start"
          fontSize="8"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          MAX
        </text>

        {/* Bracket for "training without straining" zone */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <line
            x1={pad.left + barW * 0.5}
            y1={barY + barH + 44}
            x2={pad.left + barW * 0.875}
            y2={barY + barH + 44}
            stroke="#8b5cf6"
            strokeWidth="1"
          />
          <line
            x1={pad.left + barW * 0.5}
            y1={barY + barH + 40}
            x2={pad.left + barW * 0.5}
            y2={barY + barH + 48}
            stroke="#8b5cf6"
            strokeWidth="1"
          />
          <line
            x1={pad.left + barW * 0.875}
            y1={barY + barH + 40}
            x2={pad.left + barW * 0.875}
            y2={barY + barH + 48}
            stroke="#8b5cf6"
            strokeWidth="1"
          />
          <text
            x={(pad.left + barW * 0.5 + pad.left + barW * 0.875) / 2}
            y={barY + barH + 58}
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="500"
            letterSpacing="0.04em"
            style={{ ...mono, fill: "#8b5cf6" }}
          >
            &quot;TRAINING WITHOUT STRAINING&quot;
          </text>
        </motion.g>
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
      label: "Mon",
      type: "steady",
      session: "Steady 15 mi",
      effort: "3/4 effort",
      color: "#8b5cf6",
      intensity: "quality",
    },
    {
      label: "Tue",
      type: "easy",
      session: "Easy 10 mi",
      effort: "1/4 effort",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Wed",
      type: "fartlek",
      session: "Fartlek 12 mi",
      effort: "aerobic",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Thu",
      type: "easy",
      session: "Easy + strides 10 mi",
      effort: "1/4 effort",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Fri",
      type: "tempo",
      session: "Sub-threshold 12–15 mi",
      effort: "1/2–3/4",
      color: "#8b5cf6",
      intensity: "quality",
    },
    {
      label: "Sat",
      type: "easy",
      session: "Easy 8–10 mi",
      effort: "1/4 effort",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Sun",
      type: "long",
      session: "Long 22 mi",
      effort: "3/4 effort",
      color: "#8b5cf6",
      intensity: "long",
    },
  ];

  return (
    <Figure caption="A typical Lydiard base-phase week: 90–100 miles of aerobic running. Three quality sessions (Mon, Fri, Sun) anchor the week, with easy recovery runs between. All running is aerobic — no anaerobic work in this phase.">
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
                      ? "#8b5cf6"
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </div>
                <div
                  className="rounded-md py-4 px-1 border"
                  style={{
                    borderColor: highlight
                      ? "#8b5cf6"
                      : "var(--border)",
                    background: highlight
                      ? "#8b5cf6"
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
                        ? "#8b5cf6"
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isQuality && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#8b5cf6" }}
                      >
                        Quality
                      </span>
                    )}
                    {isLong && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: "#8b5cf6", opacity: 0.7 }}
                      >
                        Long Run
                      </span>
                    )}
                    {d.session}
                    <span
                      className="block mt-0.5 text-[8px]"
                      style={{ color: "var(--muted-foreground)", opacity: 0.7 }}
                    >
                      {d.effort}
                    </span>
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
                    ? "#8b5cf6"
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
                      ? "#8b5cf6"
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
                <span
                  className="text-[9px] text-muted-foreground"
                  style={mono}
                >
                  {d.effort}
                </span>
                {isQuality && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "#8b5cf6" }}
                  >
                    Quality
                  </span>
                )}
                {isLong && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: "#8b5cf6", opacity: 0.7 }}
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
      name: "Waiatarua 22-Miler",
      structure: "22 mi hilly out-and-back, undulating terrain",
      target: "2:00–2:45 duration",
      effort: "3/4 effort — strong, sustainable, never straining",
      phase: "Base",
      color: "#8b5cf6",
    },
    {
      name: "Hill Circuit",
      structure: "200m bounding + 400m hill run + 200m springing, jog down, bottom sprints × 3",
      target: "Full circuit takes ~45 min",
      effort: "Hard — develops leg power and running economy",
      phase: "Hills",
      color: "#10b981",
    },
    {
      name: "50/50 Sprints",
      structure: "5 laps alternating 50m sprint / 50m float (20 sprints total)",
      target: "Develop anaerobic capacity",
      effort: "Near max sprint with active float recovery",
      phase: "Anaerobic",
      color: "#f59e0b",
    },
    {
      name: "Aerobic Fartlek",
      structure: "Free-form speed play: bursts < 1 min, recover as needed",
      target: "Keep all efforts aerobic",
      effort: "Unstructured — respond to terrain, wind, feel",
      phase: "Base",
      color: "#8b5cf6",
    },
  ];

  return (
    <Figure caption="Lydiard's signature workouts span every phase. Note how each session has a specific developmental purpose within the sequential periodization model.">
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
                {w.phase}
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
// AthleteLegacyTimeline
// ────────────────────────────────────

export function AthleteLegacyTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 260;
  const pad = { left: 60, right: 40, top: 30, bottom: 40 };
  const lineY = H / 2;
  const lineX1 = pad.left;
  const lineX2 = W - pad.right;

  const events = [
    { year: 1960, label: "Halberg 5000m\nGold (Rome)", color: "#8b5cf6" },
    { year: 1960, label: "Magee Marathon\nBronze (Rome)", color: "#10b981", offsetY: 1 },
    { year: 1964, label: "Snell 800m &\n1500m Gold", color: "#f59e0b" },
    { year: 1966, label: "Bowerman visits\nNew Zealand", color: "#3b82f6" },
    { year: 1972, label: "Viren 5K/10K\nDouble Gold", color: "#ef4444" },
    { year: 2004, label: "Lydiard dies;\nlegacy endures", color: "#8b5cf6" },
  ];

  const yearMin = 1958;
  const yearMax = 2006;
  const toX = (year: number) =>
    lineX1 + ((year - yearMin) / (yearMax - yearMin)) * (lineX2 - lineX1);

  return (
    <Figure caption="Key moments in the Lydiard legacy. From Olympic gold in Rome to the founding of Nike, Lydiard's influence spread across continents and decades.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Timeline axis */}
        <motion.line
          x1={lineX1}
          y1={lineY}
          x2={lineX2}
          y2={lineY}
          stroke="var(--border)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Events */}
        {events.map((ev, i) => {
          const x = toX(ev.year);
          const above = i % 2 === 0;
          const yOffset = ev.offsetY ? 30 : 0;
          const textY = above ? lineY - 24 - yOffset : lineY + 28 + yOffset;
          const yearLabelY = above ? lineY - 12 : lineY + 16;

          return (
            <motion.g
              key={`${ev.year}-${i}`}
              initial={{ opacity: 0, y: above ? -8 : 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.4 + i * 0.15,
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              {/* Dot */}
              <circle
                cx={x}
                cy={lineY}
                r="4"
                fill={ev.color}
                opacity="0.7"
              />
              {/* Connector line */}
              <line
                x1={x}
                y1={lineY + (above ? -6 : 6)}
                x2={x}
                y2={textY + (above ? 10 : -14)}
                stroke={ev.color}
                strokeWidth="0.75"
                opacity="0.4"
              />
              {/* Year */}
              <text
                x={x}
                y={yearLabelY}
                textAnchor="middle"
                fontSize="8"
                fontWeight="600"
                style={{ ...mono, fill: ev.color }}
              >
                {ev.year}
              </text>
              {/* Event text (multiline) */}
              {ev.label.split("\n").map((line, li) => (
                <text
                  key={li}
                  x={x}
                  y={textY + li * 11}
                  textAnchor="middle"
                  fontSize="7.5"
                  style={{ ...mono, fill: "var(--muted-foreground)" }}
                >
                  {line}
                </text>
              ))}
            </motion.g>
          );
        })}
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// LydiardArticle (main export)
// ────────────────────────────────────
