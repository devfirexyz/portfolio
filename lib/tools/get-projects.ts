import { tool } from "ai";
import { z } from "zod";

import { NEO_PROJECTS } from "@/lib/data/neo-home";

const projectInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(3).optional(),
});

function scoreProject(query: string, candidate: string): number {
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedCandidate = candidate.toLowerCase();

  if (!normalizedQuery) {
    return 0;
  }

  if (normalizedCandidate.includes(normalizedQuery)) {
    return normalizedQuery.length + 3;
  }

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  return queryTokens.reduce((score, token) => {
    return normalizedCandidate.includes(token) ? score + token.length : score;
  }, 0);
}

export const getProjectsTool = tool({
  description: "Find portfolio projects that match the user query and return structured cards.",
  inputSchema: projectInputSchema,
  execute: async ({ query, limit = 3 }) => {
    const ranked = NEO_PROJECTS.map((project) => {
      const stackScore = project.stack.reduce((score, tag) => score + scoreProject(query, tag), 0);
      const score =
        scoreProject(query, project.title) * 2 +
        scoreProject(query, project.description) +
        scoreProject(query, project.impact) +
        stackScore;

      return {
        project,
        score,
      };
    })
      .sort((a, b) => b.score - a.score)
      .filter((entry) => entry.score > 0)
      .slice(0, limit);

    const fallback = ranked.length > 0 ? ranked : NEO_PROJECTS.slice(0, limit).map((project) => ({ project, score: 0 }));

    return {
      kind: "projects" as const,
      items: fallback.map(({ project }) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        href: project.href ?? null,
        tags: project.stack,
        meta: {
          impact: project.impact,
          impactMetric: project.impactMetric,
          status: project.status,
          image: project.image,
          liveUnavailable: Boolean(project.liveUnavailable),
        },
      })),
    };
  },
});
