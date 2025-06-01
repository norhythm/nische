export type Post = {
  slug: string;
  title: string;
  date: string;
  image: string;
  tag: Array<string>;
  layout: string;
  content: string;
  published: boolean;
};
