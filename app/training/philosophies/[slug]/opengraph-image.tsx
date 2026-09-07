import { generateOGImage } from "@/lib/og";
import { getSlugs, loadDocument, type PhilosophyMeta } from "@/lib/content";

export const alt = "Training Philosophies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getSlugs("philosophies").map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await loadDocument<PhilosophyMeta>("philosophies", slug);

  return generateOGImage({
    title: doc?.meta.title ?? "Training Philosophies",
    description: doc?.meta.description,
  });
}
