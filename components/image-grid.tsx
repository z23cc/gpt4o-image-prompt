"use client"
import { useState } from "react"
import type { ImageWithPrompt } from "@/types/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"
import { ImageModal } from "./image-modal"

interface ImageGridProps {
  images: ImageWithPrompt[]
}

export function ImageGrid({ images }: ImageGridProps) {
  // 状态管理：当前查看的图片
  const [selectedImage, setSelectedImage] = useState<ImageWithPrompt | null>(null)

  // 复制提示词到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("提示词已复制到剪贴板！", {
          duration: 2000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        })
      })
      .catch((err) => {
        toast.error("复制失败，请重试")
        console.error("复制失败:", err)
      })
  }

  // 打开图片模态框
  const openImageModal = (image: ImageWithPrompt) => {
    setSelectedImage(image)
  }

  // 关闭图片模态框
  const closeImageModal = () => {
    setSelectedImage(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative aspect-[4/3] w-full cursor-pointer" onClick={() => openImageModal(image)}>
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.prompt}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity duration-200"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4 space-y-2">
              <p className="text-sm text-gray-700 line-clamp-3">{image.prompt}</p>
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => copyToClipboard(image.prompt)}>
                <Copy className="h-4 w-4 mr-2" />
                复制提示词
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
