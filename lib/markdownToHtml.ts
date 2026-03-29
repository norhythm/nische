import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
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
    // Allow className and data-* on every element (style intentionally omitted)
    "*": [
      ...(defaultSchema.attributes?.["*"] ?? []),
      "className",
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

function rehypeFilterIframes() {
  const allowedHosts = [
    "youtube.com",
    "www.youtube.com",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
    "youtu.be",
    "soundcloud.com",
    "w.soundcloud.com",
    "open.spotify.com",
    "embed.music.apple.com",
  ];
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "iframe" && parent && typeof index === "number") {
        const src = typeof node.properties?.src === "string" ? node.properties.src : "";
        try {
          const url = new URL(src);
          if (!allowedHosts.some((h) => url.hostname === h)) {
            parent.children.splice(index, 1);
            return index; // revisit this index since we removed a node
          }
        } catch {
          parent.children.splice(index, 1);
          return index;
        }
      }
    });
  };
}

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
    .use(rehypeFilterIframes)
    .use(rehypeWrapYouTubeIframe)
    .use(rehypeCodeTitles)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
