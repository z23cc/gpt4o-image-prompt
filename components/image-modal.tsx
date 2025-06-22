"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Share2,
  Info,
  Wand2
} from "lucide-react"
import toast from "react-hot-toast"
import { useTouchGestures, useTouchFeedback } from "@/hooks/use-touch-gestures"
import { useEnhancedMobile, useSafeAreaDimensions } from "@/hooks/use-safe-area"
import { usePromptCopy } from "@/hooks/use-prompt-copy"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  prompt: string
  category?: string
}

export function ImageModal({ isOpen, onClose, imageSrc, prompt, category }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  // 移动端检测和安全区域
  const { isMobile, isTouchDevice, orientation } = useEnhancedMobile()
  const { safeHeight, insets } = useSafeAreaDimensions()

  // 触摸反馈
  const { addTouchFeedback } = useTouchFeedback()

  // 提示词复制功能
  const { copyOnly, copyAndGenerate } = usePromptCopy()

  // 引用
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // 缩放控制 - 移动端优化
  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * (isMobile ? 1.5 : 1.2), isMobile ? 4 : 3))
  }, [isMobile])

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / (isMobile ? 1.5 : 1.2), 0.5))
  }, [isMobile])

  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  // 移动端自动全屏
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsFullscreen(true)
      setShowInfo(false)
    } else if (!isMobile && isOpen) {
      setIsFullscreen(false)
    }
  }, [isMobile, isOpen])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }, [scale, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, dragStart, scale])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -1 : 1
    const zoomFactor = 1.1

    if (delta > 0) {
      setScale(prev => Math.min(prev * zoomFactor, 3))
    } else {
      setScale(prev => Math.max(prev / zoomFactor, 0.5))
    }
  }, [])

  const handleDoubleClick = useCallback(() => {
    resetZoom()
  }, [resetZoom])

  // 触摸手势处理
  const { attachListeners } = useTouchGestures({
    onSwipe: useCallback((gesture) => {
      if (gesture.direction === 'down' && gesture.velocity > 0.5) {
        // 向下滑动关闭
        onClose()
      } else if (gesture.direction === 'left' || gesture.direction === 'right') {
        // 左右滑动可以用于切换图片（如果有多张）
        // 这里暂时不实现，但为将来扩展预留
      }
    }, [onClose]),

    onPinch: useCallback((gesture) => {
      const newScale = Math.max(0.5, Math.min(gesture.scale * scale, isMobile ? 4 : 3))
      setScale(newScale)

      // 根据缩放中心调整位置
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const offsetX = (gesture.center.x - centerX) * (newScale - scale)
        const offsetY = (gesture.center.y - centerY) * (newScale - scale)

        setPosition(prev => ({
          x: prev.x - offsetX,
          y: prev.y - offsetY
        }))
      }
    }, [scale, isMobile]),

    onDoubleTap: useCallback((point) => {
      if (scale > 1) {
        resetZoom()
      } else {
        // 双击放大到点击位置
        const newScale = isMobile ? 2.5 : 2
        setScale(newScale)

        if (imageContainerRef.current) {
          const rect = imageContainerRef.current.getBoundingClientRect()
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const offsetX = (point.x - centerX) * (newScale - 1)
          const offsetY = (point.y - centerY) * (newScale - 1)

          setPosition({
            x: -offsetX,
            y: -offsetY
          })
        }
      }
    }, [scale, resetZoom, isMobile]),

    onLongPress: useCallback(() => {
      if (isMobile) {
        // 长按显示信息面板
        setShowInfo(!showInfo)
      }
    }, [isMobile, showInfo]),

    swipeThreshold: 30,
    longPressDelay: 600,
    preventDefault: true
  })

  // 全屏状态变化时重置缩放
  useEffect(() => {
    resetZoom()
  }, [isFullscreen, resetZoom])

  // 绑定触摸事件
  useEffect(() => {
    if (imageContainerRef.current && isTouchDevice) {
      const cleanup = attachListeners(imageContainerRef.current)
      return cleanup
    }
  }, [attachListeners, isTouchDevice])

  // 为按钮添加触摸反馈
  useEffect(() => {
    const buttons = document.querySelectorAll('.touch-feedback-btn')
    const cleanupFunctions: (() => void)[] = []

    buttons.forEach((button) => {
      if (button instanceof HTMLElement) {
        const cleanup = addTouchFeedback(button, 'light')
        cleanupFunctions.push(cleanup)
      }
    })

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [addTouchFeedback, isOpen])

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case '=':
        case '+':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case '0':
          e.preventDefault()
          resetZoom()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          setIsFullscreen(!isFullscreen)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, isFullscreen, zoomIn, zoomOut, resetZoom])

  const handleCopyPrompt = async () => {
    await copyOnly(prompt)
  }

  const handleCopyAndGenerate = () => {
    copyAndGenerate(prompt, category)
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = imageSrc
    link.download = `ai-image-${Date.now()}.jpg`
    link.click()
    toast.success("图片下载开始！")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          ${isFullscreen || isMobile
            ? 'max-w-[100vw] w-[100vw] h-[100vh] m-0 rounded-none safe-all'
            : 'max-w-6xl w-[95vw] max-h-[90vh]'
          }
          p-0 overflow-hidden bg-slate-900/95 backdrop-blur-xl border-slate-700
          animate-in fade-in-0 zoom-in-95 duration-300 touch-manipulation
        `}
        style={{
          height: isMobile ? `${safeHeight}px` : undefined
        }}
      >
        <div className="flex flex-col h-full">
          {/* 顶部工具栏 - 移动端优化 */}
          <div className={`
            flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border-b border-slate-700
            ${isMobile ? 'p-2 safe-top' : 'p-4'}
          `}>
            <DialogTitle className={`text-white font-medium ${isMobile ? 'text-sm' : ''}`}>
              图片详情
            </DialogTitle>

            <div className="flex items-center gap-1">
              {!isMobile && (
                <>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-200 text-xs">
                    {Math.round(scale * 100)}%
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={zoomOut}
                    className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetZoom}
                    className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={zoomIn}
                    className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>

                  <div className="w-px h-6 bg-slate-600 mx-1" />
                </>
              )}

              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInfo(!showInfo)}
                  className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                >
                  <Info className="h-4 w-4" />
                </Button>
              )}

              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={downloadImage}
                className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* 图片查看区域 - 移动端优化 */}
            <div className="flex-1 relative overflow-hidden bg-slate-900">
              <div
                ref={imageContainerRef}
                className={`
                  w-full h-full flex items-center justify-center select-none touch-none
                  ${scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}
                  ${isMobile ? 'touch-pan-x touch-pan-y' : ''}
                `}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
              >
                <div
                  className="relative transition-transform duration-200"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'center center'
                  }}
                >
                  <Image
                    ref={imageRef}
                    src={imageSrc}
                    alt={prompt}
                    width={800}
                    height={600}
                    className="object-contain"
                    style={{
                      maxWidth: isMobile ? '100vw' : isFullscreen ? '95vw' : '100%',
                      maxHeight: isMobile ? `${safeHeight - 120}px` : isFullscreen ? '85vh' : '100%',
                      width: 'auto',
                      height: 'auto',
                      minWidth: isMobile ? '90vw' : isFullscreen ? '60vw' : 'auto',
                      minHeight: isMobile ? '50vh' : isFullscreen ? '60vh' : 'auto',
                    }}
                    draggable={false}
                    priority
                  />
                </div>
              </div>

              {/* 移动端缩放指示器 */}
              {isMobile && scale !== 1 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="secondary" className="bg-slate-800/80 text-slate-200 text-xs backdrop-blur-sm">
                    {Math.round(scale * 100)}%
                  </Badge>
                </div>
              )}

              {/* 移动端操作提示 */}
              {isMobile && scale === 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-slate-800/80 text-slate-200 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    双击放大 • 长按查看信息 • 下滑关闭
                  </div>
                </div>
              )}
            </div>

            {/* 侧边栏/底部信息面板 - 移动端优化 */}
            {!isFullscreen && !isMobile && (
              <div className="w-80 bg-slate-800/80 backdrop-blur-sm border-l border-slate-700 p-4 overflow-y-auto">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-200 mb-2">AI 提示词</h3>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-lg selectable">
                        {prompt}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyPrompt}
                        variant="outline"
                        className="touch-feedback-btn flex-1 gap-2 border-slate-600 text-slate-200 hover:bg-slate-700 transition-all duration-200"
                      >
                        <Copy className="h-4 w-4" />
                        复制
                      </Button>
                      <Button
                        onClick={handleCopyAndGenerate}
                        className="touch-feedback-btn flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                      >
                        <Wand2 className="h-4 w-4" />
                        生成
                      </Button>
                    </div>

                    <div className="pt-2 border-t border-slate-600">
                      <h4 className="text-xs font-medium text-slate-400 mb-2">操作提示</h4>
                      <ul className="text-xs text-slate-400 space-y-1">
                        <li>• 滚轮缩放图片</li>
                        <li>• 拖拽移动图片</li>
                        <li>• 双击重置缩放</li>
                        <li>• +/- 键缩放，0 键重置</li>
                        <li>• F 键切换全屏</li>
                        <li>• ESC 键关闭</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 移动端信息面板 - 底部滑出 */}
            {isMobile && showInfo && (
              <div className={`
                absolute bottom-0 left-0 right-0 z-20
                bg-slate-800/95 backdrop-blur-xl border-t border-slate-700
                animate-slide-up safe-bottom
                max-h-[60vh] overflow-y-auto
              `}>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-200">AI 提示词</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowInfo(false)}
                      className="touch-feedback-btn text-slate-300 hover:text-white hover:bg-slate-700 h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg selectable">
                    {prompt}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyPrompt}
                      variant="outline"
                      className="touch-feedback-btn flex-1 gap-2 border-slate-600 text-slate-200 hover:bg-slate-700 transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                      复制
                    </Button>

                    <Button
                      onClick={handleCopyAndGenerate}
                      className="touch-feedback-btn flex-1 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                    >
                      <Wand2 className="h-4 w-4" />
                      生成
                    </Button>

                    <Button
                      onClick={downloadImage}
                      variant="outline"
                      className="touch-feedback-btn gap-2 border-slate-600 text-slate-200 hover:bg-slate-700 transition-all duration-200"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-slate-600">
                    <h4 className="text-xs font-medium text-slate-400 mb-2">触摸操作</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• 双指缩放图片</li>
                      <li>• 单指拖拽移动</li>
                      <li>• 双击放大/重置</li>
                      <li>• 长按显示信息</li>
                      <li>• 下滑关闭</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}