import { fetchBlogBySlug } from "../../../lib/notion";
import ReactMarkdown from "react-markdown";

export default async function Blog({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const blog = await fetchBlogBySlug(slug);

  return (
    <div>
      <ReactMarkdown>{blog}</ReactMarkdown>
    </div>
  );
}
