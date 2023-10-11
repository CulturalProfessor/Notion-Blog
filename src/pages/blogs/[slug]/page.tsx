import { fetchBlogBySlug } from "../../../lib/notion";
import ReactMarkdown from "react-markdown";

export default async function Blog({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const blog = await fetchBlogBySlug(slug);

  return (
    <div className="max-w-2xl mx-auto p-8 shadow-2xl">
      <ReactMarkdown className="prose ">{blog}</ReactMarkdown>
    </div>
  );
}
