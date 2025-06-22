import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 获取环境变量信息（不包含敏感信息）
    const config = {
      nodeEnv: process.env.NODE_ENV,
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      cwd: process.cwd(),
      platform: process.platform,
      nodeVersion: process.version,
    }

    return NextResponse.json({
      success: true,
      config,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}
