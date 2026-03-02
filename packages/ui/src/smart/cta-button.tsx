import React from 'react'
import { cn } from '@portfolio/utils'
import { Button, ButtonProps } from '../button'

interface CTAButtonProps extends ButtonProps {
  href: string
  external?: boolean
}

export function CTAButton({ 
  href, 
  external, 
  children, 
  className,
  variant = 'default',
  ...props 
}: CTAButtonProps) {
  const baseStyles = 'px-8 py-4 font-medium rounded-full transition-all duration-300'
  
  const variantStyles = {
    default: 'bg-white text-black hover:bg-gray-100',
    secondary: 'bg-gradient-to-r from-[#23272a] to-[#2c2f36] text-white border-2 border-white/20 hover:border-white/40',
    outline: 'border-2 border-white text-white hover:bg-white/10',
  }
  
  const combinedClassName = cn(baseStyles, variantStyles[variant], className)
  
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
      >
        {children}
      </a>
    )
  }
  
  return (
    <a href={href} className={combinedClassName}>
      {children}
    </a>
  )
}

interface CTAButtonGroupProps {
  children: React.ReactNode
  className?: string
  vertical?: boolean
}

export function CTAButtonGroup({ children, className, vertical }: CTAButtonGroupProps) {
  return (
    <div className={cn(
      'flex gap-4 justify-center',
      vertical ? 'flex-col' : 'flex-col sm:flex-row',
      className
    )}>
      {children}
    </div>
  )
}
