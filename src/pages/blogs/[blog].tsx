import ReactMarkdown from "react-markdown";
import { fetchAllPaths, fetchBlogBySlug } from "../../lib/notion";

export default function Blog({ blog }: any) {

  return (
    <div className="max-w-2xl my-4 mx-auto p-8 shadow-2xl border transition duration-300 hover:shadow-indigo-500 md:shadow-xl hover:md:shadow-indigo-100  rounded">
      <ReactMarkdown className="prose">{blog}</ReactMarkdown>
    </div>
  );
}

export const getStaticProps = async ({ params }: any) => {
  const blog = await fetchBlogBySlug(params.blog);
  return {
    props: {
      blog,
    },
    revalidate: 1000,
  };
};

export const getStaticPaths = async () => {
  const paths = await fetchAllPaths();
  return {
    paths,
    fallback: true,
  };
};
