import { createFileRoute } from '@tanstack/react-router'
import { 
  Header, 
  NavItem, 
  Section, 
  SectionHeader, 
  Container, 
  Footer,
  FooterLinks,
  BlogGrid 
} from '@portfolio/ui'
import { SITE_CONFIG } from '@portfolio/shared'
import type { BlogPost } from '@portfolio/types'

export const Route = createFileRoute('/blog')({
  component: Blog,
})

const blogPosts: BlogPost[] = [
  {
    title: 'Building Scalable AI Platforms',
    description: 'Lessons learned from architecting AI platforms that process millions of events daily.',
    publishedAt: new Date('2024-01-15'),
    category: 'Engineering',
    tags: ['AI', 'Architecture', 'Scale'],
    content: null,
    rawContent: '',
    slug: 'building-scalable-ai-platforms',
    readingTime: 8,
    readingTimeText: '8 min read',
    wordCount: 1600,
    featured: true,
  },
  {
    title: 'Zero-Downtime Deployments with Kubernetes',
    description: 'How we achieved 99.99% uptime using advanced Kubernetes deployment strategies.',
    publishedAt: new Date('2024-01-08'),
    category: 'DevOps',
    tags: ['Kubernetes', 'DevOps', 'SRE'],
    content: null,
    rawContent: '',
    slug: 'zero-downtime-kubernetes',
    readingTime: 6,
    readingTimeText: '6 min read',
    wordCount: 1200,
  },
  {
    title: 'React Performance Optimization Deep Dive',
    description: 'Advanced techniques for optimizing React applications at scale.',
    publishedAt: new Date('2023-12-20'),
    category: 'Frontend',
    tags: ['React', 'Performance', 'JavaScript'],
    content: null,
    rawContent: '',
    slug: 'react-performance-optimization',
    readingTime: 10,
    readingTimeText: '10 min read',
    wordCount: 2000,
  },
  {
    title: 'The Art of System Design',
    description: 'Key principles for designing robust and scalable distributed systems.',
    publishedAt: new Date('2023-12-10'),
    category: 'Engineering',
    tags: ['System Design', 'Architecture'],
    content: null,
    rawContent: '',
    slug: 'art-of-system-design',
    readingTime: 12,
    readingTimeText: '12 min read',
    wordCount: 2400,
  },
]

function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#404EED] via-[#36367c] to-[#1e1f22]">
      <Header
        rightContent={
          <>
            <NavItem href="/">
              Home
            </NavItem>
            <NavItem href="/projects">
              Projects
            </NavItem>
            <NavItem href="https://github.com/devfirexyz" external>
              GitHub
            </NavItem>
          </>
        }
      />

      <main className="pt-32 pb-16">
        <Container>
          <Section>
            <SectionHeader 
              title="Blog" 
              subtitle="Thoughts on engineering, architecture, and building products at scale"
            />
            <BlogGrid posts={blogPosts} />
          </Section>
        </Container>
      </main>

      <Footer>
        <FooterLinks />
      </Footer>
    </div>
  )
}
