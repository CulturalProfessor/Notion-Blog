export type Tag={
    id: string;
    name: string;
    color: string;
}

export type Blog = {
    Created: string;
    Updated: string;
    Created_By: string;
    Tags: Tag;
    Name: string;
    Description: string;
    Published: boolean;
    Slug: string;
  };
  