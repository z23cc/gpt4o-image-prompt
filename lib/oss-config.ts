import OSS from 'ali-oss'

// OSS配置接口
export interface OSSConfig {
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  region: string
  endpoint: string
}

// 获取OSS配置
export function getOSSConfig(): OSSConfig {
  const config = {
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID!,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET!,
    bucket: process.env.ALIYUN_OSS_BUCKET!,
    region: process.env.ALIYUN_OSS_REGION!,
    endpoint: process.env.ALIYUN_OSS_ENDPOINT!,
  }

  // 验证配置完整性
  const missingKeys = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingKeys.length > 0) {
    throw new Error(`Missing OSS configuration: ${missingKeys.join(', ')}`)
  }

  return config
}

// 创建OSS客户端
export function createOSSClient(): OSS {
  const config = getOSSConfig()
  
  return new OSS({
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    region: config.region,
    endpoint: config.endpoint,
    secure: true, // 使用HTTPS
  })
}

// 生成唯一文件名
export function generateFileName(originalName: string, prefix: string = 'uploads'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${prefix}/${timestamp}-${random}.${extension}`
}

// 获取文件的公共访问URL
export function getPublicUrl(fileName: string): string {
  const config = getOSSConfig()
  return `https://${config.bucket}.${config.endpoint}/${fileName}`
}

// 文件上传选项
export interface UploadOptions {
  prefix?: string
  maxSize?: number // 最大文件大小（字节）
  allowedTypes?: string[] // 允许的文件类型
}

// 默认上传选项
export const DEFAULT_UPLOAD_OPTIONS: UploadOptions = {
  prefix: 'image-generator',
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}

// 验证文件
export function validateFile(file: File, options: UploadOptions = DEFAULT_UPLOAD_OPTIONS): void {
  // 检查文件大小
  if (options.maxSize && file.size > options.maxSize) {
    throw new Error(`文件大小超过限制 (${Math.round(options.maxSize / 1024 / 1024)}MB)`)
  }

  // 检查文件类型
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    throw new Error(`不支持的文件类型: ${file.type}`)
  }
}

// OSS错误处理
export function handleOSSError(error: any): string {
  console.error('OSS Error:', error)
  
  if (error.code) {
    switch (error.code) {
      case 'NoSuchBucket':
        return 'OSS存储桶不存在'
      case 'AccessDenied':
        return 'OSS访问权限不足'
      case 'InvalidAccessKeyId':
        return 'OSS访问密钥无效'
      case 'SignatureDoesNotMatch':
        return 'OSS签名验证失败'
      case 'RequestTimeTooSkewed':
        return 'OSS请求时间偏差过大'
      default:
        return `OSS错误: ${error.code}`
    }
  }
  
  return error.message || '上传失败，请稍后重试'
}
