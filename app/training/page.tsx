import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training",
  description: "Workout tracker and training schedule.",
};

export default function TrainingPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 py-8 md:py-12 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            &larr; Back
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Training</h1>
          <Link
            href="/training/philosophies"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
          >
            View Training Philosophies
          </Link>
        </div>
        <WorkoutCalendar />
      </div>
    </main>
  );
}
