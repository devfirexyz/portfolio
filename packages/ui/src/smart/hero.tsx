import React from 'react'
import { cn } from '@portfolio/utils'
import { SITE_CONFIG } from '@portfolio/shared'

interface HeroSectionProps {
  title?: React.ReactNode
  subtitle?: string
  description?: string
  children?: React.ReactNode
  className?: string
  showGradient?: boolean
}

export function HeroSection({
  title,
  subtitle,
  description,
  children,
  className,
  showGradient = true,
}: HeroSectionProps) {
  return (
    <main className={cn(
      'relative flex items-center justify-center min-h-screen pt-20',
      showGradient && 'bg-gradient-to-b from-[#404EED] via-[#36367c] to-[#1e1f22]',
      className
    )}>
      <div className="text-center px-4 max-w-4xl mx-auto">
        {title || (
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6">
            <span className="block">Software</span>
            <span className="block">Development</span>
            <span className="block bg-gradient-to-r from-[#5865F2] via-[#8B5CF6] to-[#EB459E] bg-clip-text text-transparent">
              Engineer III
            </span>
          </h1>
        )}
        {subtitle && (
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-base text-white/60 max-w-xl mx-auto mb-8">
            {description}
          </p>
        )}
        {children}
      </div>
    </main>
  )
}

interface SocialLinksProps {
  className?: string
  iconSize?: number
}

export function SocialLinks({ className, iconSize = 24 }: SocialLinksProps) {
  const { social } = SITE_CONFIG
  
  const links = [
    { href: social.github, label: 'GitHub' },
    { href: social.linkedin, label: 'LinkedIn' },
    { href: social.twitter, label: 'Twitter' },
  ].filter(link => link.href)
  
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {links.map(link => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label={link.label}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
