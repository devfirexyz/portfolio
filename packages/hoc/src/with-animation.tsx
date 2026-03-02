import React, { ComponentType } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

interface WithAnimationOptions {
  variants?: Variants
  initial?: string
  animate?: string
  exit?: string
  transition?: React.ComponentProps<typeof motion.div>['transition']
}

export function withAnimation<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAnimationOptions = {}
) {
  const {
    variants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    initial = 'hidden',
    animate = 'visible',
    exit = 'exit',
    transition = { duration: 0.3 },
  } = options

  const WithAnimationComponent: React.FC<P> = (props) => (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      variants={variants}
      transition={transition}
    >
      <WrappedComponent {...props} />
    </motion.div>
  )

  WithAnimationComponent.displayName = `withAnimation(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithAnimationComponent
}

export function withFadeIn<P extends object>(WrappedComponent: ComponentType<P>) {
  return withAnimation(WrappedComponent, {
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  })
}

export function withSlideIn<P extends object>(
  WrappedComponent: ComponentType<P>,
  direction: 'up' | 'down' | 'left' | 'right' = 'up'
) {
  const offset = 20
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
      x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
    exit: {
      opacity: 0,
      y: direction === 'up' ? -offset : direction === 'down' ? offset : 0,
      x: direction === 'left' ? -offset : direction === 'right' ? offset : 0,
    },
  }

  return withAnimation(WrappedComponent, { variants })
}
