import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypePrism from "rehype-prism-plus";
import rehypeCodeTitles from "rehype-code-titles";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

// Extend the default sanitization schema to support:
// - YouTube iframes embedded in markdown content
// - className / style / data-* attributes on all elements (needed for code
//   highlighting, custom layouts, and the youtube-wrapper div)
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "iframe",
  ],
  attributes: {
    ...defaultSchema.attributes,
    // Allow className, style, and data-* on every element
    "*": [
      ...(defaultSchema.attributes?.["*"] ?? []),
      "className",
      "style",
      /^data-/,
    ],
    // Allow the attributes required for YouTube iframes
    iframe: [
      "src",
      "width",
      "height",
      "frameBorder",
      "allow",
      "allowFullScreen",
      "title",
      "className",
      "style",
    ],
  },
  // Allow https src on iframes (YouTube embed URLs)
  protocols: {
    ...defaultSchema.protocols,
    src: [...(defaultSchema.protocols?.src ?? ["http", "https"]), "https"],
  },
};

function rehypeWrapYouTubeIframe() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (
        node.tagName === "iframe" &&
        typeof node.properties?.src === "string" &&
        (node.properties.src.includes("youtube.com") ||
          node.properties.src.includes("youtu.be"))
      ) {
        if (parent && typeof index === "number") {
          const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: { className: ["youtube-wrapper"] },
            children: [node],
          };
          parent.children[index] = wrapper;
        }
      }
    });
  };
}

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeWrapYouTubeIframe)
    .use(rehypeCodeTitles)
    .use(rehypePrism)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
