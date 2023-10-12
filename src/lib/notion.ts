import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_TOKEN,
});

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

function convertBlocksToMarkdown(blocks: any[]): string {
  let markdown = "";

  blocks.forEach((block: any) => {
    switch (block.type) {
      case "paragraph":
        markdown += processParagraphBlock(block);
        break;
      case "image":
        markdown += processImageBlock(block);
        break;
      // Add support for other block types here
      default:
        break;
    }
  });

  return markdown;
}

function processParagraphBlock(block: any): string {
  const richText = block.paragraph.rich_text;
  let paragraphText = "";

  richText.forEach((text: any) => {
    if (text.annotations.bold) {
      paragraphText += `**${text.text.content}**`;
    } else {
      paragraphText += text.text.content;
    }
    if (text.annotations.italic) {
      paragraphText = `_${paragraphText}_`;
    }
  });

  paragraphText += "\n\n";

  return paragraphText;
}

function processImageBlock(block: any): string {
  const imageUrl = block.image.file.url;
  return `![Image](${imageUrl})\n\n`;
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

export async function fetchAllPaths(): Promise<string[]> {
  const databaseId = process.env.NOTION_DB;
  if (!databaseId) {
    throw new Error("NOTION_DB is missing");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  const slugs: string[] = response.results
    .filter((page) => "properties" in page)
    .map((page: any) => {
      const path="/blogs/"+page.properties.Slug.formula.string
      return path;
    });

  return slugs;
}
