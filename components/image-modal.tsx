"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X, ZoomIn, ZoomOut, RotateCcw, Copy } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ImageWithPrompt } from "@/types/types"
import { toast } from "react-hot-toast"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  prompt: string
}

export function ImageModal({ isOpen, onClose, imageSrc, prompt }: ImageModalProps) {
  if (!isOpen) return null

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const maxScale = 3
  const minScale = 0.5

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, maxScale))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, minScale))
  }

  const resetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("提示词已复制到剪贴板！")
      })
      .catch(() => {
        toast.error("复制失败，请重试")
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <div className="flex justify-between items-center">
          <DialogTitle>图片详情</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={resetZoom}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div 
          className="relative aspect-[4/3] w-full overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s'
            }}
          >
            <Image
              src={imageSrc}
              alt={prompt}
              fill
              className="object-contain transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
              draggable={false}
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-600">{prompt}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => copyPrompt(prompt)}
          >
            <Copy className="h-4 w-4 mr-2" />
            复制提示词
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
