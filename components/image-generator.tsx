"use client"

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  Download, 
  Heart, 
  Share2, 
  RefreshCw, 
  Wand2,
  Image as ImageIcon,
  Clock,
  AlertCircle
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { usePromptFromUrl } from '@/hooks/use-prompt-copy'
import { useApiConfig, getModelOptimizedPrompts, getModelTips } from '@/hooks/use-api-config'

interface GenerationResult {
  generationId: string
  imageUrl: string
  prompt: string
  parameters: {
    size: string
    quality: string
    style: string
  }
}

interface GenerationStatus {
  status: 'idle' | 'processing' | 'completed' | 'failed'
  progress: number
  estimatedTime?: number
  error?: string
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024')
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard')
  const [style, setStyle] = useState<'vivid' | 'natural'>('vivid')
  const [status, setStatus] = useState<GenerationStatus>({ status: 'idle', progress: 0 })
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 从URL获取提示词
  const { getPromptFromUrl, clearPromptFromUrl } = usePromptFromUrl()

  // 获取API配置
  const { config, loading: configLoading } = useApiConfig()

  // 检查URL参数中的提示词
  useEffect(() => {
    const urlData = getPromptFromUrl()
    if (urlData?.prompt) {
      setPrompt(urlData.prompt)
      // 清除URL参数，避免刷新页面时重复设置
      clearPromptFromUrl()

      // 显示提示
      toast.success(`已从图库复制提示词！${urlData.category ? `分类：${urlData.category}` : ''}`, {
        icon: '🎨',
        duration: 3000
      })
    }
  }, [])

  // 根据当前模型获取优化的提示词建议
  const promptSuggestions = config ? getModelOptimizedPrompts(config.model) : []
  const modelTips = config ? getModelTips(config.model) : []

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('请输入提示词')
      return
    }

    setIsGenerating(true)
    setStatus({ status: 'processing', progress: 0 })
    setResult(null)

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 90)
        }))
      }, 1000)

      // 创建一个带超时的 fetch 请求
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2分钟超时

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size,
          quality,
          style
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      clearInterval(progressInterval)

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        const errorMessage = data.error || '生成失败'
        const errorDetails = data.details ? ` (${data.details})` : ''
        throw new Error(errorMessage + errorDetails)
      }

      setStatus({ status: 'completed', progress: 100 })
      setResult(data.data)

      toast.success(`图片生成成功！剩余 ${data.data.remainingGenerations} 次生成机会`, {
        icon: '🎉',
        duration: 4000
      })

    } catch (error) {
      console.error('Generation error:', error)

      let errorMessage = '生成失败'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时，请稍后重试'
        } else if (error.message.includes('fetch')) {
          errorMessage = '网络连接错误，请检查网络'
        } else {
          errorMessage = error.message
        }
      }

      setStatus({
        status: 'failed',
        progress: 0,
        error: errorMessage
      })

      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [prompt, size, quality, style])

  const handleDownload = useCallback(async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-generated-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('图片下载成功！')
    } catch (error) {
      toast.error('下载失败，请重试')
    }
  }, [])

  const handleAddToGallery = useCallback(async () => {
    if (!result) return
    
    try {
      // 这里调用添加到图库的API
      toast.success('已添加到图片库！')
    } catch (error) {
      toast.error('添加失败，请重试')
    }
  }, [result])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 生成控制面板 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800">
                AI 图片生成
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                输入提示词，让AI为你创作独特的图片
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 提示词输入 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">
                提示词描述
              </label>
              {prompt && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrompt('')}
                  className="text-xs text-slate-500 hover:text-slate-700 h-auto p-1"
                  disabled={isGenerating}
                >
                  清除
                </Button>
              )}
            </div>
            <div className="relative">
              <Textarea
                placeholder="详细描述你想要生成的图片，包括风格、颜色、构图等..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 pr-12"
                disabled={isGenerating}
              />
              {prompt && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                    已填充
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>详细的描述有助于生成更好的图片</span>
              <span>{prompt.length}/4000</span>
            </div>
          </div>

          {/* 快速提示词建议 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              快速开始
            </label>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3 hover:bg-purple-50 hover:border-purple-200"
                  onClick={() => setPrompt(suggestion)}
                  disabled={isGenerating}
                >
                  {suggestion.slice(0, 20)}...
                </Button>
              ))}
            </div>
          </div>

          {/* 参数设置 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">图片尺寸</label>
              <Select value={size} onValueChange={(value: any) => setSize(value)} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">正方形 (1:1)</SelectItem>
                  <SelectItem value="1792x1024">横版 (16:9)</SelectItem>
                  <SelectItem value="1024x1792">竖版 (9:16)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">图片质量</label>
              <Select value={quality} onValueChange={(value: any) => setQuality(value)} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">标准质量</SelectItem>
                  <SelectItem value="hd">高清质量 (+1积分)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">图片风格</label>
              <Select value={style} onValueChange={(value: any) => setStyle(value)} disabled={isGenerating}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vivid">鲜艳风格</SelectItem>
                  <SelectItem value="natural">自然风格</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 生成按钮 */}
          <motion.div
            whileHover={{ scale: isGenerating ? 1 : 1.02 }}
            whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  开始生成
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      {/* 生成状态显示 */}
      <AnimatePresence>
        {status.status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                {status.status === 'processing' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
                      <span className="font-medium text-slate-800">正在生成图片...</span>
                    </div>
                    <Progress value={status.progress} className="h-2" />
                    <p className="text-sm text-slate-500">
                      预计还需要 {Math.max(0, Math.ceil((100 - status.progress) / 10))} 秒
                    </p>
                  </div>
                )}

                {status.status === 'failed' && (
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>生成失败：{status.error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 生成结果显示 */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  生成结果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={result.imageUrl}
                    alt={result.prompt}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    <strong>提示词：</strong>{result.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{result.parameters.size}</Badge>
                    <Badge variant="outline">{result.parameters.quality}</Badge>
                    <Badge variant="outline">{result.parameters.style}</Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleDownload(result.imageUrl)}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    下载
                  </Button>
                  <Button
                    onClick={handleAddToGallery}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    收藏
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    分享
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
