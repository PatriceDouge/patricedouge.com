import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { ArticleLayout } from "@/components/ArticleLayout";
import { getSlugs, loadDocument, type PhilosophyMeta } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getSlugs("philosophies").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await loadDocument<PhilosophyMeta>("philosophies", slug);

  if (!doc) {
    return { title: "Not Found" };
  }

  return {
    title: `${doc.meta.metaTitle ?? doc.meta.title} — Training Philosophies`,
    description: doc.meta.description,
  };
}

export default async function PhilosophyPage({ params }: Props) {
  const { slug } = await params;
  const doc = await loadDocument<PhilosophyMeta>("philosophies", slug);

  if (!doc) {
    notFound();
  }

  const { meta, Content } = doc;

  return (
    <ArticleLayout
      title={meta.title}
      subtitle={meta.subtitle}
      accent={meta.accentBar ?? meta.accent}
      backHref="/training/philosophies"
      backLabel="&larr; All Philosophies"
      footer={
        <Link
          href="/training/philosophies"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to All Philosophies
        </Link>
      }
    >
      <Content />
    </ArticleLayout>
  );
}
