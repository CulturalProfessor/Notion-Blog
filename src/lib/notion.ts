import { Client } from "@notionhq/client";
import cron from "node-cron";

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_TOKEN,
});

// Function to fetch image URLs from Notion
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
    console.log("Fetched image URLs:", blogs[0].cover.expiry_time);
    return blogs;
  }
}

// Define the cron schedule (runs every hour)
const cronSchedule = "0 * * * *";

// Schedule the job to fetch image URLs
cron.schedule(cronSchedule, async () => {
  console.log("Fetching image URLs from Notion...");
  try {
    await fetchBlogs();
    console.log("Image URLs refreshed successfully.");
  } catch (error) {
    console.error("Error fetching image URLs:", error);
  }
});

console.log("Scheduled job for refreshing image URLs started.");

// Keep the script running
process.stdin.resume();

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

function convertBlocksToMarkdown(blocks: any[]) {
  let markdown = "";

  blocks.forEach((block: { type: string; paragraph: { rich_text: any[]; }; image: { file: { url: any; }; }; }) => {
    if (block.type === "paragraph") {
      block.paragraph.rich_text.forEach((text: { text: { content: string; }; }) => {
        markdown += text.text.content;
      });
      markdown += "\n\n";
    } else if (block.type === "image") {
      // Extract image URL or other relevant data
      const imageUrl = block.image.file.url;
      markdown += `![Image](${imageUrl})\n\n`;
    }
  });

  return markdown;
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
    const markdown = convertBlocksToMarkdown(post.results);
    return markdown;
  }
}
