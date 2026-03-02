import React from 'react'
import { cn } from '@portfolio/utils'
import { SITE_CONFIG } from '@portfolio/shared'
import { Link } from './link'

interface HeaderProps {
  className?: string
  children?: React.ReactNode
  logo?: React.ReactNode
  rightContent?: React.ReactNode
}

export function Header({ className, children, logo, rightContent }: HeaderProps) {
  return (
    <nav className={cn('fixed top-0 w-full z-50 px-6 lg:px-10', className)}>
      <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
        <div className="flex items-center">
          {logo || (
            <Link href="/" className="text-white font-bold text-xl tracking-tight">
              {SITE_CONFIG.name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-6">
          {children}
          {rightContent}
        </div>
      </div>
    </nav>
  )
}

interface NavItemProps {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

export function NavItem({ href, children, className, external }: NavItemProps) {
  const baseStyles = 'text-white/80 hover:text-white transition-colors text-sm font-medium'
  
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseStyles, className)}
      >
        {children}
      </a>
    )
  }
  
  return (
    <Link href={href} className={cn(baseStyles, className)}>
      {children}
    </Link>
  )
}
