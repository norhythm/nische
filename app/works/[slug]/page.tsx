import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";

import BackComponent from "@/components/back-component";
import ArticleBody from "@/components/article-body";
import WorkNavLink from "@/components/work-nav-link";
import KeyboardNavigation from "@/components/keyboard-navigation";

export default async function Post(props: Params) {
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
        prevUrl={prevPost ? `/works/${prevPost.url}` : undefined}
        nextUrl={nextPost ? `/works/${nextPost.url}` : undefined}
      />
      <BackComponent style="layer" />
      <BackComponent style="mobile-cursor" />
      <div className="work-detail relative w-full mx-auto flex flex-col items-stretch">
        <div className="md:flex-1 px-4 md:px-0">
          <article className="article">
            <ArticleBody
              post={post}
              content={content}
              modal={false}
              classNames={""}
            />
          </article>
        </div>
        {/* Prev/Next Navigation */}
        <div className="works-navigation sticky md:relative z-40 bottom-4 w-full pt-8 md:pt-16 overflow-hidden pointer-events-none">
          <nav className="flex justify-between items-center px-4 md:px-0 md:w-8/12 mx-auto">
            <div className="flex-1 flex md:hidden">
              <BackComponent style="button" className="pointer-events-auto" />
            </div>
            <div className="md:flex-1">
              {prevPost && (
                <WorkNavLink
                  href={`/works/${prevPost.url}`}
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
                  href={`/works/${nextPost.url}`}
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
