"use client";

import Link from "next/link";

interface TagProps {
  tag: string;
}

export default function Tag({ tag }: TagProps) {
  return (
    <Link
      className="text-xs md:text-sm decoration-underline capitalize"
      href={`/?tag=${tag}`}
      onClick={() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("selectedTag", tag);
          sessionStorage.setItem("isInternalNavigation", "true");
        }
      }}
    >
      {tag}
    </Link>
  );
}
