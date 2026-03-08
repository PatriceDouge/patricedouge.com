"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArticleLayout,
  Figure,
  SectionDivider,
  ExternalLink,
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

function CumulativeFatigueDiagram() {
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

function SOSWorkoutTypes() {
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

function WeeklyStructureGrid() {
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

function The16MileArgument() {
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

export function HansonsArticle() {
  return (
    <ArticleLayout
      title="Hansons Marathon Method"
      subtitle="Cumulative fatigue, capped long runs, and the case for training smarter -- not longer."
      accentColor="var(--accent)"
    >
      {/* ── Origins ── */}
      <section>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            In the late 1990s, brothers Keith and Kevin Hanson opened a running
            store in Rochester Hills, Michigan. Their competitive running
            backgrounds and coaching instincts led them to a provocative question:
            what if the conventional marathon training wisdom -- anchored around
            the 20-mile long run -- was fundamentally misguided?
          </p>
          <p className="text-muted leading-relaxed">
            They founded the Hansons-Brooks Distance Project in 1999, a
            post-collegiate training group sponsored by Brooks Running. The
            project gave mid-level professionals a structured, high-volume
            environment that prioritized consistency over heroic individual
            workouts. The results spoke clearly: multiple Olympic Trials
            qualifiers, sub-2:12 marathoners, and a training philosophy that
            would eventually reshape how everyday runners approach the 26.2-mile
            distance.
          </p>
          <p className="text-muted leading-relaxed">
            The method was codified into a book by Luke Humphrey, a coach within
            the Hansons system, and has since become one of the most widely
            adopted marathon plans in the running world. Its central thesis is
            deceptively simple: you do not need to simulate the full marathon
            distance in training. You need to simulate the full marathon{" "}
            <em>feeling</em>.
          </p>
        </div>
      </section>

      <SectionDivider text="CUMULATIVE FATIGUE" />

      {/* ── Cumulative Fatigue ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Theory of Cumulative Fatigue
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Most traditional marathon plans treat the long run as the week&apos;s
            centerpiece. Everything else orbits around it: easy days exist to
            recover for the weekend&apos;s 18- or 20-miler. The result is a
            training rhythm where you arrive at your long run feeling relatively
            fresh -- legs recovered, glycogen stores topped off.
          </p>
          <p className="text-muted leading-relaxed">
            The Hansons method flips this entirely. By distributing quality work
            across three &quot;SOS&quot; (Something Of Substance) sessions per
            week -- speed, strength, and tempo -- with easy runs filling the
            remaining days, you arrive at every workout carrying residual fatigue
            from the previous one. Your 16-mile Saturday long run begins on legs
            that have already accumulated 40-50 miles of work that week.
          </p>
          <p className="text-muted leading-relaxed">
            This is the key insight: a 16-mile run on fatigued legs replicates
            the physiological state of miles 10 through 26 in an actual marathon.
            You are not simulating the distance. You are simulating the fatigue.
          </p>
        </div>

        <CumulativeFatigueDiagram />
      </section>

      <SectionDivider text="THE 16-MILE ARGUMENT" />

      {/* ── The 16-Mile Argument ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Why 16 Miles, Not 20
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The traditional 20-mile long run has near-religious status in
            marathon culture. Hansons challenges it on multiple fronts. First,
            there is the time-on-feet argument: for a runner targeting a 3:30
            marathon, 16 miles takes roughly 2:15 at easy pace. The aerobic
            adaptations from time on feet -- capillary development, mitochondrial
            density, fat oxidation -- plateau somewhere around 2.5 to 3 hours.
            Going beyond that offers diminishing physiological returns.
          </p>
          <p className="text-muted leading-relaxed">
            Second, there is the injury calculus. The risk of soft-tissue damage,
            overuse injury, and deep glycogen depletion rises exponentially beyond
            the 2.5-hour mark, particularly for runners logging high weekly
            volume. A single 20-miler that leads to a stress fracture or IT band
            flare-up erases weeks of training.
          </p>
          <p className="text-muted leading-relaxed">
            Third, and most critically, the cumulative fatigue model means you do
            not need the extra miles to achieve the same training effect. If your
            legs are already carrying five days of accumulated work, mile one of
            your long run is not really mile one -- it is effectively mile ten in
            terms of glycogen depletion, muscular fatigue, and mental load.
          </p>
        </div>

        <The16MileArgument />
      </section>

      <SectionDivider text="SOS WORKOUTS" />

      {/* ── SOS Workouts ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Something Of Substance
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The three SOS workout types form the backbone of the Hansons method.
            Each targets a different energy system and pace range, but together
            they create a comprehensive aerobic and neuromuscular training
            stimulus. The naming convention -- &quot;Something Of Substance&quot;
            -- emphasizes that these are the sessions that matter. Everything else
            is recovery.
          </p>
          <p className="text-muted leading-relaxed">
            Speed work develops VO2max through short, intense intervals at 5K
            pace. Strength sessions -- run at roughly 10 seconds per mile faster
            than marathon pace -- target lactate threshold and teach the body to
            process metabolic waste at sustained effort. Tempo runs at marathon
            pace build the specific endurance and pace discipline needed on race
            day.
          </p>
        </div>

        <SOSWorkoutTypes />

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The progression across an 18-week cycle is deliberate. Speed work
            appears first, establishing neuromuscular fitness and running economy.
            Strength sessions layer in around week four or five, building on that
            speed base. Tempo runs -- the most marathon-specific work -- dominate
            the final mesocycle. By race day, the body has been systematically
            conditioned across every relevant energy system.
          </p>
        </div>
      </section>

      <SectionDivider text="WEEKLY STRUCTURE" />

      {/* ── Weekly Structure ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          How the Week Builds
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            A Hansons week is not random. The placement of SOS days is
            deliberate: hard days are never back-to-back, and each easy day
            serves a dual purpose as both recovery from the previous quality
            session and pre-fatigue for the next one. The long run sits on
            Saturday, after a full week of accumulated load.
          </p>
          <p className="text-muted leading-relaxed">
            Sunday is the only true rest day. Some advanced runners will jog
            lightly, but the program encourages full rest to allow structural
            adaptation -- tendons, ligaments, and bones rebuilding under the
            cumulative stress. This creates a reliable rhythm: work, recover,
            work, recover, work, long, rest.
          </p>
        </div>

        <WeeklyStructureGrid />

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Weekly mileage in the Hansons advanced plan peaks around 57 to 63
            miles. The beginner plan tops out in the low 40s. What distinguishes
            the method from other high-mileage approaches -- like Pfitzinger or
            Daniels -- is the even distribution. No single run accounts for more
            than 25% of weekly volume. This protects against the boom-bust cycle
            that plagues many marathon training blocks: a massive long run
            followed by days of recovery that effectively waste training time.
          </p>
        </div>
      </section>

      <SectionDivider text="WHY IT WORKS" />

      {/* ── Why It Works ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          For Working Athletes and Injury-Prone Runners
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Hansons method has found a particularly loyal following among
            runners with full-time jobs and limited training windows. When your
            longest run is 16 miles instead of 22, Saturday does not consume the
            entire day. You can fit the workout into a morning and still be
            present for the rest of your life. This is not a minor advantage --
            marathon training is as much a test of schedule management as physical
            endurance.
          </p>
          <p className="text-muted leading-relaxed">
            For injury-prone runners, the capped long run is transformative. Many
            runners who have repeatedly broken down during 20-mile training runs
            -- whether from biomechanical faults, previous injuries, or simply
            the accumulated impact of 3+ hours of pounding -- find that the
            Hansons cap lets them train through an entire cycle without the
            breakdown that traditionally derails their buildup.
          </p>
          <p className="text-muted leading-relaxed">
            The method also cultivates a different kind of mental toughness. In
            traditional plans, the long run is the psychological anchor: survive
            20 miles in training, and you believe you can survive 26.2 on race
            day. In Hansons, the toughness comes from the grind -- from running
            quality intervals on Tuesday, knowing Thursday brings another hard
            session, knowing Saturday brings the long run, knowing there is no
            week where you truly rest. You learn to perform under fatigue, which
            is exactly what the marathon demands.
          </p>
          <p className="text-muted leading-relaxed">
            The Hansons brothers built their philosophy on a simple observation:
            the marathon is not a long run. It is a sustained effort on tired
            legs. Every design decision in the method -- the cumulative load, the
            SOS distribution, the 16-mile cap -- flows from that single insight.
          </p>
        </div>
      </section>

      {/* ── Sources ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Sources</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <ExternalLink href="https://lukehumphreyrunning.com/hansons-marathon-method/">
              Luke Humphrey -- Hansons Marathon Method Overview
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://lukehumphreyrunning.com/the-long-run-is-dead/">
              Luke Humphrey -- Long-Run Volume and the 16-Mile Argument
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://lukehumphreyrunning.com/cumulative-fatigue-explained/">
              Luke Humphrey -- Cumulative Fatigue Explained
            </ExternalLink>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
