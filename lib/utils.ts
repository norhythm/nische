import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Post } from "@/interfaces/post";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function layoutImageStyle(post: Post, modal: boolean) {
  if (modal) {
    switch (post.layout) {
      case "rect-h":
        return "md:w-7/12 md:mb-5";
      case "rect-v":
        return "md:w-5/12 md:mb-5";
      case "square":
        return "md:w-6/12 md:mb-5";
      default:
        return "md:w-6/12 md:mb-5";
    }
  } else {
    switch (post.layout) {
      case "rect-h":
        return "md:w-8/12 md:mb-4";
      case "rect-v":
        return "md:w-6/12 md:mb-4";
      case "square":
        return "md:w-7/12 md:mb-4";
      default:
        return "md:w-7/12 md:mb-4";
    }
  }
}
