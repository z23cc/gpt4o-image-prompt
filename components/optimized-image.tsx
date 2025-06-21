"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useEnhancedMobile, useMobilePerformance } from '@/hooks/use-safe-area'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  sizes?: string
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  sizes,
  quality
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)
  
  const { isMobile, screenSize } = useEnhancedMobile()
  const { performanceMode, maxConcurrentImages } = useMobilePerformance()

  // 根据设备性能调整图片质量
  const getOptimizedQuality = useCallback(() => {
    if (quality) return quality
    
    switch (performanceMode) {
      case 'high':
        return 90
      case 'balanced':
        return isMobile ? 75 : 85
      case 'battery':
        return isMobile ? 60 : 70
      default:
        return 75
    }
  }, [quality, performanceMode, isMobile])

  // 根据屏幕尺寸生成响应式尺寸
  const getResponsiveSizes = useCallback(() => {
    if (sizes) return sizes
    
    switch (screenSize) {
      case 'xs':
        return '(max-width: 480px) 100vw, 480px'
      case 'sm':
        return '(max-width: 640px) 100vw, 640px'
      case 'md':
        return '(max-width: 768px) 50vw, 384px'
      case 'lg':
        return '(max-width: 1024px) 33vw, 341px'
      case 'xl':
        return '(max-width: 1280px) 25vw, 320px'
      default:
        return '(max-width: 1536px) 20vw, 307px'
    }
  }, [sizes, screenSize])

  // 生成默认模糊占位符
  const getBlurDataURL = useCallback(() => {
    if (blurDataURL) return blurDataURL
    
    // 生成简单的渐变占位符
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }, [blurDataURL, width, height])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: isMobile ? '50px' : '100px', // 移动端提前加载距离更小
        threshold: 0.1
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority, isInView, isMobile])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setIsError(true)
    onError?.()
  }, [onError])

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {isInView && !isError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`
            object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          sizes={getResponsiveSizes()}
          quality={getOptimizedQuality()}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? getBlurDataURL() : undefined}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* 加载状态 */}
      {isInView && !isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      {/* 错误状态 */}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-xs">加载失败</span>
        </div>
      )}
      
      {/* 占位符 */}
      {!isInView && !priority && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
      )}
    </div>
  )
}

// 预加载管理器
class ImagePreloader {
  private static instance: ImagePreloader
  private preloadQueue: string[] = []
  private preloadedImages: Set<string> = new Set()
  private maxConcurrent: number = 3
  private currentLoading: number = 0

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader()
    }
    return ImagePreloader.instance
  }

  setMaxConcurrent(max: number) {
    this.maxConcurrent = max
  }

  preload(src: string): Promise<void> {
    if (this.preloadedImages.has(src)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const img = new window.Image()
      
      img.onload = () => {
        this.preloadedImages.add(src)
        this.currentLoading--
        this.processQueue()
        resolve()
      }
      
      img.onerror = () => {
        this.currentLoading--
        this.processQueue()
        reject(new Error(`Failed to preload image: ${src}`))
      }
      
      if (this.currentLoading < this.maxConcurrent) {
        this.currentLoading++
        img.src = src
      } else {
        this.preloadQueue.push(src)
      }
    })
  }

  private processQueue() {
    if (this.preloadQueue.length > 0 && this.currentLoading < this.maxConcurrent) {
      const nextSrc = this.preloadQueue.shift()
      if (nextSrc) {
        this.preload(nextSrc)
      }
    }
  }

  preloadBatch(sources: string[]): Promise<void[]> {
    return Promise.all(sources.map(src => this.preload(src)))
  }

  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src)
  }

  clear() {
    this.preloadQueue = []
    this.preloadedImages.clear()
    this.currentLoading = 0
  }
}

export const imagePreloader = ImagePreloader.getInstance()

// Hook for image preloading
export function useImagePreloader() {
  const { maxConcurrentImages } = useMobilePerformance()

  useEffect(() => {
    imagePreloader.setMaxConcurrent(maxConcurrentImages)
  }, [maxConcurrentImages])

  return {
    preload: imagePreloader.preload.bind(imagePreloader),
    preloadBatch: imagePreloader.preloadBatch.bind(imagePreloader),
    isPreloaded: imagePreloader.isPreloaded.bind(imagePreloader),
    clear: imagePreloader.clear.bind(imagePreloader)
  }
}
