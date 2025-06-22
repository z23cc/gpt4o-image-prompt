// 图片处理工具函数

/**
 * 检查字符串是否为有效的URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

/**
 * 检查字符串是否为base64图片数据
 */
export function isBase64Image(string: string): boolean {
  return string.startsWith('data:image/')
}

/**
 * 从URL下载图片并转换为base64
 */
export async function downloadImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = response.headers.get('content-type') || 'image/png'
    
    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch (error) {
    console.error('Error downloading image:', error)
    throw new Error('Failed to download image from URL')
  }
}

/**
 * 处理图片数据，统一转换为base64格式
 */
export async function processImageData(imageData: string): Promise<string> {
  if (isBase64Image(imageData)) {
    // 已经是base64格式，直接返回
    return imageData
  } else if (isValidUrl(imageData)) {
    // 是URL，下载并转换为base64
    return await downloadImageAsBase64(imageData)
  } else {
    throw new Error('Invalid image data format')
  }
}

/**
 * 批量处理图片数据
 */
export async function processMultipleImages(images: Array<{
  data: string
  type: 'reference' | 'mask'
  isUrl?: boolean
}>): Promise<Array<{
  data: string
  type: 'reference' | 'mask'
  originalUrl?: string
}>> {
  const processedImages = []
  
  for (const image of images) {
    try {
      const originalUrl = isValidUrl(image.data) ? image.data : undefined
      const processedData = await processImageData(image.data)
      
      processedImages.push({
        data: processedData,
        type: image.type,
        originalUrl
      })
    } catch (error) {
      console.error(`Failed to process image of type ${image.type}:`, error)
      throw new Error(`Failed to process ${image.type} image`)
    }
  }
  
  return processedImages
}

/**
 * 验证图片文件大小（从base64估算）
 */
export function validateImageSize(base64Data: string, maxSizeMB: number = 10): boolean {
  try {
    // 移除data:image/...;base64,前缀
    const base64String = base64Data.split(',')[1] || base64Data
    
    // 计算原始文件大小（base64编码会增加约33%的大小）
    const sizeInBytes = (base64String.length * 3) / 4
    const sizeInMB = sizeInBytes / (1024 * 1024)
    
    return sizeInMB <= maxSizeMB
  } catch (error) {
    console.error('Error validating image size:', error)
    return false
  }
}

/**
 * 获取图片的基本信息
 */
export function getImageInfo(base64Data: string): {
  mimeType: string
  extension: string
  estimatedSize: number
} {
  try {
    const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,/)
    const mimeType = matches ? `image/${matches[1]}` : 'image/png'
    const extension = matches ? matches[1] : 'png'
    
    const base64String = base64Data.split(',')[1] || base64Data
    const estimatedSize = (base64String.length * 3) / 4
    
    return {
      mimeType,
      extension,
      estimatedSize
    }
  } catch (error) {
    console.error('Error getting image info:', error)
    return {
      mimeType: 'image/png',
      extension: 'png',
      estimatedSize: 0
    }
  }
}

/**
 * 为ChatGPT API准备图片数据
 * 注意：这个函数需要根据实际使用的API进行调整
 */
export function prepareImageForChatGPT(base64Data: string): {
  type: 'image_url'
  image_url: {
    url: string
    detail?: 'low' | 'high' | 'auto'
  }
} {
  return {
    type: 'image_url',
    image_url: {
      url: base64Data,
      detail: 'high'
    }
  }
}

/**
 * 构建包含图片的ChatGPT消息
 */
export function buildImageMessage(prompt: string, images: string[]): any {
  const content = [
    {
      type: 'text',
      text: prompt
    },
    ...images.map(imageData => prepareImageForChatGPT(imageData))
  ]

  return {
    role: 'user',
    content
  }
}

/**
 * 生成图片文件名
 */
export function generateImageFileName(prefix: string = 'generated', extension: string = 'png'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}.${extension}`
}
