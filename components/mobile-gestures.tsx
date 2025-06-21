"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from 'lucide-react'
import { useTouchGestures } from '@/hooks/use-touch-gestures'
import { useEnhancedMobile } from '@/hooks/use-safe-area'

interface MobileGesturesProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onDoubleTap?: (event: any) => void
  onLongPress?: () => void
  children: React.ReactNode
  className?: string
  showHints?: boolean
}

export function MobileGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  children,
  className = '',
  showHints = false
}: MobileGesturesProps) {
  const [gestureHint, setGestureHint] = useState<string | null>(null)
  const [showGestureHints, setShowGestureHints] = useState(showHints)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isMobile, isTouchDevice } = useEnhancedMobile()

  const { attachListeners } = useTouchGestures({
    onSwipe: (gesture) => {
      // 显示手势提示
      setGestureHint(gesture.direction)
      setTimeout(() => setGestureHint(null), 500)

      // 执行对应的回调
      switch (gesture.direction) {
        case 'left':
          onSwipeLeft?.()
          break
        case 'right':
          onSwipeRight?.()
          break
        case 'up':
          onSwipeUp?.()
          break
        case 'down':
          onSwipeDown?.()
          break
      }
    },
    onDoubleTap: (event) => {
      setGestureHint('double-tap')
      setTimeout(() => setGestureHint(null), 500)
      onDoubleTap?.(event)
    },
    onLongPress: () => {
      setGestureHint('long-press')
      setTimeout(() => setGestureHint(null), 500)
      onLongPress?.()
    },
    swipeThreshold: 50,
    longPressDelay: 600
  })

  useEffect(() => {
    if (containerRef.current && isTouchDevice) {
      return attachListeners(containerRef.current)
    }
  }, [attachListeners, isTouchDevice])

  // 手势提示图标
  const getGestureIcon = (direction: string) => {
    switch (direction) {
      case 'left':
        return <ArrowLeft className="h-6 w-6" />
      case 'right':
        return <ArrowRight className="h-6 w-6" />
      case 'up':
        return <ArrowUp className="h-6 w-6" />
      case 'down':
        return <ArrowUp className="h-6 w-6 rotate-180" />
      case 'double-tap':
        return <div className="text-lg">👆👆</div>
      case 'long-press':
        return <RotateCcw className="h-6 w-6" />
      default:
        return null
    }
  }

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}

      {/* 手势反馈指示器 */}
      <AnimatePresence>
        {gestureHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-black/70 text-white rounded-full p-4 backdrop-blur-sm">
              {getGestureIcon(gestureHint)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 手势提示 */}
      {showGestureHints && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <div className="bg-black/70 text-white text-xs rounded-lg p-3 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-2">
              {onSwipeLeft && (
                <div className="flex items-center gap-2">
                  <ArrowLeft className="h-3 w-3" />
                  <span>左滑</span>
                </div>
              )}
              {onSwipeRight && (
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span>右滑</span>
                </div>
              )}
              {onSwipeUp && (
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-3 w-3" />
                  <span>上滑</span>
                </div>
              )}
              {onDoubleTap && (
                <div className="flex items-center gap-2">
                  <span>👆👆</span>
                  <span>双击</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 移动端快捷操作面板
interface MobileActionPanelProps {
  actions: Array<{
    icon: React.ReactNode
    label: string
    onClick: () => void
    color?: string
  }>
  isVisible: boolean
  onClose: () => void
}

export function MobileActionPanel({
  actions,
  isVisible,
  onClose
}: MobileActionPanelProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* 操作面板 */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-4 safe-bottom"
          >
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
            
            <div className="grid grid-cols-4 gap-4">
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    action.onClick()
                    onClose()
                  }}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200
                    ${action.color || 'bg-slate-100 hover:bg-slate-200'}
                    active:scale-95
                  `}
                >
                  <div className="text-slate-700">
                    {action.icon}
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// 移动端浮动操作按钮
interface FloatingActionButtonProps {
  icon: React.ReactNode
  onClick: () => void
  className?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function FloatingActionButton({
  icon,
  onClick,
  className = '',
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4 safe-bottom',
    'bottom-left': 'bottom-4 left-4 safe-bottom',
    'top-right': 'top-4 right-4 safe-top',
    'top-left': 'top-4 left-4 safe-top'
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        fixed z-40 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg
        flex items-center justify-center
        hover:bg-blue-600 active:bg-blue-700
        transition-colors duration-200
        ${positionClasses[position]}
        ${className}
      `}
    >
      {icon}
    </motion.button>
  )
}
