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
// Colors
// ────────────────────────────────────

const SPEED_COLOR = "#3b82f6"; // blue-500
const STRENGTH_COLOR = "#f59e0b"; // amber-500
const TEMPO_COLOR = "#10b981"; // emerald-500

// ────────────────────────────────────
// CumulativeFatigueDiagram
// ────────────────────────────────────

export function CumulativeFatigueDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Traditional approach: mostly easy days, one massive long run
  const traditionalDays = [
    { day: "M", effort: 20, label: "Rest" },
    { day: "T", effort: 30, label: "Easy" },
    { day: "W", effort: 25, label: "Easy" },
    { day: "T", effort: 35, label: "Easy" },
    { day: "F", effort: 20, label: "Rest" },
    { day: "S", effort: 95, label: "20 mi" },
    { day: "S", effort: 30, label: "Easy" },
  ];

  // Hansons approach: cumulative fatigue building all week, capped long run
  const hansonsDays = [
    { day: "M", effort: 25, label: "Easy" },
    { day: "T", effort: 65, label: "Speed" },
    { day: "W", effort: 45, label: "Easy" },
    { day: "T", effort: 70, label: "Tempo" },
    { day: "F", effort: 40, label: "Easy" },
    { day: "S", effort: 75, label: "16 mi" },
    { day: "S", effort: 35, label: "Easy" },
  ];

  const barWidth = 26;
  const barGap = 8;
  const sideWidth = 7 * (barWidth + barGap);
  const maxBarH = 110;
  const baseY = 150;

  function renderSide(
    days: typeof traditionalDays,
    offsetX: number,
    color: string,
    label: string,
    delayBase: number
  ) {
    // Cumulative fatigue line: running sum normalized
    const cumulative = days.reduce<number[]>((acc, d, i) => {
      const prev = i > 0 ? acc[i - 1] : 0;
      acc.push(prev + d.effort * 0.4);
      return acc;
    }, []);
    const maxCum = Math.max(...cumulative);

    return (
      <g>
        {/* Section label */}
        <motion.text
          x={offsetX + sideWidth / 2}
          y={18}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.04em"
          style={{ ...mono, fill: "var(--foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delayBase, duration: 0.4 }}
        >
          {label}
        </motion.text>

        {/* Bars */}
        {days.map((d, i) => {
          const barH = (d.effort / 100) * maxBarH;
          const x = offsetX + i * (barWidth + barGap);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{
                delay: delayBase + 0.1 + i * 0.08,
                duration: 0.3,
              }}
            >
              {/* Background track */}
              <rect
                x={x}
                y={baseY - maxBarH}
                width={barWidth}
                height={maxBarH}
                rx="3"
                fill="var(--muted-foreground)"
                opacity={0.06}
              />
              {/* Effort bar */}
              <motion.rect
                x={x}
                width={barWidth}
                rx="3"
                fill={color}
                initial={{ y: baseY, height: 0 }}
                animate={
                  inView
                    ? { y: baseY - barH, height: barH }
                    : { y: baseY, height: 0 }
                }
                transition={{
                  delay: delayBase + 0.15 + i * 0.08,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                opacity={0.5}
              />
              {/* Day label */}
              <text
                x={x + barWidth / 2}
                y={baseY + 14}
                textAnchor="middle"
                fontSize="8"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {d.day}
              </text>
              {/* Workout label */}
              <text
                x={x + barWidth / 2}
                y={baseY + 25}
                textAnchor="middle"
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {d.label}
              </text>
            </motion.g>
          );
        })}

        {/* Cumulative fatigue line */}
        <motion.polyline
          points={cumulative
            .map((v, i) => {
              const x =
                offsetX + i * (barWidth + barGap) + barWidth / 2;
              const y = baseY - (v / maxCum) * (maxBarH - 10) - 5;
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity={0.7}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            inView
              ? { pathLength: 1, opacity: 0.7 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ delay: delayBase + 0.6, duration: 1.0, ease: "easeOut" }}
        />

        {/* Fatigue label on last point */}
        <motion.text
          x={
            offsetX + 6 * (barWidth + barGap) + barWidth / 2 + 4
          }
          y={baseY - (cumulative[6] / maxCum) * (maxBarH - 10) - 8}
          fontSize="7"
          style={{ ...mono, fill: color }}
          opacity={0.8}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.8 } : {}}
          transition={{ delay: delayBase + 1.4, duration: 0.4 }}
        >
          fatigue
        </motion.text>
      </g>
    );
  }

  return (
    <Figure caption="Traditional plans front-load rest before a massive long run. Hansons builds fatigue all week so the 16-miler simulates miles 10-26 of the marathon.">
      <svg ref={ref} viewBox="0 0 560 180" className="w-full">
        {renderSide(
          traditionalDays,
          10,
          "var(--muted-foreground)",
          "TRADITIONAL",
          0
        )}
        {/* Divider */}
        <motion.line
          x1="275"
          y1="6"
          x2="275"
          y2="170"
          stroke="var(--border)"
          strokeWidth="0.5"
          strokeDasharray="3 3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.3, duration: 0.4 }}
        />
        {renderSide(
          hansonsDays,
          295,
          "var(--accent)",
          "HANSONS",
          0.3
        )}
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// SOSWorkoutTypes
// ────────────────────────────────────

export function SOSWorkoutTypes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const workouts = [
    {
      name: "Speed",
      color: SPEED_COLOR,
      pace: "5K race pace",
      example: "12 x 400m w/ 400m jog",
      purpose: "Develop VO2max and neuromuscular speed. Trains the body to recruit fast-twitch fibers and improves running economy at high effort.",
    },
    {
      name: "Strength",
      color: STRENGTH_COLOR,
      pace: "MP minus 10 sec/mi",
      example: "3 x 2 mi at strength pace",
      purpose: "Bridge between speed and tempo. Builds lactate threshold and teaches the body to clear metabolic waste at marathon-adjacent effort.",
    },
    {
      name: "Tempo",
      color: TEMPO_COLOR,
      pace: "Goal marathon pace",
      example: "10 mi at marathon pace",
      purpose: "Develop pace discipline and glycogen efficiency. Simulates race-day conditions and trains the body to sustain effort over long durations.",
    },
  ];

  return (
    <div ref={ref} className="my-10 grid grid-cols-1 gap-4">
      {workouts.map((w, i) => (
        <motion.div
          key={w.name}
          className="rounded-lg border border-border p-5 relative overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
        >
          {/* Accent stripe */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
            style={{ background: w.color }}
          />
          <div className="ml-3">
            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="text-sm font-semibold"
                style={{ color: w.color, ...mono }}
              >
                {w.name}
              </span>
              <span
                className="text-xs text-muted-foreground"
                style={mono}
              >
                {w.pace}
              </span>
            </div>
            <div
              className="text-xs text-muted-foreground mb-2 px-2 py-1 rounded inline-block"
              style={{
                background: w.color,
                opacity: 0.1,
              }}
            >
              <span style={{ opacity: 10 }}>{w.example}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              {w.purpose}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ────────────────────────────────────
// WeeklyStructureGrid
// ────────────────────────────────────

export function WeeklyStructureGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const days = [
    { day: "Mon", type: "easy", label: "Easy", distance: "5-6 mi", color: "var(--muted-foreground)" },
    { day: "Tue", type: "sos", label: "Speed", distance: "Intervals", color: SPEED_COLOR },
    { day: "Wed", type: "easy", label: "Easy", distance: "5-6 mi", color: "var(--muted-foreground)" },
    { day: "Thu", type: "sos", label: "Strength", distance: "6-8 mi", color: STRENGTH_COLOR },
    { day: "Fri", type: "easy", label: "Easy", distance: "5-6 mi", color: "var(--muted-foreground)" },
    { day: "Sat", type: "sos", label: "Long Run", distance: "10-16 mi", color: TEMPO_COLOR },
    { day: "Sun", type: "rest", label: "Rest", distance: "--", color: "var(--border)" },
  ];

  return (
    <Figure caption="A typical Hansons week: three SOS sessions separated by easy days with one full rest day. Total weekly mileage: 55-65 miles in peak weeks.">
      <div ref={ref} className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((d, i) => (
          <motion.div
            key={d.day}
            className="text-center rounded-md p-2 sm:p-3"
            style={{
              background:
                d.type === "sos"
                  ? `color-mix(in srgb, ${d.color} 10%, transparent)`
                  : d.type === "rest"
                    ? "var(--muted-foreground)"
                    : "transparent",
              border:
                d.type === "sos"
                  ? `1px solid ${d.color}`
                  : d.type === "rest"
                    ? "1px solid var(--border)"
                    : "1px solid var(--border)",
              opacity: d.type === "rest" ? 0.3 : 1,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: d.type === "rest" ? 0.3 : 1, scale: 1 } : {}}
            transition={{
              delay: i * 0.06,
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <div
              className="text-[10px] sm:text-xs font-medium mb-1"
              style={{ color: d.type === "sos" ? d.color : "var(--muted-foreground)", ...mono }}
            >
              {d.day}
            </div>
            <div
              className="text-[9px] sm:text-[10px] font-semibold"
              style={{
                color: d.type === "sos" ? d.color : "var(--foreground)",
                ...mono,
              }}
            >
              {d.label}
            </div>
            <div
              className="text-[8px] sm:text-[9px] mt-0.5 text-muted-foreground"
              style={mono}
            >
              {d.distance}
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// The16MileArgument
// ────────────────────────────────────

export function The16MileArgument() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Time-on-feet zones
  const zones = [
    { start: 0, end: 30, label: "0-30 min", note: "Glycogen barely touched", color: TEMPO_COLOR, opacity: 0.15 },
    { start: 30, end: 90, label: "30-90 min", note: "Aerobic adaptation zone", color: TEMPO_COLOR, opacity: 0.25 },
    { start: 90, end: 150, label: "90-150 min", note: "Peak training stimulus", color: "var(--accent)", opacity: 0.35 },
    { start: 150, end: 210, label: "2.5-3.5 hr", note: "Diminishing returns", color: STRENGTH_COLOR, opacity: 0.2 },
    { start: 210, end: 260, label: "3.5+ hr", note: "Injury risk / overtraining", color: "#ef4444", opacity: 0.15 },
  ];

  const svgW = 560;
  const svgH = 200;
  const barY = 60;
  const barH = 50;
  const maxMin = 260;
  const scale = (min: number) => 30 + (min / maxMin) * (svgW - 60);

  // Marker for 16-mile sweet spot (~135 min for ~8:30/mi runner)
  const sweetSpotMin = 135;
  const sweetSpotX = scale(sweetSpotMin);

  // Marker for 20-mile danger zone (~170 min)
  const longRunMin = 170;
  const longRunX = scale(longRunMin);

  return (
    <Figure caption="The 16-mile long run lands in the peak training stimulus window. Going beyond 20 miles adds injury risk without proportional aerobic benefit -- especially under cumulative fatigue.">
      <svg ref={ref} viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
        {/* Time axis label */}
        <motion.text
          x={svgW / 2}
          y={16}
          textAnchor="middle"
          fontSize="9"
          letterSpacing="0.05em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.8 } : {}}
          transition={{ duration: 0.4 }}
        >
          TIME ON FEET (MINUTES)
        </motion.text>

        {/* Zone bands */}
        {zones.map((z, i) => {
          const x1 = scale(z.start);
          const x2 = scale(z.end);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <motion.rect
                x={x1}
                y={barY}
                height={barH}
                rx="2"
                fill={z.color}
                opacity={z.opacity}
                initial={{ width: 0 }}
                animate={inView ? { width: x2 - x1 } : { width: 0 }}
                transition={{
                  delay: 0.15 + i * 0.12,
                  duration: 0.7,
                  ease: "easeOut",
                }}
              />
              {/* Zone label */}
              <text
                x={(x1 + x2) / 2}
                y={barY + barH + 16}
                textAnchor="middle"
                fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
              >
                {z.label}
              </text>
              {/* Zone note */}
              <text
                x={(x1 + x2) / 2}
                y={barY + barH + 28}
                textAnchor="middle"
                fontSize="6.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
                opacity={0.7}
              >
                {z.note}
              </text>
            </motion.g>
          );
        })}

        {/* Base line */}
        <motion.line
          x1={scale(0)}
          y1={barY + barH}
          x2={scale(maxMin)}
          y2={barY + barH}
          stroke="var(--border)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.3 }}
        />

        {/* 16-mile marker */}
        <motion.g
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <line
            x1={sweetSpotX}
            y1={barY - 8}
            x2={sweetSpotX}
            y2={barY + barH}
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <circle cx={sweetSpotX} cy={barY - 12} r="3" fill="var(--accent)" />
          <text
            x={sweetSpotX}
            y={barY - 22}
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            style={{ ...mono, fill: "var(--accent)" }}
          >
            16 mi
          </text>
          <text
            x={sweetSpotX}
            y={barY - 34}
            textAnchor="middle"
            fontSize="7"
            style={{ ...mono, fill: "var(--accent)" }}
            opacity={0.7}
          >
            ~2:15 on tired legs
          </text>
        </motion.g>

        {/* 20-mile marker */}
        <motion.g
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          <line
            x1={longRunX}
            y1={barY - 4}
            x2={longRunX}
            y2={barY + barH}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity={0.6}
          />
          <text
            x={longRunX}
            y={barY - 10}
            textAnchor="middle"
            fontSize="8"
            style={{ ...mono, fill: "#ef4444" }}
            opacity={0.7}
          >
            20 mi
          </text>
        </motion.g>

        {/* Benefit curve (freehand) */}
        <motion.path
          d={`M${scale(0)},${barY + barH - 2}
              C${scale(40)},${barY + barH - 8} ${scale(80)},${barY + 10} ${scale(130)},${barY + 6}
              C${scale(160)},${barY + 4} ${scale(200)},${barY + 8} ${scale(maxMin)},${barY + 18}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
        />
        <motion.text
          x={scale(maxMin) - 2}
          y={barY + 14}
          textAnchor="end"
          fontSize="7"
          style={{ ...mono, fill: "var(--accent)" }}
          opacity={0.6}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 2.0, duration: 0.4 }}
        >
          aerobic benefit
        </motion.text>

        {/* Injury risk curve */}
        <motion.path
          d={`M${scale(90)},${barY + barH - 2}
              C${scale(130)},${barY + barH - 6} ${scale(180)},${barY + barH - 20} ${scale(maxMin)},${barY + 2}`}
          fill="none"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity={0.35}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
        />
        <motion.text
          x={scale(maxMin) - 2}
          y={barY + 4}
          textAnchor="end"
          fontSize="7"
          style={{ ...mono, fill: "#ef4444" }}
          opacity={0.4}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ delay: 2.0, duration: 0.4 }}
        >
          injury risk
        </motion.text>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// Main Article
// ────────────────────────────────────
