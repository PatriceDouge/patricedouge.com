# Content

All prose on this site lives here. Pages under `app/` are chrome and data
plumbing; they hold no copy. Adding a post is creating one file.

## Collections

| Directory | What it holds | Rendered by |
|---|---|---|
| `posts/` | Blog posts, listed on `/` and `/writing` | `/posts/<slug>` |
| `philosophies/` | Training-philosophy deep dives | `/training/philosophies/<slug>` |
| `pages/` | Prose belonging to a specific page | that page |

The filename without its extension is the slug. A slug may exist once per
collection: `.md` **or** `.mdx`, never both.

## Frontmatter

**posts** — `title`, `date` (`YYYY-MM-DD`) required; `description` (default
`""`), `visible` (default `true`) optional.

```yaml
---
title: "How I use claude code"
date: "2026-01-19"
description: "My workflow for building software with AI."
---
```

**philosophies** — `title`, `subtitle`, `description`, `name`, `tagline`,
`stat`, `statLabel`, `accent` (hex), `order` (integer) all required.
`title`/`subtitle`/`accent` drive the article header; `name`/`tagline`/`stat`/
`statLabel`/`accent`/`order` drive the card on the index. Two optional escape
hatches: `accentBar` for an article accent bar that differs from the card
colour, and `metaTitle` for a `<title>` prefix that differs from the h1.

```yaml
---
title: "The Lydiard Method"
subtitle: "How Arthur Lydiard's aerobic base-first periodization…"
description: "Aerobic base-first sequential periodization…"
metaTitle: "Arthur Lydiard"
name: "Arthur Lydiard"
tagline: "Aerobic base-first sequential periodization"
stat: "6"
statLabel: "Olympic medals"
accent: "#8b5cf6"
order: 1
---
```

**pages** — `title` required; any other key is passed through to the page.

Validation runs at build time. A missing or malformed key fails `pnpm build`
with the file path and the offending key.

## `.md` vs `.mdx`

Use `.md` for pure prose. Use `.mdx` only when you embed a component — in MDX,
`<`, `{` and `}` are syntax and must be escaped (`\<`, `\{`) or reworded, and a
JSX block needs a blank line above and below it for markdown inside it to
parse.

## Vocabulary

Markdown elements are already styled to match the site; write plain markdown and
it comes out right. Links starting with `/` become `next/link`; the rest open in
a new tab. These components are available in any `.mdx` file:

```mdx
<SectionDivider text="THE TRAINING WEEK" />

<KeyStats>
  <KeyStat value={22} label="mile peak long run" />
</KeyStats>

<BarGroup title="Volume Distribution" caption="Optional line under the bars">
  <AnimatedBar percent={75} color="#22c55e" label="Easy" delay={0} />
  <BarLabel spaced>A second label in the same group</BarLabel>
</BarGroup>

<Figure caption="Optional caption">…</Figure>

<FadeIn>…</FadeIn>          <!-- fades its children in on scroll -->
<Points>…</Points>          <!-- a markdown list with roomier item spacing -->
<Sources>…</Sources>        <!-- the closing sources block; gap={2} for a bare list -->
<PhilosophyWeeks />
```

`KeyStat` takes `color`, `suffix`, and `format` (`"locale"`, `"integer"`,
`"decimal1"`, `"marathon"`). Formatting is a string preset, not a function:
props cross into client components and must stay serialisable.

## Diagrams

Per-article diagrams live in `components/diagrams/<slug>.tsx` and are scoped to
the document with that slug automatically — no import, no registration beyond
adding the module to `components/diagrams/index.ts`. Scoping is why seven
articles can each have their own `WeeklyStructureTimeline`. A reference to a
component that does not exist fails the build.

## Recipes

**Add a post.** Create `content/posts/<slug>.md`, add `title` and `date`, write.
It appears on `/` and `/writing`, and gets an OG image, automatically.

**Hide a post.** Set `visible: false`. It leaves the lists and gains `noindex`,
but still serves at its URL.

## Verify

```
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
