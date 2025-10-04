"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";

interface DiscordPortfolioProps {
  className?: string;
}

const DiscordPortfolio = ({ className = "" }: DiscordPortfolioProps) => {
  const [activeChannel, setActiveChannel] = useState("introduction");

  // Memoized channel data
  const channels = useMemo(() => [
    { id: "introduction", name: "introduction", icon: "👋" },
    { id: "experience", name: "work-experience", icon: "💼" },
    { id: "skills", name: "tech-skills", icon: "⚡" },
    { id: "projects", name: "key-projects", icon: "🚀" },
    { id: "achievements", name: "achievements", icon: "🏆" },
    { id: "education", name: "education", icon: "🎓" },
  ], []);

  // Memoized server list
  const servers = useMemo(() => [
    { color: "#5865F2", name: "Portfolio" },
    { color: "#57F287", name: "Work" },
    { color: "#EB459E", name: "Projects" },
    { color: "#FEE75C", name: "Skills" },
  ], []);

  // Memoized chat messages for each channel
  const channelMessages = useMemo(() => ({
    introduction: [
      {
        user: "Piyush Raj",
        avatar: "P",
        role: "SDE III",
        time: "5 mins ago",
        message: "Hey there! 👋 I'm Piyush Raj, a Software Development Engineer III at Angel One. Welcome to my interactive portfolio!",
        avatarColors: "from-[#5865F2] to-[#4752c4]",
      },
      {
        user: "Portfolio Bot",
        avatar: "🤖",
        role: "BOT",
        time: "4 mins ago",
        message: "📍 Currently based in Bangalore, India. Building scalable fintech solutions serving millions of users daily!",
        avatarColors: "from-[#57F287] to-[#3ba55d]",
        roleColor: "bg-[#FEE75C]",
      },
      {
        user: "Piyush Raj",
        avatar: "P",
        time: "3 mins ago",
        message: "Feel free to explore different channels to learn more about my work experience, skills, and projects. Each channel has detailed information! 🚀",
        avatarColors: "from-[#5865F2] to-[#4752c4]",
      },
    ],
    experience: [
      {
        user: "Experience Tracker",
        avatar: "💼",
        role: "TRACKER",
        time: "2 hrs ago",
        message: "📈 **Angel One - SDE III** (May 2025 - Present)\nPreviously SDE II (Aug 2024 - Apr 2025) & SDE I (Aug 2023 - July 2024)\n**AsknBid Tech - SDE I** (July 2022 - July 2023)",
        avatarColors: "from-[#EB459E] to-[#c4185e]",
        roleColor: "bg-[#5865F2]",
      },
      {
        user: "AI Engineer",
        avatar: "🤖",
        role: "AI",
        time: "2 hrs ago",
        message: "🤖 **AI-Powered Financial Platform**: Built from scratch ingesting 15+ news sources (720+ daily articles) with automated trending-topic detection, reducing research effort by 70-80%",
        avatarColors: "from-[#5865F2] to-[#4752c4]",
        roleColor: "bg-[#57F287]",
      },
      {
        user: "Tech Lead",
        avatar: "📊",
        role: "LEAD",
        time: "1 hr ago",
        message: "🎯 **Composable-SDK Leader**: Led development & integration launching 3 successful campaigns reaching 192,124 users with 3.42% expansion rate. Scaled to handle concurrent B2B (530,265 users) & B2C (1.67Cr+ users) with zero failures!",
        avatarColors: "from-[#FEE75C] to-[#d4ac0d]",
        roleColor: "bg-[#EB459E]",
      },
      {
        user: "Performance Bot",
        avatar: "⚡",
        role: "PERF",
        time: "1 hr ago",
        message: "🚀 **Finone Super-app**: Led integration of 5+ mini-apps, >80% on-time delivery with zero critical incidents. Optimized performance: 40% load reduction, FCP <1.5s, LCP <2.5s, FID <100ms, TTI <4s",
        avatarColors: "from-[#57F287] to-[#3ba55d]",
        roleColor: "bg-[#FEE75C]",
      },
      {
        user: "Architecture Lead",
        avatar: "🏗️",
        role: "ARCH",
        time: "45 mins ago",
        message: "🎨 **UI & Utils Libraries**: Built atomic design system with Storybook + pure JS API layer (batching, caching, intelligent polling, offline queues), accelerating cross-team delivery & reducing integration effort",
        avatarColors: "from-[#EB459E] to-[#c4185e]",
        roleColor: "bg-[#57F287]",
      },
      {
        user: "Monitoring Bot",
        avatar: "📈",
        role: "MONITOR",
        time: "30 mins ago",
        message: "📊 **Production Excellence**: Comprehensive Web Vitals, analytics & error tracking. Resolved critical incidents in <6 hours. 97%+ on-time delivery. Enforced 100% peer reviews, CI/CD & containerization",
        avatarColors: "from-[#57F287] to-[#3ba55d]",
        roleColor: "bg-[#5865F2]",
      },
      {
        user: "AsknBid Engineer",
        avatar: "🏢",
        role: "SDE I",
        time: "20 mins ago",
        message: "💼 **Dstreet Finance**: Built high-impact microservices (markets, referrals, feeds, wallet, rewards) in Quarkus powering 300K+ users. Designed cross-platform UI library & achieved 4-10% KYC drop-off rates",
        avatarColors: "from-[#FEE75C] to-[#d4ac0d]",
        roleColor: "bg-[#EB459E]",
      },
    ],
    skills: [
      {
        user: "Skills Analyzer",
        avatar: "⚡",
        role: "ANALYZER",
        time: "1 hr ago",
        message: "💻 **Languages**: TypeScript, JavaScript, Python, Java",
        avatarColors: "from-[#FEE75C] to-[#d4ac0d]",
        roleColor: "bg-[#5865F2]",
      },
      {
        user: "Frontend Master",
        avatar: "⚛️",
        role: "FRONTEND",
        time: "1 hr ago",
        message: "🎨 **Frontend**: Svelte & SvelteKit, ReactJS, React Native, React Native-Web, React Native Reanimated 2, Redux, Nx",
        avatarColors: "from-[#5865F2] to-[#4752c4]",
        roleColor: "bg-[#57F287]",
      },
      {
        user: "Backend Engineer",
        avatar: "🔧",
        role: "BACKEND",
        time: "55 mins ago",
        message: "🔥 **Backend & AI**: NodeJS, ExpressJS, Quarkus, Python, Vercel AI-SDK, CrewAI",
        avatarColors: "from-[#EB459E] to-[#c4185e]",
        roleColor: "bg-[#FEE75C]",
      },
      {
        user: "Cloud Expert",
        avatar: "☁️",
        role: "CLOUD",
        time: "50 mins ago",
        message: "☁️ **Cloud & DevOps**: AWS (EC2, S3, DocumentDB), Docker, Firebase, Redis, Flipper",
        avatarColors: "from-[#57F287] to-[#3ba55d]",
        roleColor: "bg-[#EB459E]",
      },
      {
        user: "Mobile Dev",
        avatar: "📱",
        role: "MOBILE",
        time: "45 mins ago",
        message: "📱 **Mobile & Native**: React Native, React Native Reanimated 2, React Native-Web, Android Kotlin, Appcenter CodePush",
        avatarColors: "from-[#FEE75C] to-[#d4ac0d]",
        roleColor: "bg-[#5865F2]",
      },
    ],
    projects: [
      {
        user: "AI Platform Lead",
        avatar: "🤖",
        role: "AI",
        time: "3 hrs ago",
        message: "🤖 **AI Financial Content Platform**: From-scratch development ingesting 15+ news sources, 720+ daily articles. Automated trending-topic detection reducing research by 70-80%",
        avatarColors: "from-[#5865F2] to-[#4752c4]",
        roleColor: "bg-[#57F287]",
      },
      {
        user: "SDK Architect",
        avatar: "📦",
        role: "ARCH",
        time: "2 hrs ago",
        message: "📊 **Composable-SDK Integration**: Led A1 super-app SDK with 3 campaigns (Oct-Dec 2024). 192,124 users, 3.42% expansion. Scaled to 1.67Cr+ B2C & 530,265 B2B users, zero failures, global mutual-fund campaigns",
        avatarColors: "from-[#EB459E] to-[#c4185e]",
        roleColor: "bg-[#FEE75C]",
      },
      {
        user: "Finone Lead",
        avatar: "🏦",
        role: "LEAD",
        time: "2 hrs ago",
        message: "🏦 **Finone Super-app**: Led 5+ mini-app integration. >80% on-time delivery, zero critical incidents. 40% load reduction, all core Web Vitals optimized for mid-range devices",
        avatarColors: "from-[#FEE75C] to-[#d4ac0d]",
        roleColor: "bg-[#EB459E]",
      },
      {
        user: "Library Architect",
        avatar: "🏗️",
        role: "ARCH",
        time: "1 hr ago",
        message: "🎨 **Design System**: Atomic design with Storybook for consistent UI\n🔧 **Utils Library**: Pure JS API layer - batching, caching, intelligent polling, offline queues",
        avatarColors: "from-[#57F287] to-[#3ba55d]",
        roleColor: "bg-[#5865F2]",
      },
      {
        user: "Dstreet Engineer",
        avatar: "📈",
        role: "SDE",
        time: "45 mins ago",
        message: "💼 **Dstreet Finance**: High-impact microservices (markets, referrals, feeds, wallet, rewards) in Quarkus for 300K+ users. Market data viz with Highcharts, KYC flows with 4-10% drop-off",
        avatarColors: "from-[#EB459E] to-[#c4185e]",
        roleColor: "bg-[#57F287]",
      },
    ],
    achievements: [
      {
        user: "Scale Master",
        avatar: "🚀",
        role: "SCALE",
        time: "4 hrs ago",
        message: "📈 **Massive Scale**: Serving 1.67Cr+ B2C users & 530,265 B2B users concurrently with zero failures, no performance degradation, consistently low latency",
        avatarColors: "from-[#5865F2] to-[#4752c4]",
        roleColor: "bg-[#57F287]",
      },
      {
        user: "Performance King",
        avatar: "⚡",
        role: "PERF",
        time: "3 hrs ago",
        message: "⚡ **Web Vitals Excellence**: 40% load reduction, FCP <1.5s, LCP <2.5s, FID <100ms, TTI <4s on mid-range devices across all projects",
        avatarColors: "from-[#FEE75C] to-[#d4ac0d]",
        roleColor: "bg-[#EB459E]",
      },
      {
        user: "Delivery Champion",
        avatar: "🎯",
        role: "DELIVERY",
        time: "2 hrs ago",
        message: "🚀 **97%+ On-Time Delivery**: Consistent delivery across all projects with zero critical incidents in production",
        avatarColors: "from-[#EB459E] to-[#c4185e]",
        roleColor: "bg-[#FEE75C]",
      },
      {
        user: "Tech Leader",
        avatar: "👨‍💼",
        role: "LEAD",
        time: "2 hrs ago",
        message: "👥 **Leadership & Mentorship**: Mentored junior/mid engineers, drove technical decision-making, collaborated cross-functionally with product, backend & QA teams",
        avatarColors: "from-[#57F287] to-[#3ba55d]",
        roleColor: "bg-[#5865F2]",
      },
      {
        user: "Quality Guardian",
        avatar: "✅",
        role: "QA",
        time: "1 hr ago",
        message: "🛡️ **Quality & DevOps**: Enforced repo-level quality gates (ESLint/Prettier), 100% peer reviews, CI/CD & containerization for SvelteKit, testing/SSR safety standards",
        avatarColors: "from-[#FEE75C] to-[#d4ac0d]",
        roleColor: "bg-[#EB459E]",
      },
      {
        user: "Incident Hero",
        avatar: "🚨",
        role: "HERO",
        time: "45 mins ago",
        message: "⚡ **Incident Response**: Resolved critical production incidents in <6 hours with comprehensive Web Vitals, analytics & error tracking monitoring",
        avatarColors: "from-[#EB459E] to-[#c4185e]",
        roleColor: "bg-[#57F287]",
      },
    ],
    education: [
      {
        user: "Education Bot",
        avatar: "🎓",
        role: "EDU",
        time: "6 hrs ago",
        message: "🏫 **Lovely Professional University**\nBachelor of Technology in Computer Science\nCGPA: 8.29 (2018-2022)",
        avatarColors: "from-[#5865F2] to-[#4752c4]",
        roleColor: "bg-[#57F287]",
      },
      {
        user: "Academic Tracker",
        avatar: "📚",
        role: "TRACKER",
        time: "5 hrs ago",
        message: "🏫 **Army Public School**\nClass XII (CBSE) - 77.7%\nStrong foundation in science and mathematics",
        avatarColors: "from-[#57F287] to-[#3ba55d]",
        roleColor: "bg-[#EB459E]",
      },
    ],
  }), []);

  const handleChannelClick = useCallback((channelId: string) => {
    setActiveChannel(channelId);
  }, []);

  const activeMessages = channelMessages[activeChannel as keyof typeof channelMessages] || [];
  const activeChannelMeta = channels.find((ch) => ch.id === activeChannel);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: 5 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        delay: 0.6,
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 200,
      }}
      whileHover={{
        scale: 1.005,
        transition: { duration: 0.3 },
      }}
      style={{
        WebkitFontSmoothing: 'antialiased',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
      className={`bg-[#36393f] rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col will-change-transform ${className}`}
    >
      {/* Discord window header */}
      <div className="h-10 bg-[#202225] flex items-center justify-between px-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-white text-xs font-medium sm:text-sm">
          Piyush Raj - Portfolio
        </div>
        <div className="w-12" />
      </div>

      {/* Discord app interface */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Mobile channel picker */}
        <div className="md:hidden border-b border-[#202225] bg-[#2f3136]">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2 text-white text-sm font-semibold">
              <span className="text-lg">{activeChannelMeta?.icon}</span>
              <span className="capitalize">{activeChannelMeta?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <div className="w-2 h-2 rounded-full bg-[#3ba55d] animate-pulse" />
              Live
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto px-4 pb-3">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeChannel === channel.id
                    ? "bg-white text-[#202225]"
                    : "bg-[#3a3d42] text-white/70"
                }`}
              >
                <span>{channel.icon}</span>
                <span className="capitalize">{channel.name.replace(/-/g, " ")}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Server sidebar */}
          <div className="hidden md:flex w-[60px] lg:w-[72px] bg-[#202225] flex-col items-center py-3 gap-2">
            <motion.div
              className="w-10 h-10 lg:w-12 lg:h-12 bg-[#5865F2] rounded-[20px] lg:rounded-[24px] flex items-center justify-center text-white font-bold cursor-pointer relative group"
              whileHover={{
                borderRadius: "16px",
                scale: 1.1,
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.3,
              }}
            >
              <span className="text-lg">P</span>
            </motion.div>
            <div className="w-8 h-[2px] lg:w-12 lg:h-[2px] bg-[#35383e] rounded-full" />
            {servers.map((server, index) => (
              <motion.div
                key={index}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-[#36393f] rounded-full cursor-pointer relative group"
                whileHover={{
                  backgroundColor: server.color,
                  borderRadius: "16px",
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <motion.div
                  className="absolute -inset-1 rounded-full -z-10"
                  style={{ backgroundColor: server.color }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ opacity: 0.2, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Channel sidebar */}
          <div className="hidden md:block w-[160px] lg:w-[180px] bg-[#2f3136]">
            <div className="p-3 lg:p-4">
              <motion.div
                className="text-white font-semibold mb-4 text-base"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                Portfolio Server
              </motion.div>
              <motion.div
                className="text-white/60 text-xs font-semibold uppercase mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                Resume Channels
              </motion.div>
              <div className="space-y-1">
                {channels.map((channel, index) => (
                  <motion.div
                    key={channel.id}
                    className={`px-3 py-2 rounded text-sm flex items-center gap-3 cursor-pointer group transition-all duration-300 ${
                      activeChannel === channel.id
                        ? "bg-[#42464d] text-white"
                        : "text-[#96989d] hover:bg-[#42464d]/50 hover:text-white"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 1.0 + index * 0.1,
                      duration: 0.3,
                    }}
                    whileHover={{
                      x: 4,
                      backgroundColor: activeChannel === channel.id ? "#42464d" : "#42464d",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChannelClick(channel.id)}
                  >
                    <span className="text-lg">{channel.icon}</span>
                    <span className="truncate flex-1">{channel.name}</span>
                    {activeChannel === channel.id && (
                      <motion.div
                        className="w-1 h-4 bg-white rounded-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 bg-[#36393f] flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="h-12 border-b border-[#202225] px-4 flex items-center flex-shrink-0">
              <span className="text-[#72767d] text-lg">{activeChannelMeta?.icon}</span>
              <span className="ml-2 text-white font-semibold text-sm capitalize sm:text-base">
                {activeChannelMeta?.name}
              </span>
              <div className="ml-auto hidden items-center gap-2 md:flex">
                <div className="w-2 h-2 bg-[#3ba55d] rounded-full animate-pulse" />
                <span className="text-[#b5bac1] text-xs">Live Portfolio</span>
              </div>
            </div>

            {/* Messages - Scrollable Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#36393f] min-h-0">
              <div className="p-3 sm:p-4 space-y-4">
              {activeMessages.map((msg, msgIndex) => (
                <motion.div
                  key={`${activeChannel}-${msgIndex}`}
                  className="flex gap-3 group"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: msgIndex * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300,
                  }}
                  whileHover={{ scale: 1.005 }}
                >
                  <motion.div
                    className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${msg.avatarColors} rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0 shadow-lg cursor-pointer`}
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      boxShadow: "0 8px 32px rgba(88, 101, 242, 0.3)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {msg.avatar}
                  </motion.div>
                  <div className="flex-1">
                    <motion.div
                      className="flex items-center gap-2 mb-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: msgIndex * 0.1 + 0.05,
                        duration: 0.3,
                      }}
                    >
                      <span className="text-[#f2f3f5] font-bold text-xs sm:text-sm hover:text-white transition-colors cursor-pointer">
                        {msg.user}
                      </span>
                      {msg.role && (
                        <motion.span
                          className={`${
                            msg.roleColor || "bg-[#5865F2]"
                          } text-white text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium cursor-pointer`}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {msg.role}
                        </motion.span>
                      )}
                      <span className="text-[#b5bac1] text-[10px] sm:text-xs group-hover:text-[#dcddde] transition-colors">
                        {msg.time}
                      </span>
                    </motion.div>
                    <motion.div
                      className="text-[#dcddde] text-sm leading-relaxed bg-[#4f545c]/60 p-3 rounded-lg border border-[#5c6370]/50 shadow-sm hover:bg-[#4f545c]/80 hover:border-[#5c6370]/70 transition-all duration-300 cursor-pointer group-hover:shadow-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: msgIndex * 0.1 + 0.1,
                        duration: 0.3,
                      }}
                      whileHover={{ y: -1 }}
                      dangerouslySetInnerHTML={{
                        __html: msg.message.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>'),
                      }}
                    />
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiscordPortfolio;
