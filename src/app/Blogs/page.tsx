import { fetchBlogs } from "../../../lib/notion";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const response = await fetchBlogs();
  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto py-8 font-sans">
      <h1 className="text-3xl mb-4">My Blogs</h1>
      <div className="grid grid-cols-3 gap-4 ">
        {response.map((blog) => (
          <Link href={`/blogs/${blog.slug}`} key={blog.id}>
            <div className="border rounded p-4 max-w-[360px] flex flex-col justify-between shadow-lg hover:shadow-indigo-100 md:shadow-xl hover:md:shadow-indigo-100">
              <div className="mb-4 flex justify-center">
                <Image
                  src={blog.cover.url}
                  alt={blog.name}
                  width={360}
                  height={200}
                  className="bg-blend-lighten rounded"
                />
              </div>
              <div>
                <h2 className="text-xl mb-2">{blog.name}</h2>
                <p className="text-gray-600">{blog.description}</p>
              </div>
              <div>
                {blog.tags.map((tag: any) => (
                  <span
                    key={tag.id}
                    className="inline-block bg-red-200 text-gray-800 text-sm rounded-full px-2 py-1 mt-2"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div>
                <h1 className="text-lg text-gray-700 mt-4">
                  {blog.author}
                </h1>
              </div>
              <div className="text-gray-500 mt-2">{formatDate(blog.time)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
