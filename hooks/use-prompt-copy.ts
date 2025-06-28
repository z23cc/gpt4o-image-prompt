import { useCallback } from 'react'
import toast from 'react-hot-toast'

export function usePromptCopy() {
  const copyOnly = useCallback(async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      toast.success('提示词已复制到剪贴板！', { icon: '📋' })
      return true
    } catch (error) {
      toast.error('复制失败，请重试')
      return false
    }
  }, [])

  const copyAndGenerate = useCallback(async (prompt: string) => {
    try {
      // 先复制提示词
      await navigator.clipboard.writeText(prompt)
      toast.success('提示词已复制，正在生成图片...', { icon: '✨' })
      
      // 这里可以添加生成图片的逻辑
      // 例如：调用API生成图片
      
      return true
    } catch (error) {
      toast.error('操作失败，请重试')
      return false
    }
  }, [])

  return {
    copyOnly,
    copyAndGenerate
  }
} 