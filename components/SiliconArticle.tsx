"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  motion,
  useInView,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";

const mono = {
  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
};

// ────────────────────────────────────
// Shared
// ────────────────────────────────────

function Figure({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption?: string;
}) {
  return (
    <figure className="my-10">
      <div className="rounded-lg border border-border p-6">{children}</div>
      {caption && (
        <figcaption className="mt-2.5 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function AnimatedNumber({
  value,
  duration = 1.2,
  format,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => {
    if (format) return format(v);
    return Math.round(v).toLocaleString();
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, value, { duration, ease: "easeOut" });
    return controls.stop;
  }, [inView, value, duration, motionVal]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

/** 3D block helper for isometric-inspired chip stacks */
function Block3D({
  x,
  y,
  w,
  h,
  depth = 10,
  fill,
  stroke,
  frontOpacity = 1,
  topOpacity,
  sideOpacity,
  rx = 0,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  depth?: number;
  fill: string;
  stroke?: string;
  frontOpacity?: number;
  topOpacity?: number;
  sideOpacity?: number;
  rx?: number;
}) {
  const dx = depth * 0.7;
  const dy = depth * 0.5;
  const tOp = topOpacity ?? frontOpacity * 0.7;
  const sOp = sideOpacity ?? frontOpacity * 0.45;
  return (
    <g>
      {/* Front face */}
      <rect
        x={x} y={y} width={w} height={h} rx={rx}
        fill={fill} stroke={stroke} strokeWidth={stroke ? 0.5 : 0}
        opacity={frontOpacity}
      />
      {/* Top face */}
      <path
        d={`M${x + rx},${y} L${x + dx + rx},${y - dy} L${x + w + dx - rx},${y - dy} L${x + w - rx},${y} Z`}
        fill={fill} opacity={tOp}
      />
      {/* Right face */}
      <path
        d={`M${x + w},${y + rx} L${x + w + dx},${y - dy + rx} L${x + w + dx},${y + h - dy - rx} L${x + w},${y + h - rx} Z`}
        fill={fill} opacity={sOp}
      />
    </g>
  );
}

// ────────────────────────────────────
// Diagrams
// ────────────────────────────────────

function MemoryWallDiagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Figure caption="On-chip SRAM is 100× faster than off-chip DRAM, but thousands of times less dense.">
      <svg ref={ref} viewBox="0 0 560 230" className="w-full">
        {/* COMPUTE box */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <rect x="10" y="20" width="140" height="90" rx="6" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.7" />
          <text x="80" y="55" textAnchor="middle" fontSize="13" fontWeight="600" style={{ ...mono, fill: "var(--foreground)" }}>COMPUTE</text>
          <text x="80" y="78" textAnchor="middle" fontSize="10" style={{ ...mono, fill: "var(--muted-foreground)" }}>SRAM · ~1ns</text>
        </motion.g>

        {/* MEMORY box */}
        <motion.g
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <rect x="410" y="20" width="140" height="90" rx="6" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" opacity="0.4" />
          <text x="480" y="55" textAnchor="middle" fontSize="13" fontWeight="600" style={{ ...mono, fill: "var(--foreground)" }}>MEMORY</text>
          <text x="480" y="78" textAnchor="middle" fontSize="10" style={{ ...mono, fill: "var(--muted-foreground)" }}>DRAM · ~100ns</text>
        </motion.g>

        {/* Bottleneck label */}
        <motion.text
          x="280" y="38" textAnchor="middle" fontSize="9" letterSpacing="0.05em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 0.7, 0.4, 0.7], transition: { delay: 0.5, duration: 3, repeat: Infinity, repeatType: "reverse" as const } } : {}}
        >
          BANDWIDTH BOTTLENECK
        </motion.text>

        {/* Data lines */}
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4, duration: 0.4 }}>
          <line x1="150" y1="58" x2="410" y2="58" stroke="var(--border)" strokeWidth="0.5" />
          <line x1="150" y1="72" x2="410" y2="72" stroke="var(--border)" strokeWidth="0.5" />
        </motion.g>

        {/* Animated dots with glow */}
        {inView && [0, 0.7, 1.4, 2.1].map((delay, i) => (
          <motion.g key={i}>
            <motion.circle r="6" fill="var(--accent)" opacity={0}
              initial={{ cx: 410, cy: 65 }}
              animate={{ cx: [410, 150], opacity: [0, 0.15, 0] }}
              transition={{ duration: 2.5, delay: 0.6 + delay, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle r="3" fill="var(--accent)" opacity={0.8 - i * 0.15}
              initial={{ cx: 410, cy: 65 }}
              animate={{ cx: [410, 150] }}
              transition={{ duration: 2.5, delay: 0.6 + delay, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>
        ))}

        {/* Latency section */}
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6, duration: 0.4 }}>
          <text x="10" y="145" fontSize="9" letterSpacing="0.05em" style={{ ...mono, fill: "var(--muted-foreground)" }}>ACCESS LATENCY</text>
          <rect x="10" y="158" width="5" height="16" rx="2" fill="var(--accent)" />
          <text x="24" y="171" fontSize="11" style={{ ...mono, fill: "var(--foreground)" }}>SRAM ~1ns</text>
        </motion.g>

        <motion.rect x="10" y="186" height="16" rx="2" fill="var(--muted-foreground)" opacity="0.15"
          initial={{ width: 0 }} animate={inView ? { width: 500 } : { width: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
        />
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.9, duration: 0.4 }}>
          <text x="24" y="199" fontSize="11" style={{ ...mono, fill: "var(--foreground)" }}>DRAM ~100ns</text>
        </motion.g>
        <motion.text x="520" y="199" textAnchor="end" fontSize="10" fontWeight="600"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 2.0, duration: 0.5 }}
        >
          100×
        </motion.text>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// NEW: Compute-in-Memory Cell
// ────────────────────────────────────

function ComputeInMemoryCell() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const stages = [
    { label: "DRAM CELL", sub: "weight stored", y: 10, h: 48 },
    { label: "DATA BUS", sub: "transfer", y: 88, h: 32 },
    { label: "L2 CACHE", sub: "cached copy", y: 148, h: 32 },
    { label: "ALU", sub: "0.73 × 1.2 = 0.88", y: 210, h: 45, accent: true },
  ];

  const latencyLabels = [
    { text: "~100ns read", y: 68 },
    { text: "transfer", y: 130 },
    { text: "load", y: 192 },
    { text: "~100ns write back", y: 268 },
  ];

  return (
    <Figure caption="In a traditional system, data travels through 4 stages for one multiply. In compute-in-memory, the multiply happens where the weight is stored.">
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* ── Traditional side ── */}
        <div>
          <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
            Traditional: Read → Move → Compute
          </div>
          <svg viewBox="0 0 240 310" className="w-full">
            {/* Stages */}
            {stages.map((s, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
              >
                <rect
                  x="40" y={s.y} width="160" height={s.h} rx="4"
                  fill={s.accent ? "var(--accent)" : "var(--muted-foreground)"}
                  opacity={s.accent ? 0.08 : 0.04}
                  stroke={s.accent ? "var(--accent)" : "var(--border)"}
                  strokeWidth={s.accent ? 1 : 0.5}
                />
                <text
                  x="120" y={s.y + (s.h < 40 ? 18 : 22)} textAnchor="middle"
                  fontSize="10" fontWeight="600"
                  style={{ ...mono, fill: s.accent ? "var(--accent)" : "var(--foreground)" }}
                >
                  {s.label}
                </text>
                {s.sub && (
                  <text
                    x="120" y={s.y + (s.h < 40 ? 28 : 38)} textAnchor="middle"
                    fontSize="8" style={{ ...mono, fill: "var(--muted-foreground)" }}
                  >
                    {s.sub}
                  </text>
                )}
                {/* Capacitor symbol inside DRAM cell */}
                {i === 0 && (
                  <g opacity="0.5">
                    <line x1="180" y1={s.y + 14} x2="180" y2={s.y + 22} stroke="var(--foreground)" strokeWidth="1.5" />
                    <line x1="174" y1={s.y + 22} x2="186" y2={s.y + 22} stroke="var(--foreground)" strokeWidth="2" />
                    <line x1="174" y1={s.y + 27} x2="186" y2={s.y + 27} stroke="var(--foreground)" strokeWidth="2" />
                    <line x1="180" y1={s.y + 27} x2="180" y2={s.y + 35} stroke="var(--foreground)" strokeWidth="1.5" />
                    <text x="180" y={s.y + 46} textAnchor="middle" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}>0.73</text>
                  </g>
                )}
              </motion.g>
            ))}

            {/* Connecting dashed arrows with latency labels */}
            {latencyLabels.map((l, i) => (
              <motion.g
                key={`arr-${i}`}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
              >
                <line
                  x1="120" y1={l.y - 8} x2="120" y2={l.y + 8}
                  stroke="var(--border)" strokeWidth="0.75" strokeDasharray="3 2"
                />
                <text x="164" y={l.y + 3} fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}>{l.text}</text>
              </motion.g>
            ))}

            {/* Animated dot flowing through entire path */}
            {inView && (
              <motion.circle r="3" fill="var(--muted-foreground)"
                cx={120}
                animate={{
                  cy: [34, 68, 88, 130, 148, 192, 232, 268, 290],
                  opacity: [0.5, 0.4, 0.5, 0.4, 0.5, 0.4, 0.5, 0.3, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.8 }}
              />
            )}

            {/* Summary */}
            <motion.text
              x="120" y="298" textAnchor="middle" fontSize="8" fontWeight="600"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.7 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              ~200ns per multiply · 4 hops
            </motion.text>
          </svg>
        </div>

        {/* ── CIM side ── */}
        <div>
          <div className="text-xs text-accent mb-3 font-medium uppercase tracking-wider">
            CIM: Multiply in Place
          </div>
          <svg viewBox="0 0 240 310" className="w-full">
            {/* Word-line label + arrow entering from left */}
            <motion.g
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <text x="8" y="73" fontSize="7" style={{ ...mono, fill: "var(--accent)" }}>word-line</text>
              <text x="8" y="86" fontSize="9" fontWeight="600" style={{ ...mono, fill: "var(--foreground)" }}>input: 1.2</text>
              <line x1="5" y1="95" x2="35" y2="95" stroke="var(--accent)" strokeWidth="1" markerEnd="url(#arrow)" />
            </motion.g>

            {/* Arrowhead def */}
            <defs>
              <marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)" />
              </marker>
            </defs>

            {/* The single CIM cell — large box */}
            <motion.g
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            >
              <rect
                x="35" y="20" width="175" height="220" rx="6"
                fill="var(--accent)" opacity="0.04"
                stroke="var(--accent)" strokeWidth="1"
              />
              <text
                x="122" y="14" textAnchor="middle" fontSize="8" letterSpacing="0.05em"
                style={{ ...mono, fill: "var(--accent)" }}
              >
                SINGLE MEMORY CELL
              </text>
            </motion.g>

            {/* Ambient glow on cell */}
            {inView && (
              <motion.rect
                x="35" y="20" width="175" height="220" rx="6"
                fill="var(--accent)"
                animate={{ opacity: [0, 0.06, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Transistor symbol (simplified) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {/* Gate (word-line input) */}
              <line x1="35" y1="95" x2="90" y2="95" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
              {/* Transistor body */}
              <rect x="90" y="82" width="28" height="26" rx="3" fill="var(--accent)" opacity="0.12" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="104" y="98" textAnchor="middle" fontSize="7" fontWeight="600" style={{ ...mono, fill: "var(--accent)" }}>T</text>
              {/* Source/drain lines */}
              <line x1="104" y1="72" x2="104" y2="82" stroke="var(--foreground)" strokeWidth="1" opacity="0.5" />
              <line x1="104" y1="108" x2="104" y2="120" stroke="var(--foreground)" strokeWidth="1" opacity="0.5" />
            </motion.g>

            {/* Capacitor (stores weight) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              <line x1="104" y1="120" x2="104" y2="128" stroke="var(--foreground)" strokeWidth="1.5" opacity="0.6" />
              <line x1="92" y1="128" x2="116" y2="128" stroke="var(--foreground)" strokeWidth="2.5" opacity="0.6" />
              <line x1="92" y1="136" x2="116" y2="136" stroke="var(--foreground)" strokeWidth="2.5" opacity="0.6" />
              <line x1="104" y1="136" x2="104" y2="144" stroke="var(--foreground)" strokeWidth="1.5" opacity="0.6" />
              <text x="138" y="128" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>weight</text>
              <text x="138" y="142" fontSize="10" fontWeight="600" style={{ ...mono, fill: "var(--accent)" }}>0.73</text>
              <text x="138" y="155" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}>stored in</text>
              <text x="138" y="165" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}>capacitor</text>
            </motion.g>

            {/* Capacitor glow when "computing" */}
            {inView && (
              <motion.rect
                x="88" y="124" width="32" height="16" rx="2"
                fill="var(--accent)"
                animate={{ opacity: [0, 0.25, 0] }}
                transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
              />
            )}

            {/* Multiply symbol */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <text x="104" y="170" textAnchor="middle" fontSize="14" fontWeight="700" style={{ fill: "var(--accent)" }}>×</text>
              <text x="140" y="180" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}>analog multiply</text>
            </motion.g>

            {/* Result */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.85, duration: 0.4 }}
            >
              <text x="104" y="205" textAnchor="middle" fontSize="12" fontWeight="600" style={{ ...mono, fill: "var(--accent)" }}>= 0.88</text>
              <text x="104" y="222" textAnchor="middle" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}>current on bit-line</text>
            </motion.g>

            {/* Bit-line output going down */}
            <motion.g
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.95, duration: 0.4 }}
            >
              <line x1="104" y1="240" x2="104" y2="268" stroke="var(--accent)" strokeWidth="1" />
              <text x="130" y="258" fontSize="7" style={{ ...mono, fill: "var(--accent)" }}>bit-line</text>
              <text x="130" y="270" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>→ next cell</text>
            </motion.g>

            {/* Animated dot: input arrives, flows through, exits */}
            {inView && (
              <motion.circle r="3" fill="var(--accent)"
                animate={{
                  cx: [5, 35, 90, 104, 104, 104, 104],
                  cy: [95, 95, 95, 95, 150, 220, 268],
                  opacity: [0.6, 0.8, 0.8, 0.8, 0.6, 0.4, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
            )}

            {/* Summary */}
            <motion.text
              x="122" y="295" textAnchor="middle" fontSize="8" fontWeight="600"
              style={{ ...mono, fill: "var(--accent)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.9 } : {}}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              ~1ns · zero data movement
            </motion.text>
          </svg>
        </div>
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// Architecture Comparison (enhanced)
// ────────────────────────────────────

function ArchitectureComparison() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  // Weight values for the Taalas grid
  const gridWeights = [
    [0.3, 0.7, 0.1, 0.5],
    [0.8, 0.2, 0.6, 0.4],
    [0.5, 0.9, 0.3, 0.7],
  ];

  // Taalas grid cell dimensions
  const tCellW = 44;
  const tCellH = 30;
  const tGridX = 22;
  const tGridY = 50;

  return (
    <Figure caption="Traditional chips shuttle data between separate memory and compute through a narrow bus. Taalas processes data where it's stored—each cell holds a weight AND computes.">
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* ── Traditional side ── */}
        <div>
          <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
            Traditional GPU
          </div>
          <svg viewBox="0 0 240 320" className="w-full">
            {/* ── HBM Memory banks ── */}
            <motion.g
              initial={{ opacity: 0, y: -6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <text x="120" y="14" textAnchor="middle" fontSize="8" letterSpacing="0.06em"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.6 }}>
                HBM MEMORY
              </text>
              {/* 4 memory bank blocks with weight values inside */}
              {[0, 1, 2, 3].map((i) => {
                const bx = 16 + i * 54;
                return (
                  <motion.g key={`mem-${i}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.3 }}
                  >
                    <rect x={bx} y="22" width="48" height="46" rx="3"
                      fill="var(--muted-foreground)" opacity="0.05"
                      stroke="var(--muted-foreground)" strokeWidth="0.5" />
                    {/* Mini weight rows inside each bank */}
                    {[0, 1, 2].map((r) => (
                      <text key={r} x={bx + 24} y={35 + r * 12} textAnchor="middle" fontSize="6.5"
                        style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.4 }}>
                        {(0.1 + i * 0.2 + r * 0.15).toFixed(1)} {(0.3 + i * 0.1 + r * 0.2).toFixed(1)}
                      </text>
                    ))}
                    <text x={bx + 24} y="62" textAnchor="middle" fontSize="5"
                      style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.3 }}>
                      weights
                    </text>
                  </motion.g>
                );
              })}
            </motion.g>

            {/* ── Bandwidth bottleneck bus ── */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {/* Bus pipes */}
              <rect x="60" y="78" width="120" height="28" rx="4"
                fill="var(--muted-foreground)" opacity="0.03"
                stroke="var(--muted-foreground)" strokeWidth="0.75" strokeDasharray="4 3" />
              {/* Narrow lane lines inside bus */}
              {[0, 1, 2].map((i) => (
                <line key={i} x1="68" y1={84 + i * 7} x2="172" y2={84 + i * 7}
                  stroke="var(--muted-foreground)" strokeWidth="0.3" opacity="0.2" />
              ))}
              <text x="120" y="93" textAnchor="middle" fontSize="6.5" fontWeight="600"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.5 }}>
                BANDWIDTH BUS
              </text>
              {/* Bottleneck pinch markers */}
              <text x="48" y="96" textAnchor="end" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.35 }}>
                narrow
              </text>
              <text x="192" y="96" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.35 }}>
                narrow
              </text>
            </motion.g>

            {/* Connecting lines from memory to bus */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              {[40, 94, 148, 202].map((x, i) => (
                <line key={i} x1={x} y1="68" x2={Math.min(Math.max(x, 70), 170)} y2="78"
                  stroke="var(--muted-foreground)" strokeWidth="0.5" opacity="0.25" strokeDasharray="2 2" />
              ))}
            </motion.g>

            {/* Connecting lines from bus to compute */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              {[85, 120, 155].map((x, i) => (
                <line key={i} x1={x} y1="106" x2={x} y2="118"
                  stroke="var(--muted-foreground)" strokeWidth="0.5" opacity="0.25" strokeDasharray="2 2" />
              ))}
            </motion.g>

            {/* ── Compute cores ── */}
            <motion.g
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <text x="120" y="130" textAnchor="middle" fontSize="8" letterSpacing="0.06em"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.6 }}>
                GPU COMPUTE CORES
              </text>
              {/* Grid of cores — most faded (idle), few highlighted (active) */}
              {Array.from({ length: 3 }).map((_, row) =>
                Array.from({ length: 6 }).map((_, col) => {
                  const cx = 22 + col * 34;
                  const cy = 140 + row * 28;
                  const isActive = (row === 0 && col < 2) || (row === 1 && col === 0);
                  return (
                    <motion.g key={`core-${row}-${col}`}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.45 + row * 0.05 + col * 0.02, duration: 0.3 }}
                    >
                      <rect x={cx} y={cy} width="28" height="20" rx="2"
                        fill={isActive ? "var(--accent)" : "var(--muted-foreground)"}
                        opacity={isActive ? 0.15 : 0.04}
                        stroke={isActive ? "var(--accent)" : "var(--border)"}
                        strokeWidth={isActive ? 0.75 : 0.3}
                      />
                      <text x={cx + 14} y={cy + 13} textAnchor="middle" fontSize="5.5"
                        style={{ ...mono, fill: isActive ? "var(--accent)" : "var(--muted-foreground)", opacity: isActive ? 0.7 : 0.2 }}>
                        {isActive ? "busy" : "idle"}
                      </text>
                    </motion.g>
                  );
                })
              )}
            </motion.g>

            {/* Animated data packets through bus (slow, showing bottleneck) */}
            {inView && [0, 1.2, 2.4].map((delay, i) => (
              <motion.g key={`pkt-${i}`}>
                {/* Glow */}
                <motion.rect width="14" height="5" rx="2" fill="var(--muted-foreground)"
                  animate={{
                    x: [65, 165],
                    y: [83 + i * 6, 83 + i * 6],
                    opacity: [0, 0.15, 0.15, 0],
                  }}
                  transition={{ duration: 3, delay: 0.6 + delay, repeat: Infinity, ease: "linear" }}
                />
                {/* Packet */}
                <motion.rect width="10" height="3" rx="1.5" fill="var(--muted-foreground)"
                  animate={{
                    x: [66, 166],
                    y: [84 + i * 6, 84 + i * 6],
                    opacity: [0, 0.5, 0.5, 0],
                  }}
                  transition={{ duration: 3, delay: 0.6 + delay, repeat: Infinity, ease: "linear" }}
                />
              </motion.g>
            ))}

            {/* ── Utilization bar ── */}
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <text x="16" y="240" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.5 }}>
                time breakdown
              </text>
              {/* Background bar */}
              <rect x="16" y="246" width="208" height="10" rx="2"
                fill="var(--muted-foreground)" opacity="0.06" />
              {/* Waiting portion (large) */}
              <motion.rect x="16" y="246" height="10" rx="2"
                fill="var(--muted-foreground)" opacity="0.12"
                initial={{ width: 0 }}
                animate={inView ? { width: 170 } : { width: 0 }}
                transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
              />
              {/* Computing portion (small, accent) */}
              <motion.rect y="246" height="10" rx="2"
                fill="var(--accent)" opacity="0.25"
                initial={{ x: 186, width: 0 }}
                animate={inView ? { x: 186, width: 38 } : { x: 186, width: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              />
              <motion.text x="100" y="254" textAnchor="middle" fontSize="5.5"
                style={{ ...mono, fill: "var(--muted-foreground)" }}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 0.5 } : {}}
                transition={{ delay: 1.5, duration: 0.3 }}>
                ~80% waiting for data
              </motion.text>
              <motion.text x="205" y="254" textAnchor="middle" fontSize="5.5"
                style={{ ...mono, fill: "var(--accent)" }}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 0.6 } : {}}
                transition={{ delay: 1.6, duration: 0.3 }}>
                math
              </motion.text>
            </motion.g>

            {/* Summary */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <text x="120" y="280" textAnchor="middle" fontSize="8"
                style={{ ...mono, fill: "var(--muted-foreground)" }}>
                data moves constantly
              </text>
              <text x="120" y="293" textAnchor="middle" fontSize="7"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.5 }}>
                most cores sit idle, waiting for weights
              </text>
            </motion.g>
          </svg>
        </div>

        {/* ── Taalas CIM side ── */}
        <div>
          <div className="text-xs text-accent mb-3 font-medium uppercase tracking-wider">
            Taalas CIM
          </div>
          <svg viewBox="0 0 240 320" className="w-full">
            {/* Title */}
            <motion.text x="120" y="14" textAnchor="middle" fontSize="8" letterSpacing="0.06em"
              style={{ ...mono, fill: "var(--accent)", opacity: 0.6 }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.6 } : {}}
              transition={{ delay: 0.2, duration: 0.3 }}>
              MEMORY ARRAY = COMPUTE ENGINE
            </motion.text>

            {/* Input labels across top */}
            {["x₁", "x₂", "x₃", "x₄"].map((label, col) => (
              <motion.g key={`tin-${col}`}
                initial={{ opacity: 0, y: -5 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + col * 0.06, duration: 0.3 }}
              >
                <text x={tGridX + col * tCellW + tCellW / 2} y="30" textAnchor="middle" fontSize="8"
                  style={{ ...mono, fill: "var(--accent)" }}>
                  {label}
                </text>
                <line x1={tGridX + col * tCellW + tCellW / 2} y1="34"
                  x2={tGridX + col * tCellW + tCellW / 2} y2={tGridY}
                  stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" />
              </motion.g>
            ))}

            {/* Outer array border */}
            <motion.rect
              x={tGridX - 2} y={tGridY - 2}
              width={4 * tCellW + 4} height={3 * tCellH + 4} rx="4"
              fill="none" stroke="var(--accent)" strokeWidth="0.75" opacity="0.3"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.3 } : {}}
              transition={{ delay: 0.2, duration: 0.3 }}
            />

            {/* Grid of CIM cells — each shows weight + compute symbol */}
            {gridWeights.map((row, r) =>
              row.map((w, c) => {
                const cx = tGridX + c * tCellW;
                const cy = tGridY + r * tCellH;
                const diagDelay = (r + c) * 0.12;
                return (
                  <motion.g key={`tcell-${r}-${c}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.25 + r * 0.08 + c * 0.04, duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Cell background */}
                    <rect x={cx} y={cy} width={tCellW} height={tCellH} rx="3"
                      fill="var(--accent)" opacity="0.06"
                      stroke="var(--accent)" strokeWidth="0.4" />

                    {/* Weight value */}
                    <text x={cx + tCellW / 2} y={cy + 12} textAnchor="middle" fontSize="8"
                      style={{ ...mono, fill: "var(--foreground)" }}>
                      {w.toFixed(1)}
                    </text>

                    {/* Tiny multiply symbol — shows this cell computes */}
                    <text x={cx + tCellW / 2} y={cy + 23} textAnchor="middle" fontSize="6"
                      style={{ ...mono, fill: "var(--accent)", opacity: 0.5 }}>
                      w×x
                    </text>

                    {/* Activation glow wave */}
                    {inView && (
                      <motion.rect x={cx} y={cy} width={tCellW} height={tCellH} rx="3"
                        fill="var(--accent)"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 0.8, delay: 1.0 + diagDelay, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                      />
                    )}
                  </motion.g>
                );
              })
            )}

            {/* Output arrows and labels on the right */}
            {["y₁", "y₂", "y₃"].map((label, r) => (
              <motion.g key={`tout-${r}`}
                initial={{ opacity: 0, x: -4 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + r * 0.1, duration: 0.3 }}
              >
                <line
                  x1={tGridX + 4 * tCellW + 4} y1={tGridY + r * tCellH + tCellH / 2}
                  x2={tGridX + 4 * tCellW + 16} y2={tGridY + r * tCellH + tCellH / 2}
                  stroke="var(--accent)" strokeWidth="0.75" opacity="0.5"
                />
                <text
                  x={tGridX + 4 * tCellW + 22} y={tGridY + r * tCellH + tCellH / 2 + 3}
                  fontSize="8" style={{ ...mono, fill: "var(--accent)" }}>
                  → {label}
                </text>
              </motion.g>
            ))}

            {/* Animated input signals flowing down columns */}
            {inView && [0, 1, 2, 3].map((col) => (
              <motion.circle key={`sig-${col}`} r="2.5" fill="var(--accent)"
                animate={{
                  cx: [tGridX + col * tCellW + tCellW / 2, tGridX + col * tCellW + tCellW / 2],
                  cy: [34, tGridY + 3 * tCellH],
                  opacity: [0.6, 0],
                }}
                transition={{ duration: 1.5, delay: 0.8 + col * 0.2, repeat: Infinity, ease: "easeIn" }}
              />
            ))}

            {/* Explanatory annotation below grid */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              {/* "How one cell works" callout */}
              <rect x="16" y="156" width="208" height="72" rx="4"
                fill="var(--accent)" opacity="0.03"
                stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="4 3" />
              <text x="120" y="171" textAnchor="middle" fontSize="7" fontWeight="600"
                style={{ ...mono, fill: "var(--accent)", opacity: 0.7 }}>
                inside each cell
              </text>

              {/* Mini diagram: capacitor stores weight, transistor multiplies */}
              {/* Capacitor symbol */}
              <line x1="60" y1="182" x2="60" y2="188" stroke="var(--foreground)" strokeWidth="1" opacity="0.4" />
              <line x1="52" y1="188" x2="68" y2="188" stroke="var(--foreground)" strokeWidth="1.5" opacity="0.4" />
              <line x1="52" y1="193" x2="68" y2="193" stroke="var(--foreground)" strokeWidth="1.5" opacity="0.4" />
              <line x1="60" y1="193" x2="60" y2="200" stroke="var(--foreground)" strokeWidth="1" opacity="0.4" />
              <text x="60" y="212" textAnchor="middle" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)" }}>
                stores weight
              </text>

              {/* Plus sign */}
              <text x="105" y="196" textAnchor="middle" fontSize="10"
                style={{ fill: "var(--muted-foreground)", opacity: 0.3 }}>
                +
              </text>

              {/* Transistor symbol */}
              <rect x="132" y="182" width="16" height="16" rx="2"
                fill="var(--accent)" opacity="0.1" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="140" y="194" textAnchor="middle" fontSize="7" fontWeight="600"
                style={{ ...mono, fill: "var(--accent)" }}>
                T
              </text>
              <text x="140" y="212" textAnchor="middle" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)" }}>
                multiplies
              </text>

              {/* Equals */}
              <text x="175" y="196" textAnchor="middle" fontSize="10"
                style={{ fill: "var(--muted-foreground)", opacity: 0.3 }}>
                =
              </text>

              {/* Result */}
              <text x="200" y="196" textAnchor="middle" fontSize="7" fontWeight="600"
                style={{ ...mono, fill: "var(--accent)" }}>
                w × x
              </text>
              <text x="200" y="212" textAnchor="middle" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)" }}>
                in 1 ns
              </text>
            </motion.g>

            {/* Utilization bar — 100% active */}
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <text x="16" y="244" fontSize="7" style={{ ...mono, fill: "var(--accent)", opacity: 0.5 }}>
                time breakdown
              </text>
              <rect x="16" y="250" width="208" height="10" rx="2"
                fill="var(--accent)" opacity="0.04" />
              <motion.rect x="16" y="250" height="10" rx="2"
                fill="var(--accent)" opacity="0.25"
                initial={{ width: 0 }}
                animate={inView ? { width: 208 } : { width: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              />
              <motion.text x="120" y="258" textAnchor="middle" fontSize="5.5"
                style={{ ...mono, fill: "var(--accent)" }}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 0.7 } : {}}
                transition={{ delay: 1.6, duration: 0.3 }}>
                100% computing · zero data movement
              </motion.text>
            </motion.g>

            {/* Summary */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <text x="120" y="280" textAnchor="middle" fontSize="8"
                style={{ ...mono, fill: "var(--accent)" }}>
                compute happens where data lives
              </text>
              <text x="120" y="293" textAnchor="middle" fontSize="7"
                style={{ ...mono, fill: "var(--accent)", opacity: 0.5 }}>
                every cell stores a weight AND multiplies it
              </text>
            </motion.g>
          </svg>
        </div>
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// NEW: Matrix Multiply Array
// ────────────────────────────────────

function MatrixMultiplyArray() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  const weights = [
    [0.3, 0.7, 0.1, 0.5],
    [0.8, 0.2, 0.6, 0.4],
    [0.5, 0.9, 0.3, 0.7],
    [0.1, 0.4, 0.8, 0.2],
  ];
  const inputs = [1.0, 0.5, 0.8, 0.3];
  const outputs = [0.88, 1.50, 1.40, 1.00];

  const cellW = 58;
  const cellH = 42;
  const gridX = 86;
  const gridY = 68;

  // Repeating animation phase
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!inView) return;
    // Cycle: 0=idle, 1=inputs arrive, 2=cells activate, 3=outputs appear
    const delays = [1200, 800, 1200, 1500]; // ms per phase
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      setPhase((p) => {
        const next = (p + 1) % 4;
        setTimeout(tick, delays[next]);
        return next;
      });
    };
    const id = setTimeout(tick, delays[0]);
    return () => { mounted = false; clearTimeout(id); };
  }, [inView]);

  return (
    <Figure caption="A memory crossbar array computes matrix-vector multiplication in one cycle. Each cell stores a weight and multiplies it by the column input. Row currents sum to produce the output.">
      <svg ref={ref} viewBox="0 0 440 330" className="w-full">
        {/* "INPUT ACTIVATIONS" label */}
        <motion.text
          x={gridX + (cellW * 4) / 2} y="18" textAnchor="middle"
          fontSize="8" letterSpacing="0.1em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          INPUT ACTIVATIONS (word-lines)
        </motion.text>

        {/* Input vector labels at top */}
        {inputs.map((val, col) => (
          <motion.g key={`in-${col}`}
            initial={{ opacity: 0, y: -8 }}
            animate={inView ? { opacity: phase >= 1 ? 1 : 0.4, y: 0 } : {}}
            transition={{ delay: 0.4 + col * 0.08, duration: 0.3 }}
          >
            <text
              x={gridX + col * cellW + cellW / 2} y="36"
              textAnchor="middle" fontSize="10" fontWeight="600"
              style={{ ...mono, fill: "var(--accent)" }}
            >
              {val.toFixed(1)}
            </text>
            <text
              x={gridX + col * cellW + cellW / 2} y="48"
              textAnchor="middle" fontSize="7"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
            >
              x{col + 1}
            </text>
            {/* Vertical input arrow */}
            <motion.line
              x1={gridX + col * cellW + cellW / 2} y1="52"
              x2={gridX + col * cellW + cellW / 2} y2={gridY}
              stroke="var(--accent)" strokeWidth="0.75"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.g>
        ))}

        {/* Column activation glow (phase 1+) */}
        {inView && inputs.map((_, col) => (
          <motion.rect
            key={`col-glow-${col}`}
            x={gridX + col * cellW} y={gridY}
            width={cellW} height={cellH * 4}
            fill="var(--accent)" rx="2"
            animate={{ opacity: phase >= 1 ? 0.04 : 0 }}
            transition={{ duration: 0.4, delay: col * 0.1 }}
          />
        ))}

        {/* Grid of weight cells */}
        {weights.map((row, r) =>
          row.map((w, c) => {
            const cx = gridX + c * cellW;
            const cy = gridY + r * cellH;
            const isActive = phase >= 2;
            return (
              <motion.g key={`cell-${r}-${c}`}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 + r * 0.08 + c * 0.04, duration: 0.3 }}
              >
                {/* Cell background */}
                <rect
                  x={cx} y={cy} width={cellW} height={cellH} rx="3"
                  fill="var(--accent)" opacity="0.05"
                  stroke="var(--accent)" strokeWidth="0.5"
                />
                {/* Activation glow */}
                <motion.rect
                  x={cx} y={cy} width={cellW} height={cellH} rx="3"
                  fill="var(--accent)"
                  animate={{ opacity: isActive ? [0, 0.18, 0] : 0 }}
                  transition={{
                    duration: 0.6,
                    delay: r * 0.1 + c * 0.08,
                    ease: "easeInOut",
                  }}
                />
                {/* Weight value */}
                <text
                  x={cx + cellW / 2} y={cy + cellH / 2 + 4}
                  textAnchor="middle" fontSize="10"
                  style={{ ...mono, fill: "var(--foreground)" }}
                >
                  {w.toFixed(1)}
                </text>
              </motion.g>
            );
          })
        )}

        {/* Row labels on left */}
        {weights.map((_, r) => (
          <motion.text
            key={`row-${r}`}
            x={gridX - 10} y={gridY + r * cellH + cellH / 2 + 4}
            textAnchor="end" fontSize="7"
            style={{ ...mono, fill: "var(--muted-foreground)" }}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 0.5 } : {}}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            row {r + 1}
          </motion.text>
        ))}

        {/* Row accumulation arrows (right side) */}
        {outputs.map((val, r) => (
          <motion.g key={`out-${r}`}>
            {/* Arrow line */}
            <motion.line
              x1={gridX + 4 * cellW + 4} y1={gridY + r * cellH + cellH / 2}
              x2={gridX + 4 * cellW + 24} y2={gridY + r * cellH + cellH / 2}
              stroke="var(--accent)" strokeWidth="1"
              animate={{ opacity: phase >= 3 ? 0.7 : 0.15 }}
              transition={{ duration: 0.3, delay: r * 0.1 }}
            />
            {/* Output value */}
            <motion.text
              x={gridX + 4 * cellW + 30} y={gridY + r * cellH + cellH / 2 - 2}
              fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}
              animate={{ opacity: phase >= 3 ? 1 : 0.3 }}
              transition={{ duration: 0.3, delay: r * 0.1 }}
            >
              y{r + 1}
            </motion.text>
            <motion.text
              x={gridX + 4 * cellW + 30} y={gridY + r * cellH + cellH / 2 + 10}
              fontSize="11" fontWeight="600"
              style={{ ...mono, fill: "var(--accent)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.8 }}
              transition={{ duration: 0.4, delay: 0.1 + r * 0.12 }}
            >
              {val.toFixed(2)}
            </motion.text>
          </motion.g>
        ))}

        {/* Bit-line label */}
        <motion.text
          x={gridX + (cellW * 4) / 2} y={gridY + 4 * cellH + 18}
          textAnchor="middle" fontSize="7" letterSpacing="0.08em"
          style={{ ...mono, fill: "var(--muted-foreground)" }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          currents sum per row on bit-lines → output vector
        </motion.text>

        {/* Summary */}
        <motion.text
          x="220" y="310" textAnchor="middle" fontSize="9" fontWeight="600"
          style={{ ...mono, fill: "var(--accent)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.8 } : {}}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          one memory cycle = one full matrix-vector multiply
        </motion.text>
      </svg>
    </Figure>
  );
}

// ────────────────────────────────────
// NEW: Chip Stack Comparison
// ────────────────────────────────────

function ChipStackComparison() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const [dataFlowActive, setDataFlowActive] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setDataFlowActive(true), 1800);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <Figure caption="A GPU system requires HBM stacks, a silicon interposer, and advanced packaging — all to shuttle data. Taalas puts everything on a single die.">
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* ── GPU System ── */}
        <div>
          <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
            GPU System: Multi-Die Stack
          </div>
          <svg viewBox="0 0 260 310" className="w-full">
            {/* Package substrate (bottom) */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Block3D x={10} y={252} w={230} h={28} depth={12}
                fill="var(--muted-foreground)" frontOpacity={0.08} rx={3} />
              <rect x={10} y={252} width={230} height={28} rx={3}
                fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 3" />
              <text x="125" y="270" textAnchor="middle" fontSize="8"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.4 }}>
                PACKAGE SUBSTRATE
              </text>
            </motion.g>

            {/* Silicon interposer */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Block3D x={20} y={210} w={210} h={30} depth={12}
                fill="var(--muted-foreground)" frontOpacity={0.12} rx={2} />
              <rect x={20} y={210} width={210} height={30} rx={2}
                fill="none" stroke="var(--muted-foreground)" strokeWidth="0.75" />
              <text x="125" y="228" textAnchor="middle" fontSize="8"
                style={{ ...mono, fill: "var(--muted-foreground)" }}>
                SILICON INTERPOSER
              </text>
              <text x="125" y="240" textAnchor="middle" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.5 }}>
                $$$ advanced packaging
              </text>
              {/* Connection dots to substrate */}
              {[50, 90, 130, 170, 210].map((bx, i) => (
                <line key={i} x1={bx} y1={240} x2={bx} y2={252}
                  stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2" />
              ))}
            </motion.g>

            {/* GPU Die (center) */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Block3D x={72} y={144} w={116} h={52} depth={12}
                fill="var(--accent)" frontOpacity={0.15} rx={3} />
              <rect x={72} y={144} width={116} height={52} rx={3}
                fill="none" stroke="var(--accent)" strokeWidth="0.75" />
              {/* Internal sections */}
              <line x1="110" y1={148} x2="110" y2={192} stroke="var(--accent)" strokeWidth="0.3" opacity="0.3" />
              <line x1="150" y1={148} x2="150" y2={192} stroke="var(--accent)" strokeWidth="0.3" opacity="0.3" />
              <text x="91" y="165" textAnchor="middle" fontSize="6" style={{ ...mono, fill: "var(--accent)", opacity: 0.6 }}>CACHE</text>
              <text x="130" y="165" textAnchor="middle" fontSize="6" style={{ ...mono, fill: "var(--accent)", opacity: 0.6 }}>CORES</text>
              <text x="168" y="165" textAnchor="middle" fontSize="6" style={{ ...mono, fill: "var(--accent)", opacity: 0.6 }}>SCHED</text>
              <text x="130" y="186" textAnchor="middle" fontSize="7" fontWeight="600" style={{ ...mono, fill: "var(--foreground)" }}>GPU DIE</text>
              {/* Connections to interposer */}
              {[95, 120, 145, 165].map((bx, i) => (
                <line key={i} x1={bx} y1={196} x2={bx} y2={210}
                  stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2" />
              ))}
            </motion.g>

            {/* HBM Stack Left */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              {[0, 1, 2, 3].map((layer) => (
                <Block3D key={`hbm-l-${layer}`}
                  x={22} y={168 - layer * 12} w={42} h={10} depth={8}
                  fill="var(--muted-foreground)" frontOpacity={0.1 + layer * 0.03}
                />
              ))}
              <rect x={22} y={132} width={42} height={46} rx={2}
                fill="none" stroke="var(--muted-foreground)" strokeWidth="0.5" strokeDasharray="3 2" />
              {/* TSV dots between layers */}
              {[0, 1, 2].map((i) => (
                <g key={`tsv-l-${i}`}>
                  <circle cx={33} cy={166 - i * 12} r="1" fill="var(--muted-foreground)" opacity="0.3" />
                  <circle cx={53} cy={166 - i * 12} r="1" fill="var(--muted-foreground)" opacity="0.3" />
                </g>
              ))}
              <text x="43" y="127" textAnchor="middle" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)" }}>
                HBM STACK
              </text>
              <text x="43" y="190" textAnchor="middle" fontSize="5"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.5 }}>
                4× DRAM dies
              </text>
              {/* Connection to interposer */}
              <line x1="43" y1="196" x2="43" y2="210"
                stroke="var(--muted-foreground)" strokeWidth="0.5" strokeDasharray="2 2" />
            </motion.g>

            {/* HBM Stack Right */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              {[0, 1, 2, 3].map((layer) => (
                <Block3D key={`hbm-r-${layer}`}
                  x={196} y={168 - layer * 12} w={42} h={10} depth={8}
                  fill="var(--muted-foreground)" frontOpacity={0.1 + layer * 0.03}
                />
              ))}
              <rect x={196} y={132} width={42} height={46} rx={2}
                fill="none" stroke="var(--muted-foreground)" strokeWidth="0.5" strokeDasharray="3 2" />
              {[0, 1, 2].map((i) => (
                <g key={`tsv-r-${i}`}>
                  <circle cx={207} cy={166 - i * 12} r="1" fill="var(--muted-foreground)" opacity="0.3" />
                  <circle cx={227} cy={166 - i * 12} r="1" fill="var(--muted-foreground)" opacity="0.3" />
                </g>
              ))}
              <text x="217" y="127" textAnchor="middle" fontSize="6"
                style={{ ...mono, fill: "var(--muted-foreground)" }}>
                HBM STACK
              </text>
              <text x="217" y="190" textAnchor="middle" fontSize="5"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.5 }}>
                4× DRAM dies
              </text>
              <line x1="217" y1="196" x2="217" y2="210"
                stroke="var(--muted-foreground)" strokeWidth="0.5" strokeDasharray="2 2" />
            </motion.g>

            {/* Data path arrows (animated) */}
            {dataFlowActive && (
              <>
                {/* HBM left → interposer → GPU */}
                <motion.circle r="2.5" fill="var(--muted-foreground)"
                  animate={{
                    cx: [43, 43, 95, 95],
                    cy: [155, 218, 218, 172],
                    opacity: [0.5, 0.4, 0.4, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                {/* HBM right → interposer → GPU */}
                <motion.circle r="2.5" fill="var(--muted-foreground)"
                  animate={{
                    cx: [217, 217, 155, 155],
                    cy: [155, 218, 218, 172],
                    opacity: [0.5, 0.4, 0.4, 0],
                  }}
                  transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "linear" }}
                />
              </>
            )}

            {/* Labels */}
            <motion.text x="130" y="298" textAnchor="middle" fontSize="7"
              style={{ ...mono, fill: "var(--muted-foreground)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.5 } : {}}
              transition={{ delay: 1.2, duration: 0.4 }}>
              data travels millimeters · 300-700W
            </motion.text>
          </svg>
        </div>

        {/* ── Taalas HC1 ── */}
        <div>
          <div className="text-xs text-accent mb-3 font-medium uppercase tracking-wider">
            Taalas HC1: Unified Die
          </div>
          <svg viewBox="0 0 260 310" className="w-full">
            {/* Package substrate */}
            <motion.g
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Block3D x={10} y={252} w={230} h={28} depth={12}
                fill="var(--muted-foreground)" frontOpacity={0.08} rx={3} />
              <rect x={10} y={252} width={230} height={28} rx={3}
                fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 3" />
              <text x="125" y="270" textAnchor="middle" fontSize="8"
                style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.4 }}>
                PACKAGE SUBSTRATE
              </text>
            </motion.g>

            {/* Single unified die */}
            <motion.g
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            >
              <Block3D x={20} y={118} w={210} h={125} depth={14}
                fill="var(--accent)" frontOpacity={0.1} rx={4} />
              <rect x={20} y={118} width={210} height={125} rx={4}
                fill="none" stroke="var(--accent)" strokeWidth="1" />

              {/* Internal CIM cell grid (5×6) */}
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => (
                  <rect key={`cim-${row}-${col}`}
                    x={30 + col * 38} y={130 + row * 26}
                    width="32" height="20" rx="2"
                    fill="var(--accent)" opacity="0.08"
                    stroke="var(--accent)" strokeWidth="0.3"
                  />
                ))
              )}

              <text x="125" y="240" textAnchor="middle" fontSize="8" fontWeight="600"
                style={{ ...mono, fill: "var(--foreground)" }}>
                SINGLE DIE · 815mm²
              </text>
            </motion.g>

            {/* CIM cell labels */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <text x="125" y="112" textAnchor="middle" fontSize="7"
                style={{ ...mono, fill: "var(--accent)" }}>
                53B transistors · memory IS compute
              </text>
            </motion.g>

            {/* Diagonal wave activation on CIM cells */}
            {inView && Array.from({ length: 4 }).map((_, row) =>
              Array.from({ length: 5 }).map((_, col) => {
                const delay = (row + col) * 0.12;
                return (
                  <motion.g key={`cim-wave-${row}-${col}`}>
                    <motion.rect
                      x={30 + col * 38} y={130 + row * 26}
                      width="32" height="20" rx="2" fill="var(--accent)"
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.8, delay: 1.0 + delay, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                    />
                    <motion.circle
                      cx={30 + col * 38 + 16} cy={130 + row * 26 + 10}
                      r="2" fill="var(--accent)"
                      animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.5, delay: 1.1 + delay, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
                    />
                  </motion.g>
                );
              })
            )}

            {/* Connection to substrate (simple) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              {[60, 125, 190].map((bx, i) => (
                <line key={i} x1={bx} y1={243} x2={bx} y2={252}
                  stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 2" />
              ))}
            </motion.g>

            {/* No interposer callout */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.0, duration: 0.4 }}
            >
              <text x="125" y="250" textAnchor="middle" fontSize="6"
                style={{ ...mono, fill: "var(--accent)", opacity: 0.5 }}>
                no interposer · no HBM
              </text>
            </motion.g>

            {/* Labels */}
            <motion.text x="125" y="298" textAnchor="middle" fontSize="7"
              style={{ ...mono, fill: "var(--accent)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.7 } : {}}
              transition={{ delay: 1.2, duration: 0.4 }}>
              data travels nanometers · 200W
            </motion.text>
          </svg>
        </div>
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// Execution Comparison (enhanced)
// ────────────────────────────────────

function ExecutionComparison() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    { label: "FETCH", y: 20 },
    { label: "DECODE", y: 66 },
    { label: "SCHEDULE", y: 112 },
    { label: "LOAD WEIGHTS", y: 158, accent: true },
    { label: "EXECUTE", y: 204 },
    { label: "WRITE BACK", y: 250 },
  ];

  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setCycle((c) => (c >= 4096 ? 1 : c + 1)), 3500);
    setCycle(1);
    return () => clearInterval(id);
  }, [inView]);

  const [activeStep, setActiveStep] = useState(-1);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setActiveStep((s) => (s >= 5 ? 0 : s + 1)), 3500 / 6);
    setActiveStep(0);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <Figure caption="The GPU repeats a 6-step instruction cycle thousands of times per token. In the ASIC, data flows straight through fixed silicon.">
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* GPU */}
        <div>
          <div className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">GPU · instruction cycle</div>
          <svg viewBox="0 0 260 340" className="w-full">
            {steps.map((step, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}>
                <motion.rect x="56" y={step.y} width="176" height="30" rx="4"
                  fill={step.accent ? "var(--accent)" : "var(--muted-foreground)"}
                  stroke={step.accent ? "var(--accent)" : "var(--border)"}
                  strokeWidth={step.accent ? 1 : 0.75}
                  animate={{ opacity: activeStep === i ? 0.2 : (step.accent ? 0.08 : 0.04) }}
                  transition={{ duration: 0.15 }}
                />
                <text x="144" y={step.y + 19} textAnchor="middle" fontSize="10"
                  style={{ ...mono, fill: step.accent ? "var(--accent)" : "var(--muted-foreground)" }}>
                  {step.label}
                </text>
                {i < steps.length - 1 && (
                  <line x1="144" y1={step.y + 30} x2="144" y2={steps[i + 1].y} stroke="var(--border)" strokeWidth="0.75" />
                )}
              </motion.g>
            ))}

            {inView && (
              <motion.text x="248" y={steps[3].y + 19} fontSize="8" style={{ ...mono, fill: "var(--accent)" }}
                animate={{ opacity: activeStep === 3 ? [0, 0.8, 0] : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}>
                ~100ns wait
              </motion.text>
            )}

            <motion.path d="M144,280 L144,296 L32,296 L32,20 L54,20" fill="none" stroke="var(--muted-foreground)"
              strokeWidth="0.75" strokeDasharray="4 3" initial={{ opacity: 0 }} animate={inView ? { opacity: 0.25 } : {}}
              transition={{ delay: 0.7, duration: 0.4 }} />
            <motion.polygon points="54,16 54,24 58,20" fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.25 } : {}} transition={{ delay: 0.7, duration: 0.4 }} />

            <motion.text x="144" y="326" textAnchor="middle" fontSize="9" style={{ ...mono, fill: "var(--muted-foreground)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.7 } : {}} transition={{ delay: 0.8, duration: 0.4 }}>
              {cycle > 0 ? `cycle ${cycle.toLocaleString()} / 4,096` : "× 4,096 per token"}
            </motion.text>

            {/* Animated dot — using animateMotion for reliable path following */}
            {inView && (
              <circle r="3" fill="var(--muted-foreground)" opacity="0.5">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M144,35 L144,296 L32,296 L32,20 L144,20 L144,35" />
              </circle>
            )}
          </svg>
        </div>

        {/* Taalas */}
        <div>
          <div className="text-xs text-accent mb-4 font-medium uppercase tracking-wider">Taalas · hardwired pipeline</div>
          <svg viewBox="0 0 260 340" className="w-full">
            <motion.text x="130" y="12" textAnchor="middle" fontSize="9" style={{ ...mono, fill: "var(--muted-foreground)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.1, duration: 0.3 }}>
              token in
            </motion.text>
            <motion.line x1="130" y1="18" x2="130" y2="26" stroke="var(--accent)" strokeWidth="0.75"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2, duration: 0.3 }} />

            {/* EMBED */}
            <motion.g initial={{ opacity: 0, scale: 0.97 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.4 }}>
              <rect x="40" y="28" width="180" height="24" rx="4" fill="var(--accent)" opacity="0.08" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="130" y="44" textAnchor="middle" fontSize="9" fontWeight="600" style={{ ...mono, fill: "var(--foreground)" }}>EMBED</text>
              {[-20, -8, 4, 16].map((dx, i) => (
                <circle key={`e${i}`} cx={130 + dx} cy={49} r="1" fill="var(--accent)" opacity="0.35" />
              ))}
            </motion.g>
            {inView && <motion.rect x="40" y="28" width="180" height="24" rx="4" fill="var(--accent)"
              animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.6, delay: 0.3, repeat: Infinity, repeatDelay: 1.4 }}
              style={{ transformOrigin: "130px 40px" }} />}

            <motion.line x1="130" y1="52" x2="130" y2="60" stroke="var(--accent)" strokeWidth="0.75"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.45, duration: 0.2 }} />

            {/* Layer 1 container */}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5, duration: 0.4 }}>
              <rect x="20" y="62" width="220" height="138" rx="6" fill="var(--accent)" opacity="0.03" stroke="var(--accent)" strokeWidth="0.75" />
              <text x="32" y="76" fontSize="8" fontWeight="600" style={{ ...mono, fill: "var(--accent)", opacity: 0.6 }}>LAYER 1</text>
            </motion.g>

            {/* NORM */}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.55, duration: 0.3 }}>
              <rect x="40" y="82" width="180" height="14" rx="2" fill="var(--accent)" opacity="0.05" stroke="var(--accent)" strokeWidth="0.3" />
              <text x="130" y="92" textAnchor="middle" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}>NORM</text>
            </motion.g>
            {inView && <motion.rect x="40" y="82" width="180" height="14" rx="2" fill="var(--accent)"
              animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.4, delay: 0.6, repeat: Infinity, repeatDelay: 1.6 }} />}

            <motion.line x1="130" y1="96" x2="130" y2="104" stroke="var(--accent)" strokeWidth="0.5"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.65, duration: 0.2 }} />

            {/* Q/K/V — fan out simultaneously */}
            {[{ label: "Q", x: 44 }, { label: "K", x: 103 }, { label: "V", x: 162 }].map((p) => (
              <motion.g key={p.label} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.75, duration: 0.3 }}>
                <rect x={p.x} y={106} width="54" height="22" rx="3" fill="var(--accent)" opacity="0.1" stroke="var(--accent)" strokeWidth="0.5" />
                <text x={p.x + 27} y={119} textAnchor="middle" fontSize="9" style={{ ...mono, fill: "var(--foreground)" }}>{p.label}</text>
                {[-8, 0, 8].map((dx, i) => (
                  <circle key={i} cx={p.x + 27 + dx} cy={124} r="1" fill="var(--accent)" opacity="0.35" />
                ))}
              </motion.g>
            ))}
            {inView && [44, 103, 162].map((x, i) => (
              <motion.rect key={`qkv-${i}`} x={x} y={106} width="54" height="22" rx="3" fill="var(--accent)"
                animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.5, delay: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
                style={{ transformOrigin: `${x + 27}px 117px` }} />
            ))}

            {/* Converge lines */}
            {[{ x1: 71, x2: 130 }, { x1: 130, x2: 130 }, { x1: 189, x2: 130 }].map((l, i) => (
              <motion.line key={`conv-${i}`} x1={l.x1} y1={128} x2={l.x2} y2={140}
                stroke="var(--accent)" strokeWidth="0.4" opacity="0.4"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 0.4 } : {}} transition={{ delay: 0.9, duration: 0.3 }} />
            ))}

            {/* ATTEND */}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.95, duration: 0.3 }}>
              <rect x="60" y="142" width="140" height="20" rx="3" fill="var(--accent)" opacity="0.08" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="130" y="155" textAnchor="middle" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>ATTEND</text>
            </motion.g>
            {inView && <motion.rect x="60" y="142" width="140" height="20" rx="3" fill="var(--accent)"
              animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.5, delay: 1.0, repeat: Infinity, repeatDelay: 1.5 }}
              style={{ transformOrigin: "130px 152px" }} />}

            <motion.line x1="130" y1="162" x2="130" y2="170" stroke="var(--accent)" strokeWidth="0.5"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.05, duration: 0.2 }} />

            {/* FFN */}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.1, duration: 0.3 }}>
              <rect x="60" y="172" width="140" height="20" rx="3" fill="var(--accent)" opacity="0.1" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="130" y="185" textAnchor="middle" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>FFN</text>
              {[-12, -4, 4, 12].map((dx, i) => (
                <circle key={`f${i}`} cx={130 + dx} cy={189} r="1" fill="var(--accent)" opacity="0.35" />
              ))}
            </motion.g>
            {inView && <motion.rect x="60" y="172" width="140" height="20" rx="3" fill="var(--accent)"
              animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.5, delay: 1.15, repeat: Infinity, repeatDelay: 1.35 }}
              style={{ transformOrigin: "130px 182px" }} />}

            {/* Layer dots */}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.3, duration: 0.3 }}>
              <line x1="130" y1="200" x2="130" y2="210" stroke="var(--accent)" strokeWidth="0.75" />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx="130" cy={220 + i * 10} r="1.5" fill="var(--accent)" opacity="0.4" />
              ))}
            </motion.g>

            {/* Layer 32 */}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.4, duration: 0.3 }}>
              <line x1="130" y1="248" x2="130" y2="254" stroke="var(--accent)" strokeWidth="0.75" />
              <rect x="40" y="256" width="180" height="26" rx="4" fill="var(--accent)" opacity="0.08" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="130" y="273" textAnchor="middle" fontSize="9" fontWeight="600" style={{ ...mono, fill: "var(--foreground)" }}>LAYER 32</text>
            </motion.g>
            {inView && <motion.rect x="40" y="256" width="180" height="26" rx="4" fill="var(--accent)"
              animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
              style={{ transformOrigin: "130px 269px" }} />}

            <motion.line x1="130" y1="282" x2="130" y2="288" stroke="var(--accent)" strokeWidth="0.75"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.55, duration: 0.2 }} />

            {/* OUTPUT */}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.6, duration: 0.3 }}>
              <rect x="40" y="290" width="180" height="24" rx="4" fill="var(--accent)" opacity="0.08" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="130" y="306" textAnchor="middle" fontSize="9" fontWeight="600" style={{ ...mono, fill: "var(--foreground)" }}>OUTPUT</text>
            </motion.g>
            {inView && <motion.rect x="40" y="290" width="180" height="24" rx="4" fill="var(--accent)"
              animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 0.5, delay: 1.7, repeat: Infinity, repeatDelay: 1.3 }}
              style={{ transformOrigin: "130px 302px" }} />}

            <motion.line x1="130" y1="314" x2="130" y2="320" stroke="var(--accent)" strokeWidth="0.75"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.75, duration: 0.2 }} />

            <motion.text x="130" y="334" textAnchor="middle" fontSize="9" style={{ ...mono, fill: "var(--muted-foreground)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.8, duration: 0.3 }}>
              token out
            </motion.text>
          </svg>
        </div>
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// Die Comparison (enhanced)
// ────────────────────────────────────

function DieComparison() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const overhead = [
    { label: "Cache", x: 8, y: 92, w: 100, h: 32 },
    { label: "Instruction", x: 112, y: 92, w: 100, h: 32 },
    { label: "Scheduler", x: 8, y: 128, w: 68, h: 32 },
    { label: "Registers", x: 80, y: 128, w: 68, h: 32 },
    { label: "I/O", x: 152, y: 128, w: 60, h: 32 },
    { label: "Mem Controller", x: 8, y: 164, w: 136, h: 32 },
    { label: "DMA", x: 148, y: 164, w: 64, h: 32 },
  ];
  const layers = [0, 1, 2, 3];
  const asicBlocks = [
    { x: 8, y: 8, w: 204, h: 24 },
    ...layers.flatMap((row) => [
      { x: 8, y: 40 + row * 38, w: 100, h: 32 },
      { x: 112, y: 40 + row * 38, w: 100, h: 32 },
    ]),
    { x: 8, y: 194, w: 204, h: 24 },
  ];

  return (
    <Figure caption="On a GPU, ~60% of silicon is infrastructure that doesn't compute tokens. On a model-specific ASIC, every block runs part of the model.">
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* GPU die */}
        <div>
          <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">General Purpose</div>
          <svg viewBox="0 0 220 230" className="w-full">
            <rect x="0" y="0" width="220" height="230" rx="6" fill="none" stroke="var(--border)" strokeWidth="1" />
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4 }}>
              <rect x="8" y="8" width="204" height="76" rx="4" fill="var(--accent)" opacity="0.12" stroke="var(--accent)" strokeWidth="0.5" />
              {Array.from({ length: 2 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => (
                  <rect key={`c-${row}-${col}`} x={16 + col * 48} y={16 + row * 32} width="40" height="24" rx="2" fill="var(--accent)" opacity="0.1" />
                ))
              )}
              <text x="110" y="78" textAnchor="middle" fontSize="8" style={{ ...mono, fill: "var(--accent)", opacity: 0.7 }}>Compute Cores</text>
            </motion.g>
            {overhead.map((b, i) => (
              <motion.g key={b.label} initial={{ opacity: 0, y: 4 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="var(--muted-foreground)" opacity="0.04" stroke="var(--border)" strokeWidth="0.5" />
                <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} textAnchor="middle" fontSize="8"
                  style={{ ...mono, fill: "var(--muted-foreground)", opacity: 0.25 }}>{b.label}</text>
              </motion.g>
            ))}
            <motion.text x="110" y="214" textAnchor="middle" fontSize="7" style={{ ...mono, fill: "var(--muted-foreground)" }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.2 } : {}} transition={{ delay: 1.2, duration: 0.5 }}>
              idle during inference
            </motion.text>
          </svg>
          <motion.div className="text-xs text-muted-foreground mt-2 text-center"
            initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.4, duration: 0.4 }}>
            ~40% of silicon active during inference
          </motion.div>
        </div>

        {/* Model-specific die */}
        <div>
          <div className="text-xs text-accent mb-3 font-medium uppercase tracking-wider">Model Specific</div>
          <svg viewBox="0 0 220 230" className="w-full">
            <rect x="0" y="0" width="220" height="230" rx="6" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.4" />
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2, duration: 0.3 }}>
              <rect x="8" y="8" width="204" height="24" rx="3" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="110" y="24" textAnchor="middle" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>EMBED</text>
            </motion.g>
            {layers.map((row) => (
              <motion.g key={`layer-${row}`} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.35 + row * 0.12, duration: 0.3 }}>
                <rect x="8" y={40 + row * 38} width="100" height="32" rx="3" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="0.5" />
                <text x="58" y={60 + row * 38} textAnchor="middle" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>{`ATTN ${row * 8 + 1}–${(row + 1) * 8}`}</text>
                <rect x="112" y={40 + row * 38} width="100" height="32" rx="3" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="0.5" />
                <text x="162" y={60 + row * 38} textAnchor="middle" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>{`FFN ${row * 8 + 1}–${(row + 1) * 8}`}</text>
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.85, duration: 0.3 }}>
              <rect x="8" y="194" width="204" height="24" rx="3" fill="var(--accent)" opacity="0.15" stroke="var(--accent)" strokeWidth="0.5" />
              <text x="110" y="210" textAnchor="middle" fontSize="8" style={{ ...mono, fill: "var(--foreground)" }}>OUTPUT</text>
            </motion.g>
            {inView && asicBlocks.map((b, i) => (
              <motion.rect key={`sweep-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="var(--accent)"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 0.6, delay: i * 0.2, repeat: Infinity, repeatDelay: asicBlocks.length * 0.2 - 0.6 + 0.5, ease: "easeInOut" }} />
            ))}
          </svg>
          <motion.div className="text-xs text-accent mt-2 text-center"
            initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.2, duration: 0.4 }}>
            100% serves the model
          </motion.div>
        </div>
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// Performance Bars
// ────────────────────────────────────

function PerformanceBars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const metrics = [
    { label: "Speed", unit: "tokens / sec", baseline: "~1,700", taalas: "17,000", taalasNum: 17000, baselineWidth: "10%", taalasWidth: "100%" },
    { label: "Build cost", unit: "relative", baseline: "1×", taalas: "0.05×", taalasNum: 0.05, baselineWidth: "100%", taalasWidth: "5%" },
    { label: "Power", unit: "relative", baseline: "1×", taalas: "0.1×", taalasNum: 0.1, baselineWidth: "100%", taalasWidth: "10%" },
  ];

  return (
    <Figure>
      <div ref={ref} className="space-y-6">
        {metrics.map((m, mIdx) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: mIdx * 0.15, duration: 0.4, ease: "easeOut" }}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-sm text-foreground font-medium">{m.label}</span>
              <span className="text-xs text-muted-foreground">{m.unit}</span>
            </div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-xs text-muted-foreground w-10 shrink-0 text-right">GPU</span>
              <div className="flex-1 h-3.5 rounded-sm bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-sm" style={{ background: "var(--muted-foreground)", opacity: 0.2 }}
                  initial={{ width: "0%" }} animate={inView ? { width: m.baselineWidth } : { width: "0%" }}
                  transition={{ delay: mIdx * 0.15 + 0.2, duration: 1, ease: "easeOut" }} />
              </div>
              <span className="font-mono text-xs text-muted-foreground w-14 shrink-0 text-right">{m.baseline}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-accent w-10 shrink-0 text-right">HC1</span>
              <div className="flex-1 h-3.5 rounded-sm bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-sm" style={{ background: "var(--accent)", opacity: 0.6 }}
                  initial={{ width: "0%" }} animate={inView ? { width: m.taalasWidth } : { width: "0%" }}
                  transition={{ delay: mIdx * 0.15 + 0.4, duration: 1, ease: "easeOut" }} />
              </div>
              <span className="font-mono text-xs text-foreground font-medium w-14 shrink-0 text-right">
                {m.label === "Speed" ? (
                  <AnimatedNumber value={m.taalasNum} format={(n) => Math.round(n).toLocaleString()} />
                ) : m.label === "Build cost" ? (
                  <AnimatedNumber value={m.taalasNum} format={(n) => `${n.toFixed(2)}×`} />
                ) : (
                  <AnimatedNumber value={m.taalasNum} format={(n) => `${n.toFixed(1)}×`} />
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Figure>
  );
}

// ────────────────────────────────────
// Glossary
// ────────────────────────────────────

type GlossaryCategory = "MEMORY" | "COMPUTE" | "PACKAGING" | "AI" | "CIRCUIT";

interface GlossaryEntry {
  term: string;
  category: GlossaryCategory;
  aka?: string;
  definition: string;
  context: string; // how it relates to this article specifically
}

const categoryColors: Record<GlossaryCategory, string> = {
  MEMORY: "#22d3ee",   // cyan
  COMPUTE: "#a78bfa",  // purple
  PACKAGING: "#f59e0b", // amber
  AI: "#34d399",       // green
  CIRCUIT: "#f472b6",  // pink
};

const glossaryEntries: GlossaryEntry[] = [
  {
    term: "DRAM",
    category: "MEMORY",
    aka: "Dynamic Random-Access Memory",
    definition: "The main memory in computers. Stores each bit as a charge on a tiny capacitor. Dense and cheap, but slow (~100ns access). Must be constantly refreshed because capacitors leak charge.",
    context: "Taalas embeds compute directly inside DRAM cells, turning slow memory into fast compute.",
  },
  {
    term: "SRAM",
    category: "MEMORY",
    aka: "Static Random-Access Memory",
    definition: "Fast on-chip memory (~1ns) used for CPU/GPU caches. Uses 6 transistors per bit instead of 1, making it much less dense and far more expensive than DRAM.",
    context: "GPU caches use SRAM. It's fast but too small to hold an entire model's weights.",
  },
  {
    term: "HBM",
    category: "MEMORY",
    aka: "High Bandwidth Memory",
    definition: "Stacks of DRAM dies connected vertically with through-silicon vias (TSVs). Delivers terabytes/sec of bandwidth by widening the data bus across thousands of tiny wires.",
    context: "GPUs use HBM to brute-force the memory wall. Taalas eliminates the need for it entirely.",
  },
  {
    term: "CIM",
    category: "COMPUTE",
    aka: "Compute-in-Memory",
    definition: "An architecture where arithmetic operations happen inside the memory array itself. Each memory cell stores a value AND performs multiplication, eliminating the need to move data to a separate processor.",
    context: "The core innovation in Taalas's chip. Each DRAM cell stores a weight and multiplies it by the input in ~1ns.",
  },
  {
    term: "GPU",
    category: "COMPUTE",
    aka: "Graphics Processing Unit",
    definition: "A massively parallel processor originally designed for rendering graphics. Thousands of small cores execute the same instruction on different data. Repurposed for AI because matrix math maps well to parallel execution.",
    context: "The current default for AI inference. Fast cores, but bottlenecked by data movement from external memory.",
  },
  {
    term: "ASIC",
    category: "COMPUTE",
    aka: "Application-Specific Integrated Circuit",
    definition: "A chip designed for one specific task, with the computation graph hardwired into silicon. No instruction fetch, no scheduling overhead—just fixed-function data flow.",
    context: "Taalas HC1 is an ASIC built for Llama 3.1 8B. Every transistor serves that one model.",
  },
  {
    term: "ALU",
    category: "COMPUTE",
    aka: "Arithmetic Logic Unit",
    definition: "The part of a processor that performs math and logic operations. In a GPU, thousands of ALUs run in parallel, but each one must wait for data to arrive from memory.",
    context: "In traditional chips, data travels from DRAM → bus → cache → ALU. CIM eliminates this journey.",
  },
  {
    term: "Transformer",
    category: "AI",
    definition: "The neural network architecture behind modern LLMs. Built from repeated blocks of self-attention and feed-forward layers. The computation graph is fixed and predictable.",
    context: "Because transformer structure is known ahead of time, Taalas can hardwire the entire model into silicon.",
  },
  {
    term: "Inference",
    category: "AI",
    definition: "Running a trained model to produce outputs—generating text, classifying images, etc. Unlike training (which updates weights), inference only reads weights and computes forward passes.",
    context: "Inference is memory-bound: the bottleneck is reading weights, not doing math. This is why CIM helps so much.",
  },
  {
    term: "Quantization",
    category: "AI",
    definition: "Reducing the numerical precision of model weights (e.g., from 16-bit to 3-bit). Shrinks model size and speeds up computation with minimal quality loss when done carefully.",
    context: "Taalas co-designs quantization with the hardware—3-bit and 6-bit formats tuned per layer.",
  },
  {
    term: "FFN",
    category: "AI",
    aka: "Feed-Forward Network",
    definition: "A layer in a transformer that processes each token independently through two matrix multiplications with a nonlinearity in between. Typically the most compute-intensive part of each block.",
    context: "Each FFN layer's weights are stored in dedicated CIM cells on the Taalas chip.",
  },
  {
    term: "Word-line",
    category: "CIRCUIT",
    definition: "A horizontal wire in a memory array that activates a row of cells. In CIM, the input activation voltage is applied on the word-line, triggering all cells in that row to multiply simultaneously.",
    context: "Input activations enter the CIM array via word-lines, enabling parallel computation across an entire row.",
  },
  {
    term: "Bit-line",
    category: "CIRCUIT",
    definition: "A vertical wire in a memory array that carries data out of cells. In CIM, bit-line currents from multiple cells accumulate naturally, performing the summation step of matrix multiplication.",
    context: "Currents on bit-lines sum automatically—this is how CIM computes dot products without separate adders.",
  },
  {
    term: "TSV",
    category: "PACKAGING",
    aka: "Through-Silicon Via",
    definition: "A tiny vertical electrical connection that passes completely through a silicon die. Used to stack chips on top of each other (like HBM DRAM layers) with very short interconnects.",
    context: "HBM stacks use TSVs to connect 4-8 DRAM dies. Taalas needs none—everything is on one die.",
  },
  {
    term: "Interposer",
    category: "PACKAGING",
    aka: "Silicon Interposer",
    definition: "A thin silicon layer that sits between chips and the package substrate, providing fine-pitch wiring to connect multiple dies (like GPU + HBM). One of the most expensive components in modern AI hardware.",
    context: "GPU systems need interposers to connect HBM to compute. Taalas's single-die approach eliminates this entirely.",
  },
  {
    term: "Memory Wall",
    category: "COMPUTE",
    definition: "The growing gap between processor speed and memory speed. Compute has improved ~1,000,000× since 1980, but memory latency only ~10×. For memory-bound workloads like inference, this is the fundamental bottleneck.",
    context: "The entire article is about solving the memory wall—Taalas does it by computing where data already lives.",
  },
];

function Glossary() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const selected = glossaryEntries[selectedIdx];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-lg border border-border overflow-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.3fr] min-h-[420px]">
        {/* ── Left panel: term list ── */}
        <div className="border-b sm:border-b-0 sm:border-r border-border p-4 overflow-y-auto max-h-[420px]">
          {glossaryEntries.map((entry, i) => (
            <button
              key={entry.term}
              onClick={() => setSelectedIdx(i)}
              className={`w-full text-left flex items-center gap-3 py-2 px-2.5 rounded-md transition-colors ${
                selectedIdx === i
                  ? "bg-foreground/[0.05]"
                  : "hover:bg-foreground/[0.03]"
              }`}
            >
              <span
                className="text-[10px] font-medium uppercase tracking-wider shrink-0 w-[72px]"
                style={{ ...mono, color: categoryColors[entry.category] }}
              >
                {entry.category}
              </span>
              <span
                className={`text-sm transition-colors ${
                  selectedIdx === i
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
                style={mono}
              >
                {entry.term}
              </span>
              {selectedIdx === i && (
                <span
                  className="ml-auto text-accent opacity-50 text-xs"
                >
                  ›
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Right panel: definition ── */}
        <div className="p-5 sm:p-6 flex flex-col">
          <div
            className="text-[10px] font-medium uppercase tracking-wider mb-1.5"
            style={{ ...mono, color: categoryColors[selected.category] }}
          >
            {selected.category}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-0.5" style={mono}>
            {selected.term}
          </h3>
          {selected.aka && (
            <div className="text-xs text-muted-foreground mb-3" style={mono}>
              {selected.aka}
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {selected.definition}
          </p>
          <div className="mt-auto pt-3 border-t border-border">
            <div
              className="text-[10px] font-medium uppercase tracking-wider mb-1.5 text-muted-foreground"
              style={mono}
            >
              In this article
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--accent)" }}>
              {selected.context}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────
// Article
// ────────────────────────────────────

export function SiliconArticle() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24 bg-background text-foreground transition-colors">
      <article className="mx-auto max-w-xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-sm text-muted hover:text-accent transition-colors">&larr; Back</Link>
          <ThemeToggle />
        </div>

        <header className="mt-8 mb-12">
          <h1 className="text-3xl font-bold tracking-tight">The Path to Ubiquitous AI, Visualized</h1>
          <time className="mt-3 block text-sm text-muted-foreground">February 21, 2026</time>
        </header>

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            The <a href="https://taalas.com/the-path-to-ubiquitous-ai/" className="text-foreground hover:underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">demo for this article</a> blew my mind. I was curious to learn more about how it all worked under the hood. I had Claude Code break down the architecture and the differences between traditional chip architectures and custom AI silicon, then visualize each piece. I had Claude refine each visual until it made sense to me.
          </p>
        </div>

        <div className="my-10 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>Everything below was written and visualized by Claude</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-5">
          <p className="text-muted leading-relaxed">
            AI inference is the most significant computational workload humanity has created. Every chat completion, every image generation, every code suggestion requires trillions of arithmetic operations.
          </p>
          <p className="text-muted leading-relaxed">
            The hardware running these workloads—GPUs designed for rendering pixels—was never built for this. A company called{" "}
            <a href="https://taalas.com" className="text-foreground hover:underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">Taalas</a>{" "}
            is rethinking the stack from the silicon up: custom chips where every transistor serves a single model. This is a deep dive into how that works.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">The Memory Wall</h2>
          <div className="space-y-5">
            <p className="text-muted leading-relaxed">
              When a language model generates a token, it reads its entire weight matrix from memory. For an 8B parameter model at 16-bit precision, that&apos;s ~16 gigabytes of data. Every single token.
            </p>
            <p className="text-muted leading-relaxed">
              The arithmetic itself is simple—multiply and accumulate. The bottleneck is feeding data to the compute units fast enough. DRAM is dense and cheap but takes ~100 nanoseconds to access. On-chip SRAM is fast (~1ns) but tiny and expensive.
            </p>

            <MemoryWallDiagram />

            <p className="text-muted leading-relaxed">
              This is the memory wall. Compute speed has grown exponentially over decades, but memory bandwidth hasn&apos;t kept pace. For AI inference—which is almost entirely memory-bound—this is the fundamental constraint.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">The GPU Approach</h2>
          <div className="space-y-5">
            <p className="text-muted leading-relaxed">
              Modern GPUs address the memory wall with brute force. High Bandwidth Memory (HBM) stacks DRAM dies vertically, connected via silicon interposers, delivering terabytes per second of bandwidth. Thousands of cores operate in parallel.
            </p>
            <p className="text-muted leading-relaxed">
              This works, but it&apos;s expensive. HBM costs 5-10× more per gigabyte than standard DRAM. Silicon interposers are among the most expensive components in modern semiconductors. Power consumption reaches 300-700 watts per chip, requiring liquid cooling.
            </p>
            <p className="text-muted leading-relaxed">
              The entire modern AI infrastructure stack—advanced packaging, HBM, massive I/O bandwidth, liquid cooling—exists to work around the memory wall. What if you could eliminate it instead?
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Compute Where the Data Lives</h2>
          <div className="space-y-5">
            <p className="text-muted leading-relaxed">
              Taalas inverts the problem. Instead of moving data faster, they eliminate data movement entirely.
            </p>
            <p className="text-muted leading-relaxed">
              Their approach: embed compute circuits directly inside the memory array. Each memory cell stores a model weight AND performs the multiply-accumulate operation in place. The data never leaves the memory.
            </p>
            <p className="text-muted leading-relaxed">
              To understand what that means at the hardware level, compare how a single multiply operation works in each system.
            </p>

            <ComputeInMemoryCell />

            <ArchitectureComparison />

            <p className="text-muted leading-relaxed">
              The memory array structure maps naturally to linear algebra. Each row stores weights for one output neuron. Each column carries one input activation. The result appears as current on the output lines—an entire matrix-vector multiply in a single cycle.
            </p>

            <MatrixMultiplyArray />

            <p className="text-muted leading-relaxed">
              This is compute-in-memory at DRAM-level density. The bit-line and word-line structure of a memory array maps naturally to matrix-vector multiplication—the core operation of neural network inference. Store the weight matrix in the array, apply input activations as voltages, and read out the result as currents. The entire multiply happens in one memory access cycle.
            </p>
            <p className="text-muted leading-relaxed">
              No HBM stacks. No silicon interposer. No massive I/O bandwidth. No liquid cooling.
            </p>
            <p className="text-muted leading-relaxed">
              The difference shows up in the physical hardware stack.
            </p>

            <ChipStackComparison />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">One Chip, One Model</h2>
          <div className="space-y-5">
            <p className="text-muted leading-relaxed">
              Taalas goes further. Each chip is hardwired for a specific model&apos;s computation graph. To understand what that means, consider how a GPU actually runs a model.
            </p>
            <p className="text-muted leading-relaxed">
              A transformer like Llama 3.1 8B has a fixed structure: an embedding layer, then 32 identical transformer blocks (each containing self-attention and a feed-forward network), then a final output projection. This computation graph—the exact sequence of matrix multiplications—is known ahead of time and never changes.
            </p>
            <p className="text-muted leading-relaxed">
              On a GPU, this fixed graph is executed dynamically. For every operation, the processor fetches an instruction from memory, decodes it, schedules it to a free core, loads the relevant weights, executes the multiply, and writes the result back. Then repeats. Thousands of times per token.
            </p>

            <ExecutionComparison />

            <p className="text-muted leading-relaxed">
              A Taalas chip eliminates all of that overhead. The model&apos;s computation graph is physically wired into the silicon. Layer 1&apos;s output connects directly to layer 2&apos;s input. The attention weights for each head sit in dedicated memory cells that also perform the multiply. There are no instructions to fetch, no cores to schedule, no results to shuttle around. The chip IS the model.
            </p>
            <p className="text-muted leading-relaxed">
              Think of it this way: a GPU is a programmable calculator—you enter each step, wait for the answer, enter the next step. A Taalas chip is a purpose-built machine—data flows in one end and the answer comes out the other.
            </p>

            <DieComparison />

            <p className="text-muted leading-relaxed">
              This also enables aggressive quantization. Standard models use 16-bit precision (2 bytes per weight). Taalas co-designs the quantization with the hardware—3-bit and 6-bit formats on HC1—shrinking model size by 3-5× with minimal quality loss. When you control both the silicon and the model mapping, you can tune precision to exactly what each layer needs.
            </p>
            <p className="text-muted leading-relaxed">
              The tradeoff is real: each chip runs exactly one model. A new model requires a new chip. Taalas&apos;s bet is that a handful of dominant models—the ones handling billions of daily requests—justify dedicated silicon.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">The Numbers</h2>
          <div className="space-y-5">
            <p className="text-muted leading-relaxed">
              HC1, their first-generation platform, is hardwired for Llama 3.1 8B.
            </p>

            <PerformanceBars />

            <p className="text-muted leading-relaxed">
              Built by 24 people. $30M spent of more than $200M raised. The efficiency comes from total specialization: one chip, one model, compute in memory.
            </p>
            <p className="text-muted leading-relaxed">
              HC2, the second generation, adopts standard 4-bit floating-point formats with higher density and speed, targeting frontier-scale models.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Why This Matters</h2>
          <div className="space-y-5">
            <p className="text-muted leading-relaxed">
              If AI inference can be made 10-20× cheaper and more efficient, it changes what&apos;s possible. Real-time AI in every device. Inference at the edge. AI as utility infrastructure, not a luxury compute resource.
            </p>
            <p className="text-muted leading-relaxed">
              Total specialization—one chip, one model, compute in memory—is Taalas&apos;s bet on the path to ubiquitous AI.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-2">Silicon Vocabulary</h2>
          <p className="text-muted leading-relaxed text-sm mb-2">
            DRAM, CIM, HBM, ASIC—these acronyms get thrown around constantly in chip discussions, but they mean very specific things. Understanding the distinction helps the concepts above click into place.
          </p>
          <p className="text-muted-foreground text-xs mb-6">
            Interactive format inspired by{" "}
            <a href="https://how-terminals-work.vercel.app/" className="text-foreground hover:underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">How Terminals Work</a>.
          </p>
          <Glossary />
        </section>

        <div className="mt-16 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Based on{" "}
            <a href="https://taalas.com/the-path-to-ubiquitous-ai/" className="text-foreground hover:underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
              The Path to Ubiquitous AI, Visualized
            </a>{" "}
            by Taalas.
          </p>
        </div>
      </article>
    </main>
  );
}
