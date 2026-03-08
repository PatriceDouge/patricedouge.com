"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArticleLayout,
  Figure,
  AnimatedNumber,
  SectionDivider,
  ExternalLink,
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

function PMPProgressionChart() {
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

function AltitudeProfileDiagram() {
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

function RaceResultsTimeline() {
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

function ThreeCsDiagram() {
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

export function MantzEyestoneArticle() {
  return (
    <ArticleLayout
      title="Mantz / Eyestone: The BYU Marathon System"
      subtitle="How Ed Eyestone's altitude-powered, progressive-pace methodology built one of America's most consistent young marathoners."
      accentColor={GREEN}
    >
      {/* ── Introduction ── */}
      <div className="space-y-5">
        <p className="text-muted leading-relaxed">
          In the thin air above Provo, Utah, a coaching partnership has
          produced results that defy the conventional marathon development
          timeline. Ed Eyestone -- a two-time Olympic marathoner himself
          (1988 Seoul, 1992 Barcelona) and head cross-country and track
          coach at Brigham Young University since 2000 -- has spent decades
          refining an approach to the 26.2-mile distance that emphasizes
          patience, physiological specificity, and a race-day framework
          simple enough to remember at mile 22.
        </p>
        <p className="text-muted leading-relaxed">
          His most prominent protege, Conner Mantz, arrived at BYU as a
          talented but unheralded recruit from American Fork, Utah. Under
          Eyestone's guidance, Mantz won back-to-back NCAA cross-country
          titles (2020, 2021) before transitioning to the marathon with
          a debut that immediately signaled world-class potential. Their
          partnership offers a case study in how altitude, progressive
          pacing, and disciplined race execution can accelerate marathon
          development without burning an athlete out.
        </p>
      </div>

      <SectionDivider text="THE COACH" />

      {/* ── Eyestone Background ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Ed Eyestone: From Olympian to Architect
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Eyestone's own marathon career peaked with a 2:10:59 personal
            best and two Olympic appearances, giving him firsthand
            understanding of the demands the distance places on both body
            and mind. After retiring from professional competition, he
            took the coaching reins at his alma mater and built BYU into
            a national cross-country power, earning over a dozen
            conference titles and producing multiple All-Americans.
          </p>
          <p className="text-muted leading-relaxed">
            His coaching philosophy rejects the high-mileage-at-all-costs
            orthodoxy common in American distance running. Instead,
            Eyestone prioritizes quality over volume, building athletes
            gradually through a system that leverages Utah's unique
            geography. His runners typically peak between 100-115 miles
            per week in marathon training -- meaningful volume, but
            conservative compared to programs that push 130 or more.
            The key differentiator is not how much they run, but where
            and how they run it.
          </p>
        </div>
      </section>

      <SectionDivider text="ALTITUDE STRATEGY" />

      {/* ── Altitude ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Live High, Train Low: The Utah Advantage
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Eyestone system exploits a natural version of the
            &ldquo;live high, train low&rdquo; protocol that sports
            scientists have championed since the 1990s. Athletes live and
            perform easy runs in Park City at roughly 7,000 feet of
            elevation, where the reduced oxygen pressure stimulates the
            body to produce more red blood cells and improve oxygen-
            carrying capacity. When it is time for quality workouts --
            tempo runs, intervals, or the signature PMP long runs --
            they drive 30 minutes down to Provo at approximately
            4,500 feet, where the denser air allows them to hit faster
            paces with less cardiovascular strain.
          </p>
          <p className="text-muted leading-relaxed">
            This daily oscillation gives athletes the hematological
            benefits of altitude exposure without the compromised
            training quality that comes from doing hard sessions in
            thin air. Eyestone has noted in interviews that his runners
            often see a measurable boost when they travel to sea-level
            races, arriving with altitude-enhanced blood profiles and
            fresh legs from controlled training loads.
          </p>
        </div>
      </section>

      <AltitudeProfileDiagram />

      <SectionDivider text="THE PMP METHOD" />

      {/* ── PMP ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Progressive Marathon Pace: The Signature Workout
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The cornerstone of the Eyestone marathon system is the
            Progressive Marathon Pace (PMP) long run. Unlike traditional
            long runs done entirely at easy pace, or the aggressive
            marathon-pace long runs favored by some programs, PMP sessions
            start easy and insert a block of race-pace running in the
            final third of the run. The idea is to rehearse the exact
            physiological state of the late miles in a marathon: running
            at goal pace on tired, glycogen-depleted legs.
          </p>
          <p className="text-muted leading-relaxed">
            A typical PMP build cycle over four to five weeks might
            begin with a 16-mile all-easy long run, progress to an
            18-miler with 4 miles at marathon pace at the end, then
            a 20-miler with 6 at pace, and peak with a 22-miler
            finishing with 8 miles at marathon pace. A recovery week
            follows before the next cycle. The race-pace blocks always
            come at the end -- never the beginning or middle -- to
            teach the body and mind to run fast when fatigued.
          </p>
          <p className="text-muted leading-relaxed">
            This specificity is critical. As Eyestone has explained,
            the marathon is unique among road races because the hardest
            part comes at the end, when muscle glycogen is depleted and
            the body is switching to fat oxidation. PMP training
            specifically conditions athletes for this metabolic
            crossover, building both the physical endurance and the
            psychological confidence to maintain pace in the final
            10 kilometers.
          </p>
        </div>
      </section>

      <PMPProgressionChart />

      <SectionDivider text="RACE EXECUTION" />

      {/* ── The 3 C's ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The 3 C&apos;s: Chill, Cover, Compete
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Eyestone distills marathon race strategy into three phases,
            each tied to a simple word beginning with C. In the first
            third of the race (miles 1-10), the runner should
            <strong> Chill</strong> -- run relaxed, conserve energy,
            and let others dictate the pace. The goal is to feel almost
            too easy, banking nothing but calm confidence.
          </p>
          <p className="text-muted leading-relaxed">
            During the middle third (miles 10-20), the runner should
            <strong> Cover</strong> -- move up to goal pace, cover
            ground efficiently, and stay in contact with the relevant
            group. This is where the race begins to take shape, but
            the runner should still feel in control, not racing.
          </p>
          <p className="text-muted leading-relaxed">
            In the final phase (miles 20-26.2), it is time to
            <strong> Compete</strong>. This is where all the PMP
            training manifests: the runner attacks, negative-splits
            the final 10K, and races to the finish. Mantz's best
            marathon performances have followed this template almost
            exactly, coming through halfway conservative and then
            running down fading competitors in the closing miles.
          </p>
        </div>
      </section>

      <ThreeCsDiagram />

      <SectionDivider text="THE ATHLETE" />

      {/* ── Mantz Development ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Conner Mantz: Development and Results
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Mantz's marathon trajectory illustrates the system in action.
            After winning consecutive NCAA cross-country championships --
            the first BYU runner to accomplish this since Ed Eyestone's
            own era -- he debuted at the marathon in December 2021 at
            The Marathon Project in Chandler, Arizona, running 2:11:27.
            The time itself was strong for a debut, but more notable was
            the manner: an even, controlled effort with a slightly
            negative second half, textbook 3 C's execution.
          </p>
          <p className="text-muted leading-relaxed">
            Just two months later, at the 2022 U.S. Olympic Trials
            Marathon in January, Mantz ran 2:09:05 to finish as the
            top American (fourth overall behind three already-qualified
            athletes). That race -- held on a hot day in Orlando --
            showcased his ability to stay patient early and pick off
            fading runners in the second half.
          </p>
          <p className="text-muted leading-relaxed">
            His breakout came at the 2022 Chicago Marathon, where he
            ran a 2:08:16 personal best in one of the world's fastest
            fields. He followed that with a 2:08:19 in Valencia in late
            2023, demonstrating the consistency that defines the
            Eyestone approach: small, sustainable improvements rather
            than volatile swings.
          </p>
          <p className="text-muted leading-relaxed">
            At the 2024 U.S. Olympic Trials in Orlando, Mantz ran
            2:10:47 to finish second and earn his spot on the U.S.
            Olympic team for the Paris Games. The race was tactical
            rather than fast, and Mantz executed a patient strategy
            that prioritized position over time. In Paris, he ran
            2:12:43 in brutal heat and humidity -- conditions that
            wrecked many favorites -- and gained invaluable Olympic
            experience at age 27.
          </p>
        </div>
      </section>

      <RaceResultsTimeline />

      <SectionDivider text="KEY NUMBERS" />

      {/* ── Stats row ── */}
      <section className="mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-8">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ ...mono, color: GREEN }}>
              <AnimatedNumber value={2} format={(n) => Math.round(n).toString()} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              NCAA XC Titles
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ ...mono, color: GREEN }}>
              <AnimatedNumber
                value={7696}
                format={(n) => formatMarathon(n)}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Marathon PR
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ ...mono, color: GREEN }}>
              <AnimatedNumber value={6} format={(n) => Math.round(n).toString()} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Career Marathons
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ ...mono, color: GREEN }}>
              <AnimatedNumber value={7000} format={(n) => Math.round(n).toLocaleString() + " ft"} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Training Altitude
            </div>
          </div>
        </div>
      </section>

      <SectionDivider text="PHILOSOPHY" />

      {/* ── Broader Lessons ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          What Makes This System Work
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The Eyestone-Mantz partnership works because it aligns
            training stimulus with race demands at every level. The
            altitude protocol maximizes aerobic development without
            compromising workout quality. The PMP long runs condition
            the exact metabolic and muscular state of the late-race
            marathon. The 3 C's framework gives the athlete a simple,
            memorable strategy that prevents the premature effort that
            ruins most marathon bids.
          </p>
          <p className="text-muted leading-relaxed">
            Perhaps most importantly, the system is patient. Eyestone
            did not rush Mantz into a marathon debut. He waited until
            the cross-country career was complete, built the aerobic
            base over years of collegiate training, and then introduced
            marathon-specific work gradually. The result was a 24-year-
            old who ran 2:11 in his debut and 2:08 within a year --
            a trajectory that typically takes runners three to five
            years to achieve.
          </p>
          <p className="text-muted leading-relaxed">
            For recreational and competitive runners alike, the
            Eyestone system offers transferable lessons: train
            specifically for the demands of the final miles, leverage
            your environment (even modest altitude or heat exposure),
            keep the race plan simple, and resist the urge to prove
            fitness in training at the expense of race-day performance.
          </p>
        </div>
      </section>

      <SectionDivider text="SOURCES" />

      {/* ── Sources ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Sources</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <ExternalLink href="https://universe.byu.edu/2022/01/18/byu-coach-ed-eyestone-marathon-method/">
              BYU Universe: Ed Eyestone&apos;s Marathon Method
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.deseret.com/sports/2024/02/03/conner-mantz-olympic-trials-marathon-training/">
              Deseret News: Conner Mantz Olympic Trials Training
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.runnersworld.com/runners-stories/a42764509/conner-mantz-olympic-marathon-trials/">
              Runner&apos;s World: Conner Mantz Profile
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.ncaa.com/news/cross-country-men/article/2021-11-20/conner-mantz-wins-2021-ncaa-di-mens-cross-country-title">
              NCAA: Mantz Wins 2021 Cross-Country Title
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://journals.humankinetics.com/view/journals/ijspp/12/s2/article-pS2-29.xml">
              International Journal of Sports Physiology: Live High, Train Low Meta-Analysis
            </ExternalLink>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
