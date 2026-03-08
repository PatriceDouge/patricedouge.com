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

const ZONE1 = "var(--accent)"; // blue — easy aerobic
const ZONE2 = "#f59e0b"; // amber — "gray zone"
const ZONE3 = "#ef4444"; // red — high intensity

// ────────────────────────────────────
// IntensityDistributionComparison
// ────────────────────────────────────

function IntensityDistributionComparison() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const models = [
    {
      name: "Polarized",
      z1: 80,
      z2: 0,
      z3: 20,
      highlight: true,
    },
    {
      name: "Threshold",
      z1: 60,
      z2: 30,
      z3: 10,
      highlight: false,
    },
    {
      name: "Pyramidal",
      z1: 75,
      z2: 20,
      z3: 5,
      highlight: false,
    },
  ];

  return (
    <Figure caption="Three training models compared. Polarized minimizes time in the moderate-intensity gray zone; threshold-heavy loads it.">
      <div ref={ref} className="space-y-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs" style={mono}>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: ZONE1, opacity: 0.6 }}
            />
            Zone 1 (easy)
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: ZONE2, opacity: 0.6 }}
            />
            Zone 2 (moderate)
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: ZONE3, opacity: 0.6 }}
            />
            Zone 3 (hard)
          </span>
        </div>

        {models.map((m, mi) => (
          <div key={m.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-xs font-medium"
                style={{
                  ...mono,
                  color: m.highlight
                    ? ZONE3
                    : "var(--muted-foreground)",
                }}
              >
                {m.name}
              </span>
            </div>
            <div className="relative h-8 w-full rounded overflow-hidden bg-border/30">
              {/* Zone 1 */}
              <motion.div
                className="absolute inset-y-0 left-0 flex items-center justify-center"
                style={{ background: ZONE1, opacity: 0.45 }}
                initial={{ width: 0 }}
                animate={inView ? { width: `${m.z1}%` } : { width: 0 }}
                transition={{
                  delay: mi * 0.15,
                  duration: 0.9,
                  ease: "easeOut",
                }}
              >
                {m.z1 > 15 && (
                  <span
                    className="text-[10px] text-foreground font-medium"
                    style={mono}
                  >
                    {m.z1}%
                  </span>
                )}
              </motion.div>

              {/* Zone 2 */}
              {m.z2 > 0 && (
                <motion.div
                  className="absolute inset-y-0 flex items-center justify-center"
                  style={{
                    left: `${m.z1}%`,
                    background: ZONE2,
                    opacity: 0.5,
                  }}
                  initial={{ width: 0 }}
                  animate={
                    inView ? { width: `${m.z2}%` } : { width: 0 }
                  }
                  transition={{
                    delay: mi * 0.15 + 0.3,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                >
                  {m.z2 >= 10 && (
                    <span
                      className="text-[10px] text-foreground font-medium"
                      style={mono}
                    >
                      {m.z2}%
                    </span>
                  )}
                </motion.div>
              )}

              {/* Zone 3 */}
              <motion.div
                className="absolute inset-y-0 flex items-center justify-center"
                style={{
                  left: `${m.z1 + m.z2}%`,
                  background: ZONE3,
                  opacity: 0.5,
                }}
                initial={{ width: 0 }}
                animate={
                  inView ? { width: `${m.z3}%` } : { width: 0 }
                }
                transition={{
                  delay: mi * 0.15 + 0.5,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                {m.z3 >= 5 && (
                  <span
                    className="text-[10px] text-foreground font-medium"
                    style={mono}
                  >
                    {m.z3}%
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// ThreeZoneModel
// ────────────────────────────────────

function ThreeZoneModel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // Lactate curve points: x = intensity (0-440), y = lactate (inverted for SVG)
  // exponential-ish rise
  const curvePoints = [
    [40, 190],
    [80, 188],
    [120, 184],
    [160, 178],
    [190, 168], // LT1 region
    [220, 152],
    [250, 130],
    [270, 110], // LT2 region
    [300, 80],
    [330, 48],
    [360, 22],
    [400, 8],
  ];

  const curvePath = curvePoints
    .map((p, i) => {
      if (i === 0) return `M${p[0]},${p[1]}`;
      const prev = curvePoints[i - 1];
      const cpx1 = prev[0] + (p[0] - prev[0]) * 0.5;
      const cpx2 = prev[0] + (p[0] - prev[0]) * 0.5;
      return `C${cpx1},${prev[1]} ${cpx2},${p[1]} ${p[0]},${p[1]}`;
    })
    .join(" ");

  const lt1X = 190;
  const lt2X = 270;

  return (
    <Figure caption="The three-zone model. Zone 2 — between the first and second lactate thresholds — is the 'gray zone' that polarized training deliberately avoids.">
      <svg ref={ref} viewBox="0 0 440 240" className="w-full">
        {/* Zone 1: below LT1 */}
        <motion.rect
          x="40"
          y="10"
          width={lt1X - 40}
          height="195"
          rx="2"
          fill={ZONE1}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.1 } : {}}
          transition={{ duration: 0.5 }}
        />

        {/* Zone 2: between LT1 and LT2 — gray zone */}
        <motion.rect
          x={lt1X}
          y="10"
          width={lt2X - lt1X}
          height="195"
          rx="0"
          fill={ZONE2}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.15 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* Dashed warning border on gray zone */}
        <motion.rect
          x={lt1X}
          y="10"
          width={lt2X - lt1X}
          height="195"
          rx="0"
          fill="none"
          stroke={ZONE2}
          strokeWidth="1.5"
          strokeDasharray="5 3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        />

        {/* Zone 3: above LT2 */}
        <motion.rect
          x={lt2X}
          y="10"
          width={400 - lt2X + 20}
          height="195"
          rx="2"
          fill={ZONE3}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        {/* Axes */}
        <line
          x1="40"
          y1="205"
          x2="420"
          y2="205"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <line
          x1="40"
          y1="10"
          x2="40"
          y2="205"
          stroke="var(--border)"
          strokeWidth="1"
        />

        {/* X-axis label */}
        <text
          x="230"
          y="228"
          textAnchor="middle"
          fontSize="10"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
        >
          Intensity / Pace
        </text>

        {/* Y-axis label */}
        <text
          x="14"
          y="110"
          textAnchor="middle"
          fontSize="10"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          transform="rotate(-90 14 110)"
        >
          Blood Lactate (mmol/L)
        </text>

        {/* LT1 line */}
        <motion.line
          x1={lt1X}
          y1="10"
          x2={lt1X}
          y2="205"
          stroke="var(--muted-foreground)"
          strokeWidth="0.8"
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.6 }}
        />
        <motion.text
          x={lt1X}
          y="222"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          LT1
        </motion.text>

        {/* LT2 line */}
        <motion.line
          x1={lt2X}
          y1="10"
          x2={lt2X}
          y2="205"
          stroke="var(--muted-foreground)"
          strokeWidth="0.8"
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.8 }}
        />
        <motion.text
          x={lt2X}
          y="222"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          LT2
        </motion.text>

        {/* Zone labels */}
        <motion.text
          x={(40 + lt1X) / 2}
          y="28"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          style={{ ...mono, fill: ZONE1 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.9 } : {}}
          transition={{ delay: 0.5 }}
        >
          ZONE 1
        </motion.text>

        <motion.g
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <text
            x={(lt1X + lt2X) / 2}
            y="28"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            style={{ ...mono, fill: ZONE2 }}
          >
            ZONE 2
          </text>
          <text
            x={(lt1X + lt2X) / 2}
            y="42"
            textAnchor="middle"
            fontSize="8"
            style={{ ...mono, fill: ZONE2 }}
          >
            &quot;gray zone&quot;
          </text>
        </motion.g>

        <motion.text
          x={(lt2X + 420) / 2}
          y="28"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          style={{ ...mono, fill: ZONE3 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.9 } : {}}
          transition={{ delay: 0.9 }}
        >
          ZONE 3
        </motion.text>

        {/* Animated lactate curve */}
        <motion.path
          d={curvePath}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            inView
              ? { pathLength: 1, opacity: 0.8 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ delay: 0.4, duration: 1.6, ease: "easeOut" }}
        />

        {/* Curve label */}
        <motion.text
          x="370"
          y="20"
          fontSize="9"
          style={{ ...mono, fill: "var(--foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.8 }}
        >
          lactate
        </motion.text>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// SeilerHierarchyPyramid
// ────────────────────────────────────

function SeilerHierarchyPyramid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const tiers = [
    {
      label: "Interval Design",
      desc: "Fine-tune work/rest ratios",
      widthPct: 35,
    },
    {
      label: "Intensity Distribution",
      desc: "80/20 split across zones",
      widthPct: 55,
    },
    {
      label: "Session Duration",
      desc: "How long each session lasts",
      widthPct: 75,
    },
    {
      label: "Training Frequency",
      desc: "Number of sessions per week",
      widthPct: 95,
    },
  ];

  return (
    <Figure caption="Seiler's hierarchy — get the bottom tiers right before optimizing the top.">
      <div ref={ref} className="flex flex-col items-center gap-2 py-4">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.label}
            className="relative rounded"
            style={{
              width: `${tier.widthPct}%`,
              minHeight: 52,
              background:
                i === 1
                  ? `${ZONE3}18`
                  : "var(--accent-background, rgba(128,128,128,0.06))",
              border:
                i === 1
                  ? `1.5px solid ${ZONE3}40`
                  : "1px solid var(--border)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={
              inView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 16 }
            }
            transition={{
              delay: (tiers.length - 1 - i) * 0.18 + 0.1,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full py-2 px-3 text-center">
              <span
                className="text-xs font-semibold"
                style={{
                  ...mono,
                  color:
                    i === 1
                      ? ZONE3
                      : "var(--foreground)",
                }}
              >
                {tier.label}
              </span>
              <span
                className="text-[10px] mt-0.5"
                style={{
                  ...mono,
                  color: "var(--muted-foreground)",
                }}
              >
                {tier.desc}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// ResearchResultsBars
// ────────────────────────────────────

function ResearchResultsBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const studies = [
    {
      group: "Esteve-Lanao et al. (2007)",
      results: [
        {
          label: "Polarized group",
          value: 5.0,
          color: ZONE3,
          maxWidth: 100,
        },
        {
          label: "Threshold group",
          value: 3.6,
          color: "var(--muted-foreground)",
          maxWidth: 72,
        },
      ],
      metric: "% improvement in 10K time",
    },
    {
      group: "Stoggl & Sperlich (2014)",
      results: [
        {
          label: "Polarized",
          value: 6.8,
          color: ZONE3,
          maxWidth: 100,
        },
        {
          label: "Threshold",
          value: 5.1,
          color: "var(--muted-foreground)",
          maxWidth: 75,
        },
        {
          label: "High-volume",
          value: 3.7,
          color: "var(--muted-foreground)",
          maxWidth: 54,
        },
        {
          label: "High-intensity",
          value: 4.2,
          color: "var(--muted-foreground)",
          maxWidth: 62,
        },
      ],
      metric: "% VO2max improvement",
    },
  ];

  return (
    <Figure caption="Key studies consistently show polarized groups outperforming threshold-heavy and other training models.">
      <div ref={ref} className="space-y-8">
        {studies.map((study, si) => (
          <div key={study.group}>
            <div
              className="text-xs font-medium mb-1"
              style={{ ...mono, color: "var(--foreground)" }}
            >
              {study.group}
            </div>
            <div
              className="text-[10px] mb-3"
              style={{ ...mono, color: "var(--muted-foreground)" }}
            >
              {study.metric}
            </div>
            <div className="space-y-2">
              {study.results.map((r, ri) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span
                    className="text-[10px] text-muted-foreground shrink-0 w-24 text-right"
                    style={mono}
                  >
                    {r.label}
                  </span>
                  <div className="flex-1 relative h-6">
                    <div
                      className="absolute inset-0 rounded"
                      style={{ background: r.color, opacity: 0.06 }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ background: r.color, opacity: 0.4 }}
                      initial={{ width: 0 }}
                      animate={
                        inView
                          ? { width: `${r.maxWidth}%` }
                          : { width: 0 }
                      }
                      transition={{
                        delay: si * 0.3 + ri * 0.12,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold w-12 shrink-0"
                    style={{
                      ...mono,
                      color: r.color,
                    }}
                  >
                    {inView ? (
                      <AnimatedNumber
                        value={r.value}
                        format={(n) => n.toFixed(1) + "%"}
                      />
                    ) : (
                      "0.0%"
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// WeekDistributionExample
// ────────────────────────────────────

function WeekDistributionExample() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const days = [
    { day: "Mon", type: "Easy", zone: 1, dur: 50 },
    { day: "Tue", type: "Intervals", zone: 3, dur: 55 },
    { day: "Wed", type: "Easy", zone: 1, dur: 45 },
    { day: "Thu", type: "Easy", zone: 1, dur: 50 },
    { day: "Fri", type: "Rest", zone: 0, dur: 0 },
    { day: "Sat", type: "Long Run", zone: 1, dur: 90 },
    { day: "Sun", type: "Tempo / VO2", zone: 3, dur: 50 },
  ];

  const zoneColor = (z: number) => {
    if (z === 1) return ZONE1;
    if (z === 3) return ZONE3;
    return "var(--muted-foreground)";
  };

  return (
    <Figure caption="A sample polarized training week. 5 easy sessions, 2 hard sessions, zero moderate — achieving roughly an 80/20 split by time.">
      <div ref={ref} className="space-y-1.5">
        {days.map((d, i) => (
          <motion.div
            key={d.day}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={
              inView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -8 }
            }
            transition={{
              delay: i * 0.07,
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            <span
              className="text-[10px] w-8 text-right text-muted-foreground"
              style={mono}
            >
              {d.day}
            </span>
            <div className="flex-1 relative h-6 rounded overflow-hidden">
              {d.dur > 0 ? (
                <>
                  <div
                    className="absolute inset-0 rounded"
                    style={{
                      background: zoneColor(d.zone),
                      opacity: 0.06,
                    }}
                  />
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded flex items-center px-2"
                    style={{
                      background: zoneColor(d.zone),
                      opacity: 0.3,
                    }}
                    initial={{ width: 0 }}
                    animate={
                      inView
                        ? { width: `${(d.dur / 90) * 100}%` }
                        : { width: 0 }
                    }
                    transition={{
                      delay: i * 0.07 + 0.15,
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                  <span
                    className="absolute inset-y-0 left-2 flex items-center text-[10px]"
                    style={{
                      ...mono,
                      color: "var(--foreground)",
                    }}
                  >
                    {d.type} · {d.dur}min
                  </span>
                </>
              ) : (
                <span
                  className="absolute inset-y-0 left-2 flex items-center text-[10px]"
                  style={{
                    ...mono,
                    color: "var(--muted-foreground)",
                    opacity: 0.5,
                  }}
                >
                  Rest
                </span>
              )}
            </div>
            {d.zone > 0 && (
              <span
                className="text-[10px] w-10 shrink-0"
                style={{
                  ...mono,
                  color: zoneColor(d.zone),
                }}
              >
                Z{d.zone}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// Main Article Export
// ────────────────────────────────────

export function PolarizedArticle() {
  return (
    <ArticleLayout
      title="Polarized 80/20"
      subtitle="Train slow to race fast. The research-backed case for spending 80% of your time easy and 20% genuinely hard — with almost nothing in between."
      accentColor={ZONE3}
    >
      {/* ── Origin ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Intensity Distribution Question
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            In the early 2000s, Norwegian sport scientist{" "}
            <strong>Stephen Seiler</strong> posed a deceptively simple
            question: how do the world&apos;s best endurance athletes
            actually distribute their training intensity? Not what coaches
            prescribe on paper, but what the athletes themselves record in
            training diaries year after year.
          </p>
          <p className="text-muted leading-relaxed">
            His answer, built from retrospective analyses of elite
            cross-country skiers, rowers, cyclists, and distance runners,
            was remarkably consistent. Across sports and decades,
            successful endurance athletes spent roughly 80% of their
            training sessions at low intensity, about 20% at high
            intensity, and surprisingly little in the moderate zone between
            the two. Seiler called this a{" "}
            <strong>polarized intensity distribution</strong>.
          </p>
          <p className="text-muted leading-relaxed">
            The finding was counter-intuitive. Conventional wisdom held
            that moderate-intensity work — tempo runs, lactate threshold
            sessions, &quot;comfortably hard&quot; efforts — should form
            the backbone of a training program. But the data told a
            different story. The athletes who performed at the highest
            levels were not the ones grinding in the middle zone. They
            were the ones who kept their easy days genuinely easy and their
            hard days genuinely hard.
          </p>
        </div>
      </section>

      <SectionDivider text="THE THREE-ZONE MODEL" />

      {/* ── Physiological Basis ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Lactate Thresholds and the Gray Zone
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The polarized model is built on a three-zone framework defined
            by two physiological landmarks: the first lactate threshold
            (LT1) and the second lactate threshold (LT2). LT1 marks the
            intensity where blood lactate first begins to rise above
            baseline — typically around 2 mmol/L. LT2 (often called OBLA,
            onset of blood lactate accumulation) is where lactate rises
            sharply and sustainably clearing it becomes impossible —
            typically around 4 mmol/L.
          </p>
        </div>

        <ThreeZoneModel />

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            <strong>Zone 1</strong> (below LT1) is genuinely easy. You can
            hold a full conversation. Perceived exertion is low. This is
            the domain of easy runs, recovery runs, and the bulk of long
            runs. Physiologically, you are primarily burning fat, building
            mitochondrial density, strengthening connective tissue, and
            developing your aerobic base without accumulating significant
            fatigue.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Zone 3</strong> (above LT2) is genuinely hard.
            Conversation is impossible. These are interval sessions, VO2max
            work, race-pace efforts, and hard tempo runs above threshold.
            They drive adaptations in VO2max, lactate clearance, running
            economy, and neuromuscular power — but at a high fatigue cost.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Zone 2</strong> (between LT1 and LT2) is the
            &quot;gray zone&quot; — and it is the crux of the polarized
            argument. Training here is too hard to allow full recovery, but
            too easy to produce the potent stimulus of Zone 3 work. It
            generates significant fatigue without proportional adaptation.
            Seiler&apos;s research suggests that athletes who spend too
            much time in this zone end up chronically fatigued, which
            degrades the quality of their hard sessions and limits their
            overall development.
          </p>
        </div>
      </section>

      <SectionDivider text="MODEL COMPARISON" />

      {/* ── Comparing Models ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Polarized vs. Threshold vs. Pyramidal
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Three broad training models describe how athletes distribute
            time across intensity zones. The{" "}
            <strong>threshold-heavy</strong> model loads Zone 2, on the
            premise that working near lactate threshold is the most
            specific stimulus for endurance performance. The{" "}
            <strong>pyramidal</strong> model places the most time in Zone 1
            with progressively less in Zone 2 and Zone 3 — a more moderate
            approach. The <strong>polarized</strong> model eliminates Zone
            2 almost entirely, concentrating hard work exclusively above
            LT2.
          </p>
        </div>

        <IntensityDistributionComparison />

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The visual distinction is clear: the polarized bar has a gap
            in the middle. In practice, this means that on easy days, a
            polarized runner is going meaningfully slower than a
            threshold-trained runner. And on hard days, they are going
            meaningfully faster. The overall weekly volume may be similar,
            but the character of the training is fundamentally different.
          </p>
          <p className="text-muted leading-relaxed">
            This is not to say that all Zone 2 work is harmful. Brief
            passages through the moderate zone are inevitable in long runs,
            tempo work, and warmups. The polarized principle is about
            deliberate distribution: do not design sessions whose primary
            purpose is to sit in the gray zone. Either go easy enough to
            recover, or hard enough to drive a potent stimulus.
          </p>
        </div>
      </section>

      <SectionDivider text="THE RESEARCH" />

      {/* ── Research Evidence ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          What the Studies Show
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            In a landmark 2007 study, <strong>Esteve-Lanao et al.</strong>{" "}
            divided sub-elite distance runners into two groups: one
            followed a polarized distribution (about 80% Zone 1, 20%
            Zone 3), while the other followed a threshold-heavy
            distribution (about 65% Zone 1, 25% Zone 2, 10% Zone 3). Both
            groups trained the same total volume over five months. The
            polarized group improved their 10K cross-country time by
            approximately 5.0%, while the threshold group improved by 3.6%.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>Stoggl and Sperlich (2014)</strong> conducted a
            nine-week study comparing four training models in well-trained
            endurance athletes: polarized, threshold, high-volume low-intensity,
            and high-intensity. The polarized group showed the greatest
            improvements in VO2max (6.8%), time to exhaustion, and body
            composition compared to all other groups.
          </p>
        </div>

        <ResearchResultsBars />

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Seiler&apos;s own 2010 review, published in the{" "}
            <em>International Journal of Sports Physiology and Performance</em>,
            synthesized data from multiple retrospective and prospective
            studies. The pattern was consistent: both observational data
            from elite athletes and controlled experiments with sub-elite
            athletes supported the polarized distribution. The review
            proposed that the 80/20 split was not merely a description of
            what elites do, but a prescriptive guideline for how endurance
            athletes at all levels should structure their training.
          </p>
          <p className="text-muted leading-relaxed">
            Subsequent work by <strong>Neal et al. (2013)</strong> in
            trained cyclists found that six weeks of polarized training
            produced greater improvements in peak power output, lactate
            threshold power, and high-intensity exercise capacity compared
            to a threshold-focused block — even when total training load
            was matched.
          </p>
        </div>
      </section>

      <SectionDivider text="SEILER'S HIERARCHY" />

      {/* ── Hierarchy ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Training Hierarchy
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            Seiler proposed a hierarchy of training priorities that puts
            intensity distribution in context. The foundation is{" "}
            <strong>frequency</strong> — how many sessions per week. Next
            is <strong>duration</strong> — how long each session lasts.
            Only then does <strong>intensity distribution</strong> matter.
            And at the top — the most over-optimized and least impactful
            variable — is <strong>interval design</strong> (the specific
            structure of work and rest periods).
          </p>
          <p className="text-muted leading-relaxed">
            The hierarchy is a corrective. Runners tend to obsess over
            interval structures (4x4 min vs. 6x3 min vs. 8x2 min) while
            neglecting the basics: are you running enough days per week? Is
            your long run actually long? And — the polarized question — are
            you spending 80% of your time truly easy? Get those right, and
            the interval details will fall into place.
          </p>
        </div>

        <SeilerHierarchyPyramid />
      </section>

      <SectionDivider text="IMPLEMENTATION" />

      {/* ── Practical Application ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Putting 80/20 Into Practice
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The 80/20 ratio is typically measured by{" "}
            <strong>time in zone</strong> or{" "}
            <strong>session count</strong>. For a runner training five days
            a week, 80/20 by session means four easy days and one hard day.
            In practice, most implementations use six to seven days with
            two hard sessions and the remainder easy — which lands close to
            70-80% easy by session count and 80%+ easy by time, since easy
            runs are often longer.
          </p>
        </div>

        <WeekDistributionExample />

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            <strong>What counts as &quot;easy&quot;:</strong> Zone 1
            running should feel conversational. Heart rate typically stays
            below 75-80% of maximum. For many runners, this means running
            1-2 minutes per mile slower than marathon pace. The most common
            error is running easy days too fast — turning them into gray
            zone sessions that accumulate fatigue without meaningful
            stimulus.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>What counts as &quot;hard&quot;:</strong> Zone 3
            sessions include classic VO2max intervals (e.g., 5x1000m at
            3K-5K pace), race-pace tempo runs (at or above LT2), and
            repetition work. The key distinction is that these sessions
            should be above LT2 during the work portions — genuinely
            uncomfortable, not merely &quot;brisk.&quot; If you can chat
            during the interval, it is not Zone 3.
          </p>
          <p className="text-muted leading-relaxed">
            <strong>The guardrail principle:</strong> Matt Fitzgerald,
            who popularized the 80/20 concept for recreational runners in
            his book <em>80/20 Running</em>, describes the ratio as a
            guardrail rather than a rigid prescription. The exact split may
            vary between 75/25 and 85/15 depending on the training phase,
            the athlete&apos;s experience, and the event distance. The
            principle is directional: most runners do too much moderate
            work and not enough truly easy running. Tracking your intensity
            distribution and pulling it toward polarized is almost always
            an improvement.
          </p>
        </div>
      </section>

      <SectionDivider text="WHY IT WORKS" />

      {/* ── Mechanism ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          The Underlying Mechanism
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The physiological argument for polarized training rests on a
            few key mechanisms. First,{" "}
            <strong>recovery quality</strong>: Zone 1 running is low enough
            in stress that it enhances recovery rather than impeding it.
            This means the athlete arrives at their Zone 3 sessions
            genuinely fresh, able to hit higher paces and sustain them
            longer — producing a more potent training stimulus.
          </p>
          <p className="text-muted leading-relaxed">
            Second, <strong>peripheral adaptation</strong>: high volume
            of easy running drives mitochondrial biogenesis, capillary
            density, and fat oxidation capacity. These are the structural
            adaptations that form the aerobic foundation. They require time
            — many hours of gentle stress — not intensity.
          </p>
          <p className="text-muted leading-relaxed">
            Third, <strong>central adaptation</strong>: Zone 3 work drives
            stroke volume improvements, VO2max ceiling expansion, and
            neuromuscular recruitment patterns that cannot be achieved at
            lower intensities. These adaptations require a high stimulus
            and tolerate low volume.
          </p>
          <p className="text-muted leading-relaxed">
            The gray zone fails on both counts. It does not provide enough
            stress to drive central adaptations, and it generates too much
            fatigue to allow the training volume needed for peripheral
            adaptations. It is the worst of both worlds — meaningful
            fatigue, marginal stimulus.
          </p>
        </div>
      </section>

      <SectionDivider text="CAVEATS" />

      {/* ── Nuance ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">
          Where 80/20 Has Limits
        </h2>
        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The polarized model is not without nuance. Most of the
            supporting research was conducted on already well-trained
            athletes. For true beginners, any consistent training produces
            rapid gains, and intensity distribution matters less than simply
            building the habit of running regularly.
          </p>
          <p className="text-muted leading-relaxed">
            Additionally, race-specific preparation sometimes requires
            sustained time near lactate threshold — particularly for
            half-marathon and marathon runners whose race intensity sits
            in or near Zone 2. In these cases, targeted threshold work in
            the final training block may complement the polarized base
            built earlier in the season.
          </p>
          <p className="text-muted leading-relaxed">
            The pyramidal model — which is sometimes hard to distinguish
            from a softened polarized approach — also shows strong results
            in some studies. The practical difference between 80/0/20 and
            75/15/10 may be smaller than the difference between either of
            those and a threshold-heavy plan. The core insight is the
            same: most of your running should be easy, and your hard
            sessions should be truly hard.
          </p>
        </div>
      </section>

      <SectionDivider text="SOURCES" />

      {/* ── Sources ── */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-4">Sources</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Seiler, S. (2010). &quot;What is best practice for training
            intensity and duration distribution in endurance athletes?&quot;{" "}
            <em>
              International Journal of Sports Physiology and Performance
            </em>
            , 5(3), 276-291.{" "}
            <ExternalLink href="https://pubmed.ncbi.nlm.nih.gov/20861519/">
              PubMed 20861519
            </ExternalLink>
          </p>
          <p>
            Esteve-Lanao, J., Foster, C., Seiler, S., & Lucia, A. (2007).
            &quot;Impact of training intensity distribution on performance in
            endurance athletes.&quot;{" "}
            <em>Journal of Strength and Conditioning Research</em>, 21(3),
            943-949.
          </p>
          <p>
            Stoggl, T. L., & Sperlich, B. (2014). &quot;Polarized training
            has greater impact on key endurance variables than threshold,
            high intensity, or high volume training.&quot;{" "}
            <em>Frontiers in Physiology</em>, 5, 33.
          </p>
          <p>
            Neal, C. M., et al. (2013). &quot;Six weeks of a polarized
            training-intensity distribution leads to greater physiological
            and performance adaptations than a threshold model in trained
            cyclists.&quot;{" "}
            <em>Journal of Applied Physiology</em>, 114(4), 461-471.
          </p>
          <p>
            Fitzgerald, M. (2014).{" "}
            <em>80/20 Running: Run Stronger and Race Faster by Training Slower</em>.
            Penguin Books.
          </p>
          <p>
            Seiler, S., & Kjerland, G. O. (2006). &quot;Quantifying training
            intensity distribution in elite endurance athletes: is there
            evidence for an optimal distribution?&quot;{" "}
            <em>Scandinavian Journal of Medicine & Science in Sports</em>,
            16(1), 49-56.
          </p>
        </div>
      </section>
    </ArticleLayout>
  );
}
