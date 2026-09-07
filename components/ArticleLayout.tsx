import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * The shared shell for every long-form page. `date` selects the post header
 * (title + timestamp); `accent`/`subtitle` select the philosophy header
 * (accent bar + title + standfirst). `footer` renders the bordered block at the
 * end — posts pass none.
 */
export function ArticleLayout({
  title,
  subtitle,
  date,
  accent,
  backHref,
  backLabel,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  date?: string;
  accent?: string;
  backHref: string;
  backLabel: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24 bg-background text-foreground transition-colors">
      <article className="mx-auto max-w-xl">
        <div className="flex justify-between items-center">
          <Link
            href={backHref}
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            {backLabel}
          </Link>
          <ThemeToggle />
        </div>

        <header className={date ? "mt-8 mb-8" : "mt-8 mb-12"}>
          {accent && (
            <div
              className="w-10 h-1 rounded mb-4"
              style={{ background: accent }}
            />
          )}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {date && (
            <time className="mt-3 block text-sm text-muted-foreground">
              {date}
            </time>
          )}
          {subtitle && (
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </header>

        {children}

        {footer && (
          <div className="mt-16 pt-6 border-t border-border">{footer}</div>
        )}
      </article>
    </main>
  );
}
