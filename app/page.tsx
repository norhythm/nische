import { getAllPosts, getAllTags } from "@/lib/api";
import TopPage from "./top";
import { Suspense } from "react";

export default function Page() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20 text-sm md:text-base">
          <p>Loading...</p>
        </div>
      }
    >
      <TopPage posts={posts} tags={tags} />;
    </Suspense>
  );
}
