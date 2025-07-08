"use client";

import { useState, useEffect, useMemo } from "react";
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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const tagFromQuery = searchParams.get("tag");
    if (tagFromQuery) setSelectedTag(tagFromQuery);
  }, [searchParams]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((post) => post.tag.includes(selectedTag));
  }, [posts, selectedTag]);

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    const query = tag ? `?tag=${tag}` : "";
    router.push(`/${query}`);
  };

  return (
    <>
      <div className="sticky top-[50px] md:top-[100px] container md:max-w-7xl mx-auto px-4 md:px-8 z-50 pointer-events-none">
        <div className="flex text-sm md:text-base tracking-wider">
          {["rec", "mix", "master"].map((tag, i) => (
            <div key={tag}>
              <button
                onClick={() => handleTagChange(tag)}
                className={`p-0 capitalize hover:text-gray-500 transition-colors cursor-pointer leading-none pointer-events-auto ${
                  selectedTag === tag ? "decoration-underline" : ""
                }`}
              >
                {tag}
              </button>
              <span>&nbsp;-&nbsp;</span>
            </div>
          ))}
          <div>
            <button
              onClick={() => handleTagChange(null)}
              className={`p-0 capitalize hover:text-gray-500 transition-colors cursor-pointer leading-none pointer-events-auto ${
                !selectedTag ? "decoration-underline" : ""
              }`}
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
        <div className="grid grid-cols-2 md:grid-cols-3 4xl:grid-cols-5 gap-8 group/works pointer-events-none animate-fade-in">
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
                href={`/works/${work.url}`}
                className="work-item relative cursor-pointer group/item group-hover/works:opacity-25 hover:!opacity-100 transition-opacity duration-300 pointer-events-auto"
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
