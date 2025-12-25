"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSelectedTagContext } from "@/lib/selected-tag-context";
import { Post } from "@/interfaces/post";

import TiltImage from "@/components/tiltImage";
import ArticleModal from "./article-modal-client";

interface PostWithHtml extends Post {
  htmlContent?: string;
}

export default function TestModalTop({
  posts,
  tags,
}: {
  posts: PostWithHtml[];
  tags: string[];
}) {
  const pathname = usePathname();
  const { selectedTag, setSelectedTag } = useSelectedTagContext();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Check if we should show modal from URL
  useEffect(() => {
    const match = pathname.match(/^\/test-modal\/works\/([^/]+)\/?$/);
    if (match) {
      setSelectedSlug(match[1]);
    } else {
      setSelectedSlug(null);
    }
  }, [pathname]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(
        /^\/test-modal\/works\/([^/]+)\/?$/
      );
      if (match) {
        setSelectedSlug(match[1]);
      } else {
        setSelectedSlug(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const updateUnderlinePosition = () => {
      const allTags = ["rec", "mix", "master", null];
      const activeIndex = allTags.indexOf(selectedTag);

      if (activeIndex !== -1 && buttonRefs.current[activeIndex]) {
        const activeButton = buttonRefs.current[activeIndex];
        if (activeButton) {
          const parentRect =
            activeButton.parentElement?.parentElement?.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();

          if (parentRect && buttonRect) {
            setUnderlineStyle({
              left: buttonRect.left - parentRect.left,
              width: buttonRect.width,
              opacity: 1,
            });
          }
        }
      } else {
        setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateUnderlinePosition();
    window.addEventListener("resize", updateUnderlinePosition);
    return () => window.removeEventListener("resize", updateUnderlinePosition);
  }, [selectedTag]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((post) => post.tag.includes(selectedTag));
  }, [posts, selectedTag]);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
  };

  const handleWorkClick = useCallback((e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    setSelectedSlug(slug);
    // Update URL without full navigation
    window.history.pushState({}, "", `/test-modal/works/${slug}/`);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedSlug(null);
    window.history.pushState({}, "", "/test-modal/");
  }, []);

  const handleNavigateWork = useCallback((slug: string) => {
    setSelectedSlug(slug);
    window.history.pushState({}, "", `/test-modal/works/${slug}/`);
  }, []);

  const selectedPost = useMemo(() => {
    if (!selectedSlug) return null;
    return posts.find((p) => p.url === selectedSlug) || null;
  }, [posts, selectedSlug]);

  const adjacentPosts = useMemo(() => {
    if (!selectedSlug) return { prev: null, next: null };
    const currentIndex = posts.findIndex((p) => p.url === selectedSlug);
    return {
      prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
      next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    };
  }, [posts, selectedSlug]);

  return (
    <>
      <div className="sticky top-[50px] md:top-[100px] w-full xl:max-w-screen-xl mx-auto px-4 md:px-[8%] z-30 pointer-events-none">
        <div className="inline-flex gap-2 text-sm md:text-base tracking-wider relative">
          <div
            className="absolute bottom-0 h-[1px] bg-current transition-all duration-300 ease-out"
            style={{
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width}px`,
              opacity: underlineStyle.opacity,
            }}
          />

          {["rec", "mix", "master"].map((tag, i) => (
            <div key={tag}>
              <button
                ref={(el) => (buttonRefs.current[i] = el)}
                onClick={() => handleTagChange(tag)}
                className="p-0 capitalize hover:text-gray-500 transition-colors cursor-pointer leading-none pointer-events-auto"
              >
                {tag}
              </button>
            </div>
          ))}
          <div>
            <button
              ref={(el) => (buttonRefs.current[3] = el)}
              onClick={() => handleTagChange(null)}
              className="p-0 capitalize hover:text-gray-500 transition-colors cursor-pointer leading-none pointer-events-auto"
            >
              All
            </button>
          </div>
        </div>
      </div>

      <section
        id="works"
        className="w-full 2xl:max-w-full mx-auto px-[4%] pt-8 mb-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 4xl:grid-cols-4 6xl:grid-cols-5 gap-8 group/works pointer-events-none animate-fade-in">
          {filteredPosts.map((work, index) => (
            <div
              key={index}
              className={`${
                index % 3 === 0 ? "col-span-2 md:col-span-1" : "col-span-1"
              }
              ${
                work.layout === "rect-v" ? "px-[10%]" : ""
              } relative flex justify-center items-center`}
            >
              <a
                href={`/test-modal/works/${work.url}/`}
                onClick={(e) => handleWorkClick(e, work.url)}
                className="work-item relative w-full cursor-pointer group/item group-hover/works:opacity-25 hover:!opacity-100 transition-opacity duration-300 pointer-events-auto"
              >
                <div className="relative flex justify-center items-center">
                  <TiltImage
                    single={true}
                    clip={true}
                    src={`${work.image}`}
                    alt={work.title}
                    width={512}
                    height={512}
                    tilt={3}
                    parentClassName={`absolute overflow-hidden flex justify-center items-center py-[11%] bg-hero layout-${work.layout}`}
                    childClassName="drop-shadow-md group-hover/item:scale-105 transition-transform"
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="flex justify-center py-20 text-sm md:text-base">
            <p>There are no relevant articles.</p>
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedPost && (
        <ArticleModal
          post={selectedPost}
          onClose={handleCloseModal}
          prevPost={adjacentPosts.prev}
          nextPost={adjacentPosts.next}
          onNavigate={handleNavigateWork}
        />
      )}
    </>
  );
}
