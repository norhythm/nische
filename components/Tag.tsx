"use client";

import Link from "next/link";
import { useSelectedTagContext } from "@/lib/selected-tag-context";

interface TagProps {
  tag: string;
  classNames: string;
}

export default function Tag({ tag, classNames }: TagProps) {
  const { setSelectedTag } = useSelectedTagContext();

  return (
    <Link
      className={`text-xs md:text-sm decoration-underline capitalize ${classNames}`}
      href={`/?tag=${tag}`}
      onClick={() => {
        setSelectedTag(tag);
      }}
    >
      {tag}
    </Link>
  );
}
