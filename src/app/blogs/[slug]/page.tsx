import { fetchBlogBySlug } from "../../../lib/notion";

export default function Blog({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const blog = fetchBlogBySlug(slug);
  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}
