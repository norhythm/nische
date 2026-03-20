import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "@/interfaces/post";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function layoutImageStyle(post: Post) {
  switch (post.layout) {
    case "rect-h":
      return "w-[90%] md:h-[440px] 4xl:h-[480px] 6xl:h-[520px]";
    case "rect-v":
      return "w-[70%] md:h-[640px] 4xl:h-[680px] 6xl:h-[720px]";
    case "square":
      return "w-[80%] md:h-[538px] 4xl:h-[580px] 6xl:h-[640px]";
    default:
      return "w-[80%] md:h-[538px] 4xl:h-[580px] 6xl:h-[640px]";
  }
}

export function layoutImageStyleAppend(post: Post) {
  switch (post.layout) {
    case "rect-h":
      return "w-[90%] md:w-[456px]";
    case "rect-v":
      return "w-[70%] md:w-[512px]";
    case "square":
      return "w-[80%] md:w-[412px]";
    default:
      return "w-[80%] md:w-[412px]";
  }
}
