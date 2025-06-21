"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface UrlState {
  category: string
  search: string
  view: 'grid' | 'list'
}

export function useUrlState() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [state, setState] = useState<UrlState>({
    category: 'all',
    search: '',
    view: 'grid'
  })

  // 从URL参数初始化状态
  useEffect(() => {
    const category = searchParams.get('category') || 'all'
    const search = searchParams.get('search') || ''
    const view = (searchParams.get('view') as 'grid' | 'list') || 'grid'

    setState({
      category,
      search,
      view
    })
  }, [searchParams])

  // 更新URL参数
  const updateUrl = useCallback((newState: Partial<UrlState>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    
    // 更新参数
    Object.entries(newState).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })

    // 构建新的URL
    const search = current.toString()
    const query = search ? `?${search}` : ''
    
    // 使用replace避免在浏览器历史中创建过多条目
    router.replace(`/${query}`, { scroll: false })
  }, [router, searchParams])

  // 更新分类
  const setCategory = useCallback((category: string) => {
    const newState = { ...state, category }
    setState(newState)
    updateUrl({ category })
  }, [state, updateUrl])

  // 更新搜索
  const setSearch = useCallback((search: string) => {
    const newState = { ...state, search }
    setState(newState)
    updateUrl({ search })
  }, [state, updateUrl])

  // 更新视图模式
  const setView = useCallback((view: 'grid' | 'list') => {
    const newState = { ...state, view }
    setState(newState)
    updateUrl({ view })
  }, [state, updateUrl])

  // 清除所有筛选
  const clearFilters = useCallback(() => {
    const newState = { category: 'all', search: '', view: state.view }
    setState(newState)
    updateUrl({ category: 'all', search: '' })
  }, [state.view, updateUrl])

  // 获取分享URL
  const getShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    
    const current = new URLSearchParams()
    
    if (state.category !== 'all') {
      current.set('category', state.category)
    }
    if (state.search) {
      current.set('search', state.search)
    }
    if (state.view !== 'grid') {
      current.set('view', state.view)
    }

    const search = current.toString()
    const query = search ? `?${search}` : ''
    
    return `${window.location.origin}${window.location.pathname}${query}`
  }, [state])

  return {
    category: state.category,
    search: state.search,
    view: state.view,
    setCategory,
    setSearch,
    setView,
    clearFilters,
    getShareUrl,
    hasActiveFilters: state.category !== 'all' || state.search !== ''
  }
}
