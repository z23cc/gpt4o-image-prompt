"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wand2, 
  Palette, 
  Grid3X3, 
  Upload, 
  Settings, 
  Zap,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Wand2,
    title: "文本生图",
    description: "根据文字描述生成全新的图片",
    color: "from-blue-500 to-cyan-500",
    features: ["自然语言描述", "多种艺术风格", "高清质量输出"]
  },
  {
    icon: Palette,
    title: "图片重绘",
    description: "基于参考图片重新绘制，保持构图改变风格",
    color: "from-purple-500 to-pink-500",
    features: ["风格迁移", "构图保持", "强度可调"]
  },
  {
    icon: Grid3X3,
    title: "局部修复",
    description: "修复或替换图片的指定区域",
    color: "from-green-500 to-emerald-500",
    features: ["精确修复", "无缝融合", "智能填充"]
  },
  {
    icon: Upload,
    title: "智能上传",
    description: "支持拖拽上传，多格式兼容",
    color: "from-orange-500 to-red-500",
    features: ["拖拽上传", "实时预览", "批量管理"]
  },
  {
    icon: Settings,
    title: "高级设置",
    description: "精细控制生成参数，获得最佳效果",
    color: "from-indigo-500 to-purple-500",
    features: ["批量生成", "参数调优", "种子控制"]
  },
  {
    icon: Zap,
    title: "智能优化",
    description: "自动优化参数，提升生成质量",
    color: "from-yellow-500 to-orange-500",
    features: ["智能建议", "性能优化", "错误恢复"]
  }
]

export function FeatureShowcase() {
  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              全新升级的图片生成体验
            </h2>
            <p className="text-slate-600 mt-2">
              支持多种生成模式，提供专业级的创作工具
            </p>
          </div>
        </motion.div>
      </div>

      {/* 功能卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">
                      {feature.title}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs">
                      新功能
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 使用提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800">
              💡 使用建议
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">🎨 创作技巧</h4>
                <ul className="space-y-1">
                  <li>• 详细描述画面内容和风格</li>
                  <li>• 可以参考知名艺术家风格</li>
                  <li>• 使用具体的形容词增强表现力</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">⚙️ 参数优化</h4>
                <ul className="space-y-1">
                  <li>• 图片重绘建议强度 0.3-0.7</li>
                  <li>• 批量生成探索更多可能性</li>
                  <li>• 固定种子可重现满意结果</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
