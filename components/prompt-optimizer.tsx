"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Wand2, 
  Copy, 
  Check, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface PromptOptimizerProps {
  originalPrompt: string
  onApplyOptimized: (optimizedPrompt: string) => void
  className?: string
}

interface OptimizationResult {
  originalPrompt: string
  optimizedPrompt: string
  success: boolean
}

export function PromptOptimizer({ originalPrompt, onApplyOptimized, className = '' }: PromptOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [copiedOriginal, setCopiedOriginal] = useState(false)
  const [copiedOptimized, setCopiedOptimized] = useState(false)

  const handleOptimize = async () => {
    if (!originalPrompt.trim()) {
      toast.error('请先输入提示词')
      return
    }

    setIsOptimizing(true)
    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: originalPrompt
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '优化失败')
      }

      setResult(data)
      toast.success('提示词优化完成！')
    } catch (error) {
      console.error('Optimization error:', error)
      toast.error(error instanceof Error ? error.message : '优化失败，请重试')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleCopy = async (text: string, type: 'original' | 'optimized') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'original') {
        setCopiedOriginal(true)
        setTimeout(() => setCopiedOriginal(false), 2000)
      } else {
        setCopiedOptimized(true)
        setTimeout(() => setCopiedOptimized(false), 2000)
      }
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const handleApply = () => {
    if (result?.optimizedPrompt) {
      onApplyOptimized(result.optimizedPrompt)
      toast.success('已应用优化后的提示词')
    }
  }

  const handleReset = () => {
    setResult(null)
    setCopiedOriginal(false)
    setCopiedOptimized(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 魔法棒按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-slate-700">提示词魔法棒</span>
          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
            AI优化
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {result && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              重新优化
            </Button>
          )}
          
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing || !originalPrompt.trim()}
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {isOptimizing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isOptimizing ? '优化中...' : '优化提示词'}
          </Button>
        </div>
      </div>

      {/* 优化结果对比 - 上下布局 */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* 原始提示词 - 上方 */}
            <Card className="border-slate-200 bg-slate-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                  原始提示词
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={result.originalPrompt}
                  readOnly
                  className="min-h-[100px] resize-none border-slate-200 bg-white text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(result.originalPrompt, 'original')}
                  className="gap-2"
                >
                  {copiedOriginal ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedOriginal ? '已复制' : '复制'}
                </Button>
              </CardContent>
            </Card>

            {/* 优化后提示词 - 下方 */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  优化后提示词
                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-600">
                    AI增强
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={result.optimizedPrompt}
                  readOnly
                  className="min-h-[120px] resize-none border-purple-200 bg-white text-sm shadow-sm"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(result.optimizedPrompt, 'optimized')}
                    className="flex-1 gap-2 hover:bg-purple-50 hover:border-purple-300"
                  >
                    {copiedOptimized ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedOptimized ? '已复制' : '复制'}
                  </Button>
                  <Button
                    onClick={handleApply}
                    size="sm"
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowRight className="h-4 w-4" />
                    应用
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 优化提示 */}
            <div className="text-center bg-yellow-50/50 rounded-xl p-3 border border-yellow-200/50">
              <p className="text-xs text-yellow-700 flex items-center justify-center gap-2">
                <span>💡</span>
                <span>AI已根据专业图像生成经验优化您的提示词，让描述更加精确和生动</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
