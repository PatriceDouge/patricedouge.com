import { LydiardArticle } from "@/components/LydiardArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arthur Lydiard — Training Philosophies",
  description:
    "Aerobic base-first sequential periodization: the pyramid model, effort-based training, and the legacy of modern distance running.",
};

export default function LydiardPage() {
  return <LydiardArticle />;
}
