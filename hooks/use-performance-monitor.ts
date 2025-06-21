"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useEnhancedMobile } from './use-safe-area'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  loadTime: number
  scrollPerformance: number
  renderTime: number
  isLowPerformance: boolean
}

interface PerformanceThresholds {
  minFPS: number
  maxMemoryMB: number
  maxLoadTimeMS: number
  maxRenderTimeMS: number
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0,
    scrollPerformance: 100,
    renderTime: 0,
    isLowPerformance: false
  })

  const { isMobile } = useEnhancedMobile()
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const renderStartRef = useRef(0)

  // 移动端性能阈值
  const thresholds: PerformanceThresholds = {
    minFPS: isMobile ? 30 : 45,
    maxMemoryMB: isMobile ? 100 : 200,
    maxLoadTimeMS: isMobile ? 3000 : 2000,
    maxRenderTimeMS: isMobile ? 50 : 30
  }

  // FPS 监控
  const measureFPS = useCallback(() => {
    const now = performance.now()
    frameCountRef.current++

    if (now - lastTimeRef.current >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current))
      
      setMetrics(prev => ({
        ...prev,
        fps,
        isLowPerformance: fps < thresholds.minFPS
      }))

      frameCountRef.current = 0
      lastTimeRef.current = now
    }

    requestAnimationFrame(measureFPS)
  }, [thresholds.minFPS])

  // 内存使用监控
  const measureMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      
      setMetrics(prev => ({
        ...prev,
        memoryUsage: usedMB,
        isLowPerformance: prev.isLowPerformance || usedMB > thresholds.maxMemoryMB
      }))
    }
  }, [thresholds.maxMemoryMB])

  // 页面加载时间监控
  const measureLoadTime = useCallback(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.navigationStart
        
        setMetrics(prev => ({
          ...prev,
          loadTime,
          isLowPerformance: prev.isLowPerformance || loadTime > thresholds.maxLoadTimeMS
        }))
      }
    }
  }, [thresholds.maxLoadTimeMS])

  // 渲染时间监控
  const measureRenderTime = useCallback(() => {
    renderStartRef.current = performance.now()
    
    return () => {
      const renderTime = performance.now() - renderStartRef.current
      
      setMetrics(prev => ({
        ...prev,
        renderTime,
        isLowPerformance: prev.isLowPerformance || renderTime > thresholds.maxRenderTimeMS
      }))
    }
  }, [thresholds.maxRenderTimeMS])

  // 滚动性能监控
  const measureScrollPerformance = useCallback(() => {
    let scrollStartTime = 0
    let frameDrops = 0
    let totalFrames = 0

    const handleScrollStart = () => {
      scrollStartTime = performance.now()
      frameDrops = 0
      totalFrames = 0
    }

    const handleScrollFrame = () => {
      if (scrollStartTime > 0) {
        totalFrames++
        const frameTime = performance.now() - scrollStartTime
        
        // 检测掉帧（超过16.67ms表示低于60fps）
        if (frameTime > 16.67) {
          frameDrops++
        }
        
        scrollStartTime = performance.now()
      }
    }

    const handleScrollEnd = () => {
      if (totalFrames > 0) {
        const scrollPerformance = Math.max(0, 100 - (frameDrops / totalFrames) * 100)
        
        setMetrics(prev => ({
          ...prev,
          scrollPerformance,
          isLowPerformance: prev.isLowPerformance || scrollPerformance < 70
        }))
      }
      
      scrollStartTime = 0
    }

    let scrollTimer: NodeJS.Timeout
    const handleScroll = () => {
      if (scrollStartTime === 0) {
        handleScrollStart()
      }
      
      handleScrollFrame()
      
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(handleScrollEnd, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer)
    }
  }, [])

  // 启动监控
  useEffect(() => {
    const fpsAnimation = requestAnimationFrame(measureFPS)
    const memoryInterval = setInterval(measureMemory, 5000)
    const scrollCleanup = measureScrollPerformance()
    
    // 页面加载完成后测量加载时间
    if (document.readyState === 'complete') {
      measureLoadTime()
    } else {
      window.addEventListener('load', measureLoadTime)
    }

    return () => {
      cancelAnimationFrame(fpsAnimation)
      clearInterval(memoryInterval)
      scrollCleanup()
      window.removeEventListener('load', measureLoadTime)
    }
  }, [measureFPS, measureMemory, measureLoadTime, measureScrollPerformance])

  return {
    metrics,
    measureRenderTime,
    thresholds
  }
}

// 性能优化建议 Hook
export function usePerformanceOptimization() {
  const { metrics } = usePerformanceMonitor()
  const { isMobile } = useEnhancedMobile()

  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = []

    if (metrics.fps < 30) {
      suggestions.push('降低图片质量以提升帧率')
      suggestions.push('减少同时显示的图片数量')
      suggestions.push('启用虚拟滚动')
    }

    if (metrics.memoryUsage > (isMobile ? 80 : 150)) {
      suggestions.push('清理未使用的图片缓存')
      suggestions.push('减少预加载的图片数量')
    }

    if (metrics.loadTime > (isMobile ? 2500 : 1500)) {
      suggestions.push('启用图片懒加载')
      suggestions.push('压缩图片大小')
      suggestions.push('使用 WebP 格式')
    }

    if (metrics.scrollPerformance < 70) {
      suggestions.push('启用硬件加速')
      suggestions.push('减少滚动时的动画效果')
      suggestions.push('优化滚动容器')
    }

    if (metrics.renderTime > (isMobile ? 40 : 25)) {
      suggestions.push('减少 DOM 操作')
      suggestions.push('使用 CSS 变换替代布局变化')
      suggestions.push('启用 will-change 属性')
    }

    return suggestions
  }, [metrics, isMobile])

  const getPerformanceLevel = useCallback(() => {
    const { fps, memoryUsage, loadTime, scrollPerformance, renderTime } = metrics
    
    let score = 100
    
    // FPS 评分
    if (fps < 20) score -= 30
    else if (fps < 40) score -= 20
    else if (fps < 50) score -= 10
    
    // 内存评分
    const memoryThreshold = isMobile ? 100 : 200
    if (memoryUsage > memoryThreshold * 1.5) score -= 25
    else if (memoryUsage > memoryThreshold) score -= 15
    
    // 加载时间评分
    const loadThreshold = isMobile ? 3000 : 2000
    if (loadTime > loadThreshold * 2) score -= 20
    else if (loadTime > loadThreshold) score -= 10
    
    // 滚动性能评分
    if (scrollPerformance < 50) score -= 15
    else if (scrollPerformance < 70) score -= 10
    
    // 渲染时间评分
    const renderThreshold = isMobile ? 50 : 30
    if (renderTime > renderThreshold * 2) score -= 10
    else if (renderTime > renderThreshold) score -= 5
    
    if (score >= 80) return 'excellent'
    if (score >= 60) return 'good'
    if (score >= 40) return 'fair'
    return 'poor'
  }, [metrics, isMobile])

  return {
    suggestions: getOptimizationSuggestions(),
    performanceLevel: getPerformanceLevel(),
    shouldOptimize: metrics.isLowPerformance
  }
}
