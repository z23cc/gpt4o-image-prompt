export interface ImageWithPrompt {
  id?: string;
  src: string
  prompt: string
  category: string
  tags?: string[]
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部', description: '显示所有图片', color: 'bg-black' },
  { id: '3d-render', name: '3D渲染', description: '3D风格和Q版人物', color: 'bg-purple-700' },
  { id: 'creative', name: '创意设计', description: '创意概念和特殊效果', color: 'bg-orange-700' },
  { id: 'illustration', name: '插画艺术', description: '手绘风格和艺术插画', color: 'bg-pink-700' },
  { id: 'product-design', name: '产品设计', description: '产品包装和商业设计', color: 'bg-amber-700' },
  { id: 'poster-design', name: '海报设计', description: '海报、宣传图和封面设计', color: 'bg-red-700' },
  { id: 'photography', name: '摄影风格', description: '照片级真实感图片', color: 'bg-teal-700' },
  { id: 'portrait', name: '人像摄影', description: '专业肖像和人物摄影', color: 'bg-rose-700' },
  { id: 'logo-branding', name: '标志品牌', description: '标志设计和品牌相关', color: 'bg-indigo-700' },
  { id: 'pixel-art', name: '像素艺术', description: '8位像素风格图片', color: 'bg-green-700' },
  { id: 'ui-design', name: 'UI设计', description: '界面设计和数字产品', color: 'bg-cyan-700' }
]
