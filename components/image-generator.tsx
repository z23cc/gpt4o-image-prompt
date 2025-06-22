"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Sparkles,
  Download,
  Heart,
  Share2,
  RefreshCw,
  Wand2,
  Image as ImageIcon,
  Clock,
  AlertCircle,
  Upload,
  X,
  Copy,
  Settings,
  Palette,
  Grid3X3,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { usePromptFromUrl } from '@/hooks/use-prompt-copy'
import { useApiConfig, getModelOptimizedPrompts, getModelTips } from '@/hooks/use-api-config'
import { useImageUpload, UploadedImageData } from '@/hooks/use-image-upload'

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

interface UploadedImage {
  file: File
  preview: string
  type: 'reference' | 'mask'
  uploadData?: UploadedImageData // OSS上传后的数据
}

interface AdvancedSettings {
  strength: number
  guidance: number
  steps: number
  seed?: number
  batchSize: number
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024')
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard')
  const [style, setStyle] = useState<'vivid' | 'natural'>('vivid')
  const [status, setStatus] = useState<GenerationStatus>({ status: 'idle', progress: 0 })
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 新增状态
  const [generationMode, setGenerationMode] = useState<'text-to-image' | 'image-to-image' | 'inpainting'>('text-to-image')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    strength: 0.8,
    guidance: 7.5,
    steps: 20,
    batchSize: 1
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 从URL获取提示词
  const { getPromptFromUrl, clearPromptFromUrl } = usePromptFromUrl()

  // 获取API配置
  const { config, loading: configLoading } = useApiConfig()

  // 图片上传Hook
  const { uploadImage, isUploading: isUploadingToOSS, uploadProgress, error: uploadError, clearError } = useImageUpload()

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

  // 图片上传处理
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        // 创建本地预览
        const reader = new FileReader()
        reader.onload = async () => {
          const newImage: UploadedImage = {
            file,
            preview: reader.result as string,
            type: generationMode === 'inpainting' ? 'mask' : 'reference'
          }

          // 先添加到本地预览
          setUploadedImages(prev => [...prev, newImage])

          // 异步上传到OSS
          try {
            const uploadData = await uploadImage(file, 'image-generator')
            if (uploadData) {
              // 更新图片数据，添加OSS信息
              setUploadedImages(prev =>
                prev.map(img =>
                  img.file === file
                    ? { ...img, uploadData }
                    : img
                )
              )
            }
          } catch (error) {
            console.error('OSS upload failed:', error)
            // 上传失败时保持本地预览，用户仍可使用base64
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }, [generationMode, uploadImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: generationMode === 'inpainting' ? 2 : 1,
    disabled: isGenerating
  })

