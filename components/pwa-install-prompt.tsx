"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone, Monitor } from 'lucide-react'
import { useEnhancedMobile } from '@/hooks/use-safe-area'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const { isMobile } = useEnhancedMobile()

  useEffect(() => {
    // 检测是否已安装
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    // 检测 iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
      setIsIOS(isIOSDevice)
    }

    checkInstalled()
    checkIOS()

    // 监听 PWA 安装事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // 延迟显示提示，避免打断用户
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // 监听应用安装完成
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
      }
      
      setShowPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error('PWA installation failed:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // 24小时后再次显示
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // 检查是否在24小时内被关闭过
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      const hoursPassed = (now - dismissedTime) / (1000 * 60 * 60)
      
      if (hoursPassed < 24) {
        setShowPrompt(false)
        return
      }
    }
  }, [])

  // iOS 安装指引
  const IOSInstallGuide = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-blue-600">
        <Smartphone className="h-5 w-5" />
        <span className="font-medium">安装到主屏幕</span>
      </div>
      <div className="text-sm text-slate-600 space-y-2">
        <p>1. 点击浏览器底部的分享按钮 📤</p>
        <p>2. 选择"添加到主屏幕"</p>
        <p>3. 点击"添加"完成安装</p>
      </div>
    </div>
  )

  // Android/Desktop 安装
  const StandardInstallPrompt = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-blue-600">
        {isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
        <span className="font-medium">安装应用</span>
      </div>
      <p className="text-sm text-slate-600">
        将 AI 图片库安装到您的{isMobile ? '手机' : '电脑'}，享受更好的使用体验
      </p>
      <div className="flex gap-2">
        <Button onClick={handleInstall} className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          立即安装
        </Button>
        <Button variant="outline" onClick={handleDismiss}>
          稍后
        </Button>
      </div>
    </div>
  )

  if (isInstalled || !showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 safe-bottom"
      >
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4 max-w-sm mx-auto">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <span className="font-medium text-slate-800">AI 图片库</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isIOS ? <IOSInstallGuide /> : <StandardInstallPrompt />}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// PWA 状态指示器
export function PWAStatusIndicator() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    checkInstalled()
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isInstalled) return null

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${isOnline 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
        }
      `}>
        {isOnline ? '已连接' : '离线模式'}
      </div>
    </div>
  )
}
