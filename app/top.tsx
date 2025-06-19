"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Post } from "@/interfaces/post";

import Image from "next/image";
import Link from "next/link";

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
      <div className="sticky top-[60px] md:top-[100px] container mx-auto px-4 md:px-8 z-50">
        <div className="flex gap-2 text-sm md:text-base tracking-wider">
          {["recording", "mixing", "mastering"].map((tag) => (
            <>
              <button
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`capitalize ${
                  selectedTag === tag ? "underline" : ""
                }`}
              >
                {tag}
              </button>
              -
            </>
          ))}
          <button onClick={() => handleTagChange(null)}>All</button>
        </div>
      </div>
      {/* Works Grid */}
      <section id="works" className="container mx-auto px-4 pt-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 group/works pointer-events-none animate-fade-in">
          {filteredPosts.map((work, index) => (
            <Link
              // href={`/works/${work.slug}`}
              href={`/works/${work.url}`}
              key={index}
              className={`${
                index % 3 === 0 ? "col-span-2 md:col-span-1" : "col-span-1"
              }
              work-item relative cursor-pointer group/item group-hover/works:opacity-25 hover:!opacity-100 transition-opacity duration-300 pointer-events-auto
              "`}
            >
              <div className="relative flex justify-center items-center aspect-square overflow-hidden">
                <div
                  className={`absolute overflow-hidden flex justify-center items-center bg-hero layout-${work.layout}`}
                >
                  <Image
                    src={`${work.image}` || "/placeholder.svg"}
                    alt={work.title}
                    width={512}
                    height={512}
                    className="drop-shadow-md group-hover/item:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </Link>
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
