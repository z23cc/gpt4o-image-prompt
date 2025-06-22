import { NextRequest, NextResponse } from 'next/server'
import { createOSSClient, generateFileName, getPublicUrl, handleOSSError, DEFAULT_UPLOAD_OPTIONS } from '@/lib/oss-config'

// 设置 API 路由的最大执行时间为 30 秒
export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    // 解析表单数据
    const formData = await request.formData()
    const file = formData.get('file') as File
    const prefix = formData.get('prefix') as string || 'image-generator'
    
    if (!file) {
      return NextResponse.json(
        { error: '没有找到上传的文件' },
        { status: 400 }
      )
    }

    // 验证文件
    if (file.size > DEFAULT_UPLOAD_OPTIONS.maxSize!) {
      return NextResponse.json(
        { error: `文件大小超过限制 (${Math.round(DEFAULT_UPLOAD_OPTIONS.maxSize! / 1024 / 1024)}MB)` },
        { status: 400 }
      )
    }

    if (!DEFAULT_UPLOAD_OPTIONS.allowedTypes!.includes(file.type)) {
      return NextResponse.json(
        { error: `不支持的文件类型: ${file.type}` },
        { status: 400 }
      )
    }

    // 创建OSS客户端
    const ossClient = createOSSClient()
    
    // 生成文件名
    const fileName = generateFileName(file.name, prefix)
    
    // 将文件转换为Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // 上传到OSS
    const result = await ossClient.put(fileName, buffer, {
      headers: {
        'Content-Type': file.type,
        'Cache-Control': 'public, max-age=31536000', // 缓存1年
      }
    })

    // 获取公共访问URL
    const publicUrl = getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      data: {
        fileName,
        url: publicUrl,
        size: file.size,
        type: file.type,
        uploadTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    const errorMessage = handleOSSError(error)
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// 获取上传配置信息
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      config: {
        maxSize: DEFAULT_UPLOAD_OPTIONS.maxSize,
        allowedTypes: DEFAULT_UPLOAD_OPTIONS.allowedTypes,
        maxSizeMB: Math.round(DEFAULT_UPLOAD_OPTIONS.maxSize! / 1024 / 1024)
      }
    })
  } catch (error) {
    console.error('Get upload config error:', error)
    
    return NextResponse.json(
      { error: '获取上传配置失败' },
      { status: 500 }
    )
  }
}
