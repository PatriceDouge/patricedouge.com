import { HudsonArticle } from "@/components/HudsonArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brad Hudson — Training Philosophies",
  description: "Adaptive, athlete-specific training: effort-based intensity, multi-pace workouts, and the art of being your own best coach.",
};

export default function HudsonPage() {
  return <HudsonArticle />;
}
