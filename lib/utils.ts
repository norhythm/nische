import { Post } from "@/interfaces/post";

export function tagName(tag: string): string {
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
