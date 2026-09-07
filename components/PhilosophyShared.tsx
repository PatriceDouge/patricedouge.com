"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

export const mono = {
  fontFamily: "var(--font-fragment-mono, ui-monospace, monospace)",
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

// ── BarLabel / BarGroup ─────────────

/**
 * The uppercase micro-label that titles a run of `AnimatedBar`s. Pass `spaced`
 * for a second label inside the same group, and `accent` where the source
 * highlighted the contrasting model.
 */
export function BarLabel({
  children,
  spaced = false,
  accent = false,
  mono: useMono = false,
}: {
  children: ReactNode;
  spaced?: boolean;
  accent?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      className={[
        "text-xs mb-2 font-medium uppercase tracking-wider",
        accent ? "text-accent" : "text-muted-foreground",
        spaced ? "mt-6" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={useMono ? mono : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Wrapper for a run of `AnimatedBar`s. `caption` renders as a sibling below the
 * group, not inside it, which is where the hand-written articles put it.
 */
export function BarGroup({
  title,
  caption,
  mono: useMono = false,
  children,
}: {
  title?: string;
  caption?: string;
  mono?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <div className="my-8 space-y-3">
        {title && <BarLabel mono={useMono}>{title}</BarLabel>}
        {children}
      </div>
      {caption && (
        <p
          className="text-xs text-muted-foreground text-center mb-8"
          style={useMono ? mono : undefined}
        >
          {caption}
        </p>
      )}
    </>
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

// ── KeyStat / KeyStats ──────────────

/**
 * Number formatting crosses the server/client boundary, so it is named by a
 * string preset rather than passed as a function.
 */
export type StatFormat = "locale" | "integer" | "decimal1" | "marathon";

function formatMarathon(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function statFormatter(
  format: StatFormat,
  suffix: string,
  suffixFrom: number
): (n: number) => string {
  const base: (n: number) => string =
    format === "integer"
      ? (n) => Math.round(n).toString()
      : format === "decimal1"
        ? (n) => n.toFixed(1)
        : format === "marathon"
          ? (n) => formatMarathon(n)
          : (n) => Math.round(n).toLocaleString();

  return (n) =>
    base(n) + (suffix && Math.round(n) >= suffixFrom ? suffix : "");
}

export function KeyStat({
  value,
  label,
  color,
  format = "locale",
  suffix = "",
  suffixFrom = 0,
}: {
  value: number;
  label: string;
  color?: string;
  format?: StatFormat;
  /** Appended to the formatted number, e.g. "%" or "+". */
  suffix?: string;
  /** Hold the suffix back until the counter passes this value. */
  suffixFrom?: number;
}) {
  const style: CSSProperties = color ? { ...mono, color } : mono;
  return (
    <div className="text-center">
      <div
        className={color ? "text-2xl font-bold" : "text-2xl font-bold text-accent"}
        style={style}
      >
        <AnimatedNumber
          value={value}
          format={statFormatter(format, suffix, suffixFrom)}
        />
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

/**
 * Column counts are a static map: Tailwind only emits classes it can see as
 * literal strings.
 */
const KEY_STATS_COLS = {
  2: "my-10 grid grid-cols-2 gap-4",
  3: "my-10 grid grid-cols-3 gap-4",
  4: "grid grid-cols-2 sm:grid-cols-4 gap-6 my-8",
} as const;

export function KeyStats({
  cols = 3,
  children,
}: {
  cols?: 2 | 3 | 4;
  children: ReactNode;
}) {
  return <div className={KEY_STATS_COLS[cols]}>{children}</div>;
}

// ── Sources ─────────────────────────

const SOURCES_GAP = {
  2: "space-y-2",
  3: "space-y-3",
} as const;

/**
 * The closing "Sources" / "Sources & Further Reading" block. Its children come
 * from markdown, so the body-copy defaults are overridden back to the smaller,
 * muted treatment the articles used. Both flavours are supported: a run of
 * paragraphs (annotated sources) and a bare list (link-only sources).
 */
export function Sources({
  gap = 3,
  children,
}: {
  gap?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        SOURCES_GAP[gap],
        "text-sm text-muted-foreground",
        // `text-sm` carries a 1.25rem line-height; the body-copy `leading-relaxed`
        // on markdown paragraphs has to be put back to it.
        "[&>p]:mt-0! [&>p]:text-muted-foreground! [&>p]:leading-5!",
        "[&>ul]:list-none [&>ul]:pl-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/**
 * A markdown list with roomier item spacing, for lists whose items run to
 * several lines each.
 */
export function Points({ children }: { children: ReactNode }) {
  return (
    <div className="[p+&]:mt-5 [&>ul>li:not(:last-child)]:mb-3!">
      {children}
    </div>
  );
}

// ── FadeIn ──────────────────────────

export function FadeIn({ children }: { children: ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
