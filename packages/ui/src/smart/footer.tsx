import React from 'react'
import { cn } from '@portfolio/utils'
import { SITE_CONFIG } from '@portfolio/shared'

interface FooterProps {
  className?: string
  children?: React.ReactNode
  showBuiltWith?: boolean
}

export function Footer({ className, children, showBuiltWith = true }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className={cn('relative py-16 text-center', className)}>
      {children}
      {showBuiltWith && (
        <div className="text-white/60 text-sm">
          Built with ❤️ by {SITE_CONFIG.name} © {currentYear}
        </div>
      )}
    </footer>
  )
}

interface FooterLinksProps {
  className?: string
}

export function FooterLinks({ className }: FooterLinksProps) {
  const { social } = SITE_CONFIG
  
  return (
    <div className={cn('flex items-center justify-center gap-6 mb-8', className)}>
      {social.github && (
        <a
          href={social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors"
        >
          GitHub
        </a>
      )}
      {social.linkedin && (
        <a
          href={social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors"
        >
          LinkedIn
        </a>
      )}
      {social.twitter && (
        <a
          href={social.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors"
        >
          Twitter
        </a>
      )}
    </div>
  )
}
