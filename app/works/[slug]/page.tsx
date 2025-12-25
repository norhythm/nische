import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";

import BackComponent from "@/components/back-component";
import WorkNavLink from "@/components/work-nav-link";
import WorkArticleContent from "@/components/work-article-content";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const { prevPost, nextPost } = getAdjacentPosts(params.slug);

  return (
    <section className="relative flex flex-1 w-full xl:max-w-screen-xl mx-auto px-4 pb-4 md:px-[8%] xl:px-[102px] md:pt-0 md:pb-10">
      <BackComponent style="layer" />
      <BackComponent style="mobile-cursor" />

      <div
        className={`block fixed top-0 left-0 w-full h-full`}
        style={{ zIndex: "-1" }}
      ></div>
      <div
        className={`hidden md:block absolute top-0 left-1/2 -translate-x-2/4 bg-hero z-0 w-screen h-full`}
      ></div>
      <div
        className={`absolute top-0 left-1/2 -translate-x-2/4 bg-hero z-0 w-screen h-full`}
      ></div>
      <div className="work-detail relative w-full mx-auto flex flex-col items-stretch">
        <WorkArticleContent
          post={{
            artist: post.artist,
            title: post.title,
            tag: post.tag,
            image: post.image,
            layout: post.layout,
          }}
          content={content}
        />
        {/* Prev/Next Navigation */}
        <div className="works-navigation sticky z-50 bottom-4 md:relative md:bottom-0 w-full mx-auto mt-auto pt-8 md:pt-0 pointer-events-none">
          <nav className="flex gap-2 md:gap-0 justify-between items-center">
            <div className="flex-1 flex md:hidden">
              <BackComponent style="button" className="pointer-events-auto" />
            </div>
            <div className="md:flex-1">
              {prevPost && (
                <WorkNavLink
                  href={`/works/${prevPost.url}`}
                  className="inline-flex justify-center items-center text-sm md:text-base hover:opacity-80 group transition-opacity align-bottom pointer-events-auto"
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
                  href={`/works/${nextPost.url}`}
                  className="inline-flex justify-center items-center justify-end text-sm md:text-base hover:opacity-80 group transition-opacity align-bottom pointer-events-auto"
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
