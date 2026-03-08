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
// LydiardPyramidDiagram
// ────────────────────────────────────

function LydiardPyramidDiagram() {
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

function EffortScaleDiagram() {
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

function WeeklyStructureTimeline() {
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

function WorkoutExamplesTable() {
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

function AthleteLegacyTimeline() {
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

export function LydiardArticle() {
  return (
    <ArticleLayout
      title="The Lydiard Method"
      subtitle="How Arthur Lydiard's aerobic base-first periodization from 1950s New Zealand became the foundation of modern distance training."
      accentColor="#8b5cf6"
    >
      {/* ── Introduction ── */}
      <section>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Arthur Lydiard (1917&ndash;2004) was an Auckland shoemaker who became
            the most influential distance running coach of the twentieth century.
            With no formal sports science background, Lydiard developed his
            training system through relentless self-experimentation in the 1940s
            and 1950s &mdash; running enormous volumes over the hills surrounding
            Auckland, meticulously logging his body&rsquo;s responses, and
            refining a set of principles that would eventually produce Olympic
            champions and reshape how the world thinks about endurance training.
          </p>
          <p className="text-muted leading-relaxed">
            Between the 1960 Rome Olympics and the 1964 Tokyo Olympics, athletes
            trained by Lydiard won{" "}
            <strong>six Olympic medals</strong>: Peter Snell took gold in the
            800m at Rome and then doubled with gold in the 800m and 1500m at
            Tokyo; Murray Halberg won the 5000m gold at Rome; and Barry Magee
            earned bronze in the marathon at Rome. What stunned the running world
            was not merely the results, but the method behind them. Snell, an
            800-meter specialist, was building his speed on a foundation of{" "}
            <strong>100-mile weeks</strong> of aerobic running &mdash; a volume
            that seemed absurd for a half-miler, and yet produced the fastest
            middle-distance runner on the planet.
          </p>
          <p className="text-muted leading-relaxed">
            Lydiard&rsquo;s central insight was deceptively simple: all distance
            runners, regardless of their racing event, need an enormous aerobic
            base first. But his aerobic running was emphatically{" "}
            <strong>not &ldquo;long slow distance.&rdquo;</strong> Lydiard
            trained his athletes at 70&ndash;100% of their maximum aerobic
            effort &mdash; what he called &ldquo;training without
            straining.&rdquo; He used an effort-based scale (1/4, 1/2, 3/4,
            7/8) rather than pace, believing that the body&rsquo;s internal
            signals were more reliable than the clock. The bulk of base-phase
            running sat at 3/4 effort: strong, purposeful, aerobically demanding
            &mdash; but never crossing the line into anaerobic distress.
          </p>
        </div>
      </section>

      {/* ── Key stats ── */}
      <div className="my-10 grid grid-cols-3 gap-4">
        <KeyStat
          value={6}
          label="Olympic medals 1960–64"
          format={(n) => `${Math.round(n)}`}
        />
        <KeyStat
          value={100}
          label="miles/week base volume"
          format={(n) => `${Math.round(n)}`}
        />
        <KeyStat
          value={22}
          label="mile Waiatarua long run"
          format={(n) => `${Math.round(n)}`}
        />
      </div>

      <SectionDivider text="THE PYRAMID" />

      {/* ── Training Phases ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Sequential Periodization
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Lydiard system is built on a principle that seems obvious in
            retrospect but was revolutionary in the 1950s:{" "}
            <strong>
              develop one energy system at a time, in the right order
            </strong>
            . Rather than mixing aerobic, anaerobic, and speed work throughout
            the season (as most coaches of his era did), Lydiard organized
            training into distinct sequential phases, each building on the
            adaptations created by the phase before it. This is the Lydiard
            Pyramid.
          </p>
          <p className="text-muted leading-relaxed">
            At the base of the pyramid sits the{" "}
            <strong>aerobic conditioning phase</strong> &mdash; the longest and
            most important block, lasting 8 to 24 weeks depending on the
            athlete&rsquo;s experience and the time available before competition.
            During this phase, runners build to peak weekly volume (typically
            90&ndash;100 miles) at predominantly 3/4 effort. The goal is to
            maximize the body&rsquo;s aerobic capacity: mitochondrial density,
            capillarization, cardiac stroke volume, fat oxidation, and the
            enzyme systems that power sustained effort.
          </p>
          <p className="text-muted leading-relaxed">
            Above the base sits <strong>hill resistance training</strong> (4
            weeks), which develops leg power and running economy through
            bounding, springing, and hill circuits without introducing true
            anaerobic work. Then comes the{" "}
            <strong>anaerobic development phase</strong> (4&ndash;6 weeks), where
            the now-massive aerobic engine is supplemented with the ability to
            tolerate and clear lactate. The{" "}
            <strong>coordination phase</strong> (4&ndash;6 weeks) sharpens
            race-specific speed and pacing. Finally, the{" "}
            <strong>peak/race phase</strong> (1&ndash;2 weeks) is a taper to
            arrive at competition fresh and sharp.
          </p>
          <p className="text-muted leading-relaxed">
            The critical insight is that anaerobic work done{" "}
            <em>before</em> the aerobic base is built will produce short-term
            fitness gains that collapse under the demands of racing. An athlete
            who builds the base first, however, has a larger &ldquo;cup&rdquo;
            into which anaerobic fitness can be poured &mdash; and that cup
            retains its contents far longer. Lydiard was fond of saying that you
            cannot put the icing on the cake before the cake is baked.
          </p>
        </div>
      </section>

      <LydiardPyramidDiagram />

      <SectionDivider text="EFFORT-BASED INTENSITY" />

      {/* ── Effort System ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Training by Feel, Not by Pace
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Decades before heart rate monitors and lactate analyzers became
            commonplace, Lydiard developed an effort-based intensity system that
            remains remarkably useful today. Rather than prescribing pace per
            mile (which varies with terrain, weather, fatigue, and fitness),
            Lydiard instructed his athletes to run at fractional efforts:{" "}
            <strong>1/4 effort</strong> (very easy recovery),{" "}
            <strong>1/2 effort</strong> (moderate aerobic),{" "}
            <strong>3/4 effort</strong> (strong aerobic, the default for base
            training), and{" "}
            <strong>7/8 effort</strong> (near-maximum aerobic, reserved for time
            trials and hard aerobic sessions).
          </p>
          <p className="text-muted leading-relaxed">
            The genius of this system is its self-regulation. On a day when an
            athlete is tired, 3/4 effort produces a slower pace &mdash; and
            that is exactly right, because the body&rsquo;s aerobic system is
            still receiving the same relative stimulus. On a day when the athlete
            feels sharp, the same effort fraction produces a faster pace. The
            training load adjusts automatically to the athlete&rsquo;s recovery
            state, which is precisely the behavior that modern exercise science
            now recognizes as optimal for long-term adaptation.
          </p>
          <p className="text-muted leading-relaxed">
            Lydiard was emphatic that{" "}
            <strong>3/4 effort is not easy running</strong>. It corresponds
            roughly to 75&ndash;80% of heart rate reserve, a pace where
            conversation is possible but not comfortable, where the runner feels
            purposeful effort but could sustain the pace for hours. This is the
            intensity that maximizes aerobic development per unit of fatigue
            &mdash; the sweet spot between accumulating stimulus and
            accumulating damage. Lydiard&rsquo;s phrase for it was
            &ldquo;training without straining&rdquo; &mdash; the effort feels
            significant, but there is always a reserve.
          </p>
        </div>
      </section>

      <EffortScaleDiagram />

      {/* Effort distribution bars */}
      <div className="my-8 space-y-3">
        <div
          className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider"
          style={mono}
        >
          Base Phase Effort Distribution
        </div>
        <AnimatedBar
          percent={75}
          color="#8b5cf6"
          label="1/4 effort"
          delay={0}
        />
        <AnimatedBar
          percent={50}
          color="#8b5cf6"
          label="1/2 effort"
          delay={0.1}
        />
        <AnimatedBar
          percent={35}
          color="#8b5cf6"
          label="3/4 effort"
          delay={0.2}
        />
        <AnimatedBar
          percent={15}
          color="#8b5cf6"
          label="7/8 effort"
          delay={0.3}
        />
      </div>

      <p className="text-xs text-muted-foreground text-center mb-8" style={mono}>
        Bar length represents approximate % of HRR at each effort level.
        Most base-phase volume sits at 3/4 effort.
      </p>

      <SectionDivider text="THE BASE PHASE WEEK" />

      {/* ── Weekly Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          100 Miles of Aerobic Purpose
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            A Lydiard base-phase week is not a collection of junk miles. Every
            session has a purpose within the aerobic development framework.
            The week is anchored by three key sessions:{" "}
            <strong>Monday&rsquo;s steady aerobic run</strong> (15 miles at 3/4
            effort), <strong>Friday&rsquo;s sub-threshold tempo</strong>{" "}
            (12&ndash;15 miles at 1/2 to 3/4 effort, the longest sustained
            quality effort of the week), and the crown jewel &mdash; the{" "}
            <strong>Sunday long run</strong> of 22 miles over the hilly
            Waiatarua course at 3/4 effort.
          </p>
          <p className="text-muted leading-relaxed">
            Between these quality sessions, the athlete recovers with easier
            aerobic running at 1/4 effort. Wednesday&rsquo;s fartlek introduces
            unstructured speed changes &mdash; surges of 30 seconds to 2
            minutes, all kept aerobic, responding to terrain and feel rather than
            a set protocol. Thursday&rsquo;s easy run includes short strides
            (6&ndash;8 accelerations of 80&ndash;100 meters) to maintain
            neuromuscular coordination without adding training stress.
          </p>
          <p className="text-muted leading-relaxed">
            The total weekly volume approaches 90&ndash;100 miles, but the
            critical point is that this volume is{" "}
            <em>aerobically purposeful</em>, not arbitrarily accumulated. An
            athlete who runs 70 miles at the correct effort distribution will
            adapt better than one who runs 100 miles with poor intensity
            management. Lydiard adjusted volume based on the individual
            athlete&rsquo;s capacity to absorb training &mdash; his system was
            never a rigid prescription of mileage, but a framework of effort
            distribution that scaled to the runner.
          </p>
        </div>
      </section>

      <WeeklyStructureTimeline />

      <SectionDivider text="SIGNATURE WORKOUTS" />

      {/* ── Key Workouts ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Workouts That Built Champions
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Each phase of the Lydiard pyramid has its own signature workouts.
            During the base phase, the{" "}
            <strong>Waiatarua 22-miler</strong> is the defining session &mdash; a
            hilly out-and-back over the Waitakere Ranges west of Auckland that
            every Lydiard athlete came to know intimately. The undulating terrain
            ensures natural variation in effort and develops leg strength
            alongside aerobic capacity. Lydiard&rsquo;s athletes ran this course
            at 3/4 effort, which typically produced finish times between 2 hours
            and 2 hours 45 minutes depending on the runner.
          </p>
          <p className="text-muted leading-relaxed">
            The <strong>hill circuit</strong> is the foundation of the hill
            resistance phase. It is not a simple hill repeat session. Athletes
            bound up a 200-meter slope (exaggerated knee lift, driving off the
            toes), then transition to a hard 400-meter hill run, then spring down
            a 200-meter decline (short, quick, bouncy strides that develop
            eccentric strength). At the bottom, they perform a set of short
            sprints before jogging back to the start. The full circuit is
            repeated three times and develops the leg power and running economy
            that translate directly to faster race paces.
          </p>
          <p className="text-muted leading-relaxed">
            The anaerobic phase introduces{" "}
            <strong>50/50 sprints</strong> &mdash; five laps of a track where the
            athlete alternates between 50 meters of near-maximum sprinting and 50
            meters of floating. This accumulates 20 sprints in a single session,
            developing the anaerobic capacity and lactate tolerance that an 800m
            or 1500m runner needs for the final stages of a race. The key is that
            this work comes only after months of base building, when the
            aerobic system can support rapid recovery between sprints.
          </p>
        </div>
      </section>

      <WorkoutExamplesTable />

      <SectionDivider text="THE LEGACY" />

      {/* ── Athletes & Legacy ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          From Auckland to the World
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            <strong>Peter Snell</strong> remains the most celebrated Lydiard
            athlete. His 800m/1500m double gold at the 1964 Tokyo Olympics is one
            of the great achievements in distance running history, and it was
            built entirely on Lydiard&rsquo;s aerobic base-first philosophy.
            Snell later earned a PhD in exercise physiology and spent years
            studying why the system worked, concluding that Lydiard had
            intuitively arrived at principles that laboratory science would
            confirm decades later: the aerobic system is the rate-limiting factor
            in middle-distance performance, and maximizing it requires sustained
            high-volume aerobic training, not endless intervals.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Murray Halberg</strong>, who overcame a withered left arm
            from a childhood rugby injury, used Lydiard&rsquo;s system to win
            the 5000m gold at the 1960 Rome Olympics with a devastating
            front-running tactic &mdash; surging with three laps to go and
            holding on through the aerobic endurance that months of 100-mile
            weeks had built. The tactic was suicidal by conventional wisdom.
            Lydiard&rsquo;s training made it viable.
          </p>
          <p className="text-muted leading-relaxed">
            Lydiard&rsquo;s influence extended far beyond New Zealand. Finnish
            coaches adopted his methods in the late 1960s, and the results
            appeared at the 1972 Munich Olympics where{" "}
            <strong>Lasse Viren</strong> won the 5000m/10000m double and{" "}
            <strong>Pekka Vasala</strong> took the 1500m gold &mdash; all trained
            on Lydiard-influenced programs that emphasized aerobic volume
            followed by sharpening. In the United States,{" "}
            <strong>Bill Bowerman</strong> of the University of Oregon visited
            Lydiard in New Zealand in 1962 and returned with two things: the
            jogging revolution (Bowerman co-authored <em>Jogging</em> in 1966,
            directly inspired by Lydiard&rsquo;s community running programs) and
            the seed of what would become{" "}
            <strong>Nike</strong>. Lydiard is often called the &ldquo;Father of
            Jogging&rdquo; for his role in popularizing recreational running
            worldwide.
          </p>
          <p className="text-muted leading-relaxed">
            Today, Lydiard&rsquo;s principles of{" "}
            <strong>periodization</strong>,{" "}
            <strong>base building</strong>, and{" "}
            <strong>tapering</strong> are so deeply embedded in distance training
            that they are often taken for granted. Nearly every modern coaching
            system &mdash; from Daniels&rsquo; to Pfitzinger&rsquo;s to
            Canova&rsquo;s &mdash; builds on the framework Lydiard pioneered.
            The specific prescriptions have evolved (few coaches now prescribe
            100 miles of running for 800m specialists), but the underlying
            architecture remains: build the aerobic engine first, add specific
            work progressively, and arrive at competition with all systems
            peaking in concert.
          </p>
        </div>
      </section>

      <AthleteLegacyTimeline />

      <SectionDivider text="PRACTICAL TAKEAWAYS" />

      {/* ── Takeaways ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Lydiard Principles for Modern Runners
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Lydiard&rsquo;s system was designed for Olympic-caliber athletes, but
            its principles scale to runners of every level. The framework is not
            about running 100 miles per week &mdash; it is about applying the
            right effort at the right time in the right order:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>Build the base first, always.</strong> Whether you are
              training for an 800m or a marathon, aerobic fitness is the
              foundation. Do not rush to speed work. The longer and deeper
              the base phase, the higher the peak that can be built on top
              of it.
            </li>
            <li>
              <strong>
                Aerobic running is not slow &mdash; run strong without straining.
              </strong>{" "}
              Lydiard&rsquo;s 3/4 effort is meaningfully hard. Easy running
              has its place (recovery days), but the bulk of base-phase work
              should feel purposeful and demanding while remaining within
              aerobic limits.
            </li>
            <li>
              <strong>
                Develop energy systems sequentially, not simultaneously.
              </strong>{" "}
              Mixing all types of training year-round produces mediocre
              development in all systems. Focus on one energy system at a time,
              in the right order, and each phase amplifies the next.
            </li>
            <li>
              <strong>Train by feel, not by pace alone.</strong> Pace is an
              outcome of effort, not a target. Use perceived exertion (or heart
              rate) to govern intensity. A &ldquo;good&rdquo; training day is
              one where the effort was correct, regardless of what the watch
              says.
            </li>
            <li>
              <strong>
                Recovery is response-regulated: take what you need.
              </strong>{" "}
              Lydiard did not prescribe rigid recovery protocols. If the body
              needs an extra easy day, take it. If a session feels flat,
              shorten it. The goal is consistent long-term development, not
              heroic individual workouts. Missing one hard session matters
              far less than missing a month to injury.
            </li>
          </ul>
        </div>
      </section>

      <SectionDivider text="SOURCES" />

      {/* ── Sources ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Sources &amp; Further Reading
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <ExternalLink href="https://lydiardfoundation.org/free-programs/">
              Lydiard Foundation &mdash; Free Starter Plans
            </ExternalLink>
            {" "}&mdash; Official Lydiard Foundation training programs adapted
            for recreational and competitive runners, based on Lydiard&rsquo;s
            original periodization framework.
          </p>
          <p>
            <ExternalLink href="https://www.scienceofrunning.com/2009/10/arthur-lydiard.html">
              Science of Running &mdash; Arthur Lydiard Overview
            </ExternalLink>
            {" "}&mdash; Steve Magness&rsquo;s detailed analysis of
            Lydiard&rsquo;s training philosophy, physiological rationale, and
            historical impact on distance running.
          </p>
          <p>
            <ExternalLink href="https://athleticsillustrated.com/five-lydiard-principles-every-runner-should-know/">
              Athletics Illustrated &mdash; Five Lydiard Principles
            </ExternalLink>
            {" "}&mdash; A concise summary of the five core Lydiard principles
            that modern runners can apply immediately to their training.
          </p>
          <p>
            <ExternalLink href="https://championseverywhere.com/waiatarua-long-run/">
              Champions Everywhere &mdash; The Waiatarua Long Run
            </ExternalLink>
            {" "}&mdash; History and significance of the legendary 22-mile
            Waiatarua course that Lydiard&rsquo;s athletes ran every Sunday
            during the base-building phase.
          </p>
          <p>
            <ExternalLink href="https://www.sweatelite.com/the-lydiard-method-summarised/">
              SweatElite &mdash; The Lydiard Method Summarised
            </ExternalLink>
            {" "}&mdash; A modern summary of Lydiard&rsquo;s training
            methodology, including phase-by-phase breakdowns and workout
            examples from his original programs.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
