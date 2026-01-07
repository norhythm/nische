"use client";

import { Post } from "@/interfaces/post";
import ArticleBody from "@/components/article-body";

interface WorkArticleContentProps {
  post: Post;
  content: string;
}

export default function WorkArticleContent({
  post,
  content,
}: WorkArticleContentProps) {
  return (
    <div className="py-0 md:py-12">
      <article className="relative article">
        <ArticleBody post={post} content={content} modal={false} />
      </article>
    </div>
  );
}
