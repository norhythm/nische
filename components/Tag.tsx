"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/?tag=${tag}`);
  };

  return (
    <Link
      className={`text-xs md:text-sm decoration-underline capitalize ${classNames}`}
      href={`/?tag=${tag}`}
      onClick={handleClick}
    >
      {tagName(tag)}
    </Link>
  );
}
