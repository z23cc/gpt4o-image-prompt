"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConfig = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/config')
      const data = await response.json()
      setResult({ type: 'config', data })
    } catch (err) {
      setError(err instanceof Error ? err.message : '配置测试失败')
    } finally {
      setLoading(false)
    }
  }



  const testGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'a simple test image',
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || '未知错误'}`)
      }

      setResult({ type: 'generate', data })
    } catch (err) {
      console.error('Generate test error:', err)
      setError(err instanceof Error ? err.message : '生成测试失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">API 调试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button onClick={testConfig} disabled={loading}>
          测试配置 API
        </Button>
        <Button onClick={testGenerate} disabled={loading}>
          测试生成 API
        </Button>
      </div>

      {loading && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p>测试中...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">错误</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>测试结果 ({result.type})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>当前环境信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>当前 URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</p>
            <p><strong>时间:</strong> {new Date().toISOString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
