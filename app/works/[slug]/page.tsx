import markdownStyles from "@/app/markdown.module.css";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Link from "next/link";

import TiltImage from "@/components/tiltImage";
import BackButton from "@/components/back-button";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const { prevPost, nextPost } = getAdjacentPosts(params.slug);

  return (
    <section className="container mx-auto px-4 md:px-0 md:py-20 ">
      <div className="hidden md:block fixed top-0 left-0 w-full h-full">
        <Link className="block w-full h-full cursor-w-resize" href={"/"}></Link>
      </div>
      <article className="relative z-10">
        <div className="mx-auto">
          <div className="w-full md:w-4/5 mx-auto flex justify-between flex-col md:flex-row">
            <div className="order-1 w-full pt-6 md:pt-0 md:w-7/12">
              <header>
                <h1 className="text-lg md:text-2xl tracking-wider">
                  {post.title}
                </h1>
                {/* <div className="flex">
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
                </div> */}
              </header>
              <div className="pt-6 mb-8 text-sm md:text-base md:pt-8 md:pr-10">
                <div
                  className={`${markdownStyles["markdown"]}`}
                  dangerouslySetInnerHTML={{ __html: content }}
                ></div>
              </div>
            </div>

            <div className="relative order-2 md:w-5/12">
              <TiltImage
                single={false}
                src={`${post.image}` || "/placeholder.svg"}
                alt={post.title}
                width={512}
                height={512}
                tilt={1}
                childClassName={`w-full post-${post.layout} block drop-shadow-md`}
              />
            </div>
          </div>
        </div>
      </article>
      {/* Prev/Next Navigation */}
      <div className="sticky bottom-4 md:relative md:bottom-0 w-full md:w-4/5 mx-auto mt-8 md:mt-24 pt-8">
        <nav className="flex gap-2 md:gap-0 justify-between items-center">
          <div className="flex-1 flex md:hidden">
            {/* <div className="flex-1 flex"> */}
            <BackButton />
          </div>
          <div className="md:flex-1">
            {prevPost && (
              <Link
                href={`/works/${prevPost.url}`}
                className="group flex items-center text-sm md:text-base hover:text-gray-500 transition-colors"
              >
                <span className="">
                  <span className="hidden">← Next work</span>
                  <span className="icon-arrow-left"></span>
                </span>
                {/* <div className="hidden md:block">
                  <div className="group-hover:underline line-clamp-2">
                    {prevPost.title}
                  </div>
                </div> */}
              </Link>
            )}
          </div>

          <div className="md:flex-1 text-right">
            {nextPost && (
              <Link
                href={`/works/${nextPost.url}`}
                className="group flex items-center justify-end text-sm md:text-base hover:text-gray-500 transition-colors"
              >
                {/* <div className="hidden md:block text-right">
                  <div className="group-hover:underline line-clamp-2">
                    {nextPost.title}
                  </div>
                </div> */}
                <span className="">
                  <span className="hidden">Previous work →</span>
                  <span className="icon-arrow-right"></span>
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>
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
