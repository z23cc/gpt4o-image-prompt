import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// 设置 API 路由的最大执行时间为 60 秒 (Vercel Hobby 计划限制)
export const maxDuration = 60

// 初始化 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
})

// 从环境变量获取模型配置
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'dall-e-3'

// 简单的生成记录存储
interface GenerationRecord {
  id: string
  prompt: string
  imageUrl: string
  localPath: string
  parameters: {
    size: string
    quality: string
    style: string
  }
  model: string
  apiProvider: string
  baseURL: string
  createdAt: string
  status: 'completed' | 'failed'
}

interface GenerateRequest {
  prompt: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
}

// 简单的配额检查（基于 IP 或 session）
const dailyGenerations = new Map<string, { count: number; date: string }>()
const DAILY_LIMIT = 10 // 每日免费生成限制

function checkDailyLimit(identifier: string): boolean {
  const today = new Date().toDateString()
  const userStats = dailyGenerations.get(identifier)

  if (!userStats || userStats.date !== today) {
    dailyGenerations.set(identifier, { count: 0, date: today })
    return true
  }

  return userStats.count < DAILY_LIMIT
}

function incrementDailyCount(identifier: string): void {
  const today = new Date().toDateString()
  const userStats = dailyGenerations.get(identifier) || { count: 0, date: today }
  userStats.count += 1
  dailyGenerations.set(identifier, userStats)
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()
    const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid' } = body

    // 验证输入
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: '提示词不能为空' },
        { status: 400 }
      )
    }

    if (prompt.length > 4000) {
      return NextResponse.json(
        { error: '提示词长度不能超过4000字符' },
        { status: 400 }
      )
    }

    // 简单的配额检查（基于 IP）
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkDailyLimit(clientIP)) {
      return NextResponse.json(
        { error: `每日生成限制为 ${DAILY_LIMIT} 张，请明天再试` },
        { status: 429 }
      )
    }

    // 生成唯一ID
    const generationId = uuidv4()

    // 调用 OpenAI API
    const response = await openai.images.generate({
      model: IMAGE_MODEL,
      prompt,
      size,
      quality,
      style,
      n: 1,
    })

    const imageUrl = response.data[0]?.url
    if (!imageUrl) {
      throw new Error('未收到图片URL')
    }

    // 下载并存储图片到本地
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()

    // 确保目录存在
    const uploadsDir = path.join(process.cwd(), 'public', 'generated')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // 保存图片到本地
    const fileName = `${generationId}.png`
    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, Buffer.from(imageBuffer))

    const storedImageUrl = `/generated/${fileName}`

    // 保存生成记录到 JSON 文件
    const record: GenerationRecord = {
      id: generationId,
      prompt,
      imageUrl: storedImageUrl,
      localPath: filePath,
      parameters: { size, quality, style },
      model: IMAGE_MODEL,
      apiProvider: 'openai',
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      createdAt: new Date().toISOString(),
      status: 'completed'
    }

    // 保存到历史记录文件
    const historyPath = path.join(process.cwd(), 'data', 'generation-history.json')
    const historyDir = path.dirname(historyPath)
    if (!existsSync(historyDir)) {
      await mkdir(historyDir, { recursive: true })
    }

    let history: GenerationRecord[] = []
    try {
      if (existsSync(historyPath)) {
        const fileContent = await readFile(historyPath, 'utf-8')
        history = JSON.parse(fileContent)
      }
    } catch {
      // 文件不存在或解析失败，使用空数组
    }

    history.unshift(record) // 最新的在前面
    history = history.slice(0, 1000) // 只保留最近1000条记录

    await writeFile(historyPath, JSON.stringify(history, null, 2))

    // 增加使用计数
    incrementDailyCount(clientIP)

    return NextResponse.json({
      success: true,
      data: {
        generationId,
        imageUrl: storedImageUrl,
        prompt,
        parameters: { size, quality, style },
        remainingGenerations: DAILY_LIMIT - (dailyGenerations.get(clientIP)?.count || 0)
      }
    })

  } catch (error) {
    console.error('Generation error:', error)

    // 提供更详细的错误信息用于调试
    let errorMessage = '图片生成失败，请稍后重试'
    let statusCode = 500

    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })

      // 根据错误类型提供更具体的错误信息
      if (error.message.includes('API key')) {
        errorMessage = 'API Key 配置错误'
        statusCode = 401
      } else if (error.message.includes('model')) {
        errorMessage = `模型 "${IMAGE_MODEL}" 不支持或配置错误`
        statusCode = 400
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        errorMessage = 'API 配额不足或账单问题'
        statusCode = 402
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = '网络连接错误，请检查网络设置'
        statusCode = 503
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined,
        config: process.env.NODE_ENV === 'development' ? {
          model: IMAGE_MODEL,
          baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
        } : undefined
      },
      { status: statusCode }
    )
  }
}

// 获取生成历史
export async function GET(request: NextRequest) {
  try {
    const historyPath = path.join(process.cwd(), 'data', 'generation-history.json')

    let history: GenerationRecord[] = []
    try {
      if (existsSync(historyPath)) {
        const fileContent = await readFile(historyPath, 'utf-8')
        history = JSON.parse(fileContent)
      }
    } catch {
      // 文件不存在或解析失败，返回空数组
    }

    // 只返回最近50条记录
    const recentHistory = history.slice(0, 50).map(record => ({
      id: record.id,
      prompt: record.prompt,
      imageUrl: record.imageUrl,
      parameters: record.parameters,
      createdAt: record.createdAt
    }))

    return NextResponse.json({
      success: true,
      data: recentHistory
    })

  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: '获取历史记录失败' },
      { status: 500 }
    )
  }
}
