export type Post = {
  slug: string;
  url: string;
  holder: string;
  artist: string;
  title: string;
  date: string;
  image: string;
  tag: Array<string>;
  layout: string;
  content: string;
  published: boolean;
};
