"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lock, Shield } from "lucide-react"

interface PasswordModalProps {
  isOpen: boolean
  onSubmit: (password: string) => void
  onClose: () => void
}

export function PasswordModal({ isOpen, onSubmit, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(password)
    setPassword("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-slate-200 animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-800">管理员验证</DialogTitle>
          <p className="text-sm text-slate-500">请输入管理员密码以继续</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                placeholder="请输入管理员密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                <Lock className="h-3 w-3 mr-1" />
                安全验证
              </Badge>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-slate-50 transition-all duration-200"
            >
              取消
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
              disabled={!password.trim()}
            >
              验证登录
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
