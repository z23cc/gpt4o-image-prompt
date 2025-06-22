import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的提示词' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    const baseURL = process.env.OPENAI_BASE_URL
    const model = process.env.OPENAI_TEXT_MODEL || 'gpt-4o'

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key 未配置' },
        { status: 500 }
      )
    }

    // 构建优化提示词的系统提示
    const systemPrompt = `你是一个专业的AI图像生成提示词优化专家。你的任务是优化用户提供的提示词，使其更适合AI图像生成模型（如DALL-E、Midjourney等）。

优化原则：
1. 保持原意不变，但让描述更加具体和生动
2. 添加适当的艺术风格、光线、构图等专业术语
3. 确保提示词结构清晰，易于AI理解
4. 适当增加细节描述，但避免过于冗长
5. 使用专业的摄影和艺术术语
6. 如果是中文提示词，保持中文输出；如果是英文提示词，保持英文输出

请直接返回优化后的提示词，不要添加任何解释或额外文字。`

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `请优化以下提示词：\n\n${prompt}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API Error:', errorData)
      return NextResponse.json(
        { error: '提示词优化失败，请稍后重试' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const optimizedPrompt = data.choices?.[0]?.message?.content?.trim()

    if (!optimizedPrompt) {
      return NextResponse.json(
        { error: '未能生成优化后的提示词' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      originalPrompt: prompt,
      optimizedPrompt: optimizedPrompt,
      success: true
    })

  } catch (error) {
    console.error('Prompt optimization error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
