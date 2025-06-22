"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Wand2, ArrowRight, Sparkles } from 'lucide-react'
import { usePromptCopy } from '@/hooks/use-prompt-copy'

export function CopyPromptDemo() {
  const { copyOnly, copyAndGenerate } = usePromptCopy()

  const demoPrompt = "一只可爱的3D卡通猫咪，坐在彩虹上，背景是梦幻的云朵，柔和的光线，温暖的色调，高质量渲染"

  const handleDemoCopy = async () => {
    await copyOnly(demoPrompt)
  }

  const handleDemoGenerate = () => {
    copyAndGenerate(demoPrompt, "3d-rendering")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                ✨ 一键复制提示词功能
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  新功能
                </Badge>
              </h3>
              
              <p className="text-sm text-slate-600 mb-4">
                在图片库中，你可以直接复制任何图片的提示词到生成界面，或者一键跳转到生成页面开始创作！
              </p>

              {/* 演示区域 */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                <div className="text-xs text-slate-500 mb-2">示例提示词：</div>
                <p className="text-sm text-slate-700 mb-3 italic">
                  "{demoPrompt}"
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDemoCopy}
                    className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Copy className="h-4 w-4" />
                    复制提示词
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleDemoGenerate}
                    className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                  >
                    <Wand2 className="h-4 w-4" />
                    一键生成
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <Copy className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-700">复制提示词</div>
                    <div className="text-slate-500">复制到剪贴板，可在任何地方使用</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Wand2 className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-700">一键生成</div>
                    <div className="text-slate-500">直接跳转到生成页面并自动填充</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
