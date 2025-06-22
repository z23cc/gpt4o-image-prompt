import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'

export interface UploadedImageData {
  fileName: string
  url: string
  size: number
  type: string
  uploadTime: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UseImageUploadReturn {
  uploadImage: (file: File, prefix?: string) => Promise<UploadedImageData | null>
  uploadImages: (files: File[], prefix?: string) => Promise<UploadedImageData[]>
  isUploading: boolean
  uploadProgress: UploadProgress | null
  error: string | null
  clearError: () => void
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const uploadImage = useCallback(async (file: File, prefix?: string): Promise<UploadedImageData | null> => {
    setIsUploading(true)
    setError(null)
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 })

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (prefix) {
        formData.append('prefix', prefix)
      }

      // 创建XMLHttpRequest以支持进度跟踪
      const xhr = new XMLHttpRequest()
      
      return new Promise<UploadedImageData | null>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100)
            setUploadProgress({
              loaded: event.loaded,
              total: event.total,
              percentage
            })
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText)
              if (response.success) {
                toast.success('图片上传成功！')
                resolve(response.data)
              } else {
                const errorMsg = response.error || '上传失败'
                setError(errorMsg)
                toast.error(errorMsg)
                resolve(null)
              }
            } catch (parseError) {
              const errorMsg = '解析响应失败'
              setError(errorMsg)
              toast.error(errorMsg)
              resolve(null)
            }
          } else {
            try {
              const response = JSON.parse(xhr.responseText)
              const errorMsg = response.error || `上传失败 (${xhr.status})`
              setError(errorMsg)
              toast.error(errorMsg)
            } catch {
              const errorMsg = `上传失败 (${xhr.status})`
              setError(errorMsg)
              toast.error(errorMsg)
            }
            resolve(null)
          }
        })

        xhr.addEventListener('error', () => {
          const errorMsg = '网络错误，上传失败'
          setError(errorMsg)
          toast.error(errorMsg)
          resolve(null)
        })

        xhr.addEventListener('timeout', () => {
          const errorMsg = '上传超时，请重试'
          setError(errorMsg)
          toast.error(errorMsg)
          resolve(null)
        })

        xhr.open('POST', '/api/upload')
        xhr.timeout = 60000 // 60秒超时
        xhr.send(formData)
      })

    } catch (error) {
      console.error('Upload error:', error)
      const errorMsg = error instanceof Error ? error.message : '上传失败'
      setError(errorMsg)
      toast.error(errorMsg)
      return null
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
    }
  }, [])

  const uploadImages = useCallback(async (files: File[], prefix?: string): Promise<UploadedImageData[]> => {
    const results: UploadedImageData[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      toast.loading(`正在上传第 ${i + 1}/${files.length} 张图片...`, {
        id: `upload-${i}`
      })
      
      const result = await uploadImage(file, prefix)
      if (result) {
        results.push(result)
        toast.success(`第 ${i + 1} 张图片上传成功`, {
          id: `upload-${i}`
        })
      } else {
        toast.error(`第 ${i + 1} 张图片上传失败`, {
          id: `upload-${i}`
        })
      }
    }

    return results
  }, [uploadImage])

  return {
    uploadImage,
    uploadImages,
    isUploading,
    uploadProgress,
    error,
    clearError
  }
}
