"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { ImageGrid } from "@/components/image-grid"
import { OptimizedImageGrid } from "@/components/optimized-image-grid"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { PerformanceSettings } from "@/components/performance-settings"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { LayoutDebug } from "@/components/layout-debug"
import { Pagination, usePagination } from "@/components/pagination"
import { AdminForm } from "@/components/admin-form"
import { PasswordModal } from "@/components/password-modal"
import { CategoryFilter } from "@/components/category-filter"
import { useUrlState } from "@/hooks/use-url-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "react-hot-toast"
import { Settings, Image as ImageIcon, Sparkles } from "lucide-react"
import type { ImageWithPrompt } from "@/types/types"
import { imageData } from "@/lib/image-data"

function HomeContent() {
  const [images, setImages] = useState<ImageWithPrompt[]>(imageData)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [useOptimizedGrid, setUseOptimizedGrid] = useState(true)
  const [enableVirtualization, setEnableVirtualization] = useState(true)
  const [usePaginationMode, setUsePaginationMode] = useState(false)

  const {
    category: selectedCategory,
    search: searchQuery,
    view: viewMode,
    setCategory: setSelectedCategory,
    setSearch: setSearchQuery,
    setView: setViewMode,
    clearFilters,
    getShareUrl,
    hasActiveFilters
  } = useUrlState()

  // 筛选图片
  const filteredImages = useMemo(() => {
    let filtered = images

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(image => image.category === selectedCategory)
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(image =>
        image.prompt.toLowerCase().includes(query) ||
        (image.tags && image.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    return filtered
  }, [images, selectedCategory, searchQuery])

  // 分页逻辑
  const {
    currentPage,
    totalPages,
    pageSize,
    currentItems: paginatedImages,
    handlePageChange,
    handlePageSizeChange,
    totalItems
  } = usePagination(filteredImages, 24)

  // 决定显示哪些图片
  const displayImages = usePaginationMode ? paginatedImages : filteredImages

  // 自动启用虚拟化的阈值
  useEffect(() => {
    if (filteredImages.length > 100) {
      setEnableVirtualization(true)
    } else if (filteredImages.length < 50) {
      setEnableVirtualization(false)
    }
  }, [filteredImages.length])

  const handlePasswordSubmit = (password: string) => {
    if (password === "admin123") {
      setIsAdmin(true)
    }
    setShowPasswordModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 现代化顶部导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 hover:scale-105 transition-transform duration-200">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  AI 提示词图片库
                </h1>
                <p className="text-sm text-slate-500">探索创意，激发灵感</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:flex bg-slate-100 text-slate-700">
                {filteredImages.length} / {images.length} 张图片
              </Badge>
              <Button
                onClick={() => setShowPasswordModal(true)}
                variant="outline"
                className="gap-2 hover:bg-slate-50 hover:scale-105 transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                管理员
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 pb-32">
        {isAdmin ? (
          <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100/80 backdrop-blur-sm">
                <TabsTrigger value="gallery" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <ImageIcon className="h-4 w-4" />
                  图片库
                </TabsTrigger>
                <TabsTrigger value="manage" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Settings className="h-4 w-4" />
                  管理
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="gallery" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                <LayoutWrapper>
                  <div className="space-y-6">
                    <CategoryFilter
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      totalCount={images.length}
                      filteredCount={filteredImages.length}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      onClearFilters={clearFilters}
                      getShareUrl={getShareUrl}
                      images={images}
                    />
                    {useOptimizedGrid ? (
                      <>
                        <OptimizedImageGrid
                          images={displayImages}
                          viewMode={viewMode}
                          enableVirtualization={enableVirtualization && !usePaginationMode}
                        />
                        {usePaginationMode && (
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                          />
                        )}
                      </>
                    ) : (
                      <ImageGrid images={displayImages} viewMode={viewMode} />
                    )}
                  </div>
                </LayoutWrapper>
              </TabsContent>
              
              <TabsContent value="manage" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                <AdminForm
                  images={images}
                  setImages={setImages}
                  onLogout={() => setIsAdmin(false)}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <LayoutWrapper className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalCount={images.length}
                filteredCount={filteredImages.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onClearFilters={clearFilters}
                getShareUrl={getShareUrl}
                images={images}
              />
              {useOptimizedGrid ? (
                <>
                  <OptimizedImageGrid
                    images={displayImages}
                    viewMode={viewMode}
                    enableVirtualization={enableVirtualization && !usePaginationMode}
                  />
                  {usePaginationMode && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={totalItems}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  )}
                </>
              ) : (
                <ImageGrid images={displayImages} viewMode={viewMode} />
              )}
            </div>
          </LayoutWrapper>
        )}
      </main>

      {/* 性能监控 */}
      <PerformanceMonitor
        totalItems={filteredImages.length}
        visibleItems={usePaginationMode ? paginatedImages.length : filteredImages.length}
        isVirtualized={enableVirtualization && !usePaginationMode}
      />

      {/* 性能设置 */}
      <PerformanceSettings
        useOptimizedGrid={useOptimizedGrid}
        onUseOptimizedGridChange={setUseOptimizedGrid}
        enableVirtualization={enableVirtualization}
        onEnableVirtualizationChange={setEnableVirtualization}
        usePaginationMode={usePaginationMode}
        onUsePaginationModeChange={setUsePaginationMode}
        totalItems={filteredImages.length}
      />

      {/* 滚动指示器 */}
      <ScrollIndicator />

      {/* 布局调试工具 (仅开发环境) */}
      <LayoutDebug />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
      />

      <Toaster 
        position="bottom-center"
        toastOptions={{
          className: 'backdrop-blur-sm bg-white/90 border border-slate-200 shadow-xl',
          duration: 3000,
          style: {
            borderRadius: '12px',
          }
        }}
      />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
