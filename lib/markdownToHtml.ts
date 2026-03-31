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

// Allow any className value on every element.  The default schema restricts
// className to specific values on several tags (a, code, h2, li, ol, section,
// ul).  hast-util-sanitize checks tag-specific rules BEFORE the "*" fallback,
// and returns an empty array (not null) when no values match, which prevents
// the "*" rule from ever being consulted.  We therefore need to patch every
// tag-specific rule to use the permissive pattern as well.
const anyClass: [string, RegExp] = ["className", /^.+$/];

const patchedAttributes: Record<string, Array<unknown>> = {};
for (const [tag, defs] of Object.entries(defaultSchema.attributes ?? {})) {
  patchedAttributes[tag] = (defs as Array<unknown>).map((def) =>
    Array.isArray(def) && def[0] === "className" ? anyClass : def,
  );
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "iframe",
  ],
  attributes: {
    ...patchedAttributes,
    // Allow className and data-* on every element (style intentionally omitted)
    "*": [
      ...(defaultSchema.attributes?.["*"] ?? []),
      anyClass,
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
      anyClass,
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
    .use(rehypeSanitize, sanitizeSchema as Parameters<typeof rehypeSanitize>[0])
    .use(rehypeFilterIframes)
    .use(rehypeWrapYouTubeIframe)
    .use(rehypeCodeTitles)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
