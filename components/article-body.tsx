import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";
import BackComponent from "@/components/back-component";
import { Post } from "@/interfaces/post";
import { layoutImageStyle } from "@/lib/utils";

interface ArticleBodyProps {
  post: Post;
  content: string;
  modal: boolean;
  backComponent: boolean;
  classNames?: string;
}

const imageBgStyle = () => {
  return "bg-hero inset-shadow px-4 pb-3 md:px-0 md:py-10 4xl:py-12 6xl:py-14";
};

export default function ArticleBody({
  post,
  content,
  modal,
  backComponent,
  classNames,
}: ArticleBodyProps) {
  return (
    <div
      className={`relative flex min-h-[calc(100%-44px)] flex-col w-full mx-auto text-center ${classNames}`}
    >
      {backComponent && <BackComponent style="mobile-cursor" />}
      <div
        className={`article-header order-2 w-full flex-auto mx-auto py-4 px-4 md:px-14`}
      >
        <header>
          <h1 className="tracking-wide">
            {post.artist && (
              <span className="md:pb-1 block text-[16px] md:text-[18px] leading-[1.5]">
                {post.artist}
              </span>
            )}
            <span className="block text-[16px] md:text-[18px] leading-[1.5]">
              {post.title}
            </span>
          </h1>
          <div className="pt-1">
            {post.tag.map((tag, i) => {
              return (
                <span key={i}>
                  <Tag
                    tag={tag}
                    classNames={"text-[11px] md:text-[13px] leading-[1.5]"}
                  />
                  {i < post.tag.length - 1 && ", "}
                </span>
              );
            })}
          </div>
        </header>
        <div className="pt-6 mb-8 text-[13px] md:text-[14px] leading-[1.5] md:pt-8">
          <div
            className={`${markdownStyles["markdown"]}`}
            dangerouslySetInnerHTML={{ __html: content || "" }}
          ></div>
        </div>
      </div>

      <div className={`${modal ? "overflow-hidden" : ""}`}>
        <div
          className={`article-image relative order-1 mx-auto py-4 md:p-0 transition-translate text-center ${imageBgStyle()}`}
        >
          <div
            className={`hidden md:block absolute top-0 left-1/2 -translate-x-2/4 bg-hero z-0 w-screen h-full`}
          ></div>
          <TiltImage
            single={false}
            clip={false}
            src={`${post.image}`}
            alt={post.title}
            width={512}
            height={512}
            tilt={1}
            // parentClassName="z-10 mt-4 mb-2 md:mb-3 p-2 bg-plate"
            parentClassName={`inline-flex md:w-full h-full z-10 ${layoutImageStyle(
              post,
              modal
            )}`}
            // childClassName={`w-full post-${post.layout} block drop-shadow-md`}
            childClassName={`post-${post.layout} drop-shadow-lg`}
          />
        </div>
      </div>
    </div>
  );
}
