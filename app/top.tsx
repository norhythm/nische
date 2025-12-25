"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelectedTagContext } from "@/lib/selected-tag-context";
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
  const { selectedTag, setSelectedTag } = useSelectedTagContext();
  const [underlineStyle, setUnderlineStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  return (
    <>
      <div className="sticky top-[50px] md:top-[100px] w-full xl:max-w-screen-xl mx-auto px-4 md:px-[8%] z-50 pointer-events-none transition-all">
        <div className="inline-flex gap-2 text-sm md:text-base tracking-wider relative">
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
              <Link
                href={`/works/${work.url}/`}
                className="work-item relative w-full cursor-pointer group/item group-hover/works:opacity-25 hover:!opacity-100 transition-opacity duration-300 pointer-events-auto"
                scroll={true}
              >
                <div className="relative flex justify-center items-center">
                  <TiltImage
                    single={true}
                    clip={true}
                    src={`${work.image}`}
                    alt={work.title}
                    width={512}
                    height={512}
                    tilt={4}
                    parentClassName={`absolute overflow-hidden flex justify-center items-center py-[11%] bg-hero layout-${work.layout}`}
                    childClassName="drop-shadow-md group-hover/item:scale-105 transition-transform"
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
