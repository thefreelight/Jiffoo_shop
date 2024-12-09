import glob from "fast-glob";
import { cache } from "react";
import path from "path";

interface Blog {
  title: string;
  description: string;
  author: {
    name: string;
    src: string;
  };
  date: string;
  image?: string;
}

export interface BlogWithSlug extends Blog {
  slug: string;
}

async function getBlogMetadata(blogPath: string): Promise<BlogWithSlug> {
  // 从文件名中提取 slug
  const slug = path.dirname(blogPath).split("/").pop() || "";
  
  // 导入元数据文件
  const { blog } = await import(`../app/(marketing)/blog/${slug}/metadata.ts`);
  
  return {
    ...blog,
    slug,
  };
}

export const getAllBlogs = cache(async (): Promise<BlogWithSlug[]> => {
  // 查找所有的 metadata.ts 文件
  const blogPaths = await glob("**/metadata.ts", {
    cwd: "app/(marketing)/blog",
  });

  const blogs = await Promise.all(
    blogPaths.map((blogPath) => getBlogMetadata(blogPath))
  );

  return blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
