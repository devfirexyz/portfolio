import { createFileRoute } from '@tanstack/react-router'
import { 
  Header, 
  NavItem, 
  Section, 
  SectionHeader, 
  Container, 
  Footer,
  FooterLinks,
  ProjectGrid 
} from '@portfolio/ui'
import { SITE_CONFIG } from '@portfolio/shared'
import type { Project } from '@portfolio/types'

export const Route = createFileRoute('/projects')({
  component: Projects,
})

const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Analytics Platform',
    description: 'Built a scalable analytics platform processing 10M+ events daily with real-time insights and ML-powered predictions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['React', 'Python', 'TensorFlow', 'Kafka', 'PostgreSQL'],
    category: 'fullstack',
    featured: true,
    status: 'completed',
    links: {
      live: 'https://example.com',
      github: 'https://github.com',
    },
  },
  {
    id: '2',
    title: 'Financial Trading SDK',
    description: 'Developed modular SDK powering millions of users with zero downtime, supporting multiple exchanges and asset classes.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    tags: ['TypeScript', 'Node.js', 'WebSocket', 'Redis'],
    category: 'library',
    featured: true,
    status: 'completed',
    links: {
      github: 'https://github.com',
      documentation: 'https://docs.example.com',
    },
  },
  {
    id: '3',
    title: 'E-commerce Microservices',
    description: 'Architected microservices infrastructure handling 100K+ concurrent users with 99.99% uptime.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    tags: ['Go', 'Kubernetes', 'gRPC', 'MongoDB'],
    category: 'backend',
    status: 'completed',
    links: {
      github: 'https://github.com',
    },
  },
  {
    id: '4',
    title: 'Real-time Collaboration Tool',
    description: 'Built a real-time document collaboration tool with CRDT-based conflict resolution.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    tags: ['React', 'WebRTC', 'Y.js', 'PostgreSQL'],
    category: 'fullstack',
    status: 'in-progress',
    links: {
      live: 'https://example.com',
    },
  },
]

function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#404EED] via-[#36367c] to-[#1e1f22]">
      <Header
        rightContent={
          <>
            <NavItem href="/">
              Home
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

      <main className="pt-32 pb-16">
        <Container>
          <Section>
            <SectionHeader 
              title="Projects" 
              subtitle="A collection of projects I've built, from AI platforms to financial systems"
            />
            <ProjectGrid projects={projects} />
          </Section>
        </Container>
      </main>

      <Footer>
        <FooterLinks />
      </Footer>
    </div>
  )
}
