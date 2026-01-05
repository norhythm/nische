"use client";

import { useState } from "react";
import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";

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
  const layoutImageStyle = (grid?: number): string => {
    if (typeof grid === "number") {
      return `md:w-${grid}/12`;
    }
    switch (post.layout) {
      case "rect-h":
        return "md:w-8/12";
      case "rect-v":
        return "md:w-6/12";
      case "square":
        return "md:w-7/12";
      default:
        return "md:w-7/12";
    }
  };

  return (
    <div className="py-0 md:py-12">
      <article className="relative article">
        <div className="w-full mx-auto flex justify-between flex-col">
          <div
            className={`article-header order-2 w-full pt-6 md:w-7/12 md:mx-auto`}
          >
            <header>
              <h1 className="tracking-wide pt-1">
                {post.artist && (
                  <span className="md:pb-1 block text-base md:text-[24px]">
                    {post.artist}
                  </span>
                )}
                <span className="block text-lg md:text-[24px]">
                  {post.title}
                </span>
              </h1>
              <p className="pt-1">
                {post.tag.map((tag, i) => {
                  return (
                    <span key={i}>
                      <Tag tag={tag} classNames={"md:text-[15px]"} />
                      {i < post.tag.length - 1 && ", "}
                    </span>
                  );
                })}
              </p>
            </header>
            <div className="pt-6 mb-8 text-sm md:text-[17px] md:pt-8">
              <div
                className={`${markdownStyles["markdown"]}`}
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </div>
          </div>

          <div
            className={`article-image relative order-1 md:order-1 py-4 md:py-0 md:mx-auto ${layoutImageStyle()}`}
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
