import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 获取当前配置信息
    const config = {
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
      apiProvider: 'openai',
      features: {
        sizes: ['1024x1024', '1792x1024', '1024x1792'],
        qualities: ['standard', 'hd'],
        styles: ['vivid', 'natural']
      }
    }

    // 根据模型类型返回不同的显示名称
    const getModelDisplayName = (model: string) => {
      switch (model) {
        case 'dall-e-3':
          return 'DALL-E 3'
        case 'gpt-image-1':
          return 'GPT-Image-1'
        default:
          return model.toUpperCase()
      }
    }

    // 根据 baseURL 判断是否为自定义端点
    const isCustomEndpoint = config.baseURL !== 'https://api.openai.com/v1'

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        displayName: getModelDisplayName(config.model),
        isCustomEndpoint,
        endpoint: config.baseURL.replace('/v1', '').replace('https://', ''),
        description: isCustomEndpoint 
          ? `基于 ${getModelDisplayName(config.model)} 模型的强大图片生成能力`
          : `使用 OpenAI ${getModelDisplayName(config.model)} 模型生成高质量图片`
      }
    })

  } catch (error) {
    console.error('Config fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '获取配置信息失败' 
      },
      { status: 500 }
    )
  }
}
