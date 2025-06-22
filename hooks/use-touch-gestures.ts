"use client"

import { useRef, useCallback, useEffect } from 'react'

interface TouchPoint {
  x: number
  y: number
  timestamp: number
}

interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down'
  distance: number
  velocity: number
  duration: number
}

interface PinchGesture {
  scale: number
  center: { x: number; y: number }
}

interface TouchGestureOptions {
  onSwipe?: (gesture: SwipeGesture) => void
  onPinch?: (gesture: PinchGesture) => void
  onTap?: (point: TouchPoint) => void
  onDoubleTap?: (event: any) => void
  onLongPress?: (point: TouchPoint) => void
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
  preventDefault?: boolean
}

export function useTouchGestures(options: TouchGestureOptions = {}) {
  const {
    onSwipe,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
    preventDefault = false
  } = options

  const touchStartRef = useRef<TouchPoint | null>(null)
  const lastTapRef = useRef<TouchPoint | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initialDistanceRef = useRef<number>(0)
  const lastScaleRef = useRef<number>(1)

  const getTouchPoint = useCallback((touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now()
  }), [])

  const getDistance = useCallback((touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  const getCenter = useCallback((touch1: Touch, touch2: Touch) => ({
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  }), [])

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }, [])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touches = e.touches

    if (touches.length === 1) {
      // 单指触摸
      const touchPoint = getTouchPoint(touches[0])
      touchStartRef.current = touchPoint

      // 设置长按定时器
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress(touchPoint)
        }, longPressDelay)
      }
    } else if (touches.length === 2) {
      // 双指触摸 - 准备缩放，阻止默认行为
      if (onPinch) {
        e.preventDefault()
      }
      clearLongPressTimer()
      initialDistanceRef.current = getDistance(touches[0], touches[1])
      lastScaleRef.current = 1
    }
  }, [getTouchPoint, getDistance, onLongPress, longPressDelay, onPinch, clearLongPressTimer])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touches = e.touches

    if (touches.length === 1) {
      // 单指移动 - 取消长按
      clearLongPressTimer()
    } else if (touches.length === 2 && onPinch) {
      // 双指移动 - 缩放手势，阻止默认行为
      e.preventDefault()
      const currentDistance = getDistance(touches[0], touches[1])
      const scale = currentDistance / initialDistanceRef.current
      const center = getCenter(touches[0], touches[1])

      if (Math.abs(scale - lastScaleRef.current) > 0.01) {
        onPinch({ scale, center })
        lastScaleRef.current = scale
      }
    }
  }, [getDistance, getCenter, onPinch, clearLongPressTimer])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    clearLongPressTimer()

    const touches = e.changedTouches
    if (touches.length === 1 && touchStartRef.current) {
      const touchEnd = getTouchPoint(touches[0])
      const touchStart = touchStartRef.current

      const dx = touchEnd.x - touchStart.x
      const dy = touchEnd.y - touchStart.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const duration = touchEnd.timestamp - touchStart.timestamp

      if (distance < swipeThreshold && duration < 300) {
        // 点击手势
        const now = Date.now()
        const lastTap = lastTapRef.current

        if (lastTap &&
            now - lastTap.timestamp < doubleTapDelay &&
            Math.abs(touchEnd.x - lastTap.x) < 50 &&
            Math.abs(touchEnd.y - lastTap.y) < 50) {
          // 双击
          if (onDoubleTap) {
            onDoubleTap({ target: e.target, point: touchEnd })
          }
          lastTapRef.current = null
        } else {
          // 单击
          if (onTap) {
            onTap(touchEnd)
          }
          lastTapRef.current = touchEnd
        }
      } else if (distance >= swipeThreshold && onSwipe) {
        // 滑动手势
        const velocity = distance / duration
        let direction: SwipeGesture['direction']

        if (Math.abs(dx) > Math.abs(dy)) {
          direction = dx > 0 ? 'right' : 'left'
        } else {
          direction = dy > 0 ? 'down' : 'up'
        }

        onSwipe({
          direction,
          distance,
          velocity,
          duration
        })
      }
    }

    touchStartRef.current = null
  }, [getTouchPoint, onSwipe, onTap, onDoubleTap, swipeThreshold, doubleTapDelay, clearLongPressTimer])

  const attachListeners = useCallback((element: HTMLElement) => {
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      clearLongPressTimer()
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, clearLongPressTimer])

  return { attachListeners }
}

// 触摸反馈 Hook
export function useTouchFeedback() {
  const addTouchFeedback = useCallback((element: HTMLElement, intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    const handleTouchStart = () => {
      // 添加视觉反馈
      element.style.transform = 'scale(0.98)'
      element.style.transition = 'transform 0.1s ease'
      
      // 触觉反馈（如果支持）
      if ('vibrate' in navigator) {
        const vibrationPattern = {
          light: [10],
          medium: [20],
          heavy: [30]
        }
        navigator.vibrate(vibrationPattern[intensity])
      }
    }

    const handleTouchEnd = () => {
      element.style.transform = 'scale(1)'
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [])

  return { addTouchFeedback }
}

// 滚动优化 Hook
export function useScrollOptimization() {
  const optimizeScrolling = useCallback((element: HTMLElement) => {
    // 启用硬件加速
    element.style.willChange = 'transform'
    element.style.transform = 'translateZ(0)'
    
    // 优化滚动性能
    element.style.webkitOverflowScrolling = 'touch'
    element.style.overscrollBehavior = 'contain'

    return () => {
      element.style.willChange = 'auto'
      element.style.transform = ''
    }
  }, [])

  return { optimizeScrolling }
}
