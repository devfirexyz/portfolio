import { createFileRoute } from '@tanstack/react-router'
import { Header, NavItem, Section, SectionHeader, Container, Footer, FooterLinks } from '@portfolio/ui'
import { SITE_CONFIG } from '@portfolio/shared'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#404EED] via-[#36367c] to-[#1e1f22]">
      <Header
        rightContent={
          <>
            <NavItem href="/">
              Home
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
            <SectionHeader title="About Me" align="left" />
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                I design and build systems that remove bottlenecks and scale effortlessly.
                From architecting AI platforms that transform raw data into real-time insights,
                to developing modular SDKs powering millions of users with zero downtime —
                my work blends deep technical rigor with a bias for business impact.
              </p>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                I thrive at the intersection of automation, scalability, and product velocity,
                turning complex challenges into platforms that outlast their first use case.
              </p>
              
              <h3 className="text-2xl font-bold text-white mb-4">Experience</h3>
              <div className="space-y-6">
                <ExperienceCard
                  title="Software Development Engineer III"
                  company="Current Role"
                  period="Present"
                  description="Building scalable financial tech solutions with AI-powered automation"
                />
              </div>
            </div>
          </Section>
        </Container>
      </main>

      <Footer>
        <FooterLinks />
      </Footer>
    </div>
  )
}

interface ExperienceCardProps {
  title: string
  company: string
  period: string
  description: string
}

function ExperienceCard({ title, company, period, description }: ExperienceCardProps) {
  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
      <h4 className="text-xl font-semibold text-white mb-1">{title}</h4>
      <p className="text-white/60 text-sm mb-2">{company} • {period}</p>
      <p className="text-white/80">{description}</p>
    </div>
  )
}
