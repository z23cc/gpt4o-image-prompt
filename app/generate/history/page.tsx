"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveLayout } from '@/components/responsive-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Clock, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface GenerationRecord {
  id: string
  prompt: string
  imageUrl: string
  parameters: {
    size: string
    quality: string
    style: string
  }
  createdAt: string
}

export default function GenerationHistoryPage() {
  const [history, setHistory] = useState<GenerationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/generate')
      if (!response.ok) {
        throw new Error('获取历史记录失败')
      }
      const data = await response.json()
      setHistory(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (imageUrl: string, prompt: string) => {
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
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return '刚刚'
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  if (loading) {
    return (
      <ResponsiveLayout className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="container mx-auto px-safe py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">加载历史记录...</p>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm transition-all duration-300 safe-top">
        <div className="container mx-auto px-safe py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/generate">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-slate-100">
                  <ArrowLeft className="h-4 w-4" />
                  返回生成
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl shadow-lg">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                    生成历史
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 hidden sm:block">
                    查看最近的图片生成记录
                  </p>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="hidden md:flex bg-slate-100 text-slate-700 text-xs">
              {history.length} 条记录
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-safe py-6 md:py-8">
        {error ? (
          <Card className="border-0 shadow-md bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchHistory} variant="outline">
                重试
              </Button>
            </CardContent>
          </Card>
        ) : history.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                暂无生成记录
              </h3>
              <p className="text-slate-500 mb-4">
                开始你的第一次 AI 图片创作吧！
              </p>
              <Link href="/generate">
                <Button className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  开始生成
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="relative aspect-square">
                    <Image
                      src={record.imageUrl}
                      alt={record.prompt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-slate-700 text-xs">
                        {record.parameters.size}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => handleDownload(record.imageUrl, record.prompt)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                      {record.prompt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {record.parameters.quality}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {record.parameters.style}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatDate(record.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* 底部提示 */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="border-0 shadow-md bg-slate-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-600">
                  历史记录仅保留最近 50 条生成记录
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </ResponsiveLayout>
  )
}
