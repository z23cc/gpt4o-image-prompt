"use client"

import { Suspense } from 'react'
import { ImageGenerator } from '@/components/image-generator'
import { FeatureShowcase } from '@/components/feature-showcase'
import { useApiConfig } from '@/hooks/use-api-config'
import { ConfigStatus } from '@/components/config-status'
import { ResponsiveLayout } from '@/components/responsive-layout'
import { ScrollIndicator } from '@/components/scroll-indicator'
import { Sparkles, ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { motion } from 'framer-motion'

function GenerateContent() {
  const { config, loading: configLoading } = useApiConfig()

  return (
    <ResponsiveLayout className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm transition-all duration-300 safe-top">
        <div className="container mx-auto px-safe py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-slate-100">
                  <ArrowLeft className="h-4 w-4" />
                  返回图库
                </Button>
              </Link>
              
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-xl shadow-lg">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                    AI 图片生成
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 hidden sm:block">
                    {config?.description || '基于 AI 模型的强大图片生成能力'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {config && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-purple-700">{config.displayName}</span>
                  {config.isCustomEndpoint && (
                    <span className="text-xs text-purple-500">({config.endpoint})</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-safe py-6 md:py-8">
        {/* 功能介绍卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                释放你的创意想象力
              </h2>
              <p className="text-purple-100 mb-4 text-sm md:text-base">
                {config
                  ? `使用 ${config.displayName} 模型，只需描述你的想法，AI 就能为你创造出令人惊艳的图片。支持多种风格和尺寸，让创意无限可能。`
                  : '使用先进的 AI 模型，只需描述你的想法，就能为你创造出令人惊艳的图片。'
                }
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  🎨 多种艺术风格
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  📐 自定义尺寸
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  ⚡ 快速生成
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  💎 高清质量
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 配置状态显示 */}
        <div className="mb-6">
          <ConfigStatus showDetails={false} />
        </div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              开始创作
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              功能介绍
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-0">
            <ImageGenerator />
          </TabsContent>

          <TabsContent value="features" className="space-y-0">
            <FeatureShowcase />
          </TabsContent>
        </Tabs>

        {/* 使用提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              生成技巧
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">📝 提示词建议</h4>
                <ul className="space-y-1">
                  <li>• 详细描述画面内容和风格</li>
                  <li>• 指定颜色、光线、构图等细节</li>
                  <li>• 可以参考艺术家或艺术风格</li>
                  <li>• 使用形容词增强表现力</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">⚙️ 参数选择</h4>
                <ul className="space-y-1">
                  <li>• 正方形适合头像、图标</li>
                  <li>• 横版适合壁纸、横幅</li>
                  <li>• 竖版适合手机壁纸、海报</li>
                  <li>• 高清模式提供更多细节</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 配额提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-blue-500 rounded-full">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">
                  免费体验
                </p>
                <p className="text-blue-600">
                  每天可免费生成 10 张图片，生成的图片会自动保存到本地。
                  如需更多配额或商业使用，请联系我们。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 滚动指示器 */}
      <ScrollIndicator />
    </ResponsiveLayout>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载生成器...</p>
        </div>
      </div>
    }>
      <GenerateContent />
    </Suspense>
  )
}
