"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface TagProps {
  tag: string;
  classNames?: string;
}

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
      {tag}
    </Link>
  );
}
