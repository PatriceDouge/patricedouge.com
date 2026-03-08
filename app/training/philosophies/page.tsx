"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const philosophies = [
  {
    slug: "norwegian",
    name: "Norwegian Singles",
    tagline: "Lactate-guided threshold training",
    stat: "80%",
    statLabel: "easy volume",
    color: "#3b82f6",
  },
  {
    slug: "mantz-eyestone",
    name: "Mantz / Eyestone",
    tagline: "Marathon-specific progressive long runs",
    stat: "7,000ft",
    statLabel: "altitude base",
    color: "#10b981",
  },
  {
    slug: "hansons",
    name: "Hansons",
    tagline: "Cumulative fatigue over weekly consistency",
    stat: "16mi",
    statLabel: "max long run",
    color: "#f59e0b",
  },
  {
    slug: "polarized",
    name: "Polarized 80/20",
    tagline: "Clear hard/easy separation",
    stat: "80/20",
    statLabel: "intensity split",
    color: "#ef4444",
  },
];

function PhilosophyCard({
  slug,
  name,
  tagline,
  stat,
  statLabel,
  color,
  index,
}: (typeof philosophies)[number] & { index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/training/philosophies/${slug}`}
        className="group block rounded-lg border border-border hover:border-muted-foreground/30 transition-colors p-5 h-full"
      >
        <div className="flex gap-4">
          <div
            className="w-1 rounded-full shrink-0"
            style={{ background: color }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold group-hover:text-accent transition-colors">
              {name}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{tagline}</p>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span
                className="text-lg font-bold"
                style={{
                  color,
                  fontFamily:
                    "var(--font-geist-mono, ui-monospace, monospace)",
                }}
              >
                {stat}
              </span>
              <span className="text-xs text-muted-foreground">{statLabel}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TrainingPhilosophiesPage() {
  const tableRef = useRef(null);
  const tableInView = useInView(tableRef, { once: true, amount: 0.2 });

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 md:py-12 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/training"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; Back To Training
          </Link>
          <ThemeToggle />
        </div>

        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight mb-3">
            Running Training Philosophies
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Four systems worth studying. Each card links to a deep-dive with
            animated diagrams, key workouts, and research context.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {philosophies.map((p, i) => (
            <PhilosophyCard key={p.slug} {...p} index={i} />
          ))}
        </div>

        <motion.section
          ref={tableRef}
          initial={{ opacity: 0, y: 12 }}
          animate={tableInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-xl font-semibold mb-4">Quick Comparison</h2>
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted-foreground/5">
                  <th className="text-left p-3 font-medium">Philosophy</th>
                  <th className="text-left p-3 font-medium">Primary Benefit</th>
                  <th className="text-left p-3 font-medium">Best Use Case</th>
                  <th className="text-left p-3 font-medium">Common Risk</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Norwegian Singles</td>
                  <td className="p-3">Sustainable LT development</td>
                  <td className="p-3">Frequent quality with controlled intensity</td>
                  <td className="p-3">Doing threshold too hard, too often</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Mantz/Eyestone</td>
                  <td className="p-3">Late-race durability</td>
                  <td className="p-3">10M/HM/FM blocks needing strong closes</td>
                  <td className="p-3">Long runs too hard too soon</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Hansons</td>
                  <td className="p-3">Cumulative fatigue resilience</td>
                  <td className="p-3">Athletes thriving on consistent rhythm</td>
                  <td className="p-3">Insufficient recovery on easy days</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground">Polarized 80/20</td>
                  <td className="p-3">Better hard/easy separation</td>
                  <td className="p-3">When overall stress is high</td>
                  <td className="p-3">Not enough race-specific work</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        <section className="mt-12 mb-8">
          <h2 className="text-xl font-semibold mb-3">
            How To Blend These In Practice
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              Keep your base structure from Norwegian Singles (Mon/Wed LT, Sat
              long, Sun recovery).
            </li>
            <li>
              Borrow Mantz/Eyestone long-run progressions every 1-2 weeks to
              improve finish strength.
            </li>
            <li>
              Borrow Hansons cumulative-fatigue logic by protecting weekday
              consistency.
            </li>
            <li>
              Use polarized thinking as guardrails: most non-key days should feel
              intentionally easy.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
