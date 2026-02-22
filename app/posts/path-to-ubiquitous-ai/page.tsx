import type { Metadata } from "next";
import { SiliconArticle } from "@/components/SiliconArticle";

export const metadata: Metadata = {
  title: "The Path to Ubiquitous AI",
  description:
    "A visual deep dive into how custom silicon could make AI inference 10x cheaper.",
  openGraph: {
    title: "The Path to Ubiquitous AI",
    description:
      "A visual deep dive into how custom silicon could make AI inference 10x cheaper.",
    type: "article",
    publishedTime: "2026-02-21",
  },
};

export default function Page() {
  return <SiliconArticle />;
}
