import markdownStyles from "@/app/markdown.module.css";
import Tag from "@/components/Tag";

interface ArticleBodyProps {
  post: {
    artist?: string;
    title: string;
    tag: string[];
    image: string;
    layout: string;
  };
  content: string;
}

export default function ArticleBody({ post, content }: ArticleBodyProps) {
  return (
    <>
      <header>
        <h1 className="tracking-wide pt-1">
          {post.artist && (
            <span className="md:pb-1 block text-base md:text-xl">
              {post.artist}
            </span>
          )}
          <span className="block text-lg md:text-xl">{post.title}</span>
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
    </>
  );
}
