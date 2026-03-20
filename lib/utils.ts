import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "@/interfaces/post";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function layoutImageStyle(post: Post) {
  switch (post.layout) {
    case "rect-h":
      return "w-[90%] md:h-[420px] 4xl:h-[460px] 6xl:h-[500px]";
    case "rect-v":
      return "w-[70%] md:h-[540px] 4xl:h-[580px] 6xl:h-[620px]";
    case "square":
      return "w-[80%] md:h-[460px] 4xl:h-[500px] 6xl:h-[540px]";
    default:
      return "w-[80%] md:h-[460px] 4xl:h-[500px] 6xl:h-[540px]";
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
