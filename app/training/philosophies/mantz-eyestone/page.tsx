import { MantzEyestoneArticle } from "@/components/MantzEyestoneArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mantz / Eyestone — Training Philosophies",
  description:
    "Marathon-specific progressive long runs, altitude strategy, and the 3 C's race execution model.",
};

export default function MantzEyestonePage() {
  return <MantzEyestoneArticle />;
}
