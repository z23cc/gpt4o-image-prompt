"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

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
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>管理员验证</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              type="password"
              placeholder="请输入管理员密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">确认</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
