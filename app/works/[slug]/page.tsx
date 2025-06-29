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
    <section className="relative container mx-auto md:py-20">
      <article className="relative">
        <div className="mx-auto">
          <div className="w-4/5 mx-auto flex justify-between items-center flex-col md:flex-row">
            <div className="order-2 md:w-7/12 md:pl-10">
              <header>
                <h1 className="text-lg md:text-2xl tracking-wider">
                  {post.title}
                </h1>
                <div className="flex">
                  {post.tag.map((tag, index) => {
                    return (
                      <span
                        key={index}
                        className="text-md md:text-lg tracking-wider mt-1 capitalize"
                      >
                        <Link
                          className="hover:text-gray-500 transition-colors"
                          href={`/?tag=${tag}`}
                        >
                          {tag}
                        </Link>
                        {index < post.tag.length - 1 && <span>,&nbsp;</span>}
                      </span>
                    );
                  })}
                </div>
              </header>
              <div className="pt-6 mb-8 text-sm md:text-base md:pt-10">
                <div
                  className={`${markdownStyles["markdown"]}`}
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>
            </div>

            <div className="relative order-1 md:w-5/12">
              <div className="">
                <Image
                  src={`${post.image}` || "/placeholder.svg"}
                  alt={post.title}
                  width={512}
                  height={512}
                  className={`w-full post-${post.layout} block drop-shadow-md`}
                />
              </div>
            </div>
          </div>
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
