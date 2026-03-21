import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "@/interfaces/post";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function layoutImageStyle(post: Post) {
  switch (post.layout) {
    case "rect-h":
      return "w-[90%] md:w-[456px]";
    case "rect-v":
      return "w-[90%] md:w-[512px]";
    case "square":
      return "w-[80%] md:w-[412px]";
    default:
      return "w-[80%] md:w-[412px]";
  }
}
