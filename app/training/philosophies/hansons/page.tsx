import { HansonsArticle } from "@/components/HansonsArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hansons Marathon Method — Training Philosophies",
  description:
    "Cumulative fatigue training: the 16-mile argument, SOS workouts, and weekly structure.",
};

export default function HansonsPage() {
  return <HansonsArticle />;
}
