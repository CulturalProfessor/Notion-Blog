import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/Logo.png";
import Github from "../../public/Github.png";
import { GetStaticProps } from "next";
import { Client } from "@notionhq/client";
import { pageToBlog } from "../lib/notion";

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_TOKEN,
});

// Function to fetch image URLs from Notion
export const getStaticProps: GetStaticProps =async () => {
  const databaseId = process.env.NOTION_DB;
  if (!databaseId) {
    throw new Error("NOTION_DB is missing");
  } else {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [
        {
          property: "Created",
          direction: "descending",
        },
      ],
    });
    const blogs = response.results.map((page) => pageToBlog(page));
    return {
      props: {
        blogs,
      },
      revalidate: 1000,
    };
  }
};

export default function Page({blogs}:any) {
  const response=blogs;
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const locale = "en-US";
    return new Date(dateString).toLocaleDateString(locale, options);
  };
  
  return (
    <div className="container mx-auto py-8 font-sans">
      <Link href={"https://github.com/CulturalProfessor/Notion-Blog"}>
        <div className="flex justify-center items-center p-8">
          <Image src={Logo} width={100} height={100} alt={"Logo"} />
          <h1 className="text-3xl mb-4 px-2 mt-4">Blogs</h1>
        </div>
      </Link>
      <div className="grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-12 justify-center items-center">
        {response.map((blog:any) => (
          <Link href={`/blogs/${blog.slug}`} key={blog.id}>
            <div className="border rounded p-4 h-[400px] max-w-[360px] flex flex-col justify-between shadow-lg transition duration-300 hover:shadow-indigo-100 md:shadow-xl hover:md:shadow-indigo-100">
              <div className="mb-4 flex justify-center">
                <Image
                  src={blog.cover.url}
                  alt={blog.name}
                  width={300}
                  height={150}
                  className="bg-blend-lighten rounded h-[150px] w-[300px]"
                />
              </div>
              <div>
                <h2 className="text-xl mb-2">{blog.name}</h2>
                <p className="text-gray-600">{blog.description}</p>
              </div>
              <div>
                {blog.tags.map((tag: any) => (
                  tag.name=="Work"?
                  <span
                    key={tag.id}
                    className="inline-block bg-red-200 text-gray-800 text-sm rounded-full px-2 py-1 mt-2"
                  >
                    {tag.name}
                  </span>
                  :
                  <span
                    key={tag.id}
                    className="inline-block bg-blue-200 text-gray-800 text-sm rounded-full px-2 py-1 mt-2"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div>
                <h1 className="text-lg text-gray-700 mt-4">{blog.author}</h1>
              </div>
              <div className="text-gray-500 mt-2">{formatDate(blog.time)}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center items-center p-16 text-xl md:grid-cols-2 lg:grid-cols-2 ">
        Made with ❤️ by{" Vinayak"}
        <Link href={"https://github.com/CulturalProfessor"}>
          <Image
            src={Github}
            width={25}
            height={25}
            alt={"Github Logo"}
            className="m-4"
          />
        </Link>
      </div>
    </div>
  );
}
