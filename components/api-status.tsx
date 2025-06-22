"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

interface ApiStatus {
  config: 'success' | 'error' | 'loading'
  generate: 'success' | 'error' | 'loading' | 'idle'
  lastTest: string | null
  error: string | null
}

export function ApiStatus() {
  const [status, setStatus] = useState<ApiStatus>({
    config: 'loading',
    generate: 'idle',
    lastTest: null,
    error: null
  })

  const testConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        setStatus(prev => ({ ...prev, config: 'success', error: null }))
      } else {
        setStatus(prev => ({ ...prev, config: 'error', error: `配置API错误: ${response.status}` }))
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        config: 'error', 
        error: error instanceof Error ? error.message : '配置API连接失败' 
      }))
    }
  }

  const testGenerate = async () => {
    setStatus(prev => ({ ...prev, generate: 'loading', error: null }))
    
    try {
      const startTime = Date.now()
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'test',
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        })
      })

      const endTime = Date.now()
      const duration = endTime - startTime

      if (response.ok) {
        setStatus(prev => ({ 
          ...prev, 
          generate: 'success', 
          lastTest: `成功 (${duration}ms)`,
          error: null 
        }))
      } else {
        const data = await response.json()
        setStatus(prev => ({ 
          ...prev, 
          generate: 'error', 
          error: `生成API错误: ${data.error || response.status}` 
        }))
      }
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        generate: 'error', 
        error: error instanceof Error ? error.message : '生成API连接失败' 
      }))
    }
  }

  useEffect(() => {
    testConfig()
  }, [])

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'loading':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700">正常</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-700">错误</Badge>
      case 'loading':
        return <Badge className="bg-blue-100 text-blue-700">测试中</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700">未测试</Badge>
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          API 状态检查
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(status.config)}
            <span className="text-sm">配置 API</span>
          </div>
          {getStatusBadge(status.config)}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(status.generate)}
            <span className="text-sm">生成 API</span>
          </div>
          {getStatusBadge(status.generate)}
        </div>

        {status.lastTest && (
          <div className="text-xs text-gray-600">
            最后测试: {status.lastTest}
          </div>
        )}

        {status.error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {status.error}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={testConfig}
            disabled={status.config === 'loading'}
          >
            测试配置
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={testGenerate}
            disabled={status.generate === 'loading'}
          >
            测试生成
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
