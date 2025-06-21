import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 提示词图片库 - 探索创意，激发灵感',
  description: '精选 AI 生成图片与提示词集合，帮助您探索创意灵感，提升 AI 绘画技能',
  keywords: ['AI图片', '提示词', 'AI绘画', '创意灵感', 'GPT-4', 'DALL-E'],
  authors: [{ name: 'AI Gallery Team' }],
  creator: 'AI Gallery',
  publisher: 'AI Gallery',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'AI 提示词图片库',
    description: '精选 AI 生成图片与提示词集合',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI 提示词图片库',
    description: '精选 AI 生成图片与提示词集合',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        {/* 预连接到重要的第三方域名 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* PWA 图标 */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* 移动端优化 */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI图片库" />

        {/* 防止电话号码自动识别 */}
        <meta name="format-detection" content="telephone=no" />

        {/* 优化触摸延迟 */}
        <meta name="msapplication-tap-highlight" content="no" />

        {/* PWA 启动画面 */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <div id="root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
