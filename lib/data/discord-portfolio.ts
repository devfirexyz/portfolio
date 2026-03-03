export type ChannelId =
  | "resume"
  | "introduction"
  | "experience"
  | "skills"
  | "projects"
  | "achievements"
  | "education";

export interface DiscordChannel {
  id: ChannelId;
  name: string;
  shortName?: string;
  icon: string;
}

export interface ResumeSectionContent {
  eyebrow: string;
  summary: string;
  chips: string[];
  points: string[];
}

export const DISCORD_CHANNELS: DiscordChannel[] = [
  { id: "resume", name: "resume-highlight", shortName: "resume", icon: "📄" },
  { id: "introduction", name: "introduction", shortName: "intro", icon: "👋" },
  {
    id: "experience",
    name: "work-experience",
    shortName: "experience",
    icon: "💼",
  },
  { id: "skills", name: "tech-skills", shortName: "skills", icon: "⚡" },
  { id: "projects", name: "key-projects", shortName: "projects", icon: "🚀" },
  { id: "achievements", name: "achievements", shortName: "wins", icon: "🏆" },
  { id: "education", name: "education", shortName: "education", icon: "🎓" },
];

export const RESUME_SECTION_CONTENT: Record<ChannelId, ResumeSectionContent> = {
  resume: {
    eyebrow: "Core Snapshot",
    summary:
      "Software Development Engineer III at Angel One with 4+ years building high-scale fintech systems focused on performance, reliability, and measurable business impact.",
    chips: [
      "📍 Bangalore, India",
      "💼 4+ years",
      "⚙️ Fintech + AI",
      "📬 piyushraj888s@gmail.com",
    ],
    points: [
      "⚡ Led & Developed Generative AI-powered chatbot for Demat account opening, transforming the traditional KYC journey into an interactive, conversational experience.",
      "🚀 Led frontend architecture and technical decisions for production fintech products.",
      "📈 Delivered AI-powered systems handling 720+ daily articles from 15+ sources.",
      "📊 Scaled composable SDK campaigns to 1.67Cr+ users across B2C and 530K+ B2B users.",
    ],
  },
  introduction: {
    eyebrow: "Professional Summary",
    summary:
      "I build systems that reduce friction, automate high-effort workflows, and keep product delivery stable under real traffic and tight timelines.",
    chips: [
      "🧠 Systems-first",
      "📦 Product-minded",
      "🔧 Delivery-focused",
      "🤝 Cross-team execution",
    ],
    points: [
      "🎯 Focus on clear architecture over temporary patches.",
      "🔄 Convert repetitive business workflows into scalable automation.",
      "📉 Track outcomes with performance, reliability, and delivery metrics.",
      "🧭 Balance speed and maintainability without reliability debt.",
    ],
  },
  experience: {
    eyebrow: "Career Timeline",
    summary:
      "Progression from intern to SDE III with increasing ownership across platform architecture, AI workflows, and high-scale campaign systems.",
    chips: [
      "🏢 Angel One",
      "🏗️ AsknBid Tech",
      "📅 Oct 2021 - Current",
      "📍 Bangalore",
    ],
    points: [
      "💼 Angel One — SDE III (May 2025 - Current) — AI powered chatbot, AI powered content automation system, Composable-SDK.",
      "🤖 Angel One — SDE II (Aug 2024 - Apr 2025) — Scaled Finone SuperApp with multiple verticals, Created DSYM libraries from scratch.",
      "📣 Angel One — SDE I (Aug 2023 - Jul 2024) — Finone, Architected the infra for the multitenant based app structure.",
      "📱 AsknBid (SDE Intern - SDE 1) — built microservices and app flows serving 300K+ users.",
    ],
  },
  skills: {
    eyebrow: "Stack Overview",
    summary:
      "Hands-on across frontend, backend, cloud, and AI-enablement with strong product and performance orientation.",
    chips: [
      "💻 TypeScript/JS",
      "⚛️ React + Next.js +- TanstackStart",
      "📱 React Native +- Flutter",
      "☁️ AWS + Docker + K8S",
      "💻 Go +- NodeJS +- Java",
    ],
    points: [
      "🛠️ Languages: TypeScript, JavaScript, Go, Python, Java.",
      "🎨 Frontend: Svelte & SvelteKit, React, Next.js, React Native, Redux, TanstackStart, Flutter.",
      "🔌 Backend: Go, Node.js, Express.js, Quarkus, Firebase.",
      "🤖 AI/Infra: Vercel AI SDK, CrewAI, Redis, EC2, S3, CI/CD, Docker, K8S.",
    ],
  },
  projects: {
    eyebrow: "Project Highlights",
    summary:
      "Production projects centered on scale, measurable outcomes, and platform-level reusability.",
    chips: [
      "📚 720+ articles/day",
      "👥 1.67Cr+ scale",
      "📈 70-80% efficiency",
      "⚡ 40% size reduction",
    ],
    points: [
      "💬 AI-powered chatbot for Demat account opening, transforming the traditional KYC journey into an interactive, conversational experience.",
      "📰 AI Financial Content Platform: automated ingestion from 15+ sources with 70-80% research-effort reduction.",
      "🧩 Composable SDK Platform: scaled concurrent B2B/B2C campaigns with 3.42% expansion.",
      "📲 Finone Super App: integrated 5+ mini-apps with >80% on-time delivery.",
      "🏦 Dstreet Finance: microservices portfolio system supporting 300K+ users.",
    ],
  },
  achievements: {
    eyebrow: "Proof of Impact",
    summary:
      "Delivery and platform outcomes tied to scale, reliability, and team effectiveness.",
    chips: [
      "🏅 Promoted to SDE III",
      "⏱️ <6h incident response",
      "✅ 97%+ on-time",
      "👨‍🏫 Mentored 5+ engineers",
    ],
    points: [
      "📈 Promoted to SDE III within 2 years at Angel One. All thanks 🤩 to the leadership & team that believed in me.",
      "🛡️ Resolved critical production incidents in under 6 hours.",
      "🎯 Maintained 97%+ project milestone consistency.",
      "📚 Mentored junior engineers while driving cross-functional delivery.",
    ],
  },
  education: {
    eyebrow: "Academic Foundation",
    summary:
      "Strong computer science foundation with practical engineering execution in real-world systems.",
    chips: [
      "🎓 B.Tech CSE",
      "🏫 LPU",
      "📅 Jul 2018 - Jul 2022",
      "📊 CGPA 8.29",
    ],
    points: [
      "📘 Degree: Bachelor of Technology in Computer Science and Engineering.",
      "🏛️ Institution: Lovely Professional University, Phagwara, Punjab.",
      "🧮 Academic score: CGPA 8.29.",
      "🧱 Applied fundamentals directly to production-scale engineering roles.",
    ],
  },
};
