"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  Palette,
  MessageSquare,
  CheckCircle,
  Lightbulb
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { usePromptFromUrl } from '@/hooks/use-prompt-copy'
import { useApiConfig, getModelOptimizedPrompts } from '@/hooks/use-api-config'
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
  error?: string
}

interface UploadedImage {
  file: File
  preview: string
  type: 'reference' | 'mask'
  uploadData?: UploadedImageData
}

interface AdvancedSettings {
  strength: number
  guidance: number
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
  const [generationMode, setGenerationMode] = useState<'text-to-image' | 'image-to-image' | 'inpainting'>('text-to-image')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    strength: 0.8,
    guidance: 7.5,
    batchSize: 1
  })

  // 从URL获取提示词
  const { getPromptFromUrl, clearPromptFromUrl } = usePromptFromUrl()
  const { config } = useApiConfig()
  const { uploadImage, isUploading: isUploadingToOSS, uploadProgress } = useImageUpload()

  // 检查URL参数中的提示词
  useEffect(() => {
    const urlData = getPromptFromUrl()
    if (urlData?.prompt) {
      setPrompt(urlData.prompt)
      clearPromptFromUrl()
      toast.success(`已从图库复制提示词！${urlData.category ? `分类：${urlData.category}` : ''}`, {
        icon: '🎨',
        duration: 3000
      })
    }
  }, [])

  const promptSuggestions = config ? getModelOptimizedPrompts(config.model) : []

  // 图片上传处理
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = async () => {
          const newImage: UploadedImage = {
            file,
            preview: reader.result as string,
            type: generationMode === 'inpainting' ? 'mask' : 'reference'
          }
          setUploadedImages(prev => [...prev, newImage])

          try {
            const uploadData = await uploadImage(file, 'image-generator')
            if (uploadData) {
              setUploadedImages(prev =>
                prev.map(img =>
                  img.file === file ? { ...img, uploadData } : img
                )
              )
            }
          } catch (error) {
            console.error('OSS upload failed:', error)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }, [generationMode, uploadImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: generationMode === 'inpainting' ? 2 : 1,
    disabled: isGenerating
  })

  const removeImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearImages = useCallback(() => {
    setUploadedImages([])
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('请输入提示词')
      return
    }

    if ((generationMode === 'image-to-image' || generationMode === 'inpainting') && uploadedImages.length === 0) {
      toast.error('请先上传参考图片')
      return
    }

    setIsGenerating(true)
    setStatus({ status: 'processing', progress: 0 })
    setResult(null)

    // 显示开始提示
    toast('🎨 开始生成图片，这可能需要1-3分钟，请耐心等待...', {
      duration: 5000,
      icon: '⏳'
    })

    try {
      const progressInterval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 10, 85)
        }))
      }, 2000)

      const requestData: any = {
        prompt: prompt.trim(),
        size,
        quality,
        style,
        mode: generationMode,
        ...advancedSettings
      }

      if (uploadedImages.length > 0) {
        requestData.images = uploadedImages.map((img) => ({
          data: img.uploadData?.url || img.preview,
          type: img.type,
          isUrl: !!img.uploadData?.url
        }))
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
      }, 180000) // 增加到3分钟

      let response
      try {
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
          signal: controller.signal
        })
      } catch (error) {
        clearTimeout(timeoutId)
        clearInterval(progressInterval)

        if (error.name === 'AbortError') {
          throw new Error('请求超时，请稍后重试')
        }
        throw error
      }

      clearTimeout(timeoutId)
      clearInterval(progressInterval)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '生成失败')
      }

      setStatus({ status: 'completed', progress: 100 })
      setResult(data.data)
      toast.success(`图片生成成功！`, { icon: '🎉', duration: 4000 })

    } catch (error) {
      console.error('Generation error:', error)
      let errorMessage = '生成失败'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时，请稍后重试'
        } else {
          errorMessage = error.message
        }
      }
      setStatus({ status: 'failed', progress: 0, error: errorMessage })
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧控制面板 */}
          <div className="space-y-6">
            {/* 生成模式选择 */}
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
                          onClick={() => setGenerationMode(mode.id as any)}
                        >
                          {generationMode === mode.id && (
                            <div className="absolute top-3 right-3">
                              <div className={`w-3 h-3 bg-gradient-to-r ${mode.gradient} rounded-full animate-pulse shadow-lg`}></div>
                            </div>
                          )}
                          <CardContent className="p-4 text-center relative">
                            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                              {mode.icon}
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1 text-base">{mode.name}</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">{mode.description}</p>
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
                    <div
                      {...getRootProps()}
                      className={`
                        border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300
                        ${isDragActive
                          ? 'border-orange-400 bg-orange-50 scale-105'
                          : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50/30'
                        }
                        ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-xl">
                          <Upload className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">
                            {isDragActive ? '释放文件到这里' : '拖拽图片到这里，或点击选择'}
                          </p>
                          <p className="text-xs text-slate-500">
                            支持 PNG, JPG, JPEG, WebP 格式，最大10MB
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
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                <Image
                                  src={image.preview}
                                  alt={`上传的图片 ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                onClick={() => removeImage(index)}
                                disabled={isGenerating}
                              >
                                <X className="h-2.5 w-2.5" />
                              </Button>
                              <div className="absolute bottom-1 left-1">
                                <Badge
                                  variant="secondary"
                                  className="text-[8px] px-1 py-0 bg-white/90 backdrop-blur-sm"
                                >
                                  {image.type === 'reference' ? '参考' : '遮罩'}
                                </Badge>
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

            {/* 提示词输入区域 */}
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

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/50 rounded-xl p-3">
                      <Lightbulb className="h-4 w-4 text-blue-500" />
                      <span>💡 提示：包含风格、颜色、构图、光线等细节描述会获得更好的效果</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
                      <Wand2 className="h-4 w-4 text-purple-500" />
                      <span>✨ <strong>建议：</strong>输入基础描述后，使用下方的"魔法棒"让AI为您优化提示词，获得更专业的效果！</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 提示词优化器 - 核心功能 */}
            {prompt.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-3xl overflow-hidden border-2 border-purple-200">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                  <CardContent className="p-6">
                    <PromptOptimizer
                      originalPrompt={prompt}
                      onApplyOptimized={(optimizedPrompt) => setPrompt(optimizedPrompt)}
                      className=""
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 快速提示词建议 */}
            {!prompt.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  快速开始 - 选择一个模板
                </label>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.slice(0, 6).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 px-3 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
                      onClick={() => setPrompt(suggestion)}
                      disabled={isGenerating}
                    >
                      {suggestion.slice(0, 25)}...
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 text-center">
                  💡 选择模板后，记得使用下方的"魔法棒"进行AI优化
                </p>
              </motion.div>
            )}
          </div>

          {/* 右侧预览区域 */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-8"
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                      <ImageIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    创作预览
                  </CardTitle>
                  <p className="text-sm text-slate-600">您的AI艺术作品将在这里显示</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 生成按钮 */}
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim() || ((generationMode === 'image-to-image' || generationMode === 'inpainting') && uploadedImages.length === 0)}
                    className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
                        <div className="flex flex-col items-center">
                          <span className="text-lg">
                            {generationMode === 'text-to-image' ? '✨ 创作中...' :
                             generationMode === 'image-to-image' ? '🎨 重绘中...' : '🔧 修复中...'}
                          </span>
                          <span className="text-sm opacity-90">AI正在工作中</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6 mr-3" />
                        <div className="flex flex-col items-center">
                          <span className="text-lg">
                            {generationMode === 'text-to-image' ? '✨ 开始创作' :
                             generationMode === 'image-to-image' ? '🎨 开始重绘' : '🔧 开始修复'}
                          </span>
                          <span className="text-sm opacity-90">点击开始生成</span>
                        </div>
                      </>
                    )}
                  </Button>

                  {/* 生成进度 */}
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 bg-blue-50/50 rounded-xl p-4 border border-blue-200"
                    >
                      <div className="flex justify-between text-sm text-blue-700 font-medium">
                        <span>🎨 创作进度</span>
                        <span>{status.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={status.progress} className="h-3 bg-blue-100" />
                      <p className="text-xs text-blue-600 text-center">
                        AI正在精心创作中，预计还需要 {Math.max(30, Math.ceil((100 - status.progress) * 2))} 秒
                      </p>
                    </motion.div>
                  )}

                  {/* 生成结果显示 */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-4"
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                          <img
                            src={result.imageUrl}
                            alt="AI生成的图片"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = result.imageUrl
                              link.download = `ai-generated-${Date.now()}.png`
                              link.click()
                            }}
                            className="flex-1 gap-2"
                          >
                            <Download className="h-4 w-4" />
                            下载
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // 分享功能
                            }}
                            className="flex-1 gap-2"
                          >
                            <Share2 className="h-4 w-4" />
                            分享
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 空状态提示 */}
                  {!result && !isGenerating && (
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 bg-slate-50/50">
                      <ImageIcon className="h-12 w-12 mb-3 text-slate-400" />
                      <p className="text-sm font-medium mb-1">等待创作</p>
                      <p className="text-xs text-center px-4">
                        完善左侧的创意描述，然后点击上方按钮开始创作
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>


      </div>
    </div>
  )
}
