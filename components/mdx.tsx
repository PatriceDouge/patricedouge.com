import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, ComponentPropsWithoutRef } from "react";

import {
  AnimatedBar,
  AnimatedNumber,
  BarGroup,
  BarLabel,
  FadeIn,
  Figure,
  KeyStat,
  KeyStats,
  Points,
  SectionDivider,
  Sources,
} from "@/components/PhilosophyShared";
import { PhilosophyWeeks } from "@/components/PhilosophyWeeks";

/*
 * The vocabulary every content file renders through. Element renderers carry
 * the classes the hand-written articles used, so markdown copy and the JSX it
 * replaced come out pixel-identical.
 *
 * Vertical rhythm: articles used `space-y-5` on a paragraph wrapper. Markdown
 * has no wrapper, so each block element re-creates the same 1.25rem gap with an
 * adjacent-sibling rule against the block types that can precede it.
 */
const BLOCK_RHYTHM =
  "[p+&]:mt-5 [ul+&]:mt-5 [ol+&]:mt-5 [blockquote+&]:mt-5";

const linkClass =
  "text-foreground hover:underline underline-offset-2 transition-colors";

function A({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/")) {
    return <Link href={href} className={linkClass} {...props} />;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={linkClass}
      {...props}
    />
  );
}

export const mdxComponents: MDXComponents = {
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className={`text-muted leading-relaxed ${BLOCK_RHYTHM}`} {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-xl font-semibold mt-16 mb-4" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-base font-semibold mt-8 mb-3" {...props} />
  ),
  a: A,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-foreground" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={`list-disc pl-5 space-y-2 text-muted-foreground ${BLOCK_RHYTHM}`}
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={`list-decimal pl-5 space-y-2 text-muted-foreground ${BLOCK_RHYTHM}`}
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={`border-l-2 border-border pl-4 text-muted-foreground ${BLOCK_RHYTHM}`}
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="text-foreground" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="rounded-lg border border-border p-4 overflow-x-auto text-xs my-6"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-border" {...props} />
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg border border-border"
      loading="lazy"
      alt=""
      {...props}
    />
  ),

  // ── Tables ────────────────────────
  // Matches the philosophies "Quick Comparison" table exactly. The wrapper has
  // to live on the table itself: markdown gives us no place to put a parent.
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className={`overflow-x-auto border border-border rounded-lg ${BLOCK_RHYTHM}`}>
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => <thead {...props} />,
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="text-muted-foreground" {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr
      className="border-border [thead_&]:border-b [thead_&]:bg-muted-foreground/5 [tbody_&:not(:last-child)]:border-b"
      {...props}
    />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="text-left p-3 font-medium" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="p-3 first:text-foreground" {...props} />
  ),

  // ── Named components ──────────────
  Figure,
  KeyStats,
  KeyStat,
  BarGroup,
  BarLabel,
  AnimatedBar,
  AnimatedNumber,
  Points,
  SectionDivider,
  Sources,
  FadeIn,
  PhilosophyWeeks,
};
