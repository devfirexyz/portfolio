export const NEO_HOME = {
  brand: "piyushraj",
  heading: "system-core",
  heroLine1: "SHIP FAST. STAY STABLE.",
  heroLine2: "CLARITY OVER NOISE.",
  ctaPrimary: "Open Resume",
  ctaSecondary: "Contact",
};

export const NEO_FEATURES = [
  {
    id: "01",
    title: "Impact First",
    description:
      "Each project starts with a target metric and ends with a visible business delta, not a visual-only launch.",
  },
  {
    id: "02",
    title: "Case Study Depth",
    description:
      "Architecture choices, tradeoffs, and outcomes are documented in plain language so hiring teams can scan signal quickly.",
  },
  {
    id: "03",
    title: "Fast Evidence",
    description:
      "Live demos, source links, and deployment notes are attached to every major build so claims are verifiable.",
  },
  {
    id: "04",
    title: "Future Ready",
    description:
      "The design system is tokenized and reusable, so expanding this portfolio into new sections stays low-friction.",
  },
] as const;

export const NEO_PROCESS = [
  {
    step: "01",
    action: "Map",
    description:
      "Define user goals, product constraints, and success metrics before opening the editor.",
  },
  {
    step: "02",
    action: "Build",
    description:
      "Implement reusable components and hard-edged layouts with strict hierarchy and clean interaction logic.",
  },
  {
    step: "03",
    action: "Validate",
    description:
      "Ship with performance checks, conversion paths, and observability so outcomes remain measurable post-launch.",
  },
] as const;

export const NEO_COMPARE = {
  leftTitle: "SIGNAL VS NOISE",
  leftText:
    "High-performing portfolios prioritize proof, clarity, and easy navigation. Decorative complexity without evidence does not convert.",
  rival: [
    "Heavy visuals, weak outcomes",
    "No clear user path",
    "Little evidence of execution",
    "Inconsistent component language",
    "Difficult to update over time",
  ],
  solution: [
    "Proof-driven copy and structure",
    "Fast scanning in under 30 seconds",
    "Reusable tokenized UI system",
    "Clear CTA paths for hiring and clients",
    "Future-proof component architecture",
  ],
};

export interface NeoProject {
  id: string;
  title: string;
  description: string;
  impact: string;
  impactMetric: string;
  stack: string[];
  image: string;
  status: "Live" | "Case Study";
  href?: string;
  liveUnavailable?: boolean;
}

export const NEO_PROJECTS: NeoProject[] = [
  {
    id: "neo-brutalist-ui-skill",
    title: "Neo-Brutalist UI System Skill",
    description:
      "Published an installable skill on skills.sh that applies a reusable neo-brutalist design system to frontend projects.",
    impact:
      "Used this exact skill to revamp this portfolio and make the design system reusable for anyone to install and apply.",
    impactMetric: "Published",
    stack: ["skills.sh", "Codex Skill", "Design System", "Tailwind"],
    image: "/dark-portfolio-showcase.png",
    status: "Live",
    href: "https://skills.sh/devfirexyz/ui-skills/neo-brutalist-ui-system",
  },
  {
    id: "convobase",
    title: "Convobase",
    description:
      "Conversation infrastructure for AI-first products with streaming responses, context control, and BYOC deployment support.",
    impact:
      "Moved teams off legacy chat stacks into production-grade, API-first conversation flows.",
    impactMetric: "Infra + API",
    stack: ["TanStack Start", "TypeScript", "Go", "BYOC"],
    image: "/convobase.png",
    status: "Live",
    href: "https://convobase.app",
    liveUnavailable: true,
  },
  {
    id: "my-gpt-11",
    title: "My GPT-11",
    description:
      "AI fantasy cricket platform that uses player form, pitch context, and match metadata to optimize team recommendations.",
    impact:
      "Delivered faster lineup decisions with data-guided suggestions for fantasy users.",
    impactMetric: "AI Product",
    stack: ["Next.js", "React", "TypeScript", "Tailwind"],
    image: "/gpt11.png",
    status: "Live",
    href: "https://www.mygpt11.com/",
  },
  {
    id: "inference-agent-ui",
    title: "Inference Agent UI Skill",
    description:
      "Published an installable skill on skills.sh. Build production-ready agent interfaces using the ui.inference.sh component registry and the AI SDK stream protocol.",
    impact: "Coming soon on this portfolio itself.",
    impactMetric: "Published",
    stack: ["skills.sh", "Codex Skill", "Design System", "Tailwind"],
    image: "/inference_agent_ui.png",
    status: "Live",
    href: "https://skills.sh/devfirexyz/ui-skills/inference-agent-ui",
  },
];
