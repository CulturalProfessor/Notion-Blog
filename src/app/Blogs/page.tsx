import { fetchBlogs } from "../../../lib/notion";

export default async function Page() {
  const response = await fetchBlogs();
  console.log(response);
  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}
