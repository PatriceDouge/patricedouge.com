import Link from "next/link";
import Image from "next/image";
import { getAllPosts, formatDate } from "@/lib/posts";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen px-6 py-8 md:py-12 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-2xl">
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
          <p className="text-muted leading-relaxed">
            I&apos;m Patrice Dougé, a software engineer at <a href="https://wistia.com" className="text-muted underline decoration-[0.5px] decoration-muted-foreground underline-offset-2 hover:text-foreground transition-colors">Wistia</a>. Born in Pétion-Ville, Haiti, currently based in Sarasota, FL. I enjoy <a href="https://github.com/PatriceDouge" className="text-muted underline decoration-[0.5px] decoration-muted-foreground underline-offset-2 hover:text-foreground transition-colors">coding</a>, <a href="https://strava.app.link/eV9Oa35B3Zb" className="text-muted underline decoration-[0.5px] decoration-muted-foreground underline-offset-2 hover:text-foreground transition-colors">training</a>, and being a girl dad of two. These days I&apos;m learning as much as I can about coding agents, AI and how to build products users love.
          </p>
        </header>

        <section>
          <h2 className="text-xl font-bold mb-6">Writing</h2>
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
