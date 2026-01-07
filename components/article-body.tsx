import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";
import { layoutImageStyle } from "@/lib/utils";
import { Post } from "@/interfaces/post";

interface ArticleBodyProps {
  post: Post;
  content: string;
  modal: boolean;
}

export default function ArticleBody({
  post,
  content,
  modal,
}: ArticleBodyProps) {
  return (
    <div className="w-full mx-auto flex justify-between flex-col">
      <div
        className={`article-header order-2 w-full flex-auto md:w-7/12 mx-auto md:pt-6 xl:max-w-screen-xl`}
      >
        <header>
          <h1 className="tracking-wide pt-1">
            {post.artist && (
              <span className="md:pb-1 block text-base md:text-xl">
                {post.artist}
              </span>
            )}
            <span className="block text-base md:text-xl">{post.title}</span>
          </h1>
          <p className="pt-1">
            {post.tag.map((tag, i) => {
              return (
                <span key={i}>
                  <Tag tag={tag} classNames={"md:text-[15px]"} />
                  {i < post.tag.length - 1 && ", "}
                </span>
              );
            })}
          </p>
        </header>
        <div className="pt-6 mb-8 text-sm md:text-base md:pt-8">
          <div
            className={`${markdownStyles["markdown"]}`}
            dangerouslySetInnerHTML={{ __html: content || "" }}
          ></div>
        </div>
      </div>
      <div
        className={`article-image relative order-1 flex-auto md:order-1 py-4 md:py-0 mx-auto ${layoutImageStyle(
          post,
          modal
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
          parentClassName="z-10"
          childClassName={`w-full post-${post.layout} block drop-shadow-md`}
        />
      </div>
    </div>
  );
}
