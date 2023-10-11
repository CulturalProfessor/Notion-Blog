import ReactMarkdown from "react-markdown";
import { fetchBlogBySlug } from "../../lib/notion";

export default function Blog({ blog }: any) {
  return (
    <div className="max-w-2xl mx-auto p-8 shadow-2xl">
      <ReactMarkdown className="prose">{blog}</ReactMarkdown>
    </div>
  );
}

export const getStaticProps = async ({
  params,
}:any) => {
  const blog = await fetchBlogBySlug(params.blog);
  return {
    props: {
      blog,
    },
    revalidate: 100000,
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  };
};
