import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs, formatDate } from "@/lib/posts";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen px-6 py-16 md:py-24 bg-background text-foreground transition-colors">
      <article className="mx-auto max-w-2xl">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; Back
          </Link>
          <ThemeToggle />
        </div>

        <header className="mt-8 mb-12">
          <time className="text-sm text-muted-foreground">{formatDate(post.date)}</time>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {post.title}
          </h1>
        </header>

        <div
          className="prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </article>
    </main>
  );
}
