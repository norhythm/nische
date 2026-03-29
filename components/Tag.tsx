"use client";

import Link from "next/link";
import { tagName } from "@/lib/utils";

interface TagProps {
  tag: string;
  classNames?: string;
}

export default function Tag({ tag, classNames = "" }: TagProps) {
  return (
    <Link
      className={`text-[#888] hover:text-[#aaa] text-xs md:text-sm capitalize transition ${classNames}`}
      href={`/?tag=${tag}`}
    >
      {tagName(tag)}
    </Link>
  );
}
