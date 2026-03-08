import { TinmanArticle } from "@/components/TinmanArticle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tom Tinman Schwartz — Training Philosophies",
  description: "Critical velocity training, Type IIA fiber development, and the art of controlled quality from America's most innovative distance coach.",
};

export default function TinmanPage() {
  return <TinmanArticle />;
}
