import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/posts";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles and blog posts.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 md:py-12 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-xl">
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; Back
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-8">Writing</h1>
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/posts/${post.slug}`}
                className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
              >
                <time className="text-sm text-muted-foreground tabular-nums shrink-0">
                  {formatDate(post.date)}
                </time>
                <span className="text-foreground/85 group-hover:text-foreground group-hover:underline underline-offset-2 transition-colors">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
