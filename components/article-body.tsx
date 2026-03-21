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
  classNames?: string;
}

const imageBgStyle = () => {
  return "px-4 pb-6 md:px-0 md:py-10 4xl:py-12 6xl:py-14";
};

export default function ArticleBody({
  post,
  content,
  modal,
  classNames,
}: ArticleBodyProps) {
  return (
    <div
      className={`relative flex min-h-[calc(100%-44px)] flex-col md:w-8/12 mx-auto ${classNames}`}
    >
      <div className={`order-2 w-full flex-auto mx-auto pb-12`}>
        <header className="text-center">
          <h1 className="tracking-wide">
            {(post.holder || post.artist) && (
              <div className="flex flex-col md:flex-row md:gap-1 justify-center">
                {post.holder && (
                  <span className="pb-1 md:pb-2 text-[#888] text-[13px] md:text-[15px] leading-[1.5]">
                    {post.holder}
                  </span>
                )}
                {post.artist && (
                  <span className="pb-1 md:pb-2 text-[#888] text-[13px] md:text-[15px] leading-[1.5]">
                    {post.artist}
                  </span>
                )}
              </div>
            )}

            <span className="block text-[#222] text-[18px] md:text-[24px] leading-[1.5]">
              {post.title}
            </span>
          </h1>
          <div className="flex justify-center gap-2 md:pt-2">
            {post.tag.map((tag, i) => {
              return (
                <span key={i}>
                  <Tag
                    tag={tag}
                    classNames={"text-[12px] md:text-[13px] leading-[1.5]"}
                  />
                  {i < post.tag.length - 1 && " "}
                </span>
              );
            })}
          </div>
          <hr className="w-[40px] h-[1px] mt-6 md:mt-8 mx-auto bg-[#ddd]" />
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
          <TiltImage
            single={false}
            article={false}
            clip={false}
            src={`${post.image}`}
            alt={post.title}
            width={512}
            height={512}
            tilt={1}
            // parentClassName="z-10 mt-4 mb-2 md:mb-3 p-2 bg-plate"
            parentClassName={`inline-flex md:w-full h-full z-10 ${layoutImageStyle(
              post,
            )}`}
            // childClassName={`w-full post-${post.layout} block drop-shadow-md`}
            childClassName={`post-${post.layout} drop-shadow-lg`}
          />
        </div>
      </div>
    </div>
  );
}
