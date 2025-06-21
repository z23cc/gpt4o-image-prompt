"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Settings, 
  Zap, 
  Grid, 
  List, 
  Eye,
  EyeOff,
  Info
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PerformanceSettingsProps {
  useOptimizedGrid: boolean
  onUseOptimizedGridChange: (value: boolean) => void
  enableVirtualization: boolean
  onEnableVirtualizationChange: (value: boolean) => void
  usePaginationMode: boolean
  onUsePaginationModeChange: (value: boolean) => void
  totalItems: number
}

export function PerformanceSettings({
  useOptimizedGrid,
  onUseOptimizedGridChange,
  enableVirtualization,
  onEnableVirtualizationChange,
  usePaginationMode,
  onUsePaginationModeChange,
  totalItems
}: PerformanceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getPerformanceMode = () => {
    if (usePaginationMode) return "分页模式"
    if (enableVirtualization) return "虚拟滚动"
    if (useOptimizedGrid) return "优化网格"
    return "标准模式"
  }

  const getPerformanceColor = () => {
    if (usePaginationMode) return "bg-blue-500"
    if (enableVirtualization) return "bg-green-500"
    if (useOptimizedGrid) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const getRecommendation = () => {
    if (totalItems > 200) {
      return {
        mode: "虚拟滚动",
        reason: "大量图片时推荐使用虚拟滚动以获得最佳性能",
        action: () => {
          onEnableVirtualizationChange(true)
          onUsePaginationModeChange(false)
        }
      }
    } else if (totalItems > 100) {
      return {
        mode: "分页模式",
        reason: "中等数量图片时推荐使用分页模式平衡性能和体验",
        action: () => {
          onUsePaginationModeChange(true)
          onEnableVirtualizationChange(false)
        }
      }
    } else {
      return {
        mode: "优化网格",
        reason: "少量图片时使用优化网格即可获得良好性能",
        action: () => {
          onUseOptimizedGridChange(true)
          onEnableVirtualizationChange(false)
          onUsePaginationModeChange(false)
        }
      }
    }
  }

  const recommendation = getRecommendation()

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-slate-200 w-80">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  性能设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 当前模式显示 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">当前模式:</span>
                  <Badge className={`${getPerformanceColor()} text-white`}>
                    {getPerformanceMode()}
                  </Badge>
                </div>

                {/* 优化网格开关 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">优化网格</span>
                    <p className="text-xs text-slate-500">使用懒加载和优化渲染</p>
                  </div>
                  <Switch
                    checked={useOptimizedGrid}
                    onCheckedChange={onUseOptimizedGridChange}
                  />
                </div>

                {/* 虚拟滚动开关 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">虚拟滚动</span>
                    <p className="text-xs text-slate-500">只渲染可见区域的图片</p>
                  </div>
                  <Switch
                    checked={enableVirtualization}
                    onCheckedChange={onEnableVirtualizationChange}
                    disabled={usePaginationMode}
                  />
                </div>

                {/* 分页模式开关 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">分页模式</span>
                    <p className="text-xs text-slate-500">分页显示图片</p>
                  </div>
                  <Switch
                    checked={usePaginationMode}
                    onCheckedChange={onUsePaginationModeChange}
                  />
                </div>

                {/* 性能统计 */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>总图片数:</span>
                      <span className="font-mono">{totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>推荐模式:</span>
                      <span className="font-medium">{recommendation.mode}</span>
                    </div>
                  </div>
                </div>

                {/* 推荐建议 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-xs text-blue-800">
                        {recommendation.reason}
                      </p>
                      <Button
                        size="sm"
                        onClick={recommendation.action}
                        className="h-6 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        应用推荐设置
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 性能提示 */}
                <div className="text-xs text-slate-500 space-y-1">
                  <p>• 虚拟滚动：最佳性能，适合大量图片</p>
                  <p>• 分页模式：平衡性能和用户体验</p>
                  <p>• 优化网格：基础优化，适合少量图片</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 触发按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-sm shadow-lg gap-2"
      >
        <Settings className="h-4 w-4" />
        性能
        <Badge className={`${getPerformanceColor()} text-white ml-1`}>
          {getPerformanceMode()}
        </Badge>
      </Button>
    </div>
  )
}

// 性能模式预设
export const PERFORMANCE_PRESETS = {
  auto: {
    name: "自动模式",
    description: "根据图片数量自动选择最佳性能设置",
    getSettings: (itemCount: number) => ({
      useOptimizedGrid: true,
      enableVirtualization: itemCount > 100,
      usePaginationMode: itemCount > 200
    })
  },
  performance: {
    name: "性能优先",
    description: "最大化性能，适合大量图片",
    getSettings: () => ({
      useOptimizedGrid: true,
      enableVirtualization: true,
      usePaginationMode: false
    })
  },
  balanced: {
    name: "平衡模式",
    description: "平衡性能和用户体验",
    getSettings: () => ({
      useOptimizedGrid: true,
      enableVirtualization: false,
      usePaginationMode: true
    })
  },
  quality: {
    name: "体验优先",
    description: "最佳用户体验，适合少量图片",
    getSettings: () => ({
      useOptimizedGrid: true,
      enableVirtualization: false,
      usePaginationMode: false
    })
  }
}
