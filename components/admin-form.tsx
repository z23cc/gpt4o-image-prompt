"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import type { ImageWithPrompt } from "@/types/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface AdminFormProps {
  images: ImageWithPrompt[]
  setImages: React.Dispatch<React.SetStateAction<ImageWithPrompt[]>>
  onLogout: () => void
}

export function AdminForm({ images, setImages, onLogout }: AdminFormProps) {
  const [prompt, setPrompt] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

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
      alert("请上传图片并填写提示词")
      return
    }

    // 创建新图片对象
    const newImage: ImageWithPrompt = {
      id: Date.now().toString(), // 使用时间戳作为临时ID
      src: previewImage, // 在实际应用中，这应该是服务器返回的URL
      prompt: prompt,
    }

    // 添加到图片列表
    setImages(prev => [...prev, newImage])

    // 重置表单
    setPrompt("")
    clearPreview()
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">添加新图片和提示词</CardTitle>
        <Button variant="outline" onClick={onLogout}>
          退出管理员模式
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 图片上传区域 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">上传图片</label>
            {!previewImage ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">拖放图片到此处，或点击选择图片</p>
                <p className="text-xs text-gray-400 mt-1">支持 PNG, JPG 格式</p>
              </div>
            ) : (
              <div className="relative w-full aspect-video">
                <Image
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearPreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* 提示词输入 */}
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium">
              提示词
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入与图片相关的提示词..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* 提交按钮 */}
          <Button type="submit" className="w-full" disabled={!previewImage || !prompt.trim()}>
            添加图片
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
