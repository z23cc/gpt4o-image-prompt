import { useState, useEffect, useCallback } from 'react'

interface ApiConfig {
  displayName: string
  model: string
  baseURL: string
  apiProvider: string
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
  refetch: () => void
}

export function useApiConfig(): UseApiConfigReturn {
  const [config, setConfig] = useState<ApiConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // 模拟API配置获取
      // 在实际应用中，这里会从API端点获取配置
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockConfig: ApiConfig = {
        displayName: 'GPT-4o 图像生成',
        model: 'gpt-4o',
        baseURL: 'https://api.openai.com/v1',
        apiProvider: 'OpenAI',
        isCustomEndpoint: false,
        endpoint: 'https://api.openai.com/v1',
        description: '使用最新的GPT-4o模型进行图像生成，支持多种尺寸和质量选项',
        features: {
          sizes: ['1024x1024', '1024x1792', '1792x1024'],
          qualities: ['standard', 'hd'],
          styles: ['vivid', 'natural']
        }
      }

      setConfig(mockConfig)
    } catch (err) {
      setError(err instanceof Error ? err.message : '配置加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchConfig()
  }, [fetchConfig])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return {
    config,
    loading,
    error,
    refetch
  }
} 