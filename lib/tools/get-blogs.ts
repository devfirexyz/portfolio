import { tool } from "ai";
import { z } from "zod";

import { getAllPosts } from "@/lib/blog";

const blogInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(3).optional(),
});

function scorePost(query: string, value: string): number {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedValue = value.toLowerCase();

  if (!normalizedQuery) {
    return 0;
  }

  if (normalizedValue.includes(normalizedQuery)) {
    return normalizedQuery.length + 3;
  }

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  return tokens.reduce((score, token) => {
    return normalizedValue.includes(token) ? score + token.length : score;
  }, 0);
}

export const getBlogsTool = tool({
  description: "Find blog posts that match the user query and return structured cards.",
  inputSchema: blogInputSchema,
  execute: async ({ query, limit = 3 }) => {
    const posts = (await getAllPosts()).filter((post) => !post.draft);

    const ranked = posts
      .map((post) => {
        const tagScore = (post.tags ?? []).reduce((score, tag) => score + scorePost(query, tag), 0);

        const score =
          scorePost(query, post.title) * 2 +
          scorePost(query, post.description) +
          scorePost(query, post.rawContent.slice(0, 800)) +
          tagScore;

        return {
          post,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .filter((entry) => entry.score > 0)
      .slice(0, limit);

    const fallback = ranked.length > 0 ? ranked : posts.slice(0, limit).map((post) => ({ post, score: 0 }));

    return {
      kind: "blogs" as const,
      items: fallback.map(({ post }) => ({
        id: post.slug,
        title: post.title,
        description: post.description,
        href: `/blog/${post.slug}`,
        tags: post.tags ?? [],
        meta: {
          publishedAt: new Date(post.publishedAt).toISOString(),
          readingTime: post.readingTime,
          category: post.category ?? null,
          featured: Boolean(post.featured),
        },
      })),
    };
  },
});
