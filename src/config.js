/**
 * 站点全局配置
 * 修改此文件即可定制网站内容与行为
 */

export const siteConfig = {
  // ── 个人信息 ──────────────────────────────
  name: 'YourName',
  tagline: 'Visual Creator',
  title: ['CREATING', 'Meaningful', 'VISUALS'],
  bio: [
    '你好，我是一名专注于<strong>视觉叙事</strong>的创作者。六年来，我用镜头与设计探索光影、空间与情感之间的关系，相信每一张图像都应该有其存在的理由。',
    '我的工作横跨商业摄影、品牌视觉与出版排版，服务过快消、时尚、文化等多个行业的客户。',
    '工作之外，我热衷于胶片摄影、黑胶收藏，以及一切与缓慢生活有关的事物。',
  ],
  location: '上海，中国',
  responseTime: '通常 24h 内回复',
  serviceTypes: '商业摄影 · 品牌视觉 · 咨询',
  email: 'hello@yourname.com',
  heroSubtitle: '摄影师 & 视觉设计师，专注于商业摄影、品牌视觉与创意排版。',
  stats: [
    { num: '120+', desc: '作品完成' },
    { num: '6',    desc: '年经验' },
    { num: '40+',  desc: '客户合作' },
  ],
  tags: ['#商业摄影', '#品牌视觉', '#杂志排版', '#纪实影像', '#胶片', '#创意总监'],
  socials: [
    { name: 'Instagram', url: '#', icon: 'instagram' },
    { name: 'Behance',   url: '#', icon: 'behance' },
    { name: 'LinkedIn',  url: '#', icon: 'linkedin' },
    { name: '微博',       url: '#', icon: 'weibo' },
  ],

  // ── 外观控制 ──────────────────────────────
  ui: {
    /**
     * 毛玻璃效果开关
     * true  = 导航栏/灯箱启用 backdrop-filter blur
     * false = 退回纯色背景，避免遮挡内容
     */
    glassmorphism: false,
  },

  // ── 作品集 ────────────────────────────────
  works: [
    { id: 1, category: 'photo',        title: '城市光影',     img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',  featured: true },
    { id: 2, category: 'design',       title: '品牌视觉系统', img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=450&fit=crop' },
    { id: 3, category: 'illustration', title: '抽象系列 Vol.1', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=450&fit=crop' },
    { id: 4, category: 'photo',        title: '人像纪实',     img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=450&fit=crop' },
    { id: 5, category: 'design',       title: '杂志版式设计', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=450&fit=crop' },
    { id: 6, category: 'photo',        title: '建筑线条',     img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=800&fit=crop',  tall: true },
    { id: 7, category: 'illustration', title: '数字插画系列', img: 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=600&h=450&fit=crop' },
    { id: 8, category: 'other',        title: '动态影像截帧', img: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&h=450&fit=crop' },
    { id: 9, category: 'design',       title: '产品包装设计', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop' },
  ],

  // ── 简历 ──────────────────────────────────
  experience: [
    {
      year: '2022',
      role: '高级视觉设计师',
      org: '某创意品牌公司 — 全职',
      desc: '负责品牌视觉系统设计、商业摄影项目，主导多个头部品牌的视觉升级。',
    },
    {
      year: '2019',
      role: '视觉设计师',
      org: '某广告集团 — 全职',
      desc: '参与大型商业广告拍摄，负责后期调色与排版，服务消费品与时尚客户。',
    },
    {
      year: '2017',
      role: '自由摄影师',
      org: '独立接单 — Freelance',
      desc: '承接人像、产品、活动摄影，积累个人风格与客户网络。',
    },
  ],
  education: [
    { year: '2016', role: '视觉传达设计 学士', org: '某艺术学院', desc: '' },
  ],
  skills: [
    { name: '商业摄影',         pct: 95 },
    { name: 'Adobe Lightroom',  pct: 90 },
    { name: 'Adobe Photoshop',  pct: 88 },
    { name: '品牌视觉设计',     pct: 85 },
    { name: 'Adobe InDesign',   pct: 82 },
    { name: 'Figma',            pct: 75 },
    { name: '视频剪辑',         pct: 65 },
  ],
  tools: ['Lightroom', 'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Premiere Pro', 'Capture One', 'Midjourney'],
}
