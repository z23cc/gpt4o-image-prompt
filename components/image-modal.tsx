"use client"

import { useState, useCallback, useEffect } from "react"
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
  Minimize2
} from "lucide-react"
import toast from "react-hot-toast"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  prompt: string
}

export function ImageModal({ isOpen, onClose, imageSrc, prompt }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const zoomIn = () => setScale(prev => Math.min(prev * 1.2, 3))
  const zoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5))
  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

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
  }, [])

  // 全屏状态变化时重置缩放
  useEffect(() => {
    resetZoom()
  }, [isFullscreen])

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
  }, [isOpen, onClose, isFullscreen])

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      toast.success("提示词已复制！", {
        icon: "✨",
        style: {
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        },
      })
    })
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
          ${isFullscreen ? 'max-w-[100vw] w-[100vw] h-[100vh] m-0 rounded-none' : 'max-w-6xl w-[95vw] max-h-[90vh]'}
          p-0 overflow-hidden bg-slate-900/95 backdrop-blur-xl border-slate-700 animate-in fade-in-0 zoom-in-95 duration-300
        `}
      >
        <div className="flex flex-col h-full">
          {/* 顶部工具栏 */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
            <DialogTitle className="text-white font-medium">图片详情</DialogTitle>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                {Math.round(scale * 100)}%
              </Badge>

              <Button variant="ghost" size="icon" onClick={zoomOut} className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200">
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={resetZoom} className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200">
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={zoomIn} className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200">
                <ZoomIn className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-slate-600 mx-1" />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="icon" onClick={downloadImage} className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200">
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* 图片查看区域 */}
            <div className="flex-1 relative overflow-hidden bg-slate-900">
              <div
                className={`w-full h-full flex items-center justify-center select-none ${
                  scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                }`}
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
                    src={imageSrc}
                    alt={prompt}
                    width={800}
                    height={600}
                    className="object-contain"
                    style={{
                      maxWidth: isFullscreen ? '95vw' : '100%',
                      maxHeight: isFullscreen ? '85vh' : '100%',
                      width: 'auto',
                      height: 'auto',
                      minWidth: isFullscreen ? '60vw' : 'auto',
                      minHeight: isFullscreen ? '60vh' : 'auto',
                    }}
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* 侧边栏 - 提示词信息 */}
            {!isFullscreen && (
              <div className="w-80 bg-slate-800/80 backdrop-blur-sm border-l border-slate-700 p-4 overflow-y-auto">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-200 mb-2">AI 提示词</h3>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-lg">
                        {prompt}
                      </p>
                    </div>

                    <Button
                      onClick={copyPrompt}
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                      复制提示词
                    </Button>

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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}