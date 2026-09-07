"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface PhilosophyCardData {
  slug: string;
  name: string;
  tagline: string;
  stat: string;
  statLabel: string;
  accent: string;
}

function PhilosophyCard({
  slug,
  name,
  tagline,
  stat,
  statLabel,
  accent,
  index,
}: PhilosophyCardData & { index: number }) {
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
            style={{ background: accent }}
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
                  color: accent,
                  fontFamily:
                    "var(--font-fragment-mono, ui-monospace, monospace)",
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

export function PhilosophyCards({ items }: { items: PhilosophyCardData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
      {items.map((p, i) => (
        <PhilosophyCard key={p.slug} {...p} index={i} />
      ))}
    </div>
  );
}
