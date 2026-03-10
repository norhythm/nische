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
    })),
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center flex-1">
          <div className="flex justify-center pb-20 text-sm md:text-sm tracking-wider animate-slide-in-up">
            <p>Loading... ;)</p>
          </div>
        </div>
      }
    >
      <TopPage posts={postsWithHtml} />
    </Suspense>
  );
}
