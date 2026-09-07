import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ThemeToggle } from "@/components/ThemeToggle";
import { PhilosophyCards } from "@/components/PhilosophyCards";
import { getPhilosophies, loadDocument, type PageMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "Running Training Philosophies",
  description:
    "Ten systems worth studying, each with a deep-dive on its diagrams, key workouts, and research context.",
};

export default async function TrainingPhilosophiesPage() {
  const philosophies = getPhilosophies();
  const cards = philosophies.map(
    ({ slug, name, tagline, stat, statLabel, accent }) => ({
      slug,
      name,
      tagline,
      stat,
      statLabel,
      accent,
    })
  );

  const doc = await loadDocument<PageMeta>("pages", "philosophies", {
    PhilosophyCards: () => <PhilosophyCards items={cards} />,
  });

  if (!doc) {
    notFound();
  }

  const { meta, Content } = doc;

  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 md:py-12 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/training"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; Back To Training
          </Link>
          <ThemeToggle />
        </div>

        <header className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight mb-3">
            {meta.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {String(meta.intro ?? "")}
          </p>
        </header>

        <Content />
      </div>
    </main>
  );
}
