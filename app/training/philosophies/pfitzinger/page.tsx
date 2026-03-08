import { PfitzingerArticle } from "@/components/PfitzingerArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pete Pfitzinger — Training Philosophies",
  description:
    "Science-backed marathon training: high aerobic volume, medium-long runs, lactate threshold work, and structured periodization.",
};

export default function PfitzingerPage() {
  return <PfitzingerArticle />;
}
