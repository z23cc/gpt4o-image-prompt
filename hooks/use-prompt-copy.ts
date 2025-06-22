"use client"

import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export function usePromptCopy() {
  const router = useRouter()

  // 复制到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('提示词已复制到剪贴板！', {
        icon: '📋',
        duration: 2000
      })
      return true
    } catch (error) {
      // 降级方案：使用传统方法
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        toast.success('提示词已复制到剪贴板！', {
          icon: '📋',
          duration: 2000
        })
        return true
      } catch (fallbackError) {
        toast.error('复制失败，请手动复制')
        return false
      }
    }
  }

  // 复制并跳转到生成页面
  const copyAndGenerate = (prompt: string, category?: string) => {
    // 编码提示词以便在URL中传递
    const encodedPrompt = encodeURIComponent(prompt)
    const params = new URLSearchParams()
    params.set('prompt', encodedPrompt)
    
    if (category) {
      params.set('category', category)
    }
    
    // 跳转到生成页面并传递提示词
    router.push(`/generate?${params.toString()}`)
    
    toast.success('已跳转到生成页面！', {
      icon: '🎨',
      duration: 2000
    })
  }

  // 只复制不跳转
  const copyOnly = async (prompt: string) => {
    return await copyToClipboard(prompt)
  }

  return {
    copyToClipboard,
    copyAndGenerate,
    copyOnly
  }
}

// 从URL参数中获取提示词的Hook
export function usePromptFromUrl() {
  const getPromptFromUrl = () => {
    if (typeof window === 'undefined') return null
    
    const urlParams = new URLSearchParams(window.location.search)
    const encodedPrompt = urlParams.get('prompt')
    const category = urlParams.get('category')
    
    if (encodedPrompt) {
      try {
        const prompt = decodeURIComponent(encodedPrompt)
        return { prompt, category }
      } catch (error) {
        console.error('Failed to decode prompt from URL:', error)
        return null
      }
    }
    
    return null
  }

  // 清除URL中的提示词参数
  const clearPromptFromUrl = () => {
    if (typeof window === 'undefined') return
    
    const url = new URL(window.location.href)
    url.searchParams.delete('prompt')
    url.searchParams.delete('category')
    
    // 使用 replaceState 避免在浏览器历史中留下记录
    window.history.replaceState({}, '', url.toString())
  }

  return {
    getPromptFromUrl,
    clearPromptFromUrl
  }
}
