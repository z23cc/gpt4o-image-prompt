"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  Zap, 
  Wifi, 
  Battery,
  Signal,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react'
import { useEnhancedMobile, useSafeAreaDimensions, useMobilePerformance } from '@/hooks/use-safe-area'
import { usePerformanceMonitor, usePerformanceOptimization } from '@/hooks/use-performance-monitor'

interface MobileTestPanelProps {
  isVisible: boolean
  onToggle: () => void
}

export function MobileTestPanel({ isVisible, onToggle }: MobileTestPanelProps) {
  const [activeTab, setActiveTab] = useState<'device' | 'performance' | 'features'>('device')
  
  // Hooks
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    isTouchDevice, 
    orientation, 
    screenSize 
  } = useEnhancedMobile()
  
  const { 
    safeHeight, 
    safeWidth, 
    insets, 
    isIOS, 
    hasNotch 
  } = useSafeAreaDimensions()
  
  const { 
    performanceMode, 
    shouldUseVirtualization, 
    shouldPreloadImages, 
    maxConcurrentImages 
  } = useMobilePerformance()
  
  const { metrics } = usePerformanceMonitor()
  const { suggestions, performanceLevel } = usePerformanceOptimization()

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="h-4 w-4" />
    if (isTablet) return <Monitor className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  const getPerformanceLevelColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'fair': return 'bg-yellow-500'
      case 'poor': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const DeviceInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">设备类型</div>
          <div className="flex items-center gap-2">
            {getDeviceIcon()}
            <span className="text-sm">
              {isMobile ? '手机' : isTablet ? '平板' : '桌面'}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">触摸支持</div>
          <Badge variant={isTouchDevice ? 'default' : 'secondary'}>
            {isTouchDevice ? '支持' : '不支持'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">屏幕方向</div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">{orientation === 'portrait' ? '竖屏' : '横屏'}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">屏幕尺寸</div>
          <Badge variant="outline">{screenSize}</Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700">安全区域</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>宽度: {safeWidth}px</div>
          <div>高度: {safeHeight}px</div>
          <div>顶部: {insets.top}px</div>
          <div>底部: {insets.bottom}px</div>
          <div>左侧: {insets.left}px</div>
          <div>右侧: {insets.right}px</div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {isIOS && <Badge variant="secondary">iOS</Badge>}
        {hasNotch && <Badge variant="secondary">刘海屏</Badge>}
      </div>
    </div>
  )

  const PerformanceInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">性能等级</div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPerformanceLevelColor(performanceLevel)}`} />
            <span className="text-sm capitalize">{performanceLevel}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">性能模式</div>
          <Badge variant="outline">{performanceMode}</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">FPS</div>
          <span className="text-sm">{metrics.fps}</span>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">内存使用</div>
          <span className="text-sm">{metrics.memoryUsage}MB</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-700">优化设置</div>
        <div className="space-y-1 text-xs">
          <div>虚拟化: {shouldUseVirtualization ? '启用' : '禁用'}</div>
          <div>预加载: {shouldPreloadImages ? '启用' : '禁用'}</div>
          <div>并发图片: {maxConcurrentImages}</div>
        </div>
      </div>
      
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-700">优化建议</div>
          <div className="space-y-1">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const FeaturesInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm">下拉刷新</span>
          <Badge variant={isMobile ? 'default' : 'secondary'}>
            {isMobile ? '支持' : '不支持'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm">触摸手势</span>
          <Badge variant={isTouchDevice ? 'default' : 'secondary'}>
            {isTouchDevice ? '支持' : '不支持'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm">PWA 安装</span>
          <Badge variant="default">支持</Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm">离线缓存</span>
          <Badge variant="default">支持</Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm">响应式布局</span>
          <Badge variant="default">支持</Badge>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <span className="text-sm">虚拟滚动</span>
          <Badge variant={shouldUseVirtualization ? 'default' : 'secondary'}>
            {shouldUseVirtualization ? '启用' : '禁用'}
          </Badge>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 切换按钮 */}
      <Button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 rounded-full p-0 safe-bottom"
        variant="outline"
      >
        {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </Button>

      {/* 测试面板 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-0 left-0 bottom-0 z-40 w-80 bg-white border-r border-slate-200 shadow-xl overflow-y-auto safe-all"
          >
            <Card className="h-full border-0 rounded-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  移动端测试面板
                </CardTitle>
                
                <div className="flex gap-1">
                  {(['device', 'performance', 'features'] as const).map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveTab(tab)}
                      className="text-xs"
                    >
                      {tab === 'device' && '设备'}
                      {tab === 'performance' && '性能'}
                      {tab === 'features' && '功能'}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                {activeTab === 'device' && <DeviceInfo />}
                {activeTab === 'performance' && <PerformanceInfo />}
                {activeTab === 'features' && <FeaturesInfo />}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
