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
        return "md:w-7/12";
      case "rect-v":
        return "md:w-5/12";
      case "square":
        return "md:w-6/12";
      default:
        return "md:w-6/12";
    }
  } else {
    switch (post.layout) {
      case "rect-h":
        return "md:w-8/12";
      case "rect-v":
        return "md:w-6/12";
      case "square":
        return "md:w-7/12";
      default:
        return "md:w-7/12";
    }
  }
}
