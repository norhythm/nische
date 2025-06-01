import { getAllPosts, getAllTags } from "@/lib/api";
import TopPage from "./top";

export default function Page() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return <TopPage posts={posts} tags={tags} />;
}
