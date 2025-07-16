import markdownStyles from "@/app/markdown.module.css";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getAdjacentPosts } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Link from "next/link";

import Tag from "@/components/Tag";
import BackComponent from "@/components/back-component";
import TiltImage from "@/components/tiltImage";
import WorkNavLink from "@/components/work-nav-link";
import TopScroller from "@/components/top-scroller";

export default async function Post(props: Params) {
  const params = await props.params;

  const post = {
    published: true,
    date: "2025-07-23",
    artist: "Limtity",
    title: "ドラマCD『幕が下りたら僕らは番 2』",
    url: "drama-cd-maku-ga-oritara-bokura-wa-tsugai-2",
    tag: ["mix", "master"],
    layout: "square",
    image: "/works/media/drama-cd-maku-ga-oritara-bokura-wa-tsugai-2.jpg",
    slug: "drama-cd-maku-ga-oritara-bokura-wa-tsugai-2",
    content:
      "Limtity inner Wolf\n\n|     |     |\n| --- | --- |\n| 歌   | Limtity |\n|     | 蜂谷密生（CV.小林千晃） |\n|     | 瀬兎真啓（CV.土岐隼一） |\n| 作詞  | 真崎エリカ、ざらめ鮫 |\n| 作編曲 | 青柳 諒 |",
  };

  const layout = post.layout;

  const content = await markdownToHtml(post.content || "");
  // const { prevPost, nextPost } = getAdjacentPosts(params.slug);

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
    // <section className="relative flex flex-1 container xl:max-w-screen-xl mx-auto px-4 md:px-8 md:px-0 md:pt-0 md:pb-10">
    <section className="relative flex flex-1 container xl:max-w-screen-xl mx-auto px-4 pb-4 md:px-8 md:px-0 md:pt-0 md:pb-10">
      <TopScroller />
      <BackComponent style="layer" />
      <BackComponent style="mobile-cursor" />

      <div
        className={`block fixed top-0 left-0 w-full h-full bg-black`}
        style={{ zIndex: "-1" }}
      ></div>
      {/* <div
        className={`hidden md:block absolute top-0 left-1/2 -translate-x-2/4 bg-hero z-0 w-screen h-full`}
      ></div> */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-2/4 bg-white z-0 w-screen h-full`}
      ></div>
      <div className="work-detail relative lg:w-3/4 mx-auto flex flex-col items-stretch">
        <div className="py-0 md:py-12 md:min-h-[480px]">
          <article className="relative article">
            <div className="w-full mx-auto flex justify-between flex-col md:flex-row">
              <div
                className={`article-header order-2 md:order-1 w-full pt-6 md:pt-0 md:pr-10 ${layoutImageStyle(
                  layoutGrid()
                )}`}
              >
                <header>
                  <h1 className="tracking-wider">
                    {post.artist && (
                      <span className="pb-1 block text-lg md:text-2xl">
                        {post.artist}
                      </span>
                    )}
                    <span className="block text-lg md:text-xl">
                      {post.title}
                    </span>
                  </h1>
                  <p className="pt-1">
                    {post.tag.map((tag, i) => {
                      return (
                        <span key={i}>
                          <Tag tag={tag} />
                          {i < post.tag.length - 1 && ", "}
                        </span>
                      );
                    })}
                  </p>
                </header>
                <div className="pt-6 mb-8 text-sm md:text-base md:pt-8">
                  <div
                    className={`${markdownStyles["markdown"]}`}
                    dangerouslySetInnerHTML={{ __html: content }}
                  ></div>
                </div>
              </div>

              <div
                className={`article-image relative order-1 md:order-2 py-4 md:py-0 ${layoutImageStyle()}`}
              >
                {/* <div className="block md:hidden absolute top-0 left-1/2 -translate-x-2/4 bg-hero textured-bg z-10 w-screen h-full"></div> */}
                <div className="block md:hidden absolute top-0 left-1/2 -translate-x-2/4 bg-white textured-bg z-10 w-screen h-full"></div>
                <TiltImage
                  single={false}
                  src={`${post.image}`}
                  alt={post.title}
                  width={512}
                  height={512}
                  tilt={1}
                  parentClassName="z-10"
                  childClassName={`w-full post-${post.layout} block drop-shadow-md`}
                />
              </div>
            </div>
          </article>
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
