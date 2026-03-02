import fs from "fs";
import path from "path";
import type { BlogPost } from "@/types/blog";

// Simple frontmatter parser
function parseFrontmatter(content: string) {
  const normalized = content.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");

  if (lines[0]?.trim() !== "---") {
    return { frontmatter: {}, content: normalized };
  }

  let frontmatterEnd = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === "---") {
      frontmatterEnd = index;
      break;
    }
  }

  if (frontmatterEnd === -1) {
    return { frontmatter: {}, content: normalized };
  }

  const frontmatterStr = lines.slice(1, frontmatterEnd).join("\n");
  const markdownContent = lines.slice(frontmatterEnd + 1).join("\n");
  const frontmatter: any = {};

  // Parse simple YAML-like frontmatter
  frontmatterStr.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Parse arrays
      if (value.startsWith("[") && value.endsWith("]")) {
        frontmatter[key] = value
          .slice(1, -1)
          .split(",")
          .map((item) =>
            item.trim().replace(/['"]/g, "")
          )
          .filter(Boolean);
      }
      // Parse booleans
      else if (value === "true") {
        frontmatter[key] = true;
      } else if (value === "false") {
        frontmatter[key] = false;
      } else {
        frontmatter[key] = value;
      }
    }
  });

  return { frontmatter, content: markdownContent };
}

// Reading time calculator
function calculateReadingTime(content: string): { minutes: number; text: string; words: number } {
  const wordsPerMinute = 200;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return {
    minutes,
    text: `${minutes} min read`,
    words,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const contentDir = path.join(process.cwd(), "content/blog");

  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((file) => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { frontmatter, content } = parseFrontmatter(fileContent);
    const readingTime = calculateReadingTime(content);
    const slug = file.replace(/\.mdx$/, "");

    return {
      title: frontmatter.title || "Untitled",
      description: frontmatter.description || "",
      publishedAt: new Date(frontmatter.publishedAt || Date.now()),
      updatedAt: frontmatter.updatedAt ? new Date(frontmatter.updatedAt) : undefined,
      tags: frontmatter.tags || [],
      category: frontmatter.category,
      author: frontmatter.author || "Piyush Raj",
      featured: frontmatter.featured || false,
      draft: frontmatter.draft || false,
      content: null, // MDX content would go here
      rawContent: content,
      slug,
      readingTime: readingTime.minutes,
      readingTimeText: readingTime.text,
      wordCount: readingTime.words,
    } as BlogPost;
  });

  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}
