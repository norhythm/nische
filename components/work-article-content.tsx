"use client";

import ArticleBody from "@/components/article-body";
import TiltImage from "@/components/tiltImage";
import { layoutImageStyle } from "@/lib/utils";

interface WorkArticleContentProps {
  post: {
    artist?: string;
    title: string;
    tag: string[];
    image: string;
    layout: string;
  };
  content: string;
}

export default function WorkArticleContent({
  post,
  content,
}: WorkArticleContentProps) {
  return (
    <div className="py-0 md:py-12">
      <article className="relative article">
        <div className="w-full mx-auto flex justify-between flex-col">
          <div
            className={`article-header order-2 w-full pt-6 md:w-7/12 md:mx-auto`}
          >
            <ArticleBody post={post} content={content} />
          </div>

          <div
            className={`article-image relative order-1 md:order-1 py-4 md:py-0 md:mx-auto ${layoutImageStyle(
              post
            )}`}
          >
            <TiltImage
              single={false}
              clip={false}
              src={`${post.image}`}
              alt={post.title}
              width={512}
              height={512}
              tilt={1}
              parentClassName="z-10"
              childClassName={`w-full post-${post.layout} block drop-shadow-md`}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
