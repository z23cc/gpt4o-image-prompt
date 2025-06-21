"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Clock, Eye, EyeOff } from "lucide-react"

interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  visibleItems: number
  totalItems: number
  fps: number
  loadTime: number
}

interface PerformanceMonitorProps {
  totalItems: number
  visibleItems: number
  isVirtualized: boolean
}

export function PerformanceMonitor({ 
  totalItems, 
  visibleItems, 
  isVirtualized 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    visibleItems,
    totalItems,
    fps: 60,
    loadTime: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const renderStartTime = useRef(0)

  // 测量渲染时间
  useEffect(() => {
    renderStartTime.current = performance.now()
    
    const measureRenderTime = () => {
      const renderTime = performance.now() - renderStartTime.current
      setMetrics(prev => ({ ...prev, renderTime }))
    }

    // 使用 requestAnimationFrame 来测量渲染完成时间
    const rafId = requestAnimationFrame(measureRenderTime)
    return () => cancelAnimationFrame(rafId)
  }, [totalItems, visibleItems])

  // 测量 FPS
  useEffect(() => {
    if (!isEnabled) return

    const measureFPS = () => {
      frameCount.current++
      const now = performance.now()
      
      if (now - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current))
        setMetrics(prev => ({ ...prev, fps }))
        frameCount.current = 0
        lastTime.current = now
      }
      
      if (isEnabled) {
        requestAnimationFrame(measureFPS)
      }
    }

    const rafId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(rafId)
  }, [isEnabled])

  // 测量内存使用情况
  useEffect(() => {
    if (!isEnabled) return

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        setMetrics(prev => ({ ...prev, memoryUsage }))
      }
    }

    measureMemory()
    const interval = setInterval(measureMemory, 2000)
    return () => clearInterval(interval)
  }, [isEnabled])

  // 更新可见项目数量
  useEffect(() => {
    setMetrics(prev => ({ 
      ...prev, 
      visibleItems, 
      totalItems 
    }))
  }, [visibleItems, totalItems])

  // 测量页面加载时间
  useEffect(() => {
    const loadTime = performance.now()
    setMetrics(prev => ({ ...prev, loadTime }))
  }, [])

  const getPerformanceStatus = () => {
    if (metrics.renderTime < 16) return { status: 'excellent', color: 'bg-green-500' }
    if (metrics.renderTime < 33) return { status: 'good', color: 'bg-yellow-500' }
    return { status: 'poor', color: 'bg-red-500' }
  }

  const getFPSStatus = () => {
    if (metrics.fps >= 55) return { status: 'excellent', color: 'bg-green-500' }
    if (metrics.fps >= 30) return { status: 'good', color: 'bg-yellow-500' }
    return { status: 'poor', color: 'bg-red-500' }
  }

  if (!isEnabled) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEnabled(true)}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <Activity className="h-4 w-4 mr-2" />
          性能监控
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-slate-200 w-80">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">性能监控</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
                className="h-6 w-6 p-0"
              >
                {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEnabled(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>

          {isVisible && (
            <div className="space-y-3 text-xs">
              {/* 渲染性能 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">渲染时间:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{metrics.renderTime.toFixed(1)}ms</span>
                  <div className={`w-2 h-2 rounded-full ${getPerformanceStatus().color}`} />
                </div>
              </div>

              {/* FPS */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">帧率:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{metrics.fps} FPS</span>
                  <div className={`w-2 h-2 rounded-full ${getFPSStatus().color}`} />
                </div>
              </div>

              {/* 内存使用 */}
              {metrics.memoryUsage > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">内存使用:</span>
                  <span className="font-mono">{metrics.memoryUsage}MB</span>
                </div>
              )}

              {/* 项目统计 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">显示项目:</span>
                <span className="font-mono">{metrics.visibleItems}/{metrics.totalItems}</span>
              </div>

              {/* 虚拟化状态 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">虚拟化:</span>
                <Badge 
                  variant={isVirtualized ? "default" : "secondary"} 
                  className="text-xs"
                >
                  {isVirtualized ? "启用" : "禁用"}
                </Badge>
              </div>

              {/* 加载时间 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">加载时间:</span>
                <span className="font-mono">{metrics.loadTime.toFixed(0)}ms</span>
              </div>

              {/* 性能建议 */}
              {metrics.totalItems > 100 && !isVirtualized && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">建议启用虚拟化以提升性能</span>
                  </div>
                </div>
              )}

              {metrics.renderTime > 50 && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-800">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span className="text-xs">渲染性能较差，考虑减少显示项目</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    fps: 60
  })

  // 开发环境下自动启用
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsEnabled(true)
    }
  }, [])

  return {
    isEnabled,
    setIsEnabled,
    metrics,
    setMetrics
  }
}
