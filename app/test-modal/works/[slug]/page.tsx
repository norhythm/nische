import { getAllPosts, getAllTags, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { notFound } from "next/navigation";
import TestModalTop from "../../test-modal-top";
import { Suspense } from "react";
import { Metadata } from "next";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkModalPage(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const posts = getAllPosts();
  const tags = getAllTags();

  // Pre-render markdown content to HTML for each post
  const postsWithHtml = await Promise.all(
    posts.map(async (p) => ({
      ...p,
      htmlContent: await markdownToHtml(p.content || ""),
    }))
  );

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20 text-sm md:text-base">
          <p>Loading... ;)</p>
        </div>
      }
    >
      <TestModalTop posts={postsWithHtml} tags={tags} />
    </Suspense>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  const hasArtist = post.artist ? `${post.artist} ` : "";
  const title = `${hasArtist}${post.title} | Kikuchi Tsukasa`;

  return {
    title,
    openGraph: {
      title: `${post.artist || ""} ${post.title}`,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.url,
  }));
}
