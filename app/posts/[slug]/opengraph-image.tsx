import { generateOGImage } from "@/lib/og";
import { getSlugs, loadDocument, type PostMeta } from "@/lib/content";

export const alt = "Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getSlugs("posts").map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await loadDocument<PostMeta>("posts", slug);

  return generateOGImage({
    title: doc?.meta.title ?? "Patrice Dougé",
    description: doc?.meta.description,
  });
}
