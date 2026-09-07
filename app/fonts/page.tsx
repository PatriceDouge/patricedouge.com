import { getPosts, formatDate } from "@/lib/content";
import { Playground } from "./Playground";

export default function TypePlaygroundPage() {
  const posts = getPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: formatDate(post.date),
  }));

  return <Playground posts={posts} />;
}
