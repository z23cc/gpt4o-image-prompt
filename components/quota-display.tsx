"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Crown, 
  Star, 
  TrendingUp,
  Clock,
  Gift
} from 'lucide-react'

interface UserQuota {
  userId: string
  subscriptionType: 'guest' | 'free' | 'premium' | 'pro'
  creditsRemaining: number
  dailyLimit: number
  hdCreditsRemaining: number
  hdDailyLimit: number
  resetTime: string
}

interface QuotaDisplayProps {
  quota: UserQuota
  onUpgrade?: () => void
}

export function QuotaDisplay({ quota, onUpgrade }: QuotaDisplayProps) {
  const [timeUntilReset, setTimeUntilReset] = useState('')

  // 计算重置倒计时
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const reset = new Date(quota.resetTime)
      const diff = reset.getTime() - now.getTime()
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntilReset(`${hours}小时${minutes}分钟`)
      } else {
        setTimeUntilReset('即将重置')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // 每分钟更新

    return () => clearInterval(interval)
  }, [quota.resetTime])

  const getSubscriptionInfo = () => {
    switch (quota.subscriptionType) {
      case 'guest':
        return {
          name: '游客',
          icon: <Gift className="h-4 w-4" />,
          color: 'bg-gray-500',
          description: '注册即可获得更多配额'
        }
      case 'free':
        return {
          name: '免费用户',
          icon: <Star className="h-4 w-4" />,
          color: 'bg-blue-500',
          description: '升级获得更多功能'
        }
      case 'premium':
        return {
          name: '高级用户',
          icon: <Zap className="h-4 w-4" />,
          color: 'bg-purple-500',
          description: '享受优先生成队列'
        }
      case 'pro':
        return {
          name: '专业用户',
          icon: <Crown className="h-4 w-4" />,
          color: 'bg-yellow-500',
          description: '无限制专业功能'
        }
      default:
        return {
          name: '未知',
          icon: <Star className="h-4 w-4" />,
          color: 'bg-gray-500',
          description: ''
        }
    }
  }

  const subscriptionInfo = getSubscriptionInfo()
  const standardProgress = (quota.creditsRemaining / quota.dailyLimit) * 100
  const hdProgress = quota.hdDailyLimit > 0 ? (quota.hdCreditsRemaining / quota.hdDailyLimit) * 100 : 0

  const isLowQuota = quota.creditsRemaining <= quota.dailyLimit * 0.2
  const isOutOfQuota = quota.creditsRemaining === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* 用户等级显示 */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-slate-50 to-slate-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${subscriptionInfo.color} rounded-lg text-white`}>
                {subscriptionInfo.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">
                    {subscriptionInfo.name}
                  </span>
                  {quota.subscriptionType !== 'guest' && quota.subscriptionType !== 'free' && (
                    <Badge variant="secondary" className="text-xs">
                      付费用户
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  {subscriptionInfo.description}
                </p>
              </div>
            </div>
            
            {(quota.subscriptionType === 'guest' || quota.subscriptionType === 'free') && (
              <Button
                onClick={onUpgrade}
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <TrendingUp className="h-4 w-4" />
                升级
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 配额详情 */}
      <Card className={`border-0 shadow-md ${isOutOfQuota ? 'bg-red-50 border-red-200' : isLowQuota ? 'bg-yellow-50 border-yellow-200' : 'bg-white'}`}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-800">今日配额</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              {timeUntilReset}后重置
            </div>
          </div>

          {/* 标准图片配额 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">标准图片</span>
              <span className="text-sm text-slate-600">
                {quota.creditsRemaining} / {quota.dailyLimit}
              </span>
            </div>
            <Progress 
              value={standardProgress} 
              className={`h-2 ${isOutOfQuota ? 'bg-red-100' : isLowQuota ? 'bg-yellow-100' : ''}`}
            />
            {isOutOfQuota && (
              <p className="text-xs text-red-600">
                今日配额已用完，请明天再来或升级账户
              </p>
            )}
            {isLowQuota && !isOutOfQuota && (
              <p className="text-xs text-yellow-600">
                配额即将用完，建议升级账户
              </p>
            )}
          </div>

          {/* 高清图片配额 */}
          {quota.hdDailyLimit > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">高清图片</span>
                <span className="text-sm text-slate-600">
                  {quota.hdCreditsRemaining} / {quota.hdDailyLimit}
                </span>
              </div>
              <Progress value={hdProgress} className="h-2" />
            </div>
          )}

          {/* 升级提示 */}
          {quota.subscriptionType === 'guest' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <Gift className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">注册即送10张免费配额！</p>
                  <p className="text-blue-600 mt-1">
                    注册用户还可以保存生成历史，永不丢失创作记录
                  </p>
                </div>
              </div>
            </div>
          )}

          {quota.subscriptionType === 'free' && isLowQuota && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-purple-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-purple-800">升级高级版，享受更多特权！</p>
                  <ul className="text-purple-600 mt-1 space-y-1">
                    <li>• 每日100张标准图片</li>
                    <li>• 50张高清图片</li>
                    <li>• 优先生成队列</li>
                    <li>• 批量生成功能</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用统计 */}
      <Card className="border-0 shadow-md bg-white">
        <CardContent className="p-4">
          <h3 className="font-medium text-slate-800 mb-3">本月使用统计</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">156</div>
              <div className="text-sm text-slate-500">已生成图片</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">¥12.8</div>
              <div className="text-sm text-slate-500">节省费用</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// 配额管理 Hook
export function useUserQuota(userId?: string) {
  const [quota, setQuota] = useState<UserQuota | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      // 游客模式
      setQuota({
        userId: 'guest',
        subscriptionType: 'guest',
        creditsRemaining: 3,
        dailyLimit: 3,
        hdCreditsRemaining: 0,
        hdDailyLimit: 0,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      setLoading(false)
      return
    }

    // 获取用户配额信息
    const fetchQuota = async () => {
      try {
        const response = await fetch(`/api/user/quota?userId=${userId}`)
        if (!response.ok) {
          throw new Error('获取配额信息失败')
        }
        const data = await response.json()
        setQuota(data.quota)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }

    fetchQuota()
  }, [userId])

  const refreshQuota = async () => {
    if (!userId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/user/quota?userId=${userId}`)
      if (!response.ok) {
        throw new Error('刷新配额信息失败')
      }
      const data = await response.json()
      setQuota(data.quota)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  return {
    quota,
    loading,
    error,
    refreshQuota
  }
}
