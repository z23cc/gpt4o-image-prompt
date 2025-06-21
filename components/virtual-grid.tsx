"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { ImageWithPrompt } from "@/types/types"

interface VirtualGridProps {
  items: ImageWithPrompt[]
  itemHeight: number
  containerHeight: number
  itemsPerRow: number
  gap: number
  renderItem: (item: ImageWithPrompt, index: number) => React.ReactNode
}

export function VirtualGrid({
  items,
  itemHeight,
  containerHeight,
  itemsPerRow,
  gap,
  renderItem
}: VirtualGridProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 计算虚拟滚动参数
  const rowHeight = itemHeight + gap
  const totalRows = Math.ceil(items.length / itemsPerRow)
  const totalHeight = totalRows * rowHeight
  
  // 计算可见范围
  const visibleRowStart = Math.floor(scrollTop / rowHeight)
  const visibleRowEnd = Math.min(
    visibleRowStart + Math.ceil(containerHeight / rowHeight) + 1,
    totalRows
  )
  
  // 计算可见项目
  const visibleItems = useMemo(() => {
    const startIndex = visibleRowStart * itemsPerRow
    const endIndex = Math.min(visibleRowEnd * itemsPerRow, items.length)
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      row: Math.floor((startIndex + index) / itemsPerRow),
      col: (startIndex + index) % itemsPerRow
    }))
  }, [items, visibleRowStart, visibleRowEnd, itemsPerRow])

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // 计算偏移量
  const offsetY = visibleRowStart * rowHeight

  return (
    <div
      ref={containerRef}
      className="overflow-auto rounded-lg border border-slate-200/50"
      style={{
        height: containerHeight,
        maxHeight: '80vh', // Ensure it doesn't exceed viewport
        minHeight: '400px' // Minimum usable height
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            display: 'grid',
            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
            gap: `${gap}px`,
            padding: `${gap}px`
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div key={item.id || index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook for responsive grid calculations
export function useResponsiveGrid() {
  const [dimensions, setDimensions] = useState({
    itemsPerRow: 4,
    itemHeight: 300,
    gap: 24
  })

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth
      
      let itemsPerRow = 4
      let itemHeight = 300
      let gap = 24

      if (width < 640) {
        // Mobile
        itemsPerRow = 1
        itemHeight = 280
        gap = 16
      } else if (width < 768) {
        // Small tablet
        itemsPerRow = 2
        itemHeight = 290
        gap = 20
      } else if (width < 1024) {
        // Tablet
        itemsPerRow = 3
        itemHeight = 295
        gap = 22
      } else if (width < 1280) {
        // Desktop
        itemsPerRow = 4
        itemHeight = 300
        gap = 24
      } else {
        // Large desktop
        itemsPerRow = 5
        itemHeight = 300
        gap = 24
      }

      setDimensions({ itemsPerRow, itemHeight, gap })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return dimensions
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

// Optimized image component with lazy loading
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  onLoad?: () => void
}

export function LazyImage({ src, alt, className, onLoad }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const isVisible = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px'
  })

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsError(true)
  }, [])

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isVisible && (
        <>
          {!isLoaded && !isError && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse rounded-lg" />
          )}
          {isError && (
            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center rounded-lg">
              <span className="text-slate-400 text-sm">加载失败</span>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
    </div>
  )
}
