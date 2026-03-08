import { CanovaArticle } from "@/components/CanovaArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renato Canova — Training Philosophies",
  description: "Specific endurance, funnel periodization, and extending race-pace volume from the most successful distance coach in history.",
};

export default function CanovaPage() {
  return <CanovaArticle />;
}
