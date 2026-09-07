"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
} from "framer-motion";
import {
  AnimatedNumber,
  Figure,
  mono,
} from "@/components/PhilosophyShared";

// ────────────────────────────────────
// Colors
// ────────────────────────────────────

const GREEN = "#10b981";
const GREEN_DIM = "rgba(16, 185, 129, 0.15)";
const GREEN_MID = "rgba(16, 185, 129, 0.35)";

// ────────────────────────────────────
// 1. PMP Progression Chart
// ────────────────────────────────────

const pmpWeeks = [
  { week: "Wk 1", miles: 16, pmpMiles: 0, label: "16 mi easy" },
  { week: "Wk 2", miles: 18, pmpMiles: 4, label: "18 mi (4 @ MP)" },
  { week: "Wk 3", miles: 20, pmpMiles: 6, label: "20 mi (6 @ MP)" },
  { week: "Wk 4", miles: 22, pmpMiles: 8, label: "22 mi (8 @ MP)" },
  { week: "Wk 5", miles: 16, pmpMiles: 0, label: "16 mi recovery" },
];

export function PMPProgressionChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const maxMiles = 24;
  const barWidth = 56;
  const gap = 16;
  const chartH = 200;
  const chartW = pmpWeeks.length * (barWidth + gap) - gap + 60;
  const baseY = chartH + 20;

  return (
    <Figure caption="Progressive Marathon Pace (PMP) long run build: race-pace blocks are inserted late in each long run and increase weekly.">
      <svg ref={ref} viewBox={`0 0 ${chartW} ${baseY + 50}`} className="w-full">
        {/* Y-axis label */}
        <text
          x="10"
          y="12"
          fontSize="9"
          letterSpacing="0.05em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          MILES
        </text>

        {/* Grid lines */}
        {[8, 12, 16, 20, 24].map((m) => {
          const y = baseY - (m / maxMiles) * chartH;
          return (
            <g key={m}>
              <line
                x1="30"
                y1={y}
                x2={chartW}
                y2={y}
                stroke="var(--border)"
                strokeWidth="0.5"
                strokeDasharray="4 3"
              />
              <text
                x="26"
                y={y + 3}
                textAnchor="end"
                fontSize="9"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {m}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1="30"
          y1={baseY}
          x2={chartW}
          y2={baseY}
          stroke="var(--border)"
          strokeWidth="1"
        />

        {/* Bars */}
        {pmpWeeks.map((w, i) => {
          const x = 40 + i * (barWidth + gap);
          const totalH = (w.miles / maxMiles) * chartH;
          const pmpH = (w.pmpMiles / maxMiles) * chartH;
          const easyH = totalH - pmpH;

          return (
            <g key={i}>
              {/* Easy portion — grow upward from baseline */}
              <motion.rect
                x={x}
                width={barWidth}
                rx="3"
                fill={GREEN}
                opacity={0.2}
                initial={{ height: 0 }}
                animate={
                  inView
                    ? { height: easyH }
                    : { height: 0 }
                }
                style={{ y: baseY - easyH }}
                transition={{
                  delay: 0.15 + i * 0.12,
                  duration: 0.7,
                  ease: "easeOut",
                }}
              />

              {/* PMP (race-pace) portion stacked on top */}
              {w.pmpMiles > 0 && (
                <motion.rect
                  x={x}
                  width={barWidth}
                  rx="3"
                  fill={GREEN}
                  opacity={0.55}
                  initial={{ height: 0 }}
                  animate={
                    inView
                      ? { height: pmpH }
                      : { height: 0 }
                  }
                  style={{ y: baseY - totalH }}
                  transition={{
                    delay: 0.4 + i * 0.12,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              )}

              {/* Distance label on bar */}
              <motion.text
                x={x + barWidth / 2}
                y={baseY - totalH - 8}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                style={{ ...mono, fill: "var(--foreground)" }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
              >
                {w.miles} mi
              </motion.text>

              {/* PMP annotation inside bar */}
              {w.pmpMiles > 0 && (
                <motion.text
                  x={x + barWidth / 2}
                  y={baseY - easyH - pmpH / 2 + 4}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="500"
                  style={{ ...mono, fill: GREEN }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
                >
                  {w.pmpMiles} @ MP
                </motion.text>
              )}

              {/* Week label */}
              <text
                x={x + barWidth / 2}
                y={baseY + 16}
                textAnchor="middle"
                fontSize="10"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {w.week}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <rect
            x={chartW - 150}
            y={baseY + 30}
            width="12"
            height="10"
            rx="2"
            fill={GREEN}
            opacity={0.15}
          />
          <text
            x={chartW - 132}
            y={baseY + 39}
            fontSize="9"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Easy pace
          </text>
          <rect
            x={chartW - 70}
            y={baseY + 30}
            width="12"
            height="10"
            rx="2"
            fill={GREEN}
            opacity={0.55}
          />
          <text
            x={chartW - 52}
            y={baseY + 39}
            fontSize="9"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            MP pace
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// 2. Altitude Profile Diagram
// ────────────────────────────────────

export function AltitudeProfileDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Figure caption="Live high, train low: easy runs and recovery at 7,000 ft; quality sessions at 4,500 ft in Provo.">
      <svg ref={ref} viewBox="0 0 520 280" className="w-full">
        <defs>
          <linearGradient
            id="mtn-grad"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.25" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.04" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sky background */}
        <rect x="0" y="0" width="520" height="280" fill="url(#sky-grad)" rx="4" />

        {/* Mountain silhouette */}
        <motion.path
          d="M0 280 L40 200 L100 120 L140 80 L180 60 L220 50 L260 55 L300 70 L340 100 L380 140 L420 170 L460 190 L500 210 L520 220 L520 280 Z"
          fill="url(#mtn-grad)"
          stroke={GREEN}
          strokeWidth="1"
          strokeOpacity={0.3}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Elevation reference lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* 7,000 ft line */}
          <line
            x1="0"
            y1="80"
            x2="520"
            y2="80"
            stroke="var(--muted-foreground)"
            strokeWidth="0.5"
            strokeDasharray="6 4"
          />
          <text
            x="510"
            y="74"
            textAnchor="end"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            7,000 ft
          </text>

          {/* 4,500 ft line */}
          <line
            x1="0"
            y1="160"
            x2="520"
            y2="160"
            stroke="var(--muted-foreground)"
            strokeWidth="0.5"
            strokeDasharray="6 4"
          />
          <text
            x="510"
            y="154"
            textAnchor="end"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            4,500 ft
          </text>

          {/* Sea level reference */}
          <line
            x1="0"
            y1="260"
            x2="520"
            y2="260"
            stroke="var(--border)"
            strokeWidth="0.5"
          />
          <text
            x="510"
            y="255"
            textAnchor="end"
            fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            sea level
          </text>
        </motion.g>

        {/* Park City marker */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        >
          <circle cx="140" cy="80" r="6" fill={GREEN} opacity={0.7} />
          <circle cx="140" cy="80" r="3" fill={GREEN} />
          <rect
            x="65"
            y="35"
            width="150"
            height="36"
            rx="4"
            fill="var(--background)"
            stroke={GREEN}
            strokeWidth="1"
            opacity={0.9}
          />
          <text
            x="140"
            y="50"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            style={{ ...mono, fill: GREEN }}
          >
            LIVE HIGH
          </text>
          <text
            x="140"
            y="64"
            textAnchor="middle"
            fontSize="9"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Park City ~7,000 ft
          </text>
        </motion.g>

        {/* Provo marker */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
        >
          <circle cx="400" cy="160" r="6" fill={GREEN} opacity={0.4} />
          <circle cx="400" cy="160" r="3" fill="var(--foreground)" opacity={0.6} />
          <rect
            x="310"
            y="170"
            width="180"
            height="36"
            rx="4"
            fill="var(--background)"
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.9}
          />
          <text
            x="400"
            y="185"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            style={{ ...mono, fill: "var(--foreground)" }}
          >
            TRAIN LOW (quality)
          </text>
          <text
            x="400"
            y="199"
            textAnchor="middle"
            fontSize="9"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Provo ~4,500 ft
          </text>
        </motion.g>

        {/* Connecting dashed path with arrow */}
        <motion.path
          d="M148 84 C200 100, 300 130, 392 156"
          fill="none"
          stroke={GREEN}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            inView
              ? { pathLength: 1, opacity: 0.6 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ delay: 0.9, duration: 1.0, ease: "easeInOut" }}
        />

        {/* Arrowhead */}
        <motion.polygon
          points="392,150 392,162 400,156"
          fill={GREEN}
          opacity={0}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 1.8, duration: 0.3 }}
        />

        {/* Annotation: easy runs / workouts */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <text
            x="90"
            y="110"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Easy runs, base mileage
          </text>
          <text
            x="90"
            y="122"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Recovery, sleep at altitude
          </text>
        </motion.g>
        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <text
            x="310"
            y="225"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Tempo, intervals, PMP long runs
          </text>
          <text
            x="310"
            y="237"
            fontSize="8"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
          >
            Higher O2 = faster paces hit
          </text>
        </motion.g>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// 3. Race Results Timeline
// ────────────────────────────────────

const races = [
  {
    date: "Dec 2021",
    event: "Marathon Project",
    time: "2:11:27",
    seconds: 7887,
    note: "Marathon debut; controlled effort",
  },
  {
    date: "Feb 2022",
    event: "US Olympic Trials Marathon",
    time: "2:09:05",
    seconds: 7745,
    note: "Top American; 4th overall",
  },
  {
    date: "Oct 2022",
    event: "Chicago Marathon",
    time: "2:08:16",
    seconds: 7696,
    note: "PR; breakout major-marathon performance",
  },
  {
    date: "Dec 2023",
    event: "Valencia Marathon",
    time: "2:08:19",
    seconds: 7699,
    note: "Consistency at the elite level",
  },
  {
    date: "Feb 2024",
    event: "US Olympic Trials Marathon",
    time: "2:10:47",
    seconds: 7847,
    note: "2nd place; punched ticket to Paris",
  },
  {
    date: "Aug 2024",
    event: "Paris Olympics Marathon",
    time: "2:12:43",
    seconds: 7963,
    note: "Olympic debut; heat/humidity conditions",
  },
];

function formatMarathon(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function RaceResultsTimeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Figure caption="Conner Mantz's marathon career progression from debut to the Olympic Games.">
      <div ref={ref} className="relative pl-8 py-2">
        {/* Vertical line */}
        <motion.div
          className="absolute left-3 top-0 w-px"
          style={{ background: GREEN, opacity: 0.3 }}
          initial={{ height: 0 }}
          animate={inView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {races.map((r, i) => (
          <motion.div
            key={i}
            className="relative mb-8 last:mb-0"
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              delay: 0.2 + i * 0.18,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            {/* Dot */}
            <div
              className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2"
              style={{
                borderColor: GREEN,
                background: i === 4 ? GREEN : "var(--background)",
              }}
            />

            {/* Date */}
            <span
              className="text-xs block mb-0.5"
              style={{ ...mono, color: "var(--muted-foreground)" }}
            >
              {r.date}
            </span>

            {/* Event name + time */}
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                {r.event}
              </span>
              <span
                className="text-sm font-bold"
                style={{ ...mono, color: GREEN }}
              >
                <AnimatedNumber
                  value={r.seconds}
                  duration={1.0}
                  format={(n) => formatMarathon(n)}
                />
              </span>
            </div>

            {/* Note */}
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              {r.note}
            </p>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// 4. Three C's Diagram
// ────────────────────────────────────

const threeCs = [
  {
    phase: "CHILL",
    miles: "1 - 10",
    color: GREEN_DIM,
    borderColor: "var(--border)",
    textColor: "var(--muted-foreground)",
    desc: "Run relaxed well behind pace. Save mental & physical energy. Let others surge.",
    pct: 38.5,
  },
  {
    phase: "COVER",
    miles: "10 - 20",
    color: GREEN_MID,
    borderColor: GREEN,
    textColor: "var(--foreground)",
    desc: "Move up to goal pace. Cover ground steadily. Stay in contact with the lead group.",
    pct: 38.5,
  },
  {
    phase: "COMPETE",
    miles: "20 - 26.2",
    color: GREEN,
    borderColor: GREEN,
    textColor: "#fff",
    desc: "Race. Negative-split the final 10K. This is where PMP training pays off.",
    pct: 23,
  },
];

export function ThreeCsDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Figure caption="The 3 C's: Eyestone's race-execution framework for the marathon.">
      <div ref={ref}>
        {/* Mile bar */}
        <div className="flex h-8 rounded overflow-hidden mb-1">
          {threeCs.map((c, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center text-xs font-semibold"
              style={{
                ...mono,
                width: `${c.pct}%`,
                background: c.color,
                color: c.textColor,
                borderRight:
                  i < 2 ? "1px solid var(--background)" : "none",
              }}
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                delay: 0.1 + i * 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              {c.phase}
            </motion.div>
          ))}
        </div>

        {/* Mile markers */}
        <div className="flex justify-between px-0.5 mb-6">
          {["0", "10", "20", "26.2"].map((m) => (
            <span
              key={m}
              className="text-[10px]"
              style={{ ...mono, color: "var(--muted-foreground)" }}
            >
              mi {m}
            </span>
          ))}
        </div>

        {/* Phase cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {threeCs.map((c, i) => (
            <motion.div
              key={i}
              className="rounded-lg border p-4"
              style={{ borderColor: c.borderColor }}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.5 + i * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <div
                className="text-xs font-bold mb-1 tracking-wider"
                style={{ ...mono, color: GREEN }}
              >
                {c.phase}
              </div>
              <div
                className="text-[10px] mb-2"
                style={{ ...mono, color: "var(--muted-foreground)" }}
              >
                Miles {c.miles}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// Main Article
// ────────────────────────────────────
