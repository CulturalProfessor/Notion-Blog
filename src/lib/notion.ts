import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_TOKEN,
});

export async function fetchBlogs() {
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
    return blogs;
  }
}

export function pageToBlog(page: any) {
  let cover = page.cover;
  if (cover.type == "file") {
    cover = page.cover.file;
  } else if (cover.type == "external") {
    cover = page.cover.external.url;
  } else {
    cover = null;
  }
  const properties = page.properties;
  const formattedBlog = {
    id: page.id,
    cover: cover,
    tags: properties.Tags.multi_select,
    time: properties.Updated.last_edited_time,
    published: properties.Published.checkbox,
    name: properties.Name.title[0].plain_text,
    description: properties.Description.rich_text[0].plain_text,
    slug: properties.Slug.formula.string,
    author: properties.Author.created_by.name,
  };
  return formattedBlog;
}

export async function fetchBlogBySlug(slug: string) {
  const databaseId = process.env.NOTION_DB;
  if (!databaseId) {
    throw new Error("NOTION_DB is missing");
  } else {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        formula: {
          string: {
            equals: slug,
          },
        },
      },
    });
    const post = await notion.blocks.children.list({
      block_id: response.results[0].id,
    });
    const result=post.results;
    return result;
  }
}
