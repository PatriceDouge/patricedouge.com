"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArticleLayout,
  Figure,
  KeyStat,
  SectionDivider,
  ExternalLink,
  mono,
} from "@/components/PhilosophyShared";

// ────────────────────────────────────
// PaceSpectrumDiagram
// ────────────────────────────────────

function PaceSpectrumDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 220;
  const pad = { top: 30, right: 20, bottom: 55, left: 20 };
  const barY = 80;
  const barH = 36;
  const barLeft = pad.left;
  const barRight = W - pad.right;
  const barW = barRight - barLeft;

  // Pace zones positioned along a spectrum (left = slow, right = fast)
  // Each zone has a start% and end% of the bar width
  const zones = [
    { label: "Easy", start: 0, end: 18, color: "var(--muted-foreground)", opacity: 0.12 },
    { label: "Marathon", start: 18, end: 32, color: "var(--muted-foreground)", opacity: 0.18 },
    { label: "Half-Mar", start: 32, end: 46, color: "#a3a3a3", opacity: 0.22 },
    { label: "CV", start: 46, end: 62, color: "#eab308", opacity: 0.35 },
    { label: "10K", start: 62, end: 74, color: "#f59e0b", opacity: 0.22 },
    { label: "5K", start: 74, end: 84, color: "#ef4444", opacity: 0.18 },
    { label: "3K", start: 84, end: 92, color: "#ef4444", opacity: 0.22 },
    { label: "Mile", start: 92, end: 100, color: "#dc2626", opacity: 0.28 },
  ];

  const toBarX = (pct: number) => barLeft + (pct / 100) * barW;

  return (
    <Figure caption="Critical Velocity sits between half-marathon and 10K pace on the effort spectrum -- harder than tempo, easier than traditional intervals. Approximately 10K race effort, sustainable for 30-45 minutes.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Title */}
        <motion.text
          x={W / 2}
          y={20}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.1em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ duration: 0.3 }}
        >
          PACE SPECTRUM
        </motion.text>

        {/* Subtitle */}
        <motion.text
          x={W / 2}
          y={34}
          textAnchor="middle"
          fontSize="7"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          SLOWER → FASTER
        </motion.text>

        {/* Background bar */}
        <motion.rect
          x={barLeft}
          y={barY}
          width={barW}
          height={barH}
          rx="4"
          fill="var(--border)"
          opacity="0.3"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          style={{ transformOrigin: `${barLeft}px ${barY + barH / 2}px` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Zone segments */}
        {zones.map((z, i) => {
          const x = toBarX(z.start);
          const w = toBarX(z.end) - toBarX(z.start);
          const isCV = z.label === "CV";

          return (
            <motion.g key={z.label}>
              <motion.rect
                x={x}
                y={barY}
                width={w}
                height={barH}
                rx={i === 0 ? "4" : i === zones.length - 1 ? "4" : "0"}
                fill={z.color}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: isCV ? 0.45 : z.opacity } : {}}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              />
              {/* Zone label below */}
              <motion.text
                x={x + w / 2}
                y={barY + barH + 16}
                textAnchor="middle"
                fontSize={isCV ? "9" : "7"}
                fontWeight={isCV ? "700" : "400"}
                style={{
                  ...mono,
                  fill: isCV ? "#eab308" : "var(--muted-foreground)",
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={inView ? { opacity: isCV ? 1 : 0.6, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
              >
                {z.label}
              </motion.text>
            </motion.g>
          );
        })}

        {/* CV highlight bracket and label */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {/* Arrow pointing down to CV zone */}
          <line
            x1={toBarX(54)}
            y1={50}
            x2={toBarX(54)}
            y2={barY - 4}
            stroke="#eab308"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <polygon
            points={`${toBarX(54) - 3},${barY - 4} ${toBarX(54) + 3},${barY - 4} ${toBarX(54)},${barY}`}
            fill="#eab308"
          />
          {/* Label */}
          <text
            x={toBarX(54)}
            y={46}
            textAnchor="middle"
            fontSize="8"
            fontWeight="600"
            style={{ ...mono, fill: "#eab308" }}
          >
            CRITICAL VELOCITY
          </text>
        </motion.g>

        {/* Sustainability annotation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          <text
            x={toBarX(54)}
            y={barY + barH + 34}
            textAnchor="middle"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Sustainable for 30-45 min | ~10K effort
          </text>
        </motion.g>

        {/* Duration annotations at bottom */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 1.7, duration: 0.4 }}
        >
          <text
            x={barLeft + 10}
            y={H - 6}
            fontSize="6"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Hours
          </text>
          <text
            x={barRight - 10}
            y={H - 6}
            textAnchor="end"
            fontSize="6"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Minutes
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// MuscleFiberDiagram
// ────────────────────────────────────

function MuscleFiberDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 340;
  const pad = { top: 30, right: 30, bottom: 30, left: 30 };

  const fibers = [
    {
      label: "Type I",
      subtitle: "Slow Twitch",
      pct: 30,
      color: "var(--accent)",
      props: ["Endurance", "Always aerobic", "Fatigue-resistant"],
      y: 60,
    },
    {
      label: "Type IIA",
      subtitle: "Fast Oxidative",
      pct: 45,
      color: "#eab308",
      props: ["THE TARGET", "Trainable aerobic ↔ anaerobic", "CV converts IIX → IIA"],
      y: 150,
    },
    {
      label: "Type IIX",
      subtitle: "Fast Glycolytic",
      pct: 25,
      color: "#ef4444",
      props: ["Pure speed", "Highly fatigable", "Anaerobic-dominant"],
      y: 240,
    },
  ];

  const barMaxW = W - pad.left - pad.right - 160;
  const barX = pad.left + 130;
  const barH = 28;

  return (
    <Figure caption="CV training targets Type IIA fibers -- converting fast-glycolytic (IIX) fibers toward fast-oxidative (IIA) characteristics. This makes more muscle fibers available for aerobic work at fast paces.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Title */}
        <motion.text
          x={W / 2}
          y={20}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.1em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ duration: 0.3 }}
        >
          MUSCLE FIBER TYPES
        </motion.text>

        {fibers.map((f, i) => {
          const isTarget = f.label === "Type IIA";
          const barWidth = (f.pct / 50) * barMaxW;

          return (
            <motion.g
              key={f.label}
              initial={{ opacity: 0, x: -15 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.5, ease: "easeOut" }}
            >
              {/* Highlight box for IIA */}
              {isTarget && (
                <motion.rect
                  x={pad.left - 10}
                  y={f.y - 18}
                  width={W - pad.left - pad.right + 20}
                  height={barH + 55}
                  rx="6"
                  fill="#eab308"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 0.06 } : {}}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              )}

              {/* Label */}
              <text
                x={pad.left}
                y={f.y}
                fontSize={isTarget ? "11" : "10"}
                fontWeight="600"
                style={{
                  ...mono,
                  fill: isTarget ? "#eab308" : "var(--foreground)",
                }}
              >
                {f.label}
              </text>
              <text
                x={pad.left}
                y={f.y + 14}
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {f.subtitle}
              </text>

              {/* Animated bar */}
              <rect
                x={barX}
                y={f.y - 10}
                width={barMaxW}
                height={barH}
                rx="4"
                fill={f.color}
                opacity={0.06}
              />
              <motion.rect
                x={barX}
                y={f.y - 10}
                height={barH}
                rx="4"
                fill={f.color}
                opacity={isTarget ? 0.4 : 0.25}
                initial={{ width: 0 }}
                animate={inView ? { width: barWidth } : { width: 0 }}
                transition={{ delay: 0.4 + i * 0.2, duration: 0.8, ease: "easeOut" }}
              />

              {/* Percentage label */}
              <motion.text
                x={barX + barWidth + 8}
                y={f.y + 4}
                fontSize="10"
                fontWeight="600"
                style={{ ...mono, fill: f.color }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.8 } : {}}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.3 }}
              >
                ~{f.pct}%
              </motion.text>

              {/* Properties */}
              {f.props.map((p, pi) => (
                <motion.text
                  key={pi}
                  x={barX}
                  y={f.y + barH + 8 + pi * 12}
                  fontSize="7"
                  style={{
                    ...mono,
                    fill: p === "THE TARGET" ? "#eab308" : "var(--muted-foreground)",
                    fontWeight: p === "THE TARGET" ? "700" : "400",
                  }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: p === "THE TARGET" ? 0.9 : 0.6 } : {}}
                  transition={{ delay: 1.0 + i * 0.15 + pi * 0.05, duration: 0.3 }}
                >
                  {p}
                </motion.text>
              ))}
            </motion.g>
          );
        })}

        {/* Conversion arrow from IIX to IIA */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <defs>
            <marker
              id="arrowTinman"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#eab308" />
            </marker>
          </defs>
          <line
            x1={W - pad.right - 30}
            y1={240}
            x2={W - pad.right - 30}
            y2={175}
            stroke="#eab308"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            markerEnd="url(#arrowTinman)"
          />
          <text
            x={W - pad.right - 18}
            y={210}
            fontSize="7"
            fontWeight="600"
            style={{ ...mono, fill: "#eab308" }}
            transform={`rotate(90, ${W - pad.right - 18}, 210)`}
          >
            CV TRAINING
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// TrainingDistributionBars
// ────────────────────────────────────

function TrainingDistributionBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const categories = [
    {
      name: "Endurance",
      percent: 80,
      color: "var(--accent)",
      description: "Easy running 5-6 days/week, 60 min daily + 90-120 min long run",
      detail: "Foundation aerobic development",
    },
    {
      name: "Stamina",
      percent: 15,
      color: "#eab308",
      description: "CV intervals, cruise intervals, threshold work, 10K-5K efforts",
      detail: "6-8% of weekly mileage at CV pace",
    },
    {
      name: "Speed",
      percent: 5,
      color: "#ef4444",
      description: "200m reps, hill sprints, strides, all-out sprints",
      detail: "Neuromuscular maintenance year-round",
    },
  ];

  return (
    <Figure caption="Tinman's pyramidal distribution. The base is aerobic volume. The middle layer is CV/stamina work -- the system's engine. Speed sits atop as a thin but ever-present layer.">
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
                {c.detail}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {c.description}
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
      type: "easy",
      session: "Easy 60 min",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Tue",
      type: "stamina",
      session: "CV / Combo",
      color: "#eab308",
      intensity: "quality",
    },
    {
      label: "Wed",
      type: "easy",
      session: "Easy 60 min",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Thu",
      type: "easy",
      session: "Easy 60 + strides",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
    {
      label: "Fri",
      type: "speed",
      session: "Speed / Intervals",
      color: "#ef4444",
      intensity: "quality",
    },
    {
      label: "Sat",
      type: "long",
      session: "Long 90-120 min",
      color: "#eab308",
      intensity: "long",
    },
    {
      label: "Sun",
      type: "easy",
      session: "Easy 45 min / Rest",
      color: "var(--muted-foreground)",
      intensity: "easy",
    },
  ];

  return (
    <Figure caption="A typical Tinman week: Tuesday's CV/combo workout is the cornerstone. Friday provides speed stimulus. Saturday's long run builds endurance. Easy days are genuinely easy.">
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
                      ? d.color
                      : "var(--muted-foreground)",
                  }}
                >
                  {d.label}
                </div>
                <div
                  className="rounded-md py-4 px-1 border"
                  style={{
                    borderColor: highlight
                      ? d.color
                      : "var(--border)",
                    background: highlight
                      ? d.color
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
                        ? d.color
                        : "var(--muted-foreground)",
                    }}
                  >
                    {isQuality && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: d.color }}
                      >
                        Quality
                      </span>
                    )}
                    {isLong && (
                      <span
                        className="block text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                        style={{ color: d.color, opacity: 0.7 }}
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
                    ? d.color
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
                      ? d.color
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
                    style={{ ...mono, color: d.color }}
                  >
                    Quality
                  </span>
                )}
                {isLong && (
                  <span
                    className="ml-auto text-[9px] font-semibold uppercase tracking-wider"
                    style={{ ...mono, color: d.color, opacity: 0.7 }}
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
      name: "CV Intervals",
      structure: "4-6 x 1000m at CV pace",
      recovery: "60-90 sec jog recovery",
      effort: "Between 10K and half-marathon pace",
      category: "Stamina",
      color: "#eab308",
    },
    {
      name: "Combo / Layered Workout",
      structure: "CV intervals + hills/200s + strides",
      recovery: "Slower-to-faster ordering",
      effort: "Multi-pace, controlled quality",
      category: "Stamina+Speed",
      color: "#eab308",
    },
    {
      name: "Marathon Big Workout",
      structure: "Extended CV/threshold session, up to 2 hours",
      recovery: "Sustained effort with short breaks",
      effort: "Marathon-specific endurance at CV pace",
      category: "Endurance",
      color: "var(--accent)",
    },
    {
      name: "Speed Reps",
      structure: "6-8 x 200m fast",
      recovery: "Full recovery between reps",
      effort: "Maintain turnover and neuromuscular power",
      category: "Speed",
      color: "#ef4444",
    },
  ];

  return (
    <Figure caption="Tinman's signature workouts. Note the combo/layered workout -- a hallmark of the system that applies diminishing returns by mixing paces within a single session.">
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
                {w.category}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="text-muted-foreground/60">Structure: </span>
                {w.structure}
              </div>
              <div>
                <span className="text-muted-foreground/60">Recovery: </span>
                {w.recovery}
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
// DiminishingReturnsDiagram
// ────────────────────────────────────

function DiminishingReturnsDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const W = 520;
  const H = 260;
  const pad = { top: 35, right: 40, bottom: 50, left: 55 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  // Diminishing returns curve: each rep yields less adaptation
  // X: rep number (1-10), Y: marginal benefit (100% down to ~5%)
  const reps = [
    [1, 100],
    [2, 72],
    [3, 52],
    [4, 38],
    [5, 28],
    [6, 20],
    [7, 15],
    [8, 11],
    [9, 8],
    [10, 6],
  ];

  const toX = (rep: number) => pad.left + ((rep - 0.5) / 10.5) * cw;
  const toY = (pct: number) => pad.top + ch - (pct / 110) * ch;

  // Build bar data
  const barWidth = cw / 12;

  // 80% cutoff line at rep ~6
  const cutoffX = toX(6.5);

  return (
    <Figure caption="The law of diminishing returns. After the first rep, each subsequent rep yields progressively less adaptation. Schwartz advocates stopping at ~80% of what you could handle -- typically rep 6-8 of 10 possible.">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Title */}
        <motion.text
          x={W / 2}
          y={18}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          letterSpacing="0.1em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ duration: 0.3 }}
        >
          MARGINAL BENEFIT PER REP
        </motion.text>

        {/* Grid lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          {[0, 25, 50, 75, 100].map((t) => (
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

        {/* Bars for each rep */}
        {reps.map(([rep, pct], i) => {
          const x = toX(rep) - barWidth / 2;
          const h = (pct / 110) * ch;
          const y = pad.top + ch - h;
          const inCutoff = rep <= 6;

          return (
            <motion.g key={rep}>
              {/* Bar background */}
              <rect
                x={x}
                y={pad.top}
                width={barWidth}
                height={ch}
                rx="2"
                fill={inCutoff ? "#eab308" : "#ef4444"}
                opacity={0.04}
              />
              {/* Animated bar */}
              <motion.rect
                x={x}
                y={y}
                width={barWidth}
                rx="2"
                fill={inCutoff ? "#eab308" : "#ef4444"}
                opacity={inCutoff ? 0.4 : 0.15}
                initial={{ height: 0, y: pad.top + ch }}
                animate={
                  inView
                    ? { height: h, y: y }
                    : { height: 0, y: pad.top + ch }
                }
                transition={{
                  delay: 0.3 + i * 0.08,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />
              {/* Rep number */}
              <motion.text
                x={toX(rep)}
                y={pad.top + ch + 16}
                textAnchor="middle"
                fontSize="8"
                style={{
                  ...mono,
                  fill: inCutoff ? "var(--foreground)" : "var(--muted-foreground)",
                }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: inCutoff ? 0.8 : 0.4 } : {}}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
              >
                {rep}
              </motion.text>
              {/* Percentage label on bar */}
              <motion.text
                x={toX(rep)}
                y={y - 4}
                textAnchor="middle"
                fontSize="7"
                fontWeight="500"
                style={{
                  ...mono,
                  fill: inCutoff ? "#eab308" : "var(--muted-foreground)",
                }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: inCutoff ? 0.8 : 0.4 } : {}}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
              >
                {pct}%
              </motion.text>
            </motion.g>
          );
        })}

        {/* 80% cutoff dashed line */}
        <motion.line
          x1={cutoffX}
          y1={pad.top}
          x2={cutoffX}
          y2={pad.top + ch}
          stroke="#eab308"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.2, duration: 0.4 }}
        />

        {/* Cutoff label */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          <text
            x={cutoffX + 6}
            y={pad.top + 14}
            fontSize="8"
            fontWeight="600"
            style={{ ...mono, fill: "#eab308" }}
          >
            STOP HERE
          </text>
          <text
            x={cutoffX + 6}
            y={pad.top + 26}
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            80% of max volume
          </text>
        </motion.g>

        {/* Zone labels */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.5, duration: 0.4 }}
        >
          <text
            x={(pad.left + cutoffX) / 2}
            y={pad.top + ch + 32}
            textAnchor="middle"
            fontSize="7"
            fontWeight="600"
            style={{ ...mono, fill: "#eab308" }}
          >
            PRODUCTIVE ZONE
          </text>
          <text
            x={(cutoffX + W - pad.right) / 2}
            y={pad.top + ch + 32}
            textAnchor="middle"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            DIMINISHING RETURNS
          </text>
        </motion.g>

        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((t) => (
          <text
            key={t}
            x={pad.left - 8}
            y={toY(t) + 3}
            textAnchor="end"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            {t}%
          </text>
        ))}

        {/* Y-axis title */}
        <text
          x="14"
          y={pad.top + ch / 2}
          textAnchor="middle"
          fontSize="7"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          transform={`rotate(-90, 14, ${pad.top + ch / 2})`}
        >
          Marginal Benefit
        </text>

        {/* X-axis title */}
        <text
          x={pad.left + cw / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize="8"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          Rep Number →
        </text>

        {/* Axes */}
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={pad.top + ch}
          stroke="var(--border)"
          strokeWidth="1"
        />
        <line
          x1={pad.left}
          y1={pad.top + ch}
          x2={W - pad.right}
          y2={pad.top + ch}
          stroke="var(--border)"
          strokeWidth="1"
        />
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// TinmanArticle (main export)
// ────────────────────────────────────

export function TinmanArticle() {
  return (
    <ArticleLayout
      title="Tinman's Critical Velocity"
      subtitle="How Tom Schwartz's focus on critical velocity and Type IIA fiber development created a system for sustainable speed that avoids frying the athlete."
      accentColor="#eab308"
    >
      {/* ── Introduction ── */}
      <section>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Tom &ldquo;Tinman&rdquo; Schwartz is an elementary school PE teacher
            from Connecticut who became one of America&rsquo;s most innovative
            distance coaches. He coached Drew Hunter to become the greatest
            American high school distance runner in history, then founded Tinman
            Elite, a professional training group built on a deceptively simple
            idea: there is a specific pace — harder than tempo, easier than
            traditional intervals — that produces the greatest aerobic return
            per unit of fatigue. He called it{" "}
            <strong>Critical Velocity</strong>.
          </p>
          <p className="text-muted leading-relaxed">
            Critical Velocity, or CV, is the pace sustainable for approximately
            30 to 45 minutes — roughly equivalent to 10K race effort, sitting
            between half-marathon and 10K pace. At this intensity, the body
            maximally develops{" "}
            <strong>Type IIA muscle fibers</strong> and aerobic power without
            the crushing recovery cost of VO2max work. Where other systems
            pile on hard intervals and hope the athlete survives, Schwartz
            recognized that the stimulus-to-fatigue ratio matters more than raw
            intensity. The result is a philosophy centered on{" "}
            <em>extendibility</em> — the ability to extend speed over greater
            distance at the same effort.
          </p>
          <p className="text-muted leading-relaxed">
            At the heart of the Tinman system lies a principle Schwartz returns
            to obsessively: <strong>diminishing returns</strong>. Do 80% of
            what you could handle. After the first rep of any workout, each
            subsequent rep yields less adaptation. So rather than grinding
            through ten reps to exhaustion, do six or seven, then use the
            remaining energy for a different stimulus — strides, hills, or
            simply preservation. The athlete who trains this way stays healthy,
            absorbs more variety, and arrives at race day with speed in reserve
            rather than fatigue in the legs.
          </p>
        </div>
      </section>

      {/* ── Key stats ── */}
      <div className="my-10 grid grid-cols-3 gap-4">
        <KeyStat
          value={45}
          label="min — CV sustainability"
          format={(n) => `${Math.round(n)}`}
        />
        <KeyStat
          value={80}
          label="% of max workout volume"
          format={(n) => `${Math.round(n)}%`}
        />
        <KeyStat
          value={6}
          label="% weekly mileage as CV"
          format={(n) => `${Math.round(n)}%`}
        />
      </div>

      <SectionDivider text="CRITICAL VELOCITY EXPLAINED" />

      {/* ── CV Concept ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The CV Sweet Spot
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Critical Velocity occupies a specific position on the pace spectrum
            that most training systems either ignore or accidentally stumble
            through. It sits between half-marathon pace and 10K pace — harder
            than traditional threshold or &ldquo;tempo&rdquo; efforts, but
            meaningfully easier than the 5K-pace intervals that dominate many
            training plans. The effort is approximately equivalent to what you
            could sustain for 30 to 45 minutes in a race — a duration long
            enough to demand serious aerobic contribution but short enough to
            recruit fast-twitch muscle fibers.
          </p>
          <p className="text-muted leading-relaxed">
            Schwartz&rsquo;s insight was that this pace produces a uniquely
            powerful stimulus. It is fast enough to engage Type IIA muscle
            fibers — the &ldquo;convertible&rdquo; fast-twitch fibers that
            can be trained to work aerobically — but not so fast that it
            generates the metabolic and hormonal stress of true VO2max work.
            In practical terms, a runner can accumulate significant volume at
            CV pace across a training week without the multi-day recovery
            hangover that 5K-pace intervals demand. The body gets faster
            because it learns to do more work aerobically at a pace that
            matters on race day.
          </p>
        </div>
      </section>

      <PaceSpectrumDiagram />

      <SectionDivider text="TYPE IIA MUSCLE FIBERS" />

      {/* ── Muscle Fiber section ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Fiber Type That Matters Most
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Schwartz&rsquo;s emphasis on muscle fiber physiology distinguishes
            his system from pace-chart coaching. Human skeletal muscle contains
            three primary fiber types. <strong>Type I</strong> (slow-twitch)
            fibers are inherently aerobic and fatigue-resistant — they power
            easy running and are always working. <strong>Type IIX</strong>{" "}
            (fast-glycolytic) fibers are at the opposite extreme: powerful,
            fast-contracting, but they fatigue rapidly and rely on anaerobic
            energy pathways. Between them sit the{" "}
            <strong>Type IIA</strong> (fast-oxidative) fibers — and these are
            the key to the entire Tinman philosophy.
          </p>
          <p className="text-muted leading-relaxed">
            Type IIA fibers are uniquely plastic. Unlike the relatively fixed
            characteristics of Type I and Type IIX fibers, IIA fibers can be
            trained to behave more aerobically or more anaerobically depending
            on the stimulus applied. CV-pace training specifically targets
            this adaptability. By running at intensities that demand IIA
            fiber recruitment without pushing them into anaerobic failure, CV
            work gradually converts IIX fibers toward IIA characteristics.
            The practical result: more of the athlete&rsquo;s muscle mass
            becomes available for sustained aerobic work at fast paces. This
            is the physiological mechanism behind what Schwartz calls
            &ldquo;controlled quality.&rdquo;
          </p>
        </div>
      </section>

      <MuscleFiberDiagram />

      <SectionDivider text="THREE MACRO CATEGORIES" />

      {/* ── Training Distribution ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Endurance, Stamina, Speed
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Schwartz organizes all training into three macro categories arranged
            in a pyramid. The wide base is{" "}
            <strong>Endurance</strong> — easy aerobic running that constitutes
            roughly 80% of total training volume. Five to six days per week of
            60-minute easy runs, plus a weekly long run of 90 to 120 minutes,
            provide the aerobic foundation upon which everything else rests.
          </p>
          <p className="text-muted leading-relaxed">
            The middle layer is <strong>Stamina</strong> — the
            system&rsquo;s engine. This encompasses CV intervals, cruise
            intervals, threshold work, and efforts in the 10K to 5K pace
            range. Approximately 6 to 8 percent of total weekly mileage falls
            at CV pace, with another portion at slightly faster or slower
            stamina efforts. This is where the aerobic power gets built.
          </p>
          <p className="text-muted leading-relaxed">
            At the pyramid&rsquo;s peak sits{" "}
            <strong>Speed</strong> — about 5% of total volume. Short 200-meter
            reps, hill sprints, strides, and brief all-out sprints maintain
            neuromuscular coordination and fast-twitch fiber recruitment.
            Critically, speed work is present{" "}
            <em>year-round</em> in the Tinman system, not crammed into a
            peaking phase. Schwartz believes that neglecting speed for months
            during base building creates a deficit that cannot be fully
            recovered during a sharpening block.
          </p>
        </div>
      </section>

      <TrainingDistributionBars />

      <SectionDivider text="THE TRAINING WEEK" />

      {/* ── Weekly Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Structure of a Tinman Week
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The typical Tinman week features two quality days separated by easy
            running. Tuesday is the cornerstone — a CV or combo workout that
            represents the system&rsquo;s highest-value session. Friday
            provides the speed or interval stimulus. Saturday&rsquo;s long run
            builds raw endurance. The remaining days are genuinely easy, with
            Thursday incorporating strides to maintain turnover without adding
            fatigue.
          </p>
          <p className="text-muted leading-relaxed">
            The spacing is intentional. By placing 48 hours of easy running
            between quality sessions, the athlete arrives at each workout
            recovered enough to execute at the intensity that matters. This
            stands in contrast to systems that stack hard days back-to-back
            under the theory that &ldquo;cumulative fatigue builds fitness.&rdquo;
            Schwartz&rsquo;s position is clear: a workout done at 85% of
            potential effort yields a similar stimulus to one done at 100%,
            but with dramatically less recovery cost. Protect the athlete.
          </p>
        </div>
      </section>

      <WeeklyStructureTimeline />

      <SectionDivider text="SIGNATURE WORKOUTS" />

      {/* ── Key Workouts ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Core Workouts
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Tinman workouts are defined by controlled quality. The CV interval
            session — typically 4 to 6 times 1000 meters at CV pace with 60 to
            90 seconds of jog recovery — is the system&rsquo;s bread and
            butter. But the more distinctive innovation is the{" "}
            <strong>combo or layered workout</strong>, which applies the
            diminishing returns principle directly. Rather than doing twelve
            reps of one thing, the athlete does a block of CV work, transitions
            to a block of hills or 200-meter reps, and finishes with strides.
            The ordering is always slower to faster — this progression protects
            mitochondrial adaptation by saving the highest-stress work for when
            the aerobic system has already been stimulated.
          </p>
        </div>
      </section>

      <SignatureWorkoutsCards />

      <SectionDivider text="THE LAW OF DIMINISHING RETURNS" />

      {/* ── Diminishing Returns ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Do 80% of What You Could Handle
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            This is the philosophical core of the Tinman system. Schwartz
            argues that the adaptation curve for any single workout stimulus
            follows a steep diminishing returns function. The first repetition
            of a workout produces the largest physiological signal. The second
            rep adds meaningfully, but less. By the sixth or seventh rep, the
            athlete is absorbing only 10 to 15 percent of the benefit of the
            first rep. By the tenth rep, the marginal benefit approaches zero
            while the fatigue cost remains constant — or even increases.
          </p>
          <p className="text-muted leading-relaxed">
            The logical conclusion: <strong>stop at 80%</strong>. If you could
            complete ten reps, do seven or eight. Use the energy and recovery
            capacity you saved in two ways. First, add training variety within
            the session — this is why combo workouts exist. Second, arrive at
            the next quality day fresher, enabling a higher-quality stimulus
            across the week. Over a training block, the athlete who
            consistently does 80% accumulates more total quality work than the
            athlete who regularly pushes to 100% and needs extra recovery days.
          </p>
          <p className="text-muted leading-relaxed">
            Schwartz calls this <em>controlled quality</em>. It is not about
            being conservative for its own sake. It is about recognizing that
            the goal of training is not to survive workouts but to{" "}
            <em>absorb</em> them — to extract the maximum adaptation from
            every session while preserving the athlete&rsquo;s ability to do
            it again two days later.
          </p>
        </div>
      </section>

      <DiminishingReturnsDiagram />

      <SectionDivider text="PRACTICAL TAKEAWAYS" />

      {/* ── Takeaways ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Applying Tinman Principles
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Tinman system is accessible precisely because it does not
            require exotic equipment or impossible fitness. It requires
            discipline — the discipline to run the right pace for the right
            duration, and the discipline to stop before you feel like you
            need to.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong>CV pace is your best friend.</strong> Find your critical
              velocity — approximately your current 10K race effort, or the
              pace you could sustain for 30-45 minutes — and make it the
              centerpiece of your quality training. It provides maximum
              aerobic stimulus with manageable recovery cost.
            </li>
            <li>
              <strong>Do 80% of what you could handle.</strong> If you think
              you could do 10 reps, do 8. If you could run 8 miles at tempo,
              run 6.5. Leave energy in the tank for training variety and
              faster recovery.
            </li>
            <li>
              <strong>Order workouts slower to faster.</strong> In combo
              sessions, start with CV-pace work and progress to hills, 200s,
              or strides. This protects mitochondrial adaptation and teaches
              the body to run fast on tired legs.
            </li>
            <li>
              <strong>Keep 6-8% of weekly mileage at CV pace.</strong> This
              is enough to drive IIA fiber development without overwhelming
              the aerobic system. More is not better — it is just more
              fatigue.
            </li>
            <li>
              <strong>Speed is maintained year-round.</strong> Do not abandon
              strides and short sprints during base building. Neuromuscular
              coordination is a use-it-or-lose-it quality. A handful of 200m
              reps each week keeps the pathways active.
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
            <ExternalLink href="https://www.letsrun.com/forum/flat_read.php?thread=8429495">
              LetsRun — Drew Hunter / Tinman Interview Thread
            </ExternalLink>
            {" "}&mdash; Discussion of Drew Hunter&rsquo;s development under
            Schwartz, including training philosophy and workout structures.
          </p>
          <p>
            <ExternalLink href="https://www.chaski.org/TrainingWithCV.pdf">
              Chaski — Training with Critical Velocity
            </ExternalLink>
            {" "}&mdash; Comprehensive guide to CV-based training with pace
            calculations and workout prescriptions.
          </p>
          <p>
            <ExternalLink href="https://finalsurge.com/Blog/Post/tinman-running-critical-velocity">
              Final Surge — Tinman Running &amp; Critical Velocity
            </ExternalLink>
            {" "}&mdash; Podcast and article covering the CV concept, diminishing
            returns, and the Tinman training framework.
          </p>
          <p>
            <ExternalLink href="https://www.tinmanelite.com">
              Tinman Elite
            </ExternalLink>
            {" "}&mdash; Schwartz&rsquo;s professional training group, with
            athlete profiles and training philosophy overview.
          </p>
          <p>
            <ExternalLink href="https://coachkylemartindale.com/tinman-marathon-training/">
              Coach Kyle — Tinman Marathon Training
            </ExternalLink>
            {" "}&mdash; Application of Tinman principles to marathon training,
            including the marathon big workout and CV-based periodization.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
