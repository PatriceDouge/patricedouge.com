import { getAllPosts, formatDate } from "@/lib/posts";
import { Playground } from "./Playground";

export default function TypePlaygroundPage() {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: formatDate(post.date),
  }));

  return <Playground posts={posts} />;
}
