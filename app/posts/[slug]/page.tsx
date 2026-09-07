import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArticleLayout } from "@/components/ArticleLayout";
import { formatDate, getSlugs, loadDocument, type PostMeta } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getSlugs("posts").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await loadDocument<PostMeta>("posts", slug);

  if (!doc) {
    return { title: "Post Not Found" };
  }

  const { title, description, date, visible } = doc.meta;

  return {
    title,
    description,
    ...(visible ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const doc = await loadDocument<PostMeta>("posts", slug);

  if (!doc) {
    notFound();
  }

  const { meta, Content } = doc;

  return (
    <ArticleLayout
      title={meta.title}
      date={formatDate(meta.date)}
      backHref="/"
      backLabel="&larr; Back"
    >
      <Content />
    </ArticleLayout>
  );
}
