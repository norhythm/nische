"use client";

import { useEffect } from "react";
import { Post } from "@/interfaces/post";
import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";
import Footer from "@/components/footer";

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
    // <div className="fixed inset-0 z-[100] flex items-center justify-center">
    <div className="fixed inset-0 z-40 md:z-[100] flex justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 md:bg-white/60 md:backdrop-blur-xs animate-fade-in"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full h-full pt-[72px] md:h-[calc(100vh-60px)] md:mt-[148px] bg-hero overflow-auto animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute bottom-0 left-0 md:fixed md:bottom-auto md:left-auto md:top-4 md:right-4 z-20 p-2 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Close modal"
        >
          <span className="icon-cross"></span>
        </button>

        {/* Navigation buttons */}
        {prevPost && (
          <button
            onClick={() => onNavigate(prevPost.url)}
            className="hidden md:flex fixed md:absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 hover:opacity-70 transition-opacity bg-hero/80 rounded-full items-center justify-center"
            aria-label="Previous work"
          >
            <span className="icon-arrow-left"></span>
          </button>
        )}
        {nextPost && (
          <button
            onClick={() => onNavigate(nextPost.url)}
            className="hidden md:flex fixed md:absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 hover:opacity-70 transition-opacity bg-hero/80 rounded-full items-center justify-center"
            aria-label="Next work"
          >
            <span className="icon-arrow-right"></span>
          </button>
        )}

        {/* Article content */}
        <div className="px-4 md:px-0 md:py-12">
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
                    dangerouslySetInnerHTML={{ __html: post.htmlContent || "" }}
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

          {/* Mobile navigation */}
          <div className="md:hidden flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
            <div>
              {prevPost && (
                <button
                  onClick={() => onNavigate(prevPost.url)}
                  className="p-2 hover:opacity-70 transition-opacity"
                >
                  <span className="icon-arrow-left"></span>
                </button>
              )}
            </div>
            <div>
              {nextPost && (
                <button
                  onClick={() => onNavigate(nextPost.url)}
                  className="p-2 hover:opacity-70 transition-opacity"
                >
                  <span className="icon-arrow-right"></span>
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer className={"mt-auto"} />
      </div>
    </div>
  );
}
