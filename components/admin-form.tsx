"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import type { ImageWithPrompt } from "@/types/types"
import { CATEGORIES } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Upload, X, Edit, Save, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ImagePlus, LogOut } from "lucide-react"
import { Sparkles } from "lucide-react"

interface AdminFormProps {
  images: ImageWithPrompt[]
  setImages: React.Dispatch<React.SetStateAction<ImageWithPrompt[]>>
  onLogout: () => void
}

export function AdminForm({ images, setImages, onLogout }: AdminFormProps) {
  const [prompt, setPrompt] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("creative")
  const [tags, setTags] = useState("")
  const [editingImage, setEditingImage] = useState<ImageWithPrompt | null>(null)
  const [editPrompt, setEditPrompt] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editTags, setEditTags] = useState("")

  // 使用react-dropzone处理图片上传
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFile(file)

      // 创建预览URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
  })

  // 清除预览和文件
  const clearPreview = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage)
    }
    setPreviewImage(null)
    setFile(null)
  }

  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!previewImage || !prompt.trim()) {
      toast.error("请上传图片并填写提示词")
      return
    }

    const newImage: ImageWithPrompt = {
      id: Date.now().toString(),
      src: previewImage,
      prompt: prompt.trim(),
      category: selectedCategory,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    }

    setImages([newImage, ...images])
    
    toast.success("图片添加成功！", {
      icon: "🎉",
      style: {
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
      },
    })

    // 重置表单
    setPrompt("")
    setSelectedCategory("creative")
    setTags("")
    clearPreview()
  }

  // 开始编辑图片
  const startEditImage = (image: ImageWithPrompt) => {
    setEditingImage(image)
    setEditPrompt(image.prompt)
    setEditCategory(image.category)
    setEditTags(image.tags?.join(', ') || '')
  }

  // 保存编辑
  const saveEdit = () => {
    if (!editingImage) return

    const updatedImages = images.map(img =>
      img.id === editingImage.id
        ? {
            ...img,
            prompt: editPrompt.trim(),
            category: editCategory,
            tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          }
        : img
    )

    setImages(updatedImages)
    setEditingImage(null)
    setEditPrompt('')
    setEditCategory('')
    setEditTags('')

    toast.success("图片信息已更新！", {
      icon: "✅",
      style: {
        borderRadius: "12px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
      },
    })
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingImage(null)
    setEditPrompt('')
    setEditCategory('')
    setEditTags('')
  }

  // 删除图片
  const deleteImage = (imageId: string) => {
    if (confirm('确定要删除这张图片吗？此操作不可撤销。')) {
      const updatedImages = images.filter(img => img.id !== imageId)
      setImages(updatedImages)

      toast.success("图片已删除！", {
        icon: "🗑️",
        style: {
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        },
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <ImagePlus className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  添加新图片
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  上传图片并添加对应的AI提示词
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
              退出管理
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 现代化图片上传区域 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700">上传图片</label>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300">
                  支持 PNG, JPG, WebP
                </Badge>
              </div>
              
              {!previewImage ? (
                <motion.div
                  {...getRootProps()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer 
                    transition-all duration-300 group
                    ${isDragActive 
                      ? "border-blue-400 bg-blue-50 scale-105" 
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-700 mb-2">
                        {isDragActive ? "放开以上传图片" : "拖拽图片到此处"}
                      </p>
                      <p className="text-sm text-slate-500">
                        或点击选择文件上传
                      </p>
                    </div>
                  </div>
                  
                  {/* 装饰性元素 */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src={previewImage}
                      alt="预览图片"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={clearPreview}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Badge 
                    variant="secondary" 
                    className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm"
                  >
                    预览图片
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* 分类选择 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                图片分类
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${CATEGORIES.find(c => c.id === selectedCategory)?.color || 'bg-gray-500'}`} />
                      {CATEGORIES.find(c => c.id === selectedCategory)?.name || '选择分类'}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        <span>{category.name}</span>
                        {category.description && (
                          <span className="text-xs text-slate-500 ml-1">
                            - {category.description}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 标签输入 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                标签 (可选)
              </label>
              <Input
                placeholder="输入标签，用逗号分隔，如：3D,Q版,可爱"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <div className="text-xs text-slate-500">
                标签有助于用户更好地搜索和筛选图片
              </div>
            </div>

            {/* 现代化提示词输入 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">
                AI 提示词
              </label>
              <Textarea
                placeholder="请输入详细的AI图片生成提示词，描述图片的风格、内容、色彩等..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>详细的提示词有助于生成更好的图片</span>
                <span>{prompt.length} 字符</span>
              </div>
            </div>

            {/* 提交按钮 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!previewImage || !prompt.trim()}
              >
                <ImagePlus className="h-5 w-5 mr-2" />
                添加到图片库
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* 统计信息卡片 */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-slate-100 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">图片库统计</h3>
              <p className="text-sm text-slate-500 mt-1">当前管理的图片数量</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">{images.length}</div>
              <div className="text-sm text-slate-500">张图片</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图片管理区域 */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">
            图片管理
          </CardTitle>
          <p className="text-sm text-slate-500">
            编辑图片信息、分类和标签
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-video">
                    <Image
                      src={image.src}
                      alt={image.prompt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge
                        variant="secondary"
                        className={`${CATEGORIES.find(c => c.id === image.category)?.color || 'bg-gray-500'} text-white text-xs`}
                      >
                        {CATEGORIES.find(c => c.id === image.category)?.name || '未分类'}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90"
                          onClick={() => startEditImage(image)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => deleteImage(image.id!)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    {image.tags && image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 编辑模态框 */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">编辑图片信息</h3>
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                <Image
                  src={editingImage.src}
                  alt={editingImage.prompt}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    分类
                  </label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${CATEGORIES.find(c => c.id === editCategory)?.color || 'bg-gray-500'}`} />
                          {CATEGORIES.find(c => c.id === editCategory)?.name || '选择分类'}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    标签
                  </label>
                  <Input
                    placeholder="输入标签，用逗号分隔"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    提示词
                  </label>
                  <Textarea
                    placeholder="编辑提示词..."
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={saveEdit} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    保存更改
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} className="flex-1">
                    取消
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
