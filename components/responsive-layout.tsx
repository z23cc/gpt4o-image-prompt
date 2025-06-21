"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Smartphone, Monitor } from 'lucide-react'
import { useEnhancedMobile, useSafeAreaDimensions } from '@/hooks/use-safe-area'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className = '' }: ResponsiveLayoutProps) {
  const [showOrientationHint, setShowOrientationHint] = useState(false)
  const { isMobile, orientation, screenSize } = useEnhancedMobile()
  const { safeHeight, safeWidth, insets, hasNotch } = useSafeAreaDimensions()

  // 检测横屏时是否需要提示
  useEffect(() => {
    if (isMobile && orientation === 'landscape' && window.innerHeight < 500) {
      setShowOrientationHint(true)
      const timer = setTimeout(() => setShowOrientationHint(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isMobile, orientation])

  // 获取响应式容器样式
  const getContainerStyles = useCallback(() => {
    const baseStyles = {
      minHeight: `${safeHeight}px`,
      paddingTop: `${insets.top}px`,
      paddingBottom: `${insets.bottom}px`,
      paddingLeft: `${Math.max(insets.left, 16)}px`,
      paddingRight: `${Math.max(insets.right, 16)}px`
    }

    // 横屏模式优化
    if (isMobile && orientation === 'landscape') {
      return {
        ...baseStyles,
        paddingTop: `${Math.max(insets.top, 8)}px`,
        paddingBottom: `${Math.max(insets.bottom, 8)}px`
      }
    }

    return baseStyles
  }, [safeHeight, insets, isMobile, orientation])

  // 获取网格列数
  const getGridColumns = useCallback(() => {
    if (isMobile) {
      return orientation === 'landscape' ? 2 : 1
    }

    switch (screenSize) {
      case 'xs':
        return 1
      case 'sm':
        return 2
      case 'md':
        return orientation === 'landscape' ? 4 : 3
      case 'lg':
        return 4
      case 'xl':
        return 5
      case '2xl':
        return 6
      default:
        return 4
    }
  }, [isMobile, orientation, screenSize])

  return (
    <div 
      className={`relative w-full transition-all duration-300 ${className}`}
      style={getContainerStyles()}
    >
      {/* 横屏提示 */}
      <AnimatePresence>
        {showOrientationHint && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm"
          >
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span className="text-sm">横屏模式已优化布局</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 响应式内容 */}
      <div 
        className="w-full"
        style={{
          '--grid-columns': getGridColumns(),
          '--safe-area-top': `${insets.top}px`,
          '--safe-area-bottom': `${insets.bottom}px`,
          '--safe-area-left': `${insets.left}px`,
          '--safe-area-right': `${insets.right}px`
        } as React.CSSProperties}
      >
        {children}
      </div>

      {/* 调试信息已关闭 */}
    </div>
  )
}

// 响应式网格容器
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  minItemWidth?: number
  gap?: number
}

export function ResponsiveGrid({ 
  children, 
  className = '', 
  minItemWidth = 280,
  gap = 16 
}: ResponsiveGridProps) {
  const { isMobile, orientation, screenSize } = useEnhancedMobile()
  
  const getGridStyle = useCallback(() => {
    // 移动端特殊处理
    if (isMobile) {
      if (orientation === 'landscape') {
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: `${gap * 0.75}px`
        }
      } else {
        return {
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: `${gap}px`
        }
      }
    }

    // 桌面端自适应网格
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
      gap: `${gap}px`
    }
  }, [isMobile, orientation, minItemWidth, gap])

  return (
    <div 
      className={`w-full ${className}`}
      style={getGridStyle()}
    >
      {children}
    </div>
  )
}

// 响应式文本组件
interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  mobileSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  desktopSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
}

export function ResponsiveText({ 
  children, 
  className = '',
  mobileSize = 'sm',
  desktopSize = 'base'
}: ResponsiveTextProps) {
  const { isMobile } = useEnhancedMobile()
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  }

  const currentSize = isMobile ? mobileSize : desktopSize
  
  return (
    <span className={`${sizeClasses[currentSize]} ${className}`}>
      {children}
    </span>
  )
}

// 响应式间距组件
interface ResponsiveSpacingProps {
  children: React.ReactNode
  mobile?: number
  desktop?: number
  className?: string
}

export function ResponsiveSpacing({ 
  children, 
  mobile = 4, 
  desktop = 6,
  className = ''
}: ResponsiveSpacingProps) {
  const { isMobile } = useEnhancedMobile()
  
  const spacing = isMobile ? mobile : desktop
  
  return (
    <div className={`space-y-${spacing} ${className}`}>
      {children}
    </div>
  )
}

// 设备类型指示器
export function DeviceIndicator() {
  const { isMobile, isTablet, isDesktop, screenSize, orientation } = useEnhancedMobile()
  
  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }
  
  const getDeviceLabel = () => {
    if (isMobile) return '手机'
    if (isTablet) return '平板'
    if (isDesktop) return '桌面'
    return '未知'
  }

  return (
    <div className="fixed top-4 right-4 z-40 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {getDeviceIcon()}
        <span>{getDeviceLabel()}</span>
        <span className="text-xs text-slate-400">
          {screenSize} · {orientation}
        </span>
      </div>
    </div>
  )
}
