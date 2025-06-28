# 提示词图片库

一个展示创意图片和提示词的现代化图片库应用。

## 功能特性

- 🖼️ **图片展示**: 精美的图片网格和列表视图
- 🏷️ **分类管理**: 11个预定义分类，支持标签系统
- 🔍 **搜索功能**: 支持关键词和标签搜索
- 📱 **移动端优化**: 响应式设计，PWA支持
- ⚡ **性能优化**: 虚拟滚动，图片懒加载
- 📋 **一键复制**: 快速复制提示词到剪贴板
- 🎨 **现代化UI**: 基于Tailwind CSS和Radix UI

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS, Framer Motion
- **UI组件**: Radix UI
- **状态管理**: React Hooks
- **包管理**: pnpm

## 快速开始

1. 安装依赖
```bash
pnpm install
```

2. 启动开发服务器
```bash
pnpm dev
```

3. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   └── page.tsx           # 主页
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   └── *.tsx             # 功能组件
├── hooks/                # 自定义 Hooks
├── lib/                  # 工具库
├── types/                # TypeScript 类型定义
└── public/               # 静态资源
```

## 分类系统

项目包含11个预定义分类：
- 3D渲染
- 创意设计
- 插画艺术
- 产品设计
- 海报设计
- 摄影风格
- 人像摄影
- 标志品牌
- 像素艺术
- UI设计

## 开发

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

## 许可证

MIT License 