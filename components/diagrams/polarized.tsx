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

const ZONE1 = "var(--accent)"; // blue — easy aerobic
const ZONE2 = "#f59e0b"; // amber — "gray zone"
const ZONE3 = "#ef4444"; // red — high intensity

// ────────────────────────────────────
// IntensityDistributionComparison
// ────────────────────────────────────

export function IntensityDistributionComparison() {
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

export function ThreeZoneModel() {
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

export function SeilerHierarchyPyramid() {
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

export function ResearchResultsBars() {
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

export function WeekDistributionExample() {
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
