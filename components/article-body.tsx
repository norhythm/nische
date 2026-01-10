import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";
import TiltImage from "@/components/tiltImage";
import BackComponent from "@/components/back-component";
import { layoutImageStyle } from "@/lib/utils";
import { Post } from "@/interfaces/post";

interface ArticleBodyProps {
  post: Post;
  content: string;
  modal: boolean;
  backComponent: boolean;
  classNames?: string;
}

export default function ArticleBody({
  post,
  content,
  modal,
  backComponent,
  classNames,
}: ArticleBodyProps) {
  return (
    <div
      className={`relative flex min-h-[calc(100%-44px)] flex-col w-full mx-auto ${classNames}`}
    >
      {backComponent && <BackComponent style="mobile-cursor" />}
      <div
        className={`article-header order-2 w-full flex-auto md:w-7/12 mx-auto xl:max-w-screen-xl`}
      >
        <header>
          <h1 className="tracking-wide">
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
        className={`article-image relative order-1 md:order-1 mx-auto ${layoutImageStyle(
          post,
          modal
        )}`}
      >
        <TiltImage
          single={false}
          clip={true}
          src={`${post.image}`}
          alt={post.title}
          width={512}
          height={512}
          tilt={1}
          parentClassName="z-10 mt-4 mb-3 p-4 bg-plate"
          childClassName={`w-full post-${post.layout} block drop-shadow-md`}
        />
      </div>
    </div>
  );
}
