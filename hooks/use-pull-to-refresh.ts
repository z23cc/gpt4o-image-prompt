"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useEnhancedMobile } from './use-safe-area'

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
  maxPullDistance?: number
  refreshingText?: string
  pullText?: string
  releaseText?: string
  disabled?: boolean
}

interface PullToRefreshState {
  isPulling: boolean
  isRefreshing: boolean
  pullDistance: number
  canRefresh: boolean
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  refreshingText = '正在刷新...',
  pullText = '下拉刷新',
  releaseText = '释放刷新',
  disabled = false
}: PullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false
  })

  const { isMobile, isTouchDevice } = useEnhancedMobile()
  const touchStartRef = useRef<{ y: number; time: number } | null>(null)
  const containerRef = useRef<HTMLElement | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || !isTouchDevice || state.isRefreshing) return

    // 只在页面顶部时启用下拉刷新
    if (window.scrollY > 0) return

    touchStartRef.current = {
      y: e.touches[0].clientY,
      time: Date.now()
    }
  }, [disabled, isTouchDevice, state.isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !touchStartRef.current || state.isRefreshing) return

    const currentY = e.touches[0].clientY
    const startY = touchStartRef.current.y
    const pullDistance = Math.max(0, currentY - startY)

    // 只在向下拉动且在页面顶部时处理
    if (pullDistance > 0 && window.scrollY === 0) {
      e.preventDefault()

      const adjustedDistance = Math.min(pullDistance * 0.5, maxPullDistance)
      const canRefresh = adjustedDistance >= threshold

      setState(prev => ({
        ...prev,
        isPulling: true,
        pullDistance: adjustedDistance,
        canRefresh
      }))
    }
  }, [disabled, state.isRefreshing, threshold, maxPullDistance])

  const handleTouchEnd = useCallback(async () => {
    if (disabled || !touchStartRef.current || state.isRefreshing) return

    const { canRefresh } = state

    if (canRefresh) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        isPulling: false
      }))

      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setState(prev => ({
          ...prev,
          isRefreshing: false,
          pullDistance: 0,
          canRefresh: false
        }))
      }
    } else {
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        canRefresh: false
      }))
    }

    touchStartRef.current = null
  }, [disabled, state.isRefreshing, state.canRefresh, onRefresh])

  const attachToElement = useCallback((element: HTMLElement) => {
    if (!isMobile || !isTouchDevice) return

    containerRef.current = element

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, isTouchDevice, handleTouchStart, handleTouchMove, handleTouchEnd])

  const getStatusText = useCallback(() => {
    if (state.isRefreshing) return refreshingText
    if (state.canRefresh) return releaseText
    return pullText
  }, [state.isRefreshing, state.canRefresh, refreshingText, releaseText, pullText])

  const getProgress = useCallback(() => {
    return Math.min(state.pullDistance / threshold, 1)
  }, [state.pullDistance, threshold])

  return {
    ...state,
    attachToElement,
    statusText: getStatusText(),
    progress: getProgress(),
    isActive: state.isPulling || state.isRefreshing
  }
}

// 无限滚动 Hook
interface InfiniteScrollOptions {
  onLoadMore: () => Promise<void>
  hasMore: boolean
  threshold?: number
  disabled?: boolean
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  threshold = 200,
  disabled = false
}: InfiniteScrollOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLElement | null>(null)

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || disabled) return

    setIsLoading(true)
    try {
      await onLoadMore()
    } catch (error) {
      console.error('Load more failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, disabled, onLoadMore])

  const attachSentinel = useCallback((element: HTMLElement) => {
    sentinelRef.current = element

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          handleLoadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    )

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, handleLoadMore])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    isLoading,
    attachSentinel,
    hasMore: hasMore && !disabled
  }
}

// 组合 Hook：同时支持下拉刷新和无限滚动
export function useMobileScrollFeatures({
  onRefresh,
  onLoadMore,
  hasMore,
  refreshDisabled = false,
  loadMoreDisabled = false
}: {
  onRefresh: () => Promise<void>
  onLoadMore: () => Promise<void>
  hasMore: boolean
  refreshDisabled?: boolean
  loadMoreDisabled?: boolean
}) {
  const pullToRefresh = usePullToRefresh({
    onRefresh,
    disabled: refreshDisabled
  })

  const infiniteScroll = useInfiniteScroll({
    onLoadMore,
    hasMore,
    disabled: loadMoreDisabled
  })

  return {
    pullToRefresh,
    infiniteScroll
  }
}
