"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, Grid, List, Share2, Copy } from "lucide-react"
import toast from "react-hot-toast"
import { CATEGORIES, Category } from "@/types/types"
import { motion, AnimatePresence } from "framer-motion"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
  filteredCount: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  onClearFilters?: () => void
  getShareUrl?: () => string
  images?: any[] // 添加图片数据用于计算分类数量
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  viewMode,
  onViewModeChange,
  onClearFilters,
  getShareUrl,
  images = []
}: CategoryFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory)

  const clearFilters = () => {
    if (onClearFilters) {
      onClearFilters()
    } else {
      onCategoryChange('all')
      onSearchChange('')
    }
  }

  const shareCurrentView = () => {
    if (getShareUrl) {
      const url = getShareUrl()
      navigator.clipboard.writeText(url).then(() => {
        toast.success("分享链接已复制到剪贴板！", {
          icon: "🔗",
          style: {
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          },
        })
      }).catch(() => {
        toast.error("复制失败，请重试")
      })
    }
  }

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.length > 0

  // 计算每个分类的图片数量
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return images.length
    return images.filter(image => image.category === categoryId).length
  }

  return (
    <div className="w-full space-y-4">
      {/* 顶部统计和视图切换 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            显示 <span className="font-medium text-slate-900">{filteredCount}</span> / {totalCount} 张图片
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4 mr-1" />
              清除筛选
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && getShareUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={shareCurrentView}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              分享
            </Button>
          )}
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="搜索提示词..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* 分类筛选 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700">分类筛选</h3>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-1" />
              {isFilterOpen ? '收起' : '展开'}
            </Button>
          )}
        </div>

        {/* 桌面端：标签式筛选 */}
        <div className="hidden md:block">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="outline"
                  className={`cursor-pointer transition-all duration-200 border-0 ${
                    selectedCategory === category.id
                      ? `${category.color} hover:text-yellow-300 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-75`
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:border-slate-400'
                  }`}
                  style={{
                    color: selectedCategory === category.id ? 'white !important' : undefined
                  }}
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.name}
                  <span className="ml-1 text-xs opacity-75">
                    ({getCategoryCount(category.id)})
                  </span>
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 移动端：下拉选择 */}
        <div className="md:hidden">
          <AnimatePresence>
            {(isFilterOpen || !isMobile) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedCategoryData?.color || 'bg-gray-500'}`} />
                        {selectedCategoryData?.name || '选择分类'}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span>{category.name}</span>
                          {category.description && (
                            <span className="text-xs text-slate-500 ml-1">
                              - {category.description}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 当前筛选状态 */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="text-sm text-blue-700">
            当前筛选：
            {selectedCategory !== 'all' && (
              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
                {selectedCategoryData?.name}
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
                "{searchQuery}"
              </Badge>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