  // 移除上传的图片
  const removeImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  // 清除所有上传的图片
  const clearImages = useCallback(() => {
    setUploadedImages([])
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('请输入提示词')
      return
    }

    // 检查是否需要上传图片但没有上传
    if ((generationMode === 'image-to-image' || generationMode === 'inpainting') && uploadedImages.length === 0) {
      toast.error('请先上传参考图片')
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

      // 准备请求数据
      const requestData: any = {
        prompt: prompt.trim(),
        size,
        quality,
        style,
        mode: generationMode,
        ...advancedSettings
      }

      // 如果有上传的图片，优先使用OSS URL，否则使用base64
      if (uploadedImages.length > 0) {
        requestData.images = uploadedImages.map((img) => ({
          data: img.uploadData?.url || img.preview, // 优先使用OSS URL
          type: img.type,
          isUrl: !!img.uploadData?.url // 标识是否为URL
        }))
      }

      // 创建一个带超时的 fetch 请求
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 2分钟超时

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
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
  }, [prompt, size, quality, style, generationMode, uploadedImages, advancedSettings])

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
          {/* 生成模式选择 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              生成模式
            </label>
            <Tabs value={generationMode} onValueChange={(value: any) => setGenerationMode(value)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text-to-image" className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  文本生图
                </TabsTrigger>
                <TabsTrigger value="image-to-image" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  图片重绘
                </TabsTrigger>
                <TabsTrigger value="inpainting" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  局部修复
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 图片上传区域 */}
          {(generationMode === 'image-to-image' || generationMode === 'inpainting') && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">
                  {generationMode === 'image-to-image' ? '参考图片' : '原图片和遮罩'}
                </label>
                {uploadedImages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearImages}
                    className="text-xs text-slate-500 hover:text-slate-700 h-auto p-1"
                    disabled={isGenerating}
                  >
                    清除全部
                  </Button>
                )}
              </div>

              {/* 拖拽上传区域 */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
                  }
                  ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm text-slate-600 mb-1">
                  {isDragActive ? '释放文件到这里' : '拖拽图片到这里，或点击选择'}
                </p>
                <p className="text-xs text-slate-500">
                  支持 PNG, JPG, JPEG, WebP 格式，最大10MB
                  {generationMode === 'inpainting' && ' (最多2张：原图+遮罩)'}
                </p>
                {isUploadingToOSS && uploadProgress && (
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>上传到云存储中...</span>
                      <span>{uploadProgress.percentage}%</span>
                    </div>
                    <Progress value={uploadProgress.percentage} className="h-2" />
                  </div>
                )}
              </div>

              {/* 已上传图片预览 */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border max-w-[120px]">
                        <Image
                          src={image.preview}
                          alt={`上传的图片 ${index + 1}`}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                        disabled={isGenerating}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                      <div className="absolute bottom-1 left-1 flex gap-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1 py-0.5"
                        >
                          {image.type === 'reference' ? '参考图' : '遮罩'}
                        </Badge>
                        {image.uploadData ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0.5 bg-green-50 text-green-700 border-green-200"
                          >
                            已上传
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0.5 bg-yellow-50 text-yellow-700 border-yellow-200"
                          >
                            本地
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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

          {/* 基础参数设置 */}
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

          {/* 高级设置 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">高级设置</label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                  disabled={isGenerating}
                />
                <Settings className="h-4 w-4 text-slate-500" />
              </div>
            </div>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 border rounded-lg p-4 bg-slate-50"
                >
                  {/* 批量生成 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">批量生成</label>
                      <Badge variant="outline" className="text-xs">
                        {advancedSettings.batchSize} 张
                      </Badge>
                    </div>
                    <Slider
                      value={[advancedSettings.batchSize]}
                      onValueChange={(value) => setAdvancedSettings(prev => ({ ...prev, batchSize: value[0] }))}
                      max={4}
                      min={1}
                      step={1}
                      disabled={isGenerating}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1张</span>
                      <span>4张</span>
                    </div>
                  </div>

                  {/* 引导强度 (仅图片重绘模式) */}
                  {generationMode === 'image-to-image' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">引导强度</label>
                        <Badge variant="outline" className="text-xs">
                          {advancedSettings.strength}
                        </Badge>
                      </div>
                      <Slider
                        value={[advancedSettings.strength]}
                        onValueChange={(value) => setAdvancedSettings(prev => ({ ...prev, strength: value[0] }))}
                        max={1}
                        min={0.1}
                        step={0.1}
                        disabled={isGenerating}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>保守 (0.1)</span>
                        <span>激进 (1.0)</span>
                      </div>
                    </div>
                  )}

                  {/* CFG Scale */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">提示词遵循度</label>
                      <Badge variant="outline" className="text-xs">
                        {advancedSettings.guidance}
                      </Badge>
                    </div>
                    <Slider
                      value={[advancedSettings.guidance]}
                      onValueChange={(value) => setAdvancedSettings(prev => ({ ...prev, guidance: value[0] }))}
                      max={20}
                      min={1}
                      step={0.5}
                      disabled={isGenerating}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>自由 (1)</span>
                      <span>严格 (20)</span>
                    </div>
                  </div>

                  {/* 随机种子 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">随机种子 (可选)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="留空为随机"
                        value={advancedSettings.seed || ''}
                        onChange={(e) => setAdvancedSettings(prev => ({
                          ...prev,
                          seed: e.target.value ? parseInt(e.target.value) : undefined
                        }))}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        disabled={isGenerating}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdvancedSettings(prev => ({
                          ...prev,
                          seed: Math.floor(Math.random() * 1000000)
                        }))}
                        disabled={isGenerating}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                      相同种子和参数会生成相似的图片
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 生成按钮 */}
          <motion.div
            whileHover={{ scale: isGenerating ? 1 : 1.02 }}
            whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          >
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || ((generationMode === 'image-to-image' || generationMode === 'inpainting') && uploadedImages.length === 0)}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  {generationMode === 'text-to-image' ? '生成中...' :
                   generationMode === 'image-to-image' ? '重绘中...' : '修复中...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {generationMode === 'text-to-image' ? '开始生成' :
                   generationMode === 'image-to-image' ? '开始重绘' : '开始修复'}
                  {advancedSettings.batchSize > 1 && ` (${advancedSettings.batchSize}张)`}
                </>
              )}
            </Button>
          </motion.div>

          {/* 模式说明 */}
          <div className="text-xs text-slate-500 text-center space-y-1">
            {generationMode === 'text-to-image' && (
              <p>💡 根据文字描述生成全新的图片</p>
            )}
            {generationMode === 'image-to-image' && (
              <p>🎨 基于参考图片重新绘制，保持构图改变风格</p>
            )}
            {generationMode === 'inpainting' && (
              <p>🔧 修复或替换图片的指定区域</p>
            )}
          </div>
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
