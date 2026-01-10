"use client";

import { useEffect, useRef } from "react";
import { Post } from "@/interfaces/post";
import ArticleBody from "@/components/article-body";
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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;

      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && nextPost) {
          // Swiped left -> next
          onNavigate(nextPost.url);
        } else if (diff < 0 && prevPost) {
          // Swiped right -> prev
          onNavigate(prevPost.url);
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.body.style.overflow = "";
    };
  }, [onClose, prevPost, nextPost, onNavigate]);

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
            <article className="article w-full h-full mx-auto">
              <ArticleBody
                post={post}
                content={post.htmlContent || ""}
                modal={true}
                backComponent={true}
                classNames="px-4"
              />

              {/* Mobile navigation */}
              <div className="md:hidden sticky z-50 w-full mt-auto bottom-1 flex md:gap-0 justify-between items-center overflow-visible">
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
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
