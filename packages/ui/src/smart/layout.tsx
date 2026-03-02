import React from 'react'
import { cn } from '@portfolio/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: 'section' | 'div' | 'main'
}

export function Section({ children, className, id, as: Component = 'section' }: SectionProps) {
  return (
    <Component id={id} className={cn('py-16 md:py-24', className)}>
      {children}
    </Component>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function SectionHeader({ title, subtitle, className, align = 'center' }: SectionHeaderProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  
  return (
    <div className={cn('mb-12', alignmentClasses[align], className)}>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-white/70 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  }
  
  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  )
}
