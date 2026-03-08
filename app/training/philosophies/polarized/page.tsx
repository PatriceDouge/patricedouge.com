import { PolarizedArticle } from "@/components/PolarizedArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polarized 80/20 — Training Philosophies",
  description:
    "Seiler's research on intensity distribution, the gray zone problem, and the 80/20 framework.",
};

export default function PolarizedPage() {
  return <PolarizedArticle />;
}
