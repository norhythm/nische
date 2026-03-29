import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_works");
const showUnpublished = process.env.SHOW_UNPUBLISHED === "true";

const tagOrder: Record<string, number> = {
  recording: 0,
  rec: 0,
  mixing: 1,
  mix: 1,
  mastering: 2,
  master: 2,
};

function sortTags(tags: string[]): string[] {
  return [...tags].sort(
    (a, b) => (tagOrder[a] ?? 99) - (tagOrder[b] ?? 99),
  );
}

function validatePostData(data: Record<string, unknown>, fileName: string): void {
  const required = ["url", "title", "date", "image", "layout"] as const;
  const missing = required.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required frontmatter fields [${missing.join(", ")}] in ${fileName}`
    );
  }
}

export function getPostBySlug(slug: string) {
  // 全てのファイルを読み込んで、frontmatterのurlでマッチするものを探す
  const allFiles = fs.readdirSync(postsDirectory);
  
  for (const fileName of allFiles) {
    if (!fileName.endsWith('.md')) continue;
    
    const fullPath = join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    
    // frontmatterのurlがslugと一致する場合
    if (data.url === slug) {
      validatePostData(data, fileName);
      // published: falseの場合はnullを返す（SHOW_UNPUBLISHED時は除く）
      if (data.published === false && !showUnpublished) {
        return null;
      }

      // 日付がDateオブジェクトの場合は文字列に変換
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().split('T')[0];
      }

      return { ...data, slug: data.url, tag: sortTags(data.tag || []), content } as Post;
    }
  }

  return null;
}

export function getAllPosts(): Post[] {
  const allFiles = fs.readdirSync(postsDirectory);
  const posts = allFiles
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      validatePostData(data, fileName);
      // 日付がDateオブジェクトの場合は文字列に変換
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().split('T')[0];
      }

      return { ...data, slug: data.url, tag: sortTags(data.tag || []), content } as Post;
    })
    // published: trueのみをフィルタリング（SHOW_UNPUBLISHED時は全件表示）
    .filter((post) => showUnpublished || post.published === true)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAdjacentPosts(currentSlug: string): {
  prevPost: Post | null;
  nextPost: Post | null;
} {
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.url === currentSlug);

  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null };
  }

  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return { prevPost, nextPost };
}
