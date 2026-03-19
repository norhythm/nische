import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Image from "next/image";

import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";
import { layoutImageStyle, layoutImageStyleAppend } from "@/lib/utils";

import BackComponent from "@/components/back-component";
import ArticleBody from "@/components/article-body";
import WorkNavLink from "@/components/work-nav-link";
import KeyboardNavigation from "@/components/keyboard-navigation";

const imageBgStyle = () => {
  return "px-4 pb-6 md:px-0 md:py-16 4xl:py-16 6xl:py-16";
};

const fillRectColor = () => {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 68%)`;
};

export default async function Post(props: Params, modal: false) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const { prevPost, nextPost } = getAdjacentPosts(params.slug);

  return (
    <section className="relative flex flex-1 w-full xl:max-w-screen-xl mx-auto md:px-[8%] xl:px-[102px] md:pt-0 md:pb-10">
      <KeyboardNavigation
        prevUrl={prevPost ? `/works-append/${prevPost.url}` : undefined}
        nextUrl={nextPost ? `/works-append/${nextPost.url}` : undefined}
      />
      <BackComponent style="layer" />
      <BackComponent style="mobile-cursor" />
      <div className="work-detail relative w-full mx-auto flex flex-col items-stretch">
        <div className="md:flex-1 px-4 md:px-0">
          <article className="article">
            <div className="relative w-full md:grid grid-cols-2 gap-6 justify-center items-center">
              <div className="bg-panel absolute left-1/2 w-screen h-full -translate-x-1/2"></div>
              <div
                className={`article-image md:flex-1 relative py-4 md:p-0 transition-translate ${imageBgStyle()}`}
              >
                <div className="flex justify-center">
                  <div
                    className={`relative inline-flex ${layoutImageStyleAppend(
                      post,
                    )}`}
                  >
                    <TiltImage
                      single={false}
                      clip={false}
                      src={`${post.image}`}
                      alt={post.title}
                      width={512}
                      height={512}
                      tilt={1}
                      // parentClassName="z-10 mt-4 mb-2 md:mb-3 p-2 bg-plate"
                      parentClassName={`inline-flex md:w-full h-full z-10`}
                      // childClassName={`w-full post-${post.layout} block drop-shadow-md`}
                      childClassName={`post-${post.layout} drop-shadow-lg`}
                    />
                    <div
                      className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full rotate-[2.8deg] drop-shadow-lg`}
                      style={{ backgroundColor: fillRectColor() }}
                    ></div>

                    {/* <Image
                      src={`${post.image}`}
                      alt={post.title}
                      width={512}
                      height={512}
                      preload
                      loading="eager"
                      fetchPriority="high"
                      className={`absolute top-0 left-1/2 -translate-x-1/2 object-contain w-full h-full rotate-[2.8deg] drop-shadow-lg`}
                    /> */}
                  </div>
                </div>
              </div>
              <div className="relative hidden md:block flex-1 pb-6 pl-6">
                <h1 className="tracking-wide">
                  {(post.holder || post.artist) && (
                    <div className="pb-2">
                      <div className="flex flex-col gap-0.5">
                        {post.holder && (
                          <span className="text-[#888] text-[12px] md:text-[13px] leading-[1.5]">
                            {post.holder}
                          </span>
                        )}
                        {post.artist && (
                          <span className="text-[#888] text-[12px] md:text-[13px] leading-[1.5]">
                            {post.artist}
                          </span>
                        )}
                      </div>
                      <div className="w-[30px] h-[2px] md:mt-2 bg-[#222]" />
                    </div>
                  )}
                  <span
                    className="block text-[#222] text-[18px] md:text-[32px] leading-[1.5] tracking-[1px] font-medium"
                    style={{ fontFamily: "Noto Serif JP" }}
                  >
                    {post.title}
                  </span>
                  <div className="flex gap-2 md:pt-1">
                    {post.tag.map((tag, i) => {
                      return (
                        <span key={i}>
                          <Tag
                            tag={tag}
                            classNames={
                              "text-[11px] md:text-[13px] leading-[1.5]"
                            }
                          />
                          {i < post.tag.length - 1 && " "}
                        </span>
                      );
                    })}
                  </div>
                </h1>
              </div>
            </div>
            <div
              className={`relative flex min-h-[calc(100%-44px)] flex-col md:w-8/12 mx-auto`}
            >
              <div
                className={`order-2 w-full flex-auto mx-auto pb-2 md:pt-4 md:pb-12`}
              >
                <header className="block md:hidden pt-4">
                  <h1 className="tracking-wide">
                    {post.artist && (
                      <span className="pb-1 md:pb-2 block text-[#888] text-[12px] md:text-[13px] leading-[1.5]">
                        {post.artist}
                      </span>
                    )}
                    <span className="block text-[#222] text-[18px] md:text-[24px] leading-[1.5]">
                      {post.title}
                    </span>
                  </h1>
                  <div className="flex gap-2 md:pt-1">
                    {post.tag.map((tag, i) => {
                      return (
                        <span key={i}>
                          <Tag
                            tag={tag}
                            classNames={
                              "text-[11px] md:text-[13px] leading-[1.5]"
                            }
                          />
                          {i < post.tag.length - 1 && " "}
                        </span>
                      );
                    })}
                  </div>
                </header>
                <div className="pt-4 md:mb-8 text-[13px] md:text-[14px] leading-[1.5]">
                  <div
                    className={`${markdownStyles["markdown"]}`}
                    dangerouslySetInnerHTML={{ __html: content || "" }}
                  ></div>
                </div>
              </div>
            </div>
          </article>
        </div>
        {/* Prev/Next Navigation */}
        <div className="works-navigation sticky md:relative z-40 bottom-4 w-full md:pt-16 overflow-hidden pointer-events-none">
          <nav className="flex justify-between items-center px-4 md:px-0 md:w-8/12 mx-auto">
            <div className="flex-1 flex md:hidden">
              <BackComponent style="button" className="pointer-events-auto" />
            </div>
            <div className="md:flex-1">
              {prevPost && (
                <WorkNavLink
                  href={`/works-append/${prevPost.url}`}
                  className="inline-flex justify-center items-center p-2 md:p-0 text-sm md:text-base hover:opacity-80 group transition-opacity align-bottom pointer-events-auto cursor-pointer"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">
                    <span className="hidden">← Next work</span>
                    <span className="icon-arrow-left"></span>
                  </span>
                </WorkNavLink>
              )}
            </div>

            <div className="md:flex-1 text-right">
              {nextPost && (
                <WorkNavLink
                  href={`/works-append/${nextPost.url}`}
                  className="inline-flex justify-center items-center justify-end p-2 md:p-0 text-sm md:text-base hover:opacity-80 group transition-opacity align-bottom pointer-events-auto cursor-pointer"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    <span className="hidden">Previous work →</span>
                    <span className="icon-arrow-right"></span>
                  </span>
                </WorkNavLink>
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
    slug: post.url,
  }));
}
