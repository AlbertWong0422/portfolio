<template>
  <section class="hero" id="top">
    <div class="hero-inner">
      <div class="hero-text">
        <p class="hero-label">VISUAL CREATOR — 2026</p>
        <h1 class="hero-title">
          <span class="hero-line1">{{ config.title[0] }}</span>
          <span class="hero-line2"><em>{{ config.title[1] }}</em></span>
          <span class="hero-line3">{{ config.title[2] }}</span>
        </h1>
        <p class="hero-sub">{{ config.heroSubtitle }}</p>
        <a href="#work" class="btn-primary" @click.prevent="scrollTo('#work')">查看作品</a>
      </div>
      <div class="hero-image">
        <div class="hero-img-frame">
          <img :src="featuredImg" alt="精选作品" loading="eager" />
          <div class="hero-img-label">Featured Work #01</div>
        </div>
        <div class="hero-stats">
          <div class="stat" v-for="s in config.stats" :key="s.desc">
            <span class="stat-num">{{ s.num }}</span>
            <span class="stat-desc">{{ s.desc }}</span>
          </div>
        </div>
      </div>
    </div>
    <a href="#work" class="scroll-indicator" aria-label="向下滚动" @click.prevent="scrollTo('#work')">
      <span class="scroll-line"></span>
      <span class="scroll-text">SCROLL</span>
    </a>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { siteConfig } from '../config.js'
import { siteData } from '../store.js'

const config = siteData
const featuredImg = computed(() => siteConfig.works.find(w => w.featured)?.img || siteConfig.works[0]?.img)

function scrollTo(hash) {
  const el = document.querySelector(hash)
  if (!el) return
  const header = document.querySelector('.site-header')
  const offset = header?.offsetHeight || 0
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero-inner {
  max-width: 1280px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 4rem; align-items: center; width: 100%;
}
.hero-label { font-size: .7rem; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-xlight); margin-bottom: 1.5rem; }
.hero-title { font-family: var(--font-serif); line-height: .95; letter-spacing: -.03em; margin-bottom: 1.5rem; }
.hero-line1, .hero-line2, .hero-line3 { display: block; font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 700; }
.hero-line2 { font-style: italic; color: var(--accent); }
.hero-sub { font-size: 1rem; color: var(--ink-light); max-width: 36ch; margin-bottom: 2.5rem; line-height: 1.7; }

.hero-image { display: flex; flex-direction: column; gap: 1.5rem; }
.hero-img-frame { position: relative; border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 4/5; }
.hero-img-frame img { transition: transform .6s ease; }
.hero-img-frame:hover img { transform: scale(1.04); }
.hero-img-label {
  position: absolute; bottom: 1rem; left: 1rem;
  font-size: .65rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase;
  color: #fff; background: rgba(0,0,0,.55); padding: .35rem .7rem;
  border-radius: 2px; backdrop-filter: blur(6px);
}
.hero-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; }
.stat { display: flex; flex-direction: column; padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.stat-num { font-size: 1.75rem; font-weight: 700; font-family: var(--font-serif); line-height: 1; margin-bottom: .25rem; }
.stat-desc { font-size: .72rem; color: var(--ink-light); letter-spacing: .04em; }

.scroll-indicator {
  position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
  color: var(--ink-xlight); font-size: .6rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase;
}
.scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--ink-xlight), transparent); animation: scrollPulse 2s ease infinite; }
@keyframes scrollPulse {
  0%, 100% { opacity: 1; transform: scaleY(1) translateZ(0); transform-origin: top; }
  50%  { opacity: .3; transform: scaleY(.5) translateZ(0); transform-origin: top; }
}

@media (max-width: 768px) {
  .hero-inner { grid-template-columns: 1fr; gap: 2.5rem; }
  .hero-image { order: -1; }
  .hero-img-frame { aspect-ratio: 16/9; }
}
</style>
