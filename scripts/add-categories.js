// 为图片数据批量添加分类的脚本
const fs = require('fs');
const path = require('path');

// 分类映射规则
const categoryMapping = {
  // 3D渲染类
  '3d-render': [
    'q版', '3d', 'c4d', '渲染', '轴测', 'isometric', '立体', '微缩', 'miniature'
  ],
  // 像素艺术类
  'pixel-art': [
    '8位', '像素', 'pixel', '8bit', '复古游戏', 'arcade'
  ],
  // 海报设计类
  'poster-design': [
    '海报', 'poster', '宣传', '广告', '封面', 'cover', '促销', '小红书'
  ],
  // 产品设计类
  'product-design': [
    '包装', '产品', '手办', '收藏', '盒子', 'box', '包装盒', '商品', '设计'
  ],
  // 标志品牌类
  'logo-branding': [
    'logo', '标志', '品牌', 'brand', '商标', '徽章', 'badge'
  ],
  // 插画艺术类
  'illustration': [
    '插画', '漫画', '动漫', '手绘', '艺术', '绘画', 'anime', 'manga', '卡通'
  ],
  // 摄影风格类
  'photography': [
    '摄影', 'photo', '35mm', '照片', '写实', '真实', 'realistic'
  ],
  // 创意设计类
  'creative': [
    '创意', '超现实', '特效', '变形', '突破', '传送门', '气球', '涂鸦'
  ],
  // UI设计类
  'ui-design': [
    'ui', 'interface', '界面', '数字', 'digital', 'app', '网页'
  ]
};

// 根据提示词内容推断分类
function inferCategory(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        return category;
      }
    }
  }
  
  // 默认分类
  return 'creative';
}

// 根据提示词生成标签
function generateTags(prompt) {
  const tags = [];
  const lowerPrompt = prompt.toLowerCase();
  
  // 常见标签关键词
  const tagKeywords = {
    '3D': ['3d', 'q版', '立体'],
    '手办': ['手办', 'figure', '收藏'],
    '动漫': ['动漫', 'anime', '漫画'],
    '摄影': ['摄影', 'photo', '照片'],
    '海报': ['海报', 'poster', '宣传'],
    '像素': ['像素', 'pixel', '8位'],
    '创意': ['创意', '特效', '超现实'],
    '插画': ['插画', '手绘', '艺术'],
    '设计': ['设计', 'design', '包装']
  };
  
  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    for (const keyword of keywords) {
      if (lowerPrompt.includes(keyword)) {
        tags.push(tag);
        break;
      }
    }
  }
  
  return tags.slice(0, 4); // 最多4个标签
}

// 处理图片数据
function processImageData() {
  const filePath = path.join(__dirname, '../lib/image-data.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 匹配所有没有category字段的图片对象
  const regex = /{\s*id:\s*"(\d+)",\s*src:\s*"([^"]+)",\s*prompt:\s*"([^"]+)"\s*}/g;
  
  content = content.replace(regex, (match, id, src, prompt) => {
    const category = inferCategory(prompt);
    const tags = generateTags(prompt);
    
    return `{
    id: "${id}",
    src: "${src}",
    prompt: "${prompt}",
    category: "${category}",
    tags: ${JSON.stringify(tags)}
  }`;
  });
  
  fs.writeFileSync(filePath, content);
  console.log('Categories added successfully!');
}

processImageData();
