import { NorwegianArticle } from "@/components/NorwegianArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Norwegian Singles — Training Philosophies",
  description:
    "Lactate-guided threshold training: origins, science, zones, workouts, and notable athletes.",
};

export default function NorwegianPage() {
  return <NorwegianArticle />;
}
