export type FontKind = "mono" | "sans" | "serif";

export type FontEntry = {
  id: string;
  name: string;
  kind: FontKind;
  note: string;
};

/** CSS variable for a font id — must match the variables set in app/fonts/layout.tsx */
export const cssVar = (id: string) => `var(--fp-${id})`;

export const FONTS: FontEntry[] = [
  // --- monospace ---
  {
    id: "fragment",
    name: "Fragment Mono",
    kind: "mono",
    note: "Helvetica Monospaced revival. The most 'beautiful terminal' font on Google Fonts. Regular + italic only — no bold.",
  },
  {
    id: "dm",
    name: "DM Mono",
    kind: "mono",
    note: "Warm, humanist, low contrast. The 300 weight reads beautifully as body copy.",
  },
  {
    id: "spline",
    name: "Spline Sans Mono",
    kind: "mono",
    note: "The closest free stand-in for Commit Mono. Neutral, tight, modern.",
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    kind: "mono",
    note: "Tall x-height, very legible. Common enough that it reads 'developer' instantly.",
  },
  {
    id: "plexmono",
    name: "IBM Plex Mono",
    kind: "mono",
    note: "Slab-ish terminals. Editorial, a bit warmer than the rest.",
  },
  {
    id: "martian",
    name: "Martian Mono",
    kind: "mono",
    note: "Wide and engineered. Too loud for body copy, excellent for labels and dates.",
  },
  {
    id: "sometype",
    name: "Sometype Mono",
    kind: "mono",
    note: "Quiet grotesque mono. Sits between Fragment and Spline.",
  },
  {
    id: "geistmono",
    name: "Geist Mono",
    kind: "mono",
    note: "What the site already loads. Vercel's mono — clean, slightly rounded.",
  },
  {
    id: "spacemono",
    name: "Space Mono",
    kind: "mono",
    note: "Quirky, high personality. Distinctive but dates quickly.",
  },

  // --- sans ---
  {
    id: "geist",
    name: "Geist",
    kind: "sans",
    note: "The current body font. Neutral but a little generic in 2026.",
  },
  {
    id: "inter",
    name: "Inter",
    kind: "sans",
    note: "The workhorse. Invisible in a good way — closest to what benji.org gets from system SF.",
  },
  {
    id: "instrumentsans",
    name: "Instrument Sans",
    kind: "sans",
    note: "Slightly condensed grotesque with real character. Underused.",
  },
  {
    id: "plexsans",
    name: "IBM Plex Sans",
    kind: "sans",
    note: "Pairs perfectly with IBM Plex Mono — same skeleton, so mixing is seamless.",
  },

  // --- serif ---
  {
    id: "newsreader",
    name: "Newsreader",
    kind: "serif",
    note: "Screen-first text serif. Gorgeous for prose, contrasts hard against a mono chrome.",
  },
  {
    id: "instrumentserif",
    name: "Instrument Serif",
    kind: "serif",
    note: "Display serif. Headings only, never body.",
  },
];

export const byId = (id: string): FontEntry => FONTS.find((f) => f.id === id) ?? FONTS[0];

export type Preset = {
  label: string;
  body: string;
  chrome: string;
  blurb: string;
  size: number;
  tracking: number;
  leading: number;
};

export const PRESETS: Preset[] = [
  {
    label: "All Fragment",
    body: "fragment",
    chrome: "fragment",
    blurb: "Full commitment to mono. Weight can't carry hierarchy, so size and color do.",
    size: 14,
    tracking: -0.01,
    leading: 1.75,
  },
  {
    label: "All Spline",
    body: "spline",
    chrome: "spline",
    blurb: "The safest all-mono setup. Has real weights, so headings still work.",
    size: 15,
    tracking: 0,
    leading: 1.7,
  },
  {
    label: "DM Mono Light",
    body: "dm",
    chrome: "dm",
    blurb: "300 weight body. Softest of the all-mono options.",
    size: 15,
    tracking: 0,
    leading: 1.75,
  },
  {
    label: "Inter + Fragment",
    body: "inter",
    chrome: "fragment",
    blurb: "Mono only on dates, labels and code. This is the pattern benji.org uses.",
    size: 16,
    tracking: -0.011,
    leading: 1.65,
  },
  {
    label: "Plex Sans + Plex Mono",
    body: "plexsans",
    chrome: "plexmono",
    blurb: "One family, two voices. Mixes without any seam.",
    size: 16,
    tracking: 0,
    leading: 1.7,
  },
  {
    label: "Newsreader + Martian",
    body: "newsreader",
    chrome: "martian",
    blurb: "Maximum contrast: literary prose against engineered metadata.",
    size: 18,
    tracking: 0,
    leading: 1.65,
  },
  {
    label: "Old (Geist)",
    body: "geist",
    chrome: "geistmono",
    blurb: "The previous baseline, before the Fragment Mono switch.",
    size: 16,
    tracking: 0,
    leading: 1.625,
  },
];
