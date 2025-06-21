"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageModal } from "./image-modal"
import { VirtualGrid, useResponsiveGrid, LazyImage } from "./virtual-grid"
import { useSafeAreaDimensions } from "./layout-wrapper"
import { Copy, Eye, Sparkles, Tag } from "lucide-react"
import toast from "react-hot-toast"
import type { ImageWithPrompt } from "@/types/types"
import { CATEGORIES } from "@/types/types"

interface OptimizedImageGridProps {
  images: ImageWithPrompt[]
  viewMode?: 'grid' | 'list'
  enableVirtualization?: boolean
}

export function OptimizedImageGrid({ 
  images, 
  viewMode = 'grid',
  enableVirtualization = true 
}: OptimizedImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<ImageWithPrompt | null>(null)
  const { itemsPerRow, itemHeight, gap } = useResponsiveGrid()
  const { safeHeight } = useSafeAreaDimensions()

  // Use safe area height for virtual scrolling container
  const containerHeight = Math.max(400, Math.min(safeHeight, 1000))

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[0]
  }

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("提示词已复制到剪贴板！", {
          icon: "✨",
          style: {
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            color: "#334155",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        })
      })
      .catch(() => {
        toast.error("复制失败，请重试")
      })
  }, [])

  const openImageModal = useCallback((image: ImageWithPrompt) => {
    setSelectedImage(image)
  }, [])

  const closeImageModal = useCallback(() => {
    setSelectedImage(null)
  }, [])

  // 渲染单个图片项目
  const renderGridItem = useCallback((image: ImageWithPrompt, index: number) => {
    const categoryInfo = getCategoryInfo(image.category)
    
    return (
      <div
        className="animate-in fade-in-0 slide-in-from-bottom-4 group h-full"
        style={{ animationDelay: `${(index % 20) * 50}ms` }}
      >
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1 h-full">
          <CardContent className="p-0 h-full flex flex-col">
            {/* 图片容器 */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <LazyImage
                src={image.src || "/placeholder.svg"}
                alt={image.prompt}
                className="w-full h-full"
              />
              
              {/* 分类标签 */}
              <div className="absolute top-2 left-2">
                <Badge 
                  variant="secondary" 
                  className={`${categoryInfo.color} text-white text-xs`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {categoryInfo.name}
                </Badge>
              </div>
              
              {/* 悬浮遮罩层 */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-slate-800 gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  onClick={() => openImageModal(image)}
                >
                  <Eye className="h-4 w-4" />
                  查看
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-slate-800 gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                  onClick={() => copyToClipboard(image.prompt)}
                >
                  <Copy className="h-4 w-4" />
                  复制
                </Button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-4 space-y-3 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 flex-1">
                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {image.prompt}
                </p>
                <Badge variant="secondary" className="shrink-0 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              </div>
              
              {/* 标签显示 */}
              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {image.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 hover:bg-slate-50 hover:scale-105 transition-all duration-200 border-slate-200 mt-auto" 
                onClick={() => copyToClipboard(image.prompt)}
              >
                <Copy className="h-4 w-4" />
                复制提示词
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }, [copyToClipboard, openImageModal])

  // 渲染列表项目
  const renderListItem = useCallback((image: ImageWithPrompt, index: number) => {
    const categoryInfo = getCategoryInfo(image.category)
    
    return (
      <div
        className="animate-in fade-in-0 slide-in-from-left-4"
        style={{ animationDelay: `${(index % 10) * 25}ms` }}
      >
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="flex gap-4 p-4">
              {/* 图片缩略图 */}
              <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg group">
                <LazyImage
                  src={image.src || "/placeholder.svg"}
                  alt={image.prompt}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-slate-800"
                    onClick={() => openImageModal(image)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* 内容区域 */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={`${categoryInfo.color} text-white text-xs`}
                      >
                        {categoryInfo.name}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {image.prompt}
                    </p>
                    {image.tags && image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 hover:bg-slate-50 transition-all duration-200" 
                    onClick={() => copyToClipboard(image.prompt)}
                  >
                    <Copy className="h-4 w-4" />
                    复制
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }, [copyToClipboard, openImageModal])

  // 决定是否使用虚拟化
  const shouldUseVirtualization = enableVirtualization && images.length > 50

  return (
    <>
      {viewMode === 'grid' ? (
        shouldUseVirtualization ? (
          <VirtualGrid
            items={images}
            itemHeight={itemHeight}
            containerHeight={containerHeight}
            itemsPerRow={itemsPerRow}
            gap={gap}
            renderItem={renderGridItem}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-8">
            {images.map((image, index) => (
              <div key={image.id || index}>
                {renderGridItem(image, index)}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-4 pb-8">
          {images.map((image, index) => (
            <div key={image.id || index}>
              {renderListItem(image, index)}
            </div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {images.length === 0 && (
        <div className="text-center py-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Sparkles className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">暂无图片</h3>
          <p className="text-slate-500">开始添加一些精彩的AI生成图片吧！</p>
        </div>
      )}

      {/* 图片查看模态框 */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          imageSrc={selectedImage.src}
          prompt={selectedImage.prompt}
        />
      )}
    </>
  )
}
