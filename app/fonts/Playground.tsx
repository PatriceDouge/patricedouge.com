"use client";

import { useState } from "react";
import { FONTS, PRESETS, byId, cssVar, type Preset } from "./catalog";

type PostRow = { slug: string; title: string; date: string };

const GROUPS = [
  { kind: "mono" as const, label: "Monospace" },
  { kind: "sans" as const, label: "Sans" },
  { kind: "serif" as const, label: "Serif" },
];

function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-[13px] text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {GROUPS.map((group) => (
          <optgroup key={group.kind} label={group.label}>
            {FONTS.filter((f) => f.kind === group.kind).map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  format,
  ticks,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  ticks?: number[];
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
        <span className="tabular-nums normal-case tracking-normal text-zinc-400">
          {format(value)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-300 accent-zinc-900 dark:bg-zinc-700 dark:accent-zinc-100"
      />
      {ticks && (
        <span className="flex gap-1">
          {ticks.map((t) => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={
                "rounded px-1.5 py-0.5 text-[10px] tabular-nums transition-colors " +
                (value === t
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800")
              }
            >
              {format(t)}
            </button>
          ))}
        </span>
      )}
    </label>
  );
}

export function Playground({ posts }: { posts: PostRow[] }) {
  const [body, setBody] = useState("fragment");
  const [chrome, setChrome] = useState("fragment");
  const [size, setSize] = useState(14);
  const [tracking, setTracking] = useState(-0.01);
  const [leading, setLeading] = useState(1.75);
  const [weight, setWeight] = useState(400);
  const [dark, setDark] = useState(true);
  const [blurb, setBlurb] = useState(PRESETS[0].blurb);

  const applyPreset = (preset: Preset) => {
    setBody(preset.body);
    setChrome(preset.chrome);
    setSize(preset.size);
    setTracking(preset.tracking);
    setLeading(preset.leading);
    setWeight(preset.body === "dm" ? 300 : 400);
    setBlurb(preset.blurb);
  };

  const bodyFont = byId(body);
  const chromeFont = byId(chrome);

  const bodyStyle = {
    fontFamily: cssVar(body),
    fontSize: `${size}px`,
    letterSpacing: `${tracking}em`,
    lineHeight: leading,
    fontWeight: weight,
  } as const;

  const chromeStyle = { fontFamily: cssVar(chrome) } as const;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      {/* ---------------- controls ---------------- */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/85 backdrop-blur dark:border-zinc-800 dark:bg-black/85">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {PRESETS.map((preset) => {
              const active = preset.body === body && preset.chrome === chrome;
              return (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className={
                    "rounded-full border px-3 py-1 text-[12px] transition-colors " +
                    (active
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500")
                  }
                >
                  {preset.label}
                </button>
              );
            })}
            <button
              onClick={() => setDark((d) => !d)}
              className="ml-auto rounded-full border border-zinc-300 px-3 py-1 text-[12px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            >
              Preview: {dark ? "dark" : "light"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-6">
            <FontSelect label="Body" value={body} onChange={setBody} />
            <FontSelect label="Chrome / meta" value={chrome} onChange={setChrome} />
            <Slider
              label="Size"
              value={size}
              min={12}
              max={20}
              step={0.5}
              format={(v) => `${v}px`}
              ticks={[13, 13.5, 14, 15]}
              onChange={setSize}
            />
            <Slider
              label="Tracking"
              value={tracking}
              min={-0.03}
              max={0.04}
              step={0.002}
              format={(v) => `${v.toFixed(3)}em`}
              onChange={setTracking}
            />
            <Slider
              label="Leading"
              value={leading}
              min={1.4}
              max={2}
              step={0.025}
              format={(v) => v.toFixed(3)}
              onChange={setLeading}
            />
            <Slider
              label="Weight"
              value={weight}
              min={300}
              max={600}
              step={100}
              format={(v) => String(v)}
              onChange={setWeight}
            />
          </div>

          <p className="mt-3 text-[12px] leading-relaxed text-zinc-500">
            <span className="text-zinc-700 dark:text-zinc-300">{bodyFont.name}</span>{" "}
            {bodyFont.note}
            {chrome !== body && (
              <>
                {" · "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {chromeFont.name}
                </span>{" "}
                {chromeFont.note}
              </>
            )}
            {blurb && <span className="block pt-1 italic">{blurb}</span>}
          </p>
        </div>
      </div>

      {/* ---------------- specimen ---------------- */}
      <div className={dark ? "dark" : ""}>
        <div className="bg-background text-foreground">
          <div className="mx-auto max-w-5xl px-6 py-10">
            {/* letterform tells */}
            <div className="mb-10 space-y-2 border-b border-border pb-8">
              <p
                className="text-muted-foreground"
                style={{ ...bodyStyle, fontSize: `${size + 6}px` }}
              >
                Hamburgefonstiv 0123456789
              </p>
              <p
                className="text-muted-foreground"
                style={{ ...bodyStyle, fontSize: `${size + 6}px` }}
              >
                Il1 O0 aegg {"{}"} () =&gt; &amp; @ # $ %
              </p>
            </div>

            {/* the actual homepage, in the chosen type */}
            <main className="mx-auto max-w-xl py-4">
              <div className="mb-16 flex items-start justify-between">
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={chromeStyle}
                >
                  PD
                </span>
                <span className="text-sm text-muted-foreground" style={chromeStyle}>
                  ☾
                </span>
              </div>

              <header className="mb-16 space-y-5">
                <p className="text-muted" style={bodyStyle}>
                  I&apos;m Patrice Dougé, a software engineer at{" "}
                  <span className="text-foreground underline underline-offset-2">
                    Wistia
                  </span>
                  . Born in Pétion-Ville, Haiti, currently based in Sarasota, FL.
                  These days I&apos;m learning as much as I can about coding
                  agents, AI and how to build products users love. Most of my
                  time I&apos;m either{" "}
                  <span className="text-foreground underline underline-offset-2">
                    coding
                  </span>
                  ,{" "}
                  <span className="text-foreground underline underline-offset-2">
                    training
                  </span>
                  , or being a girl dad of two.
                </p>
                <p className="text-muted" style={bodyStyle}>
                  It&apos;s an incredible time to be a software engineer.
                  It&apos;s empowering to know how much leverage we have with AI
                  tools, but it can also be overwhelming with all the different
                  ways of doing things. There&apos;s an interesting tension
                  between shipping code with craft and shipping fast as long as
                  it works.
                </p>
                <p className="text-muted" style={bodyStyle}>
                  I&apos;m working to find that balance and continue growing as
                  an engineer. This is where I share what I&apos;m learning along
                  the way.
                </p>
              </header>

              <section>
                <h2
                  className="mb-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                  style={chromeStyle}
                >
                  Writing
                </h2>
                <ul className="space-y-0">
                  {posts.map((post) => (
                    <li
                      key={post.slug}
                      className="flex items-baseline justify-between gap-4 border-b border-border py-3"
                    >
                      <span
                        className="text-foreground/85"
                        style={{ ...bodyStyle, lineHeight: 1.4 }}
                      >
                        {post.title}
                      </span>
                      <span
                        className="shrink-0 text-sm tabular-nums text-muted-foreground"
                        style={chromeStyle}
                      >
                        {post.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <footer className="mt-16 border-t border-border pt-6">
                <p
                  className="text-sm text-muted-foreground"
                  style={chromeStyle}
                >
                  10:41pm in Sarasota, Florida
                </p>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
