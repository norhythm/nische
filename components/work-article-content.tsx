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
  const layoutGrid = (): number => {
    switch (post.layout) {
      case "rect-h":
        return 6;
      case "rect-v":
        return 8;
      case "square":
        return 7;
      default:
        return 7;
    }
  };

  const layoutImageStyle = (grid?: number): string => {
    if (typeof grid === "number") {
      return `md:w-${grid}/12`;
    }
    switch (post.layout) {
      case "rect-h":
        return "md:w-7/12";
      case "rect-v":
        return "md:w-5/12";
      case "square":
        return "md:w-6/12";
      default:
        return "md:w-6/12";
    }
  };
  const [layoutMode, setLayoutMode] = useState<"vertical" | "horizontal">(
    "horizontal"
  );

  return (
    <>
      {/* Layout Toggle */}
      <div className="hidden md:flex justify-end pb-4 fixed top-4 left-4">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`${
              layoutMode === "vertical" ? "opacity-100" : "opacity-50"
            }`}
          >
            Vertical
          </span>
          <button
            onClick={() =>
              setLayoutMode(
                layoutMode === "vertical" ? "horizontal" : "vertical"
              )
            }
            className="relative w-12 h-6 bg-gray-300 rounded-full transition-colors cursor-pointer"
            aria-label="Toggle layout"
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                layoutMode === "horizontal"
                  ? "translate-x-1"
                  : "-translate-x-[100%]"
              }`}
            />
          </button>
          <span
            className={`${
              layoutMode === "horizontal" ? "opacity-100" : "opacity-50"
            }`}
          >
            Horizontal
          </span>
        </div>
      </div>

      {/* vertical */}
      {layoutMode === "vertical" && (
        <div className="py-0 md:py-12 md:min-h-[480px] md:w-8/12 md:mx-auto">
          <article className="relative article">
            <div className="w-full mx-auto flex justify-between flex-col">
              <div className={`article-header order-2 w-full pt-6`}>
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
                className={`article-image relative order-1 md:order-1 py-4 md:py-0`}
              >
                <TiltImage
                  single={false}
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
      )}

      {/* horizontal */}
      {layoutMode === "horizontal" && (
        <div className="py-0 md:py-12 md:min-h-[480px]">
          <article className="relative article">
            <div className="w-full mx-auto flex justify-between flex-col md:flex-row">
              <div
                className={`article-header order-2 md:order-1 w-full md:pr-10 ${layoutImageStyle(
                  layoutGrid
                )}`}
              >
                <header>
                  <h1 className="tracking-wide pt-1">
                    {post.artist && (
                      <span className="md:pb-1 block text-base md:text-[22px]">
                        {post.artist}
                      </span>
                    )}
                    <span className="block text-lg md:text-[22px]">
                      {post.title}
                    </span>
                  </h1>
                  <p className="pt-1">
                    {post.tag.map((tag, i) => {
                      return (
                        <span key={i}>
                          <Tag tag={tag} />
                          {i < post.tag.length - 1 && ", "}
                        </span>
                      );
                    })}
                  </p>
                </header>
                <div className="pt-6 mb-8 text-sm md:text-[15px] md:pt-8">
                  <div
                    className={`${markdownStyles["markdown"]}`}
                    dangerouslySetInnerHTML={{ __html: content }}
                  ></div>
                </div>
              </div>

              <div
                className={`article-image relative order-1 md:order-2 py-4 md:py-0 ${layoutImageStyle()}`}
              >
                <TiltImage
                  single={false}
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
      )}
    </>
  );
}
