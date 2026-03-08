import { DanielsArticle } from "@/components/DanielsArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jack Daniels / VDOT — Training Philosophies",
  description: "Physiological pace zones, the VDOT system, and purpose-driven training from the world's best running coach.",
};

export default function DanielsPage() {
  return <DanielsArticle />;
}
