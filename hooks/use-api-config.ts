"use client"

import { useState, useEffect } from 'react'

interface ApiConfig {
  model: string
  baseURL: string
  apiProvider: string
  displayName: string
  isCustomEndpoint: boolean
  endpoint: string
  description: string
  features: {
    sizes: string[]
    qualities: string[]
    styles: string[]
  }
}

interface UseApiConfigReturn {
  config: ApiConfig | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApiConfig(): UseApiConfigReturn {
  const [config, setConfig] = useState<ApiConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/config')
      if (!response.ok) {
        throw new Error('获取配置失败')
      }
      
      const data = await response.json()
      if (data.success) {
        setConfig(data.data)
      } else {
        throw new Error(data.error || '配置数据格式错误')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
      console.error('API config fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  return {
    config,
    loading,
    error,
    refetch: fetchConfig
  }
}

// 获取模型相关的提示词建议
export function getModelOptimizedPrompts(model: string): string[] {
  switch (model) {
    case 'gpt-image-1':
      return [
        "一只可爱的3D卡通猫咪，坐在彩虹上，背景是梦幻的云朵，柔和光线，高质量渲染",
        "赛博朋克风格的未来城市夜景，霓虹灯闪烁，细节丰富，电影级画质",
        "水彩画风格的樱花盛开的日本庭院，细腻笔触，春天氛围，艺术感强",
        "极简主义风格的现代建筑，几何形状，蓝天白云，建筑摄影，专业构图",
        "油画风格的向日葵田，梵高画风，厚重笔触，温暖色调，经典艺术"
      ]
    case 'dall-e-3':
      return [
        "一只可爱的卡通猫咪坐在彩虹上，背景是梦幻的云朵",
        "赛博朋克风格的未来城市夜景，霓虹灯闪烁",
        "水彩画风格的樱花盛开的日本庭院",
        "极简主义风格的现代建筑，几何形状，蓝天白云",
        "油画风格的向日葵田，梵高画风"
      ]
    default:
      return [
        "一只可爱的猫咪",
        "美丽的风景画",
        "现代艺术作品",
        "抽象几何图形",
        "自然风光摄影"
      ]
  }
}

// 获取模型特定的生成建议
export function getModelTips(model: string): string[] {
  switch (model) {
    case 'gpt-image-1':
      return [
        "添加质量描述词如'高质量渲染'、'细节丰富'",
        "指定具体的艺术风格和技法",
        "描述光线、色调和氛围",
        "使用专业术语提升效果"
      ]
    case 'dall-e-3':
      return [
        "保持提示词简洁明了",
        "重点描述主要元素",
        "避免过于复杂的描述",
        "使用常见的艺术风格词汇"
      ]
    default:
      return [
        "详细描述想要的图片内容",
        "指定风格和色彩偏好",
        "添加构图和视角说明",
        "使用形容词增强表现力"
      ]
  }
}
