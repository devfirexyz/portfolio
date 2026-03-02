import { createFileRoute } from '@tanstack/react-router'
import { 
  Header, 
  NavItem, 
  HeroSection, 
  CTAButton, 
  CTAButtonGroup, 
  Footer,
  FooterLinks,
  Section,
  Container,
  SectionHeader,
  ProjectCard,
  BlogCard
} from '@portfolio/ui'
import { SITE_CONFIG } from '@portfolio/shared'
import type { Project, BlogPost } from '@portfolio/types'

export const Route = createFileRoute('/')({
  component: Home,
})

const featuredProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Analytics Platform',
    description: 'Built a scalable analytics platform processing 10M+ events daily with real-time insights.',
    tags: ['React', 'Python', 'TensorFlow'],
    category: 'fullstack',
    featured: true,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Financial Trading SDK',
    description: 'Developed modular SDK powering millions of users with zero downtime.',
    tags: ['TypeScript', 'Node.js', 'WebSocket'],
    category: 'library',
    featured: true,
    status: 'completed',
  },
]

const recentPosts: BlogPost[] = [
  {
    title: 'Building Scalable AI Platforms',
    description: 'Lessons learned from architecting AI platforms that process millions of events daily.',
    publishedAt: new Date('2024-01-15'),
    category: 'Engineering',
    tags: ['AI', 'Architecture'],
    content: null,
    rawContent: '',
    slug: 'building-scalable-ai-platforms',
    readingTime: 8,
    readingTimeText: '8 min read',
    wordCount: 1600,
    featured: true,
  },
  {
    title: 'Zero-Downtime Deployments',
    description: 'How we achieved 99.99% uptime using advanced Kubernetes deployment strategies.',
    publishedAt: new Date('2024-01-08'),
    category: 'DevOps',
    tags: ['Kubernetes', 'DevOps'],
    content: null,
    rawContent: '',
    slug: 'zero-downtime-kubernetes',
    readingTime: 6,
    readingTimeText: '6 min read',
    wordCount: 1200,
  },
]

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#404EED] via-[#36367c] to-[#1e1f22]">
      <Header
        rightContent={
          <>
            <NavItem href="/projects">
              Projects
            </NavItem>
            <NavItem href="/blog">
              Blog
            </NavItem>
            <NavItem href="/about">
              About
            </NavItem>
            <NavItem href="https://github.com/devfirexyz" external>
              GitHub
            </NavItem>
          </>
        }
      />

      <HeroSection
        subtitle="Building scalable financial tech solutions with AI-powered automation."
      >
        <CTAButtonGroup>
          <CTAButton href="/projects">View Projects</CTAButton>
          <CTAButton href="https://devfire.xyz" variant="secondary">Main Portfolio</CTAButton>
        </CTAButtonGroup>
      </HeroSection>

      <Section className="py-16">
        <Container>
          <SectionHeader title="Featured Projects" />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-16">
        <Container>
          <SectionHeader title="Recent Writing" />
          <div className="grid gap-6 md:grid-cols-2">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </Section>

      <Footer>
        <FooterLinks />
        <div className="text-white/60 text-sm mt-4">
          Built with TanStack Start & React 19
        </div>
      </Footer>
    </div>
  )
}
