"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhilosophyWeeks } from "@/components/PhilosophyWeeks";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const philosophies = [
  {
    slug: "lydiard",
    name: "Arthur Lydiard",
    tagline: "Aerobic base-first sequential periodization",
    stat: "6",
    statLabel: "Olympic medals",
    color: "#8b5cf6",
  },
  {
    slug: "daniels",
    name: "Jack Daniels / VDOT",
    tagline: "Physiological pace zones & purpose-driven training",
    stat: "5",
    statLabel: "pace zones",
    color: "#06b6d4",
  },
  {
    slug: "canova",
    name: "Renato Canova",
    tagline: "Extending race-pace volume via specific endurance",
    stat: "50+",
    statLabel: "world medals coached",
    color: "#f97316",
  },
  {
    slug: "pfitzinger",
    name: "Pete Pfitzinger",
    tagline: "High aerobic volume & medium-long runs",
    stat: "22mi",
    statLabel: "peak long run",
    color: "#14b8a6",
  },
  {
    slug: "tinman",
    name: "Tinman Schwartz",
    tagline: "Critical velocity & controlled quality",
    stat: "CV",
    statLabel: "pace fulcrum",
    color: "#eab308",
  },
  {
    slug: "hudson",
    name: "Brad Hudson",
    tagline: "Adaptive, effort-based targeted training",
    stat: "0",
    statLabel: "pace charts",
    color: "#ec4899",
  },
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
            Ten systems worth studying. Each card links to a deep-dive with
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
                  <td className="p-3 text-foreground">Lydiard</td>
                  <td className="p-3">Massive aerobic engine</td>
                  <td className="p-3">Patient athletes targeting a single peak</td>
                  <td className="p-3">Volume too high too soon</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Daniels / VDOT</td>
                  <td className="p-3">Precise, purpose-driven pacing</td>
                  <td className="p-3">Data-driven runners with recent race results</td>
                  <td className="p-3">Overly rigid pace targets on off days</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Canova</td>
                  <td className="p-3">Race-pace specificity from day one</td>
                  <td className="p-3">Serious half/full marathon athletes</td>
                  <td className="p-3">Special blocks too demanding without recovery</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Pfitzinger</td>
                  <td className="p-3">Unmatched endurance development</td>
                  <td className="p-3">Experienced marathoners wanting structure</td>
                  <td className="p-3">Rapid mileage ramp-up causing injury</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Tinman</td>
                  <td className="p-3">Sustainable aerobic power gains</td>
                  <td className="p-3">5K-10K runners, injury-prone athletes</td>
                  <td className="p-3">Insufficient race-specific speed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 text-foreground">Hudson</td>
                  <td className="p-3">Individualized, adaptive training</td>
                  <td className="p-3">Self-aware runners who think about training</td>
                  <td className="p-3">Too vague for beginners without coaching instinct</td>
                </tr>
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

        <div className="mt-16">
          <PhilosophyWeeks />
        </div>

        <section className="mt-12 mb-8">
          <h2 className="text-xl font-semibold mb-3">
            How To Blend These In Practice
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              Build your aerobic foundation first (Lydiard), then layer in
              purpose-driven quality work (Daniels).
            </li>
            <li>
              Use Norwegian Singles structure for weekly rhythm (Mon/Wed
              threshold, Sat long, Sun recovery).
            </li>
            <li>
              Borrow Canova&rsquo;s specificity as the race nears: extend how
              long you can hold goal pace.
            </li>
            <li>
              Add Pfitzinger&rsquo;s medium-long run mid-week for a second
              endurance stimulus.
            </li>
            <li>
              Incorporate Tinman CV work as a sustainable quality session that
              won&rsquo;t fry you.
            </li>
            <li>
              Apply Hudson&rsquo;s adaptive mindset: plan in pencil, adjust
              daily based on readiness.
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
