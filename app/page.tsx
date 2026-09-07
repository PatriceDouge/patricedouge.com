import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPosts, formatDate, loadDocument } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const posts = getPosts();
  const home = await loadDocument("pages", "home");

  if (!home) {
    notFound();
  }

  const { Content } = home;

  return (
    <main className="min-h-screen px-6 py-8 md:py-12 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-xl">
        <div className="flex justify-between items-start mb-16">
          <Image
            src="/logo.svg"
            alt="PD"
            width={56}
            height={32}
            className="dark:invert"
            priority
          />
          <ThemeToggle />
        </div>

        <header className="mb-16">
          <Content />
        </header>

        <section>
          <h2 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6">Writing</h2>
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
        </section>
      </div>
    </main>
  );
}
