import { getAllPosts, getAllTags } from "@/lib/api";
import TopPage from "./top";
import { Suspense } from "react";

export default function Page() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TopPage posts={posts} tags={tags} />;
    </Suspense>
  );
}
