"use client"

import { useState } from "react"
import { ImageGrid } from "@/components/image-grid"
import { AdminForm } from "@/components/admin-form"
import { PasswordModal } from "@/components/password-modal"
import { Button } from "@/components/ui/button"
import { Toaster } from "react-hot-toast"
import type { ImageWithPrompt } from "@/types/types"
import { imageData } from "@/lib/image-data"

export default function Home() {
  const [images, setImages] = useState<ImageWithPrompt[]>(imageData)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handlePasswordSubmit = (password: string) => {
    if (password === "admin123") {
      setIsAdmin(true)
    }
    setShowPasswordModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">提示词图片库</h1>
          <Button onClick={() => setShowPasswordModal(true)} variant="default">
            管理员登录
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 管理员表单 - 仅在管理员模式下显示 */}
        {isAdmin && (
          <div className="mb-8">
            <AdminForm
              images={images}
              setImages={setImages}
              onLogout={() => setIsAdmin(false)}
            />
          </div>
        )}

        {/* 图片网格 */}
        <ImageGrid images={images} />
      </main>

      {/* 密码模态框 */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
      />

      {/* Toast通知容器 */}
      <Toaster position="bottom-center" />
    </div>
  )
}
