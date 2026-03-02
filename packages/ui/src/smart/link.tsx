import React from 'react'

interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

export function Link({ href, children, className, external }: LinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }
  
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
