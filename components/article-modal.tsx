"use client";

import { useEffect, useState } from "react";
import { Post } from "@/interfaces/post";
import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";

interface PostWithHtml extends Post {
  htmlContent?: string;
}

interface ArticleModalProps {
  post: PostWithHtml;
  onClose: () => void;
  prevPost: PostWithHtml | null;
  nextPost: PostWithHtml | null;
  onNavigate: (slug: string) => void;
}

export default function ArticleModal({
  post,
  onClose,
  prevPost,
  nextPost,
  onNavigate,
}: ArticleModalProps) {
  const [layoutMode, setLayoutMode] = useState<"vertical" | "horizontal">(
    "vertical"
  );

  // Handle ESC key and arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && prevPost) {
        onNavigate(prevPost.url);
      } else if (e.key === "ArrowRight" && nextPost) {
        onNavigate(nextPost.url);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, prevPost, nextPost, onNavigate]);

  const layoutImageStyle = (): string => {
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

  return (
    <div
      className="fixed inset-0 z-40 md:z-[100] flex justify-center cursor-close"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      {/* <div className="relative z-10 w-full h-[calc(100vh-80px)] top-[72px] md:top-0 mx-[8px] md:mx-4 md:h-[calc(100vh-164px)] md:mt-[148px] bg-hero overflow-auto animate-fade-in shadow-xl rounded-lg"> */}
      <div className="relative z-10 w-full h-[calc(100vh-88px)] top-[72px] md:h-[calc(100vh-32px)] md:top-4 mx-4 bg-hero overflow-auto animate-fade-in shadow-xl rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="hidden md:block md:fixed md:bottom-auto md:left-auto md:top-4 md:right-4 z-20 p-2 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Close modal"
        >
          <span className="icon-cross"></span>
        </button>

        {/* Layout Toggle */}
        <div className="hidden md:flex justify-end fixed top-4 left-4">
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`${
                layoutMode === "vertical" ? "opacity-100" : "opacity-50"
              }`}
            >
              Vertical
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLayoutMode(
                  layoutMode === "vertical" ? "horizontal" : "vertical"
                );
              }}
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

        {/* Navigation buttons */}
        {prevPost && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(prevPost.url);
            }}
            className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-20 hover:opacity-70 group transition-opacity bg-hero/80 rounded-full items-center justify-center cursor-pointer"
            aria-label="Previous work"
          >
            <span className="icon-arrow-left group-hover:-translate-x-1 transition-transform"></span>
          </button>
        )}
        {nextPost && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(nextPost.url);
            }}
            className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-20 hover:opacity-70 group transition-opacity bg-hero/80 rounded-full items-center justify-center cursor-pointer"
            aria-label="Next work"
          >
            <span className="icon-arrow-right group-hover:translate-x-1 transition-transform"></span>
          </button>
        )}

        {/* Article content */}
        <div
          className={`flex flex-col w-full h-full py-0 md:py-12 mx-auto px-4 md:px-0 ${
            layoutMode === "vertical"
              ? "xl:max-w-screen-xl md:px-[8%] xl:px-[102px]"
              : ""
          }`}
        >
          {/* vertical */}
          {layoutMode === "vertical" && (
            <article className="relative article mx-auto xl:max-w-screen-xl md:w-7/12 md:mx-auto">
              <div className="w-full mx-auto flex justify-between flex-col">
                <div className="w-full mx-auto flex justify-between flex-col">
                  <div className={`article-header order-2 w-full md:pt-6`}>
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
                        dangerouslySetInnerHTML={{
                          __html: post.htmlContent || "",
                        }}
                      />
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
              </div>
            </article>
          )}

          {/* horizontal */}
          {layoutMode === "horizontal" && (
            <article className="relative article w-full mx-auto md:px-[8%] xl:max-w-screen-xl">
              <div className="w-full mx-auto flex justify-between flex-col md:flex-row">
                <div className="article-header order-2 md:order-1 w-full md:w-7/12 md:pr-10">
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
                      {post.tag.map((tag, i) => (
                        <span key={i}>
                          <Tag tag={tag} />
                          {i < post.tag.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                  </header>
                  <div className="pt-6 mb-8 text-sm md:text-[15px] md:pt-8">
                    <div
                      className={`${markdownStyles["markdown"]}`}
                      dangerouslySetInnerHTML={{
                        __html: post.htmlContent || "",
                      }}
                    />
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
          )}

          {/* Mobile navigation */}
          <div className="md:hidden sticky w-full mt-auto -px-4 bottom-2 flex gap-2 md:gap-0 justify-between items-center">
            <div className="flex-1">
              {/* Close button */}
              <button
                onClick={onClose}
                className="block md:hidden z-20 hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Close modal"
              >
                <span className="icon-cross"></span>
              </button>
            </div>
            <div>
              {prevPost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(prevPost.url);
                  }}
                  className="p-2 hover:opacity-80 group transition-opacity"
                >
                  <span className="icon-arrow-left group-hover:translate-x-1"></span>
                </button>
              )}
            </div>
            <div>
              {nextPost && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(nextPost.url);
                  }}
                  className="p-2 hover:opacity-80 group transition-opacity"
                >
                  <span className="icon-arrow-right group-hover:translate-x-1"></span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
