import { getAllPosts } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import TopPage from "./top";
import { Suspense } from "react";

export default async function Page() {
  const posts = getAllPosts();

  const postsWithHtml = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      htmlContent: await markdownToHtml(post.content || ""),
    }))
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20 text-sm md:text-base">
          <p>Loading... ;)</p>
        </div>
      }
    >
      <TopPage posts={postsWithHtml} />
    </Suspense>
  );
}
