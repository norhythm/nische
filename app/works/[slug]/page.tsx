import markdownStyles from "@/app/markdown.module.css";

import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Link from "next/link";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <section className="relative container mx-auto px-4 md:px-8 pt-0 md:pt-0 pb-4 md:pb-20">
      <div className="absolute z-30 top-0 left-0 size-full">
        <Link className="block size-full cursor-w-resize" href={`/`}></Link>
      </div>
      <article className="relative work-detail">
        <div className="mx-auto">
          <header className="pb-4 md:pb-8">
            <h1 className="text-lg md:text-2xl tracking-wider">{post.title}</h1>
            <p className="text-md md:text-xl tracking-wider mt-1 capitalize">
              {post.tag.join(", ")}
            </p>
          </header>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-2/4 bg-hero z-10 w-screen h-full"></div>
            <div className="relative py-8 md:py-16 w-full z-20 flex justify-center items-center">
              <Image
                src={`${post.image}` || "/placeholder.svg"}
                alt={post.title}
                width={512}
                height={512}
                className={`post-${post.layout} block drop-shadow-md`}
              />
            </div>
          </div>

          <div
            className={`${markdownStyles["markdown"]} work-contents pt-6 md:pt-10 mb-8 text-sm md:text-base`}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </article>
    </section>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Kikuchi Tsukasa`;

  return {
    title,
    openGraph: {
      title,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
