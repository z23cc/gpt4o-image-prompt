"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react'
import { useApiConfig } from '@/hooks/use-api-config'

interface ConfigStatusProps {
  showDetails?: boolean
  className?: string
}

export function ConfigStatus({ showDetails = false, className = '' }: ConfigStatusProps) {
  const { config, loading, error, refetch } = useApiConfig()

  if (loading) {
    return (
      <Card className={`border-0 shadow-sm bg-slate-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
            <span className="text-sm text-slate-600">加载配置中...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={`border-0 shadow-sm bg-red-50 border-red-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">配置加载失败</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              重试
            </Button>
          </div>
          {showDetails && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!config) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-slate-700">
                  {config.displayName}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    config.isCustomEndpoint 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {config.isCustomEndpoint ? '自定义端点' : '官方 API'}
                </Badge>
                
                {config.isCustomEndpoint && (
                  <Badge variant="outline" className="text-xs">
                    {config.endpoint}
                  </Badge>
                )}
              </div>
            </div>

            {showDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refetch}
                className="gap-2 text-slate-500 hover:text-slate-700"
              >
                <RefreshCw className="h-3 w-3" />
                刷新
              </Button>
            )}
          </div>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-slate-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-medium text-slate-700 mb-2">API 配置</div>
                  <div className="space-y-1 text-slate-600">
                    <div>模型: {config.model}</div>
                    <div>端点: {config.baseURL}</div>
                    <div>提供商: {config.apiProvider}</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-slate-700 mb-2">支持功能</div>
                  <div className="space-y-1 text-slate-600">
                    <div>尺寸: {config.features.sizes.length} 种</div>
                    <div>质量: {config.features.qualities.join(', ')}</div>
                    <div>风格: {config.features.styles.join(', ')}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-slate-600">
                    <p className="font-medium mb-1">配置说明</p>
                    <p>{config.description}</p>
                    {config.isCustomEndpoint && (
                      <p className="mt-1 text-slate-500">
                        使用自定义端点可能需要特殊的 API Key 或配置
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {config.isCustomEndpoint && (
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => window.open(config.baseURL.replace('/v1', ''), '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                    访问端点
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => {
                      // 这里可以添加测试 API 连接的功能
                      console.log('测试 API 连接')
                    }}
                  >
                    <Settings className="h-3 w-3" />
                    测试连接
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// 简化版本的配置状态指示器
export function ConfigIndicator() {
  const { config, loading, error } = useApiConfig()

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-full">
        <RefreshCw className="h-3 w-3 animate-spin text-slate-400" />
        <span className="text-xs text-slate-600">加载中</span>
      </div>
    )
  }

  if (error || !config) {
    return (
      <div className="flex items-center gap-2 px-2 py-1 bg-red-100 rounded-full">
        <AlertCircle className="h-3 w-3 text-red-500" />
        <span className="text-xs text-red-700">配置错误</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-green-100 rounded-full">
      <CheckCircle className="h-3 w-3 text-green-500" />
      <span className="text-xs text-green-700">{config.displayName}</span>
    </div>
  )
}
