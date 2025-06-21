"use client"

import { useState, useEffect } from 'react'

interface SafeAreaInsets {
  top: number
  right: number
  bottom: number
  left: number
}

interface SafeAreaDimensions {
  safeHeight: number
  safeWidth: number
  insets: SafeAreaInsets
  isIOS: boolean
  hasNotch: boolean
}

export function useSafeAreaDimensions(): SafeAreaDimensions {
  const [dimensions, setDimensions] = useState<SafeAreaDimensions>({
    safeHeight: 0,
    safeWidth: 0,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
    isIOS: false,
    hasNotch: false
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === 'undefined') return

      // 检测是否为 iOS 设备
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      
      // 获取安全区域信息
      const computedStyle = getComputedStyle(document.documentElement)
      const safeAreaTop = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0')
      const safeAreaRight = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0')
      const safeAreaBottom = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0')
      const safeAreaLeft = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')

      // 检测是否有刘海屏
      const hasNotch = safeAreaTop > 20 || safeAreaBottom > 0

      // 计算安全区域尺寸
      const safeHeight = window.innerHeight - safeAreaTop - safeAreaBottom
      const safeWidth = window.innerWidth - safeAreaLeft - safeAreaRight

      setDimensions({
        safeHeight: Math.max(safeHeight, 400), // 最小高度保护
        safeWidth: Math.max(safeWidth, 320),   // 最小宽度保护
        insets: {
          top: safeAreaTop,
          right: safeAreaRight,
          bottom: safeAreaBottom,
          left: safeAreaLeft
        },
        isIOS,
        hasNotch
      })
    }

    updateDimensions()
    
    // 监听屏幕方向变化和窗口大小变化
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', () => {
      // iOS 需要延迟更新以获取正确的尺寸
      setTimeout(updateDimensions, 100)
    })

    return () => {
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('orientationchange', updateDimensions)
    }
  }, [])

  return dimensions
}

// 移动端检测增强版
export function useEnhancedMobile() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: false,
    orientation: 'portrait' as 'portrait' | 'landscape',
    screenSize: 'sm' as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      if (typeof window === 'undefined') return

      const width = window.innerWidth
      const height = window.innerHeight
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // 屏幕尺寸分类
      let screenSize: typeof deviceInfo.screenSize = 'sm'
      if (width < 480) screenSize = 'xs'
      else if (width < 640) screenSize = 'sm'
      else if (width < 768) screenSize = 'md'
      else if (width < 1024) screenSize = 'lg'
      else if (width < 1280) screenSize = 'xl'
      else screenSize = '2xl'

      // 设备类型判断
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024 && isTouchDevice
      const isDesktop = width >= 1024 && !isTouchDevice

      // 屏幕方向
      const orientation = width > height ? 'landscape' : 'portrait'

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        orientation,
        screenSize
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', () => {
      setTimeout(updateDeviceInfo, 100)
    })

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// 移动端性能优化 Hook
export function useMobilePerformance() {
  const [performanceMode, setPerformanceMode] = useState<'high' | 'balanced' | 'battery'>('balanced')
  const { isMobile } = useEnhancedMobile()

  useEffect(() => {
    if (!isMobile) {
      setPerformanceMode('high')
      return
    }

    // 检测设备性能
    const checkPerformance = () => {
      // 基于硬件并发数判断性能
      const cores = navigator.hardwareConcurrency || 2
      
      // 基于内存判断性能（如果可用）
      const memory = (navigator as any).deviceMemory || 4

      if (cores >= 8 && memory >= 8) {
        setPerformanceMode('high')
      } else if (cores >= 4 && memory >= 4) {
        setPerformanceMode('balanced')
      } else {
        setPerformanceMode('battery')
      }
    }

    checkPerformance()
  }, [isMobile])

  return {
    performanceMode,
    setPerformanceMode,
    shouldUseVirtualization: performanceMode !== 'battery',
    shouldPreloadImages: performanceMode === 'high',
    maxConcurrentImages: performanceMode === 'high' ? 10 : performanceMode === 'balanced' ? 6 : 3
  }
}
