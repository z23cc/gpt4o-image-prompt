"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ArrowDown, Check, ArrowUp } from 'lucide-react'
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  className = ''
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    isPulling,
    isRefreshing,
    pullDistance,
    canRefresh,
    attachToElement,
    statusText,
    progress,
    isActive
  } = usePullToRefresh({
    onRefresh,
    disabled
  })

  useEffect(() => {
    if (containerRef.current) {
      return attachToElement(containerRef.current)
    }
  }, [attachToElement])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 下拉刷新指示器 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ 
              opacity: 1, 
              y: Math.max(-60 + pullDistance * 0.5, -60)
            }}
            exit={{ opacity: 0, y: -60 }}
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center"
            style={{
              height: Math.max(60, pullDistance),
              background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))'
            }}
          >
            <div className="flex flex-col items-center gap-2 text-blue-600">
              {/* 图标 */}
              <div className="relative">
                {isRefreshing ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : canRefresh ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="p-1 bg-blue-500 rounded-full text-white"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ 
                      rotate: progress * 180,
                      scale: 0.8 + progress * 0.2
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <ArrowDown className="h-6 w-6" />
                  </motion.div>
                )}
                
                {/* 进度环 */}
                {!isRefreshing && (
                  <svg
                    className="absolute inset-0 w-8 h-8 -m-1"
                    viewBox="0 0 32 32"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.2"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 16 16)"
                      className="transition-all duration-150"
                    />
                  </svg>
                )}
              </div>
              
              {/* 状态文本 */}
              <motion.span
                key={statusText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm font-medium"
              >
                {statusText}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 内容区域 */}
      <div
        style={{
          transform: isActive ? `translateY(${Math.min(pullDistance * 0.3, 30)}px)` : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// 无限滚动加载指示器
interface InfiniteScrollIndicatorProps {
  isLoading: boolean
  hasMore: boolean
  onRetry?: () => void
  error?: string
}

export function InfiniteScrollIndicator({
  isLoading,
  hasMore,
  onRetry,
  error
}: InfiniteScrollIndicatorProps) {
  if (!hasMore && !isLoading && !error) {
    return (
      <div className="text-center py-8 text-slate-500">
        <div className="inline-flex items-center gap-2 text-sm">
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span>已加载全部内容</span>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-sm mb-2">{error}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-blue-500 text-sm hover:text-blue-600 transition-colors"
          >
            点击重试
          </button>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 text-slate-600">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm">加载更多...</span>
        </div>
      </div>
    )
  }

  return null
}

// 滚动到顶部按钮
interface ScrollToTopProps {
  threshold?: number
  className?: string
}

export function ScrollToTop({ threshold = 300, className = '' }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className={`
            fixed bottom-20 right-4 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg
            hover:bg-blue-600 active:scale-95 transition-all duration-200
            safe-bottom
            ${className}
          `}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
