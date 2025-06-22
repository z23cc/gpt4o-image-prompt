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
  Zap,
  MessageSquare,
  CheckCircle,
  Lightbulb,
  Sliders,
  Camera,
  Layers
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { usePromptFromUrl } from '@/hooks/use-prompt-copy'
import { useApiConfig, getModelOptimizedPrompts, getModelTips } from '@/hooks/use-api-config'
import { useImageUpload, UploadedImageData } from '@/hooks/use-image-upload'
import { PromptOptimizer } from '@/components/prompt-optimizer'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                AI 创意工坊
              </h1>
              <p className="text-slate-600 mt-1">释放想象力，让AI为您创作独特的视觉艺术</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧控制面板 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 生成模式选择 - 全新设计 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                      <Palette className="h-5 w-5 text-purple-600" />
                    </div>
                    选择创作模式
                  </CardTitle>
                  <p className="text-sm text-slate-600">每种模式都有独特的创作方式，选择最适合您需求的</p>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'text-to-image',
                        name: '文本生图',
                        description: '从文字描述创造全新图像',
                        icon: '✨',
                        gradient: 'from-blue-500 to-purple-500',
                        bgGradient: 'from-blue-50 to-purple-50'
                      },
                      {
                        id: 'image-to-image',
                        name: '图片重绘',
                        description: '基于参考图重新创作',
                        icon: '🎨',
                        gradient: 'from-purple-500 to-pink-500',
                        bgGradient: 'from-purple-50 to-pink-50'
                      },
                      {
                        id: 'inpainting',
                        name: '局部修复',
                        description: '精确修复图片区域',
                        icon: '🔧',
                        gradient: 'from-pink-500 to-orange-500',
                        bgGradient: 'from-pink-50 to-orange-50'
                      }
                    ].map((mode, index) => (
                      <motion.div
                        key={mode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-300 group relative overflow-hidden border-2 ${
                            generationMode === mode.id
                              ? `ring-2 ring-purple-400 bg-gradient-to-br ${mode.bgGradient} border-purple-300 shadow-lg`
                              : 'hover:shadow-lg border-slate-200 hover:border-purple-200 bg-white'
                          }`}
                          onClick={() => setGenerationMode(mode.id)}
                        >
                          {generationMode === mode.id && (
                            <div className="absolute top-3 right-3">
                              <div className={`w-3 h-3 bg-gradient-to-r ${mode.gradient} rounded-full animate-pulse shadow-lg`}></div>
                            </div>
                          )}
                          <CardContent className="p-6 text-center relative">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                              {mode.icon}
                            </div>
                            <h3 className="font-bold text-slate-800 mb-2 text-lg">{mode.name}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{mode.description}</p>
                            {generationMode === mode.id && (
                              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${mode.gradient}`}></div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 图片上传区域 */}
            {(generationMode === 'image-to-image' || generationMode === 'inpainting') && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                        <Upload className="h-5 w-5 text-orange-600" />
                      </div>
                      {generationMode === 'image-to-image' ? '参考图片' : '原图片和遮罩'}
                    </CardTitle>
                    <p className="text-sm text-slate-600">上传图片作为{generationMode === 'image-to-image' ? '重绘参考' : '修复素材'}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 拖拽上传区域 */}
                    <div
                      {...getRootProps()}
                      className={`
                        border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
                        ${isDragActive
                          ? 'border-orange-400 bg-orange-50 scale-105'
                          : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50/30'
                        }
                        ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-2xl">
                          <Upload className="h-8 w-8 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">
                            {isDragActive ? '释放文件到这里' : '拖拽图片到这里，或点击选择'}
                          </p>
                          <p className="text-xs text-slate-500">
                            支持 PNG, JPG, JPEG, WebP 格式，最大10MB
                            {generationMode === 'inpainting' && ' (最多2张：原图+遮罩)'}
                          </p>
                        </div>
                      </div>
                      {isUploadingToOSS && uploadProgress && (
                        <div className="mt-4 space-y-2">
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
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700">已上传图片</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearImages}
                            className="text-xs text-slate-500 hover:text-red-600 transition-colors"
                            disabled={isGenerating}
                          >
                            <X className="h-4 w-4 mr-1" />
                            清除全部
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                                <Image
                                  src={image.preview}
                                  alt={`上传的图片 ${index + 1}`}
                                  width={120}
                                  height={120}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                onClick={() => removeImage(index)}
                                disabled={isGenerating}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-2 left-2 flex gap-1">
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-2 py-1 bg-white/90 backdrop-blur-sm"
                                >
                                  {image.type === 'reference' ? '参考图' : '遮罩'}
                                </Badge>
                                {image.uploadData ? (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-2 py-1 bg-green-100 text-green-700 border-green-300"
                                  >
                                    已上传
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-2 py-1 bg-yellow-100 text-yellow-700 border-yellow-300"
                                  >
                                    本地
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 提示词输入区域 - 重新设计 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                      创意描述
                    </CardTitle>
                    {prompt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPrompt('')}
                        className="text-xs text-slate-500 hover:text-red-600 transition-colors"
                        disabled={isGenerating}
                      >
                        <X className="h-4 w-4 mr-1" />
                        清除
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">详细描述您的创意想法，AI会根据描述为您创作</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      placeholder="例如：一只可爱的橘猫坐在窗台上，阳光透过窗户洒在它身上，温暖的午后光线，油画风格，柔和的色调..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[140px] resize-none border-2 border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-2xl p-4 text-sm leading-relaxed pr-16 bg-slate-50/50"
                      disabled={isGenerating}
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {prompt && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-300 shadow-sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          已填充
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          prompt.length > 3500 ? 'bg-red-50 text-red-600 border-red-200' :
                          prompt.length > 2000 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {prompt.length}/4000
                      </Badge>
                    </div>
                  </div>

                  {/* 智能提示 */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/50 rounded-xl p-3">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <span>💡 提示：包含风格、颜色、构图、光线等细节描述会获得更好的效果</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          {/* 提示词优化器 */}
          {prompt.trim() && (
            <PromptOptimizer
              originalPrompt={prompt}
              onApplyOptimized={(optimizedPrompt) => setPrompt(optimizedPrompt)}
              className="border-t pt-4"
            />
          )}

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

          </div>

          {/* 右侧参数面板 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 基础参数设置 - 重新设计 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden sticky top-8">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
                      <Sliders className="h-5 w-5 text-orange-600" />
                    </div>
                    参数设置
                  </CardTitle>
                  <p className="text-sm text-slate-600">调整生成参数以获得最佳效果</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 图片尺寸 */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Camera className="h-4 w-4 text-blue-500" />
                      图片尺寸
                    </label>
                    <Select value={size} onValueChange={(value: any) => setSize(value)} disabled={isGenerating}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-blue-400 rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024x1024" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                            正方形 (1:1)
                          </div>
                        </SelectItem>
                        <SelectItem value="1792x1024">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                            横版 (16:9)
                          </div>
                        </SelectItem>
                        <SelectItem value="1024x1792">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-5 bg-pink-100 border border-pink-300 rounded"></div>
                            竖版 (9:16)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 图片质量 */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      图片质量
                    </label>
                    <Select value={quality} onValueChange={(value: any) => setQuality(value)} disabled={isGenerating}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-purple-400 rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            标准质量
                          </div>
                        </SelectItem>
                        <SelectItem value="hd">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                            高清质量 (+1积分)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 图片风格 */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-pink-500" />
                      图片风格
                    </label>
                    <Select value={style} onValueChange={(value: any) => setStyle(value)} disabled={isGenerating}>
                      <SelectTrigger className="border-2 border-slate-200 focus:border-pink-400 rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vivid">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full"></div>
                            鲜艳风格
                          </div>
                        </SelectItem>
                        <SelectItem value="natural">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                            自然风格
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                    className="pt-4 border-t border-slate-200"
                  >
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim() || ((generationMode === 'image-to-image' || generationMode === 'inpainting') && uploadedImages.length === 0)}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
                          <div className="flex flex-col items-start">
                            <span className="text-base">
                              {generationMode === 'text-to-image' ? '创作中...' :
                               generationMode === 'image-to-image' ? '重绘中...' : '修复中...'}
                            </span>
                            <span className="text-xs opacity-80">请稍候，AI正在工作</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-6 w-6 mr-3" />
                          <div className="flex flex-col items-start">
                            <span className="text-base">
                              {generationMode === 'text-to-image' ? '🎨 开始创作' :
                               generationMode === 'image-to-image' ? '🖼️ 开始重绘' : '🔧 开始修复'}
                            </span>
                            {advancedSettings.batchSize > 1 && (
                              <span className="text-xs opacity-80">批量生成 {advancedSettings.batchSize} 张</span>
                            )}
                          </div>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* 模式说明 */}
                  <div className="text-xs text-slate-500 text-center space-y-1 bg-slate-50/50 rounded-xl p-3">
                    {generationMode === 'text-to-image' && (
                      <div className="flex items-center justify-center gap-2">
                        <span>✨</span>
                        <span>根据文字描述生成全新的图片</span>
                      </div>
                    )}
                    {generationMode === 'image-to-image' && (
                      <div className="flex items-center justify-center gap-2">
                        <span>🎨</span>
                        <span>基于参考图片重新绘制，保持构图改变风格</span>
                      </div>
                    )}
                    {generationMode === 'inpainting' && (
                      <div className="flex items-center justify-center gap-2">
                        <span>🔧</span>
                        <span>修复或替换图片的指定区域</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

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

        {/* 生成结果显示 - 全屏展示 */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mt-12"
            >
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                      <ImageIcon className="h-6 w-6 text-green-600" />
                    </div>
                    ✨ 创作完成
                  </CardTitle>
                  <p className="text-slate-600">您的AI艺术作品已经准备就绪</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 图片展示区域 */}
                  <div className="relative">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner max-w-2xl mx-auto">
                      <Image
                        src={result.imageUrl}
                        alt={result.prompt}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-500"
                      />
                      {/* 图片装饰边框 */}
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-slate-200/50"></div>
                    </div>

                    {/* 浮动操作按钮 */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        onClick={() => handleDownload(result.imageUrl)}
                        size="sm"
                        className="bg-white/90 hover:bg-white text-slate-700 shadow-lg backdrop-blur-sm border-0 rounded-xl"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleAddToGallery}
                        size="sm"
                        className="bg-white/90 hover:bg-white text-slate-700 shadow-lg backdrop-blur-sm border-0 rounded-xl"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 详细信息 */}
                  <div className="space-y-4 max-w-2xl mx-auto">
                    <div className="bg-slate-50/50 rounded-2xl p-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        创作提示词
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {result.prompt}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-blue-50/50 rounded-xl">
                        <div className="text-xs text-blue-600 font-medium mb-1">尺寸</div>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                          {result.parameters.size}
                        </Badge>
                      </div>
                      <div className="text-center p-3 bg-purple-50/50 rounded-xl">
                        <div className="text-xs text-purple-600 font-medium mb-1">质量</div>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                          {result.parameters.quality}
                        </Badge>
                      </div>
                      <div className="text-center p-3 bg-pink-50/50 rounded-xl">
                        <div className="text-xs text-pink-600 font-medium mb-1">风格</div>
                        <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">
                          {result.parameters.style}
                        </Badge>
                      </div>
                    </div>

                    {/* 操作按钮组 */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <Button
                        onClick={() => handleDownload(result.imageUrl)}
                        variant="outline"
                        className="h-12 gap-2 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 rounded-xl"
                      >
                        <Download className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">下载</span>
                      </Button>
                      <Button
                        onClick={handleAddToGallery}
                        variant="outline"
                        className="h-12 gap-2 border-2 hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 rounded-xl"
                      >
                        <Heart className="h-4 w-4 text-pink-600" />
                        <span className="font-medium">收藏</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 gap-2 border-2 hover:bg-green-50 hover:border-green-300 transition-all duration-300 rounded-xl"
                      >
                        <Share2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium">分享</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </div>
  )
}
