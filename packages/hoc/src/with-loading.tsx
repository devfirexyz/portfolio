import React, { ComponentType, useState, useEffect } from 'react'

interface WithLoadingProps {
  isLoading?: boolean
}

export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  LoadingComponent?: React.ComponentType
) {
  const WithLoadingComponent: React.FC<P & WithLoadingProps> = ({
    isLoading,
    ...props
  }) => {
    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : <DefaultLoading />
    }
    return <WrappedComponent {...(props as P)} />
  }

  WithLoadingComponent.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithLoadingComponent
}

function DefaultLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export function useDelayedLoading(isLoading: boolean, delay: number = 200): boolean {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), delay)
      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [isLoading, delay])

  return showLoading
}
