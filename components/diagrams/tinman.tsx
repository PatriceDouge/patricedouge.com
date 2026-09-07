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
// PaceSpectrumDiagram
// ────────────────────────────────────

export function PaceSpectrumDiagram() {
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

export function MuscleFiberDiagram() {
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

export function TrainingDistributionBars() {
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

export function WeeklyStructureTimeline() {
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

export function SignatureWorkoutsCards() {
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

export function DiminishingReturnsDiagram() {
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
