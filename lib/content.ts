// Server-only: reads the filesystem and compiles MDX at build time. Never
// import this from a client component.
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";
import { createElement, type ComponentType } from "react";

import { mdxComponents } from "@/components/mdx";
import { diagrams } from "@/components/diagrams";

export type Collection = "posts" | "philosophies" | "pages";

const contentDirectory = path.join(process.cwd(), "content");

// ── Frontmatter shapes ──────────────

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  visible: boolean;
}

export interface PhilosophyMeta {
  slug: string;
  title: string;
  subtitle: string;
  name: string;
  tagline: string;
  stat: string;
  statLabel: string;
  accent: string;
  /** Optional override for the article's accent bar when it differs from the card. */
  accentBar?: string;
  /** Optional override for the `<title>` prefix when it differs from the h1. */
  metaTitle?: string;
  order: number;
  description: string;
}

export interface PageMeta {
  slug: string;
  title: string;
  [key: string]: unknown;
}

export type Meta = PostMeta | PhilosophyMeta | PageMeta;

// ── Validation ──────────────────────

class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
    this.name = "ContentError";
  }
}

function requireString(
  data: Record<string, unknown>,
  key: string,
  file: string
): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new ContentError(
      file,
      `frontmatter key "${key}" is required and must be a non-empty string (got ${JSON.stringify(value)})`
    );
  }
  return value;
}

function optionalString(
  data: Record<string, unknown>,
  key: string,
  file: string,
  fallback = ""
): string {
  const value = data[key];
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") {
    throw new ContentError(file, `frontmatter key "${key}" must be a string`);
  }
  return value;
}

function validatePost(
  data: Record<string, unknown>,
  slug: string,
  file: string
): PostMeta {
  const title = requireString(data, "title", file);
  const date = requireString(data, "date", file);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ContentError(
      file,
      `frontmatter key "date" must be YYYY-MM-DD (got "${date}")`
    );
  }
  const visible = data.visible === undefined ? true : data.visible;
  if (typeof visible !== "boolean") {
    throw new ContentError(file, `frontmatter key "visible" must be a boolean`);
  }
  return {
    slug,
    title,
    date,
    description: optionalString(data, "description", file),
    visible,
  };
}

function validatePhilosophy(
  data: Record<string, unknown>,
  slug: string,
  file: string
): PhilosophyMeta {
  const accent = requireString(data, "accent", file);
  if (!/^#[0-9a-fA-F]{3,8}$/.test(accent)) {
    throw new ContentError(
      file,
      `frontmatter key "accent" must be a hex colour (got "${accent}")`
    );
  }
  const order = data.order;
  if (typeof order !== "number" || !Number.isInteger(order)) {
    throw new ContentError(
      file,
      `frontmatter key "order" is required and must be an integer (got ${JSON.stringify(order)})`
    );
  }
  return {
    slug,
    title: requireString(data, "title", file),
    subtitle: requireString(data, "subtitle", file),
    name: requireString(data, "name", file),
    tagline: requireString(data, "tagline", file),
    stat: requireString(data, "stat", file),
    statLabel: requireString(data, "statLabel", file),
    accent,
    ...(data.accentBar === undefined
      ? {}
      : { accentBar: requireString(data, "accentBar", file) }),
    ...(data.metaTitle === undefined
      ? {}
      : { metaTitle: requireString(data, "metaTitle", file) }),
    order,
    description: requireString(data, "description", file),
  };
}

function validatePage(
  data: Record<string, unknown>,
  slug: string,
  file: string
): PageMeta {
  return { ...data, slug, title: requireString(data, "title", file) };
}

function validate(
  collection: Collection,
  data: Record<string, unknown>,
  slug: string,
  file: string
): Meta {
  switch (collection) {
    case "posts":
      return validatePost(data, slug, file);
    case "philosophies":
      return validatePhilosophy(data, slug, file);
    case "pages":
      return validatePage(data, slug, file);
  }
}

// ── Filesystem ──────────────────────

interface SourceFile {
  slug: string;
  filePath: string;
  /** Relative to the repo root, for error messages. */
  label: string;
  format: "md" | "mdx";
}

function listSourceFiles(collection: Collection): SourceFile[] {
  const dir = path.join(contentDirectory, collection);
  if (!fs.existsSync(dir)) return [];

  const bySlug = new Map<string, SourceFile>();
  for (const fileName of fs.readdirSync(dir).sort()) {
    const match = /^(.+)\.(md|mdx)$/.exec(fileName);
    if (!match) continue;
    const [, slug, ext] = match;
    if (bySlug.has(slug)) {
      throw new ContentError(
        `content/${collection}/${fileName}`,
        `both .md and .mdx exist for slug "${slug}"; keep exactly one`
      );
    }
    bySlug.set(slug, {
      slug,
      filePath: path.join(dir, fileName),
      label: `content/${collection}/${fileName}`,
      format: ext as "md" | "mdx",
    });
  }
  return [...bySlug.values()];
}

function readMeta(collection: Collection, source: SourceFile): Meta {
  const raw = fs.readFileSync(source.filePath, "utf8");
  const { data } = matter(raw);
  return validate(collection, data, source.slug, source.label);
}

// ── Public API ──────────────────────

export function getPosts(): PostMeta[] {
  return listSourceFiles("posts")
    .map((source) => readMeta("posts", source) as PostMeta)
    .filter((post) => post.visible)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPhilosophies(): PhilosophyMeta[] {
  return listSourceFiles("philosophies")
    .map((source) => readMeta("philosophies", source) as PhilosophyMeta)
    .sort((a, b) => a.order - b.order);
}

export function getSlugs(collection: Collection): string[] {
  return listSourceFiles(collection).map((source) => source.slug);
}

export interface LoadedDocument<M extends Meta = Meta> {
  meta: M;
  Content: ComponentType;
}

export async function loadDocument<M extends Meta = Meta>(
  collection: Collection,
  slug: string,
  extraComponents?: MDXComponents
): Promise<LoadedDocument<M> | null> {
  const source = listSourceFiles(collection).find((f) => f.slug === slug);
  if (!source) return null;

  const raw = fs.readFileSync(source.filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = validate(collection, data, slug, source.label) as M;

  const components: MDXComponents = {
    ...mdxComponents,
    ...(diagrams[slug] ?? {}),
    ...(extraComponents ?? {}),
  };

  let compiled;
  try {
    compiled = await evaluate(content, {
      ...runtime,
      format: source.format,
      remarkPlugins: [remarkGfm],
      development: false,
    });
  } catch (error) {
    throw new ContentError(
      source.label,
      `failed to compile: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const MDXContent = compiled.default as ComponentType<{
    components?: MDXComponents;
  }>;

  const Content: ComponentType = () => createElement(MDXContent, { components });
  Content.displayName = `Content(${collection}/${slug})`;

  return { meta, Content };
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
}
