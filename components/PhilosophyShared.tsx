"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  motion,
  useInView,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";

export const mono = {
  fontFamily: "var(--font-geist-mono, ui-monospace, monospace)",
};

// ── Figure ──────────────────────────

export function Figure({
  children,
  caption,
}: {
  children: ReactNode;
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

// ── AnimatedNumber ──────────────────

export function AnimatedNumber({
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

// ── AnimatedBar ─────────────────────

export function AnimatedBar({
  percent,
  color = "var(--accent)",
  delay = 0,
  height = 24,
  label,
  showPercent = true,
}: {
  percent: number;
  color?: string;
  delay?: number;
  height?: number;
  label?: string;
  showPercent?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="flex items-center gap-3">
      {label && (
        <span
          className="text-xs text-muted-foreground shrink-0 w-20 text-right"
          style={mono}
        >
          {label}
        </span>
      )}
      <div className="flex-1 relative" style={{ height }}>
        <div
          className="absolute inset-0 rounded"
          style={{ background: color, opacity: 0.08 }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded"
          style={{ background: color, opacity: 0.35 }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : { width: 0 }}
          transition={{ delay, duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showPercent && (
        <span className="text-xs text-muted-foreground w-10" style={mono}>
          {percent}%
        </span>
      )}
    </div>
  );
}

// ── SectionDivider ──────────────────

export function SectionDivider({ text }: { text: string }) {
  return (
    <div className="my-10 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      <span>{text}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// ── ExternalLink ────────────────────

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-foreground hover:underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}

// ── KeyStat ─────────────────────────

export function KeyStat({
  value,
  label,
  format,
}: {
  value: number;
  label: string;
  format?: (n: number) => string;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-accent" style={mono}>
        <AnimatedNumber value={value} format={format} />
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

// ── ComparisonGrid ──────────────────

export function ComparisonGrid({
  left,
  right,
  leftLabel,
  rightLabel,
}: {
  left: ReactNode;
  right: ReactNode;
  leftLabel: string;
  rightLabel: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
          {leftLabel}
        </div>
        {left}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      >
        <div className="text-xs text-accent mb-3 font-medium uppercase tracking-wider">
          {rightLabel}
        </div>
        {right}
      </motion.div>
    </div>
  );
}

// ── ArticleLayout ───────────────────

export function ArticleLayout({
  title,
  subtitle,
  children,
  accentColor,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
}) {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24 bg-background text-foreground transition-colors">
      <article className="mx-auto max-w-xl">
        <div className="flex justify-between items-center">
          <Link
            href="/training/philosophies"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; All Philosophies
          </Link>
          <ThemeToggle />
        </div>

        <header className="mt-8 mb-12">
          {accentColor && (
            <div
              className="w-10 h-1 rounded mb-4"
              style={{ background: accentColor }}
            />
          )}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </header>

        {children}

        <div className="mt-16 pt-6 border-t border-border">
          <Link
            href="/training/philosophies"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to All Philosophies
          </Link>
        </div>
      </article>
    </main>
  );
}
