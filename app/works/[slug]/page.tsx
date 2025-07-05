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

  const layout = post.layout;

  const content = await markdownToHtml(post.content || "");
  const { prevPost, nextPost } = getAdjacentPosts(params.slug);

  const layoutGrid = (): number => {
    switch (layout) {
      case "rect-h":
        return 6;
      case "rect-v":
        return 8;
      case "square":
        return 7;
      default:
        return 7;
    }
  };

  const layoutImageStyle = (grid?: number): string => {
    if (typeof grid === "number") {
      return `md:w-${grid}/12`;
    }
    switch (layout) {
      case "rect-h":
        return "md:w-6/12";
      case "rect-v":
        return "md:w-4/12";
      case "square":
        return "md:w-5/12";
      default:
        return "md:w-5/12";
    }
  };

  return (
    <section className="container md:max-w-7xl mx-auto px-4 md:px-8 md:px-0 md:py-20">
      {/* <div className="hidden md:block fixed top-0 left-0 w-full h-full">
        <Link className="block w-full h-full cursor-w-resize" href={"/"}></Link>
      </div> */}
      <div className="relative md:w-3/4 mx-auto">
        <div className="relative py-0 md:py-24">
          {/* <div className="hidden md:block absolute top-0 left-1/2 -translate-x-2/4 bg-hero z-10 w-screen h-full"></div> */}
          <div
            className={`hidden md:block absolute top-0 left-1/2 -translate-x-2/4 bg-hero z-10 w-screen h-full`}
            // style={{ backgroundImage: `url(${post.image})` }}
          ></div>
          <article className="relative z-10">
            <div className="mx-auto">
              <div className="w-full mx-auto flex justify-between flex-col md:flex-row">
                <div
                  className={`order-2 md:order-1 w-full pt-6 md:pt-0 md:pr-10 ${layoutImageStyle(
                    layoutGrid()
                  )}`}
                >
                  <header>
                    <h1 className="tracking-wider">
                      {post.artist && (
                        <span className="block text-lg md:text-2xl">
                          {post.artist}
                        </span>
                      )}
                      <span className="block text-lg md:text-xl">
                        {post.title}
                      </span>
                    </h1>
                  </header>
                  <div className="pt-6 mb-8 text-sm md:text-base md:pt-8">
                    <div
                      className={`${markdownStyles["markdown"]}`}
                      dangerouslySetInnerHTML={{ __html: content }}
                    ></div>
                  </div>
                </div>

                <div
                  className={`relative order-1 md:order-2 py-4 md:py-0 ${layoutImageStyle()}`}
                >
                  <div className="block md:hidden absolute top-0 left-1/2 -translate-x-2/4 bg-hero z-10 w-screen h-full"></div>
                  <TiltImage
                    single={false}
                    src={`${post.image}`}
                    alt={post.title}
                    width={512}
                    height={512}
                    tilt={1}
                    parentClassName="z-20"
                    childClassName={`w-full post-${post.layout} block drop-shadow-md`}
                  />
                </div>
              </div>
            </div>
          </article>
        </div>
        {/* Prev/Next Navigation */}
        <div className="sticky bottom-4 md:relative md:bottom-0 w-full mx-auto pt-8">
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

  const hasArtist = post.artist ? `${post.artist} ` : "";
  const title = `${hasArtist} ${post.title} | Kikuchi Tsukasa`;

  return {
    title,
    openGraph: {
      title: `${post.artist} ${post.title}`,
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
