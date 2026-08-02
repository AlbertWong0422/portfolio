import { reactive } from 'vue'
import { siteConfig } from './config.js'
import { api } from './api.js'

// 响应式站点数据，前台所有组件从这里读取
// 启动时从 API 拉最新数据，失败则降级到 config.js 静态数据
export const siteData = reactive({
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  title: [...siteConfig.title],
  heroSubtitle: siteConfig.heroSubtitle,
  bio: [...siteConfig.bio],
  location: siteConfig.location,
  responseTime: siteConfig.responseTime,
  serviceTypes: siteConfig.serviceTypes,
  email: siteConfig.email,
  stats: [...siteConfig.stats],
  tags: [...siteConfig.tags],
  socials: [...siteConfig.socials],
})

export async function loadSiteData() {
  try {
    const p = await api.getProfile()
    if (!p) return

    if (p.name) siteData.name = p.name
    if (p.tagline) siteData.tagline = p.tagline
    if (p.title_1 || p.title_2 || p.title_3) {
      siteData.title = [p.title_1 || '', p.title_2 || '', p.title_3 || '']
    }
    if (p.hero_subtitle) siteData.heroSubtitle = p.hero_subtitle
    if (p.bio_1 || p.bio_2 || p.bio_3) {
      siteData.bio = [p.bio_1, p.bio_2, p.bio_3].filter(Boolean)
    }
    if (p.location) siteData.location = p.location
    if (p.response_time) siteData.responseTime = p.response_time
    if (p.service_types) siteData.serviceTypes = p.service_types
    if (p.email) siteData.email = p.email
    if (p.stat_1_num) {
      siteData.stats = [
        { num: p.stat_1_num, desc: p.stat_1_desc || '' },
        { num: p.stat_2_num, desc: p.stat_2_desc || '' },
        { num: p.stat_3_num, desc: p.stat_3_desc || '' },
      ]
    }
    if (p.tags) {
      try { siteData.tags = typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags } catch {}
    }
    if (p.socials) {
      try { siteData.socials = typeof p.socials === 'string' ? JSON.parse(p.socials) : p.socials } catch {}
    }
  } catch {
    // API 不可用，保留 config.js 默认值
  }
}
