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
  icon: string;
}

export interface ResumeSectionContent {
  eyebrow: string;
  summary: string;
  chips: string[];
  points: string[];
}

export const DISCORD_CHANNELS: DiscordChannel[] = [
  { id: "resume", name: "resume-highlight", icon: "📄" },
  { id: "introduction", name: "introduction", icon: "👋" },
  { id: "experience", name: "work-experience", icon: "💼" },
  { id: "skills", name: "tech-skills", icon: "⚡" },
  { id: "projects", name: "key-projects", icon: "🚀" },
  { id: "achievements", name: "achievements", icon: "🏆" },
  { id: "education", name: "education", icon: "🎓" },
];

export const RESUME_SECTION_CONTENT: Record<ChannelId, ResumeSectionContent> = {
  resume: {
    eyebrow: "Core Snapshot",
    summary:
      "Software Development Engineer III at Angel One with 4+ years building high-scale fintech systems focused on performance, reliability, and measurable business impact.",
    chips: ["📍 Bangalore, India", "💼 4+ years", "⚙️ Fintech + AI", "📬 piyushraj888s@gmail.com"],
    points: [
      "🚀 Led frontend architecture and technical decisions for production fintech products.",
      "📈 Delivered AI-powered systems handling 720+ daily articles from 15+ sources.",
      "📊 Scaled composable SDK campaigns to 1.67Cr+ users across B2C and 530K+ B2B users.",
      "⚡ Improved performance with up to 40% load-size reduction (FCP < 1.5s, LCP < 2.5s).",
    ],
  },
  introduction: {
    eyebrow: "Professional Summary",
    summary:
      "I build systems that reduce friction, automate high-effort workflows, and keep product delivery stable under real traffic and tight timelines.",
    chips: ["🧠 Systems-first", "📦 Product-minded", "🔧 Delivery-focused", "🤝 Cross-team execution"],
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
    chips: ["🏢 Angel One", "🏗️ AsknBid Tech", "📅 Oct 2021 - Current", "📍 Bangalore"],
    points: [
      "💼 Angel One — SDE III (May 2025 - Current), SDE II (Aug 2024 - Apr 2025), SDE I (Aug 2023 - Jul 2024).",
      "🤖 Built AI content automation platform (15+ sources, 720+ daily articles).",
      "📣 Launched SDK campaigns reaching 192,124 users with 3.42% expansion.",
      "📱 AsknBid — built microservices and app flows serving 300K+ users.",
    ],
  },
  skills: {
    eyebrow: "Stack Overview",
    summary:
      "Hands-on across frontend, backend, cloud, and AI-enablement with strong product and performance orientation.",
    chips: ["💻 TypeScript/JS", "⚛️ React + Next.js", "📱 React Native", "☁️ AWS + Docker"],
    points: [
      "🛠️ Languages: TypeScript, JavaScript, Python, Java.",
      "🎨 Frontend: React, Next.js, SvelteKit, React Native, Redux.",
      "🔌 Backend: Node.js, Express.js, Quarkus, Firebase.",
      "🤖 AI/Infra: CrewAI, Vercel AI SDK, Redis, EC2, S3, CI/CD.",
    ],
  },
  projects: {
    eyebrow: "Project Highlights",
    summary:
      "Production projects centered on scale, measurable outcomes, and platform-level reusability.",
    chips: ["📚 720+ articles/day", "👥 1.67Cr+ scale", "📈 70-80% efficiency", "⚡ 40% size reduction"],
    points: [
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
    chips: ["🏅 Promoted to SDE III", "⏱️ <6h incident response", "✅ 97%+ on-time", "👨‍🏫 Mentored 5+ engineers"],
    points: [
      "📈 Promoted to SDE III within 2 years at Angel One.",
      "🛡️ Resolved critical production incidents in under 6 hours.",
      "🎯 Maintained 97%+ project milestone consistency.",
      "📚 Mentored junior engineers while driving cross-functional delivery.",
    ],
  },
  education: {
    eyebrow: "Academic Foundation",
    summary:
      "Strong computer science foundation with practical engineering execution in real-world systems.",
    chips: ["🎓 B.Tech CSE", "🏫 LPU", "📅 Jul 2018 - Jul 2022", "📊 CGPA 8.29"],
    points: [
      "📘 Degree: Bachelor of Technology in Computer Science and Engineering.",
      "🏛️ Institution: Lovely Professional University, Phagwara, Punjab.",
      "🧮 Academic score: CGPA 8.29.",
      "🧱 Applied fundamentals directly to production-scale engineering roles.",
    ],
  },
};
