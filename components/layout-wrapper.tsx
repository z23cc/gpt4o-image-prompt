"use client"

import { useEffect, useState } from "react"

interface LayoutWrapperProps {
  children: React.ReactNode
  className?: string
}

export function LayoutWrapper({ children, className = "" }: LayoutWrapperProps) {
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  return (
    <div 
      className={`w-full ${className}`}
      style={{
        minHeight: `${Math.max(600, viewportHeight - 200)}px`, // Ensure minimum height with space for fixed components
        paddingBottom: '120px' // Extra space for fixed positioned components
      }}
    >
      {children}
    </div>
  )
}

// Hook to get safe area dimensions
export function useSafeAreaDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    safeHeight: 0
  })

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const headerHeight = 80
      const footerSpace = 120 // Space for fixed components
      const safeHeight = height - headerHeight - footerSpace

      setDimensions({
        width,
        height,
        safeHeight: Math.max(400, safeHeight)
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return dimensions
}
