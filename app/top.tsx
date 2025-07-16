"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Post } from "@/interfaces/post";

import Link from "next/link";
import TiltImage from "@/components/tiltImage";

export default function BlogPage({
  posts,
  tags,
}: {
  posts: Post[];
  tags: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(() => {
    return searchParams.get("tag");
  });
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const tagFromQuery = searchParams.get("tag");
    if (tagFromQuery) setSelectedTag(tagFromQuery);
  }, [searchParams]);

  // sessionStorageの変更を監視してselectedTagを同期
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTag = sessionStorage.getItem("selectedTag");
      if (!savedTag) {
        setSelectedTag(null);
        // URLからもtagパラメータを削除
        window.history.replaceState(null, "", "/");
      }
    };

    // storageイベントは同じタブ内では発火しないため、カスタムイベントを使用
    const handleCustomStorageChange = (event: CustomEvent) => {
      if (event.detail.key === "selectedTag" && !event.detail.value) {
        setSelectedTag(null);
        window.history.replaceState(null, "", "/");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "selectedTagCleared",
      handleCustomStorageChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "selectedTagCleared",
        handleCustomStorageChange as EventListener
      );
    };
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
    // sessionStorageにタグを保存
    if (typeof window !== "undefined") {
      if (tag) {
        sessionStorage.setItem("selectedTag", tag);
      } else {
        sessionStorage.removeItem("selectedTag");
      }
    }
    // URLを更新するがページリロードは避ける
    const query = tag ? `?tag=${tag}` : "";
    const newUrl = `/${query}`;
    window.history.replaceState(null, "", newUrl);
  };

  return (
    <>
      <div className="sticky top-[50px] md:top-[100px] container xl:max-w-screen-xl mx-auto px-4 md:px-8 z-50 pointer-events-none">
        <div className="flex gap-2 text-sm md:text-base tracking-wider relative">
          {/* 動的な下線 */}
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
        className="container 2xl:max-w-full mx-auto px-4 2xl:px-32 pt-8 mb-20"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 6xl:grid-cols-5 gap-8 group/works pointer-events-none animate-fade-in">
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
              <Link
                href={`/works/${work.url}/`}
                className="work-item relative cursor-pointer group/item group-hover/works:opacity-25 hover:!opacity-100 transition-opacity duration-300 pointer-events-auto"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("isInternalNavigation", "true");
                  }
                }}
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
                    parentClassName={`absolute overflow-hidden flex justify-center items-center py-[11%] bg-hero textured-bg layout-${work.layout}`}
                    childClassName="drop-shadow-md group-hover/item:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
        {filteredPosts.length === 0 && (
          <div className="flex justify-center py-20 text-sm md:text-base">
            <p>There are no relevant articles.</p>
          </div>
        )}
      </section>
    </>
  );
}
