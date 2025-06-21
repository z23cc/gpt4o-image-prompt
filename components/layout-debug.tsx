"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export function LayoutDebug() {
  const [isVisible, setIsVisible] = useState(false)
  const [dimensions, setDimensions] = useState({
    viewport: { width: 0, height: 0 },
    document: { width: 0, height: 0 },
    scroll: { top: 0, left: 0 }
  })

  useEffect(() => {
    if (!isVisible) return

    const updateDimensions = () => {
      setDimensions({
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight
        },
        scroll: {
          top: window.scrollY,
          left: window.scrollX
        }
      })
    }

    updateDimensions()
    window.addEventListener('scroll', updateDimensions)
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('scroll', updateDimensions)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [isVisible])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Debug
        </Button>
      </div>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed top-32 right-4 z-50 w-64">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardContent className="p-4 text-xs space-y-2">
              <div>
                <strong>Viewport:</strong>
                <div>W: {dimensions.viewport.width}px</div>
                <div>H: {dimensions.viewport.height}px</div>
              </div>
              
              <div>
                <strong>Document:</strong>
                <div>W: {dimensions.document.width}px</div>
                <div>H: {dimensions.document.height}px</div>
              </div>
              
              <div>
                <strong>Scroll:</strong>
                <div>Top: {dimensions.scroll.top}px</div>
                <div>Left: {dimensions.scroll.left}px</div>
              </div>
              
              <div>
                <strong>Scrollable:</strong>
                <div>{dimensions.document.height > dimensions.viewport.height ? 'Yes' : 'No'}</div>
              </div>
              
              <div>
                <strong>Bottom Space:</strong>
                <div>{dimensions.document.height - dimensions.viewport.height - dimensions.scroll.top}px</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Visual Grid Overlay */}
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Viewport boundaries */}
          <div className="absolute inset-0 border-2 border-red-500/50" />
          
          {/* Safe area boundaries */}
          <div 
            className="absolute border-2 border-green-500/50"
            style={{
              top: '80px',
              left: '24px',
              right: '24px',
              bottom: '120px'
            }}
          />
          
          {/* Grid lines */}
          <div className="absolute inset-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full border-t border-blue-500/20"
                style={{ top: `${(i + 1) * 10}%` }}
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full border-l border-blue-500/20"
                style={{ left: `${(i + 1) * 10}%` }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
