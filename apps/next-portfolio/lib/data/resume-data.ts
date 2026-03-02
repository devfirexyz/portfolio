export const resumeData = {
  personal: {
    name: "Piyush Raj",
    title: "Software Development Engineer III",
    company: "Angel One",
    location: "Bangalore, KA, India",
    email: "piyushraj888s@gmail.com",
    phone: "+91-798-832-1537",
    linkedin: "https://linkedin.com/in/piyush-raj-60a6a2117",
    github: "https://github.com/devfirexyz",
    tagline: "Building scalable financial tech solutions with AI-powered automation",
    about: "Senior Software Engineer with 4+ years of experience in building high-performance web applications and scalable systems. Currently leading frontend architecture at Angel One, driving innovation in fintech through AI-powered solutions."
  },
  
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "Java"],
    frontend: ["React", "React Native", "Svelte", "SvelteKit", "Next.js", "Redux", "React Native Reanimated 2"],
    backend: ["Node.js", "Express.js", "Quarkus", "Firebase"],
    ai: ["CrewAI", "Vercel AI SDK"],
    cloud: ["AWS", "EC2", "DocumentDB", "Redis", "S3", "Docker"],
    tools: ["Nx", "Flipper", "Storybook", "Git", "CI/CD"]
  },
  
  experience: [
    {
      id: "angel-one-sde3",
      role: "Software Development Engineer III",
      company: "Angel One",
      location: "Bangalore, KA, India",
      period: "May 2025 - Current",
      current: true,
      highlights: [
        "Leading frontend architecture and technical decision-making for fintech solutions",
        "Driving innovation with AI-powered financial automation platforms"
      ]
    },
    {
      id: "angel-one-sde2",
      role: "Software Development Engineer II",
      company: "Angel One",
      location: "Bangalore, KA, India",
      period: "Aug 2024 - Apr 2025",
      highlights: [
        "Developed AI-powered financial content automation platform ingesting 15+ news sources (720+ daily articles)",
        "Led composable-SDK integration, launching 3 campaigns reaching 192,124 users with 3.42% expansion rate",
        "Scaled SDK to handle concurrent B2B (530,265 users) and B2C (1.67Cr+ users) campaigns",
        "Optimized app performance: 40% load size reduction, FCP <1.5s, LCP <2.5s"
      ]
    },
    {
      id: "angel-one-sde1",
      role: "Software Development Engineer I",
      company: "Angel One",
      location: "Bangalore, KA, India",
      period: "Aug 2023 - July 2024",
      highlights: [
        "Led Finone super-app development integrating 5+ mini-apps with >80% on-time delivery",
        "Developed UI component library with atomic design system using Storybook",
        "Established monitoring for Web Vitals, analytics, and error tracking",
        "Mentored junior engineers and drove cross-functional collaboration"
      ]
    },
    {
      id: "asknbid-sde1",
      role: "Software Development Engineer I",
      company: "AsknBid Tech",
      location: "Bangalore, KA, India",
      period: "July 2022 - July 2023",
      highlights: [
        "Built high-impact microservices powering portfolio management for 300K+ users",
        "Engineered cross-platform UI component library with scalable design system",
        "Implemented KYC & bank flows achieving 4-10% drop-off rates",
        "Led app delivery including Google Play releases and OTA updates"
      ]
    },
    {
      id: "asknbid-intern",
      role: "Software Development Engineer Intern",
      company: "AsknBid Tech",
      location: "Bangalore, KA, India",
      period: "October 2021 - June 2022",
      highlights: [
        "Engineered React Native modules reducing user drop-off by 2%",
        "Implemented payment gateway integrations and engagement features"
      ]
    }
  ],
  
  projects: [
    {
      id: "ai-content-automation",
      title: "AI Financial Content Platform",
      description: "Automated content ingestion system processing 720+ articles daily from 15+ sources",
      impact: "Reduced research effort by 70-80%",
      technologies: ["Python", "CrewAI", "Vercel AI SDK", "AWS"],
      metrics: {
        dailyArticles: "720+",
        sources: "15+",
        efficiency: "70-80%"
      }
    },
    {
      id: "composable-sdk",
      title: "Composable SDK Platform",
      description: "Scalable campaign SDK handling millions of concurrent users",
      impact: "192K users reached, 3.42% expansion rate",
      technologies: ["TypeScript", "React", "AWS", "Redis"],
      metrics: {
        b2bUsers: "530K+",
        b2cUsers: "1.67Cr+",
        expansionRate: "3.42%"
      }
    },
    {
      id: "finone-superapp",
      title: "Finone Super App",
      description: "Integrated platform combining 5+ mini-apps with optimized performance",
      impact: "80% on-time delivery with zero critical incidents",
      technologies: ["SvelteKit", "TypeScript", "Docker", "AWS"],
      metrics: {
        fcp: "<1.5s",
        lcp: "<2.5s",
        loadReduction: "40%"
      }
    },
    {
      id: "dstreet-finance",
      title: "Dstreet Finance Platform",
      description: "Microservices architecture for portfolio management",
      impact: "Serving 300K+ active users",
      technologies: ["Quarkus", "React Native", "Highcharts", "Redux"],
      metrics: {
        users: "300K+",
        kycDropoff: "4-10%",
        microservices: "5+"
      }
    }
  ],
  
  education: {
    degree: "Bachelor of Technology in Computer Science and Engineering",
    university: "Lovely Professional University",
    location: "Phagwara, Punjab, India",
    period: "July 2018 – July 2022",
    cgpa: "8.29"
  },
  
  achievements: [
    "Promoted to SDE-3 within 2 years at Angel One",
    "Led critical production incident resolutions in <6 hours",
    "97%+ on-time project delivery rate",
    "Mentored 5+ junior engineers"
  ]
}