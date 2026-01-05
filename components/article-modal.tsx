"use client";

import { useEffect, useState } from "react";
import { Post } from "@/interfaces/post";
import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";
import BackComponent from "@/components/back-component";

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
        return "md:w-9/12";
      case "rect-v":
        return "md:w-6/12";
      case "square":
        return "md:w-7/12";
      default:
        return "md:w-7/12";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center items-center cursor-close"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="md:flex justify-center items-center w-full h-full p-4 xl:max-w-screen-xl mx-auto md:px-[8%] xl:px-[102px]">
        <div className="relative z-10 w-full h-full md:h-[80vh] md:top-0 bg-hero animate-fade-in shadow-xl rounded-lg overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="hidden md:block md:absolute md:bottom-auto md:left-auto md:top-2 md:right-2 z-30 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Close modal"
          >
            <span className="icon-cross"></span>
          </button>

          {/* Navigation buttons */}
          {prevPost && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(prevPost.url);
              }}
              className="hidden md:flex absolute left-2 top-0 bottom-0 z-20 hover:opacity-80 group transition-opacity items-center justify-center cursor-pointer"
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
              className="hidden md:flex absolute right-2 top-0 bottom-0 z-20 hover:opacity-80 group transition-opacity items-center justify-center cursor-pointer"
              aria-label="Next work"
            >
              <span className="icon-arrow-right group-hover:translate-x-1 transition-transform"></span>
            </button>
          )}

          {/* Article content */}
          <div
            className={`relative flex flex-col w-full h-full py-0 md:py-12 mx-auto md:px-0 overflow-auto`}
          >
            <article className="relative article w-full mx-auto px-4">
              <BackComponent style="mobile-cursor" />
              <div className="w-full mx-auto flex justify-between flex-col">
                <div
                  className={`article-header order-2 w-full flex-auto md:pt-6 xl:max-w-screen-xl md:w-7/12 mx-auto`}
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
                  <div className="pt-6 pb-8 text-sm md:text-[17px] md:pt-8">
                    <div
                      className={`${markdownStyles["markdown"]}`}
                      dangerouslySetInnerHTML={{
                        __html: post.htmlContent || "",
                      }}
                    />
                  </div>
                </div>

                <div
                  className={`article-image relative order-1 flex-auto md:order-1 py-4 md:py-0 mx-auto ${layoutImageStyle()}`}
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

            {/* Mobile navigation */}
            <div className="md:hidden sticky z-50 w-full mt-auto bottom-1 flex md:gap-0 justify-between items-center">
              <div className="flex-1">
                <button
                  onClick={onClose}
                  className="relative block md:hidden z-50 p-2 hover:opacity-70 transition-opacity cursor-pointer"
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
                    className="relative z-50 p-2 hover:opacity-80 group transition-opacity"
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
                    className="relative z-50 p-2 hover:opacity-80 group transition-opacity"
                  >
                    <span className="icon-arrow-right group-hover:translate-x-1"></span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
