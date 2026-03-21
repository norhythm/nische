import { Post } from "@/interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_works");

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

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
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
      // 日付がDateオブジェクトの場合は文字列に変換
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().split('T')[0];
      }
      
      return { ...data, slug: data.url, tag: sortTags(data.tag || []), content } as Post;
    }
  }

  // 見つからない場合はnullを返す
  throw new Error(`Post with slug "${slug}" not found`);
}

export function getAllPosts(): Post[] {
  const allFiles = fs.readdirSync(postsDirectory);
  const posts = allFiles
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      
      // 日付がDateオブジェクトの場合は文字列に変換
      if (data.date instanceof Date) {
        data.date = data.date.toISOString().split('T')[0];
      }
      
      return { ...data, slug: data.url, tag: sortTags(data.tag || []), content } as Post;
    })
    // published: trueのみをフィルタリング
    .filter((post) => post.published === true)
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
