import markdownStyles from "@/app/markdown.module.css";
import arrangeStyles from "@/app/arrange.module.css";

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
    <section className="relative container mx-auto px-4 pt-0 pb-4 md:pt-0 md:px-8 md:pb-20">
      {/* <div className="absolute z-30 top-0 left-0 size-full">
        <Link className="block size-full cursor-w-resize" href={`/`}>
          &nbsp;
        </Link>
      </div> */}
      <article className="relative work-detail">
        <div className="mx-auto">
          <header className="pb-4 md:pb-8">
            <h1 className="text-lg md:text-2xl tracking-wider">{post.title}</h1>
            <div className="flex">
              {post.tag.map((tag, index) => {
                return (
                  <span
                    key={index}
                    className="text-md md:text-xl tracking-wider mt-1 capitalize"
                  >
                    <Link href={`/?tag=${tag}`}>{tag}</Link>
                    {index < post.tag.length - 1 && `, `}
                  </span>
                );
              })}
            </div>
          </header>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-2/4 bg-hero z-10 w-screen h-full"></div>
            <div className={`${arrangeStyles["post-image"]}`}>
              <Image
                src={`${post.image}` || "/placeholder.svg"}
                alt={post.title}
                width={512}
                height={512}
                className={`post-${post.layout} block drop-shadow-md`}
              />
            </div>
          </div>

          {/* <div className="pt-6 mb-8 text-sm md:text-base md:pt-10">
            <div
              className={`${markdownStyles["markdown"]}`}
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div> */}
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
