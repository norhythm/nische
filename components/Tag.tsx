"use client";

import Link from "next/link";

interface TagProps {
  tag: string;
  classNames?: string;
}

const tagName = (tag: string) => {
  switch (tag) {
    case "rec":
      return "recording";
    case "mix":
      return "mixing";
    case "master":
      return "mastering";
    default:
      return tag;
  }
};

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
