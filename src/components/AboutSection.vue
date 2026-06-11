<template>
  <section class="section" id="about">
    <div class="section-inner">
      <header class="section-header">
        <div class="section-label">03 — ABOUT ME</div>
        <h2 class="section-title">关于我</h2>
      </header>

      <div class="about-grid">
        <div class="about-image fade-in">
          <div class="about-img-frame">
            <img src="https://picsum.photos/seed/portrait/500/600" alt="个人照片" loading="lazy" />
          </div>
          <div class="about-img-accent" aria-hidden="true"></div>
        </div>

        <div class="about-content">
          <p v-for="(para, i) in config.bio" :key="i"
             class="fade-in"
             :class="i === 0 ? 'about-intro' : 'about-body'"
             v-html="para"></p>

          <div class="about-tags fade-in">
            <span v-for="tag in config.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="about-socials fade-in">
            <a v-for="s in config.socials" :key="s.name" :href="s.url" class="social-link" :aria-label="s.name">
              <!-- instagram -->
              <svg v-if="s.icon === 'instagram'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              <!-- behance -->
              <svg v-else-if="s.icon === 'behance'" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 11a2.5 2.5 0 1 0 0-5H2v14h6a3 3 0 0 0 0-6H7.5zm-3-3.5H7a1 1 0 0 1 0 2H4.5V7.5zM4.5 17v-3H8a1.5 1.5 0 0 1 0 3H4.5zM15 8a5 5 0 1 0 0 10 5 5 0 0 0 4.5-2.75h-2.25A2.5 2.5 0 0 1 15 16.5a2.5 2.5 0 0 1-2.49-2.25H19.5A5 5 0 0 0 15 8zm-2.45 4a2.5 2.5 0 0 1 4.9 0h-4.9zM14 4h6v1.5h-6V4z"/></svg>
              <!-- linkedin -->
              <svg v-else-if="s.icon === 'linkedin'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>
              <!-- weibo fallback -->
              <svg v-else viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path fill="white" d="M8 12.5c0-1.4 1.8-2.5 4-2.5s4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5zm8-4.5a3 3 0 0 0-2.5-1c-.4 0-.7.3-.7.7s.3.7.7.7a1.6 1.6 0 0 1 1.6 1.6c0 .4.3.7.7.7s.7-.3.7-.7A3 3 0 0 0 16 8z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { siteConfig } from '../config.js'

const config = siteConfig

onMounted(() => {
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return
      e.target.style.transitionDelay = `${i * 60}ms`
      e.target.classList.add('visible')
      io.unobserve(e.target)
    })
  }, { threshold: 0.15 })
  document.querySelectorAll('#about .fade-in').forEach(el => io.observe(el))
})
</script>

<style scoped>
.about-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: var(--space-xl); align-items: center; }

.about-image { position: relative; }
.about-img-frame { aspect-ratio: 5/6; border-radius: var(--radius-lg); overflow: hidden; position: relative; z-index: 1; }
.about-img-frame img { transition: transform .6s ease; }
.about-img-frame:hover img { transform: scale(1.04); }
.about-img-accent { position: absolute; bottom: -1.5rem; right: -1.5rem; width: 70%; aspect-ratio: 1; border: 2px solid var(--accent); border-radius: var(--radius-lg); z-index: 0; }

.about-intro { font-family: var(--font-serif); font-size: clamp(1.1rem,2.5vw,1.4rem); line-height: 1.6; margin-bottom: 1.25rem; }
.about-body { font-size: .92rem; color: var(--ink-light); line-height: 1.75; margin-bottom: 1rem; }

.about-tags { display: flex; flex-wrap: wrap; gap: .4rem; margin: 1.5rem 0; }
.tag { padding: .3rem .8rem; border: 1.5px solid var(--border); border-radius: 999px; font-size: .72rem; font-weight: 600; color: var(--ink-light); transition: all .2s; cursor: default; }
.tag:hover { background: var(--accent); border-color: var(--accent); color: #fff; }

.about-socials { display: flex; gap: 1rem; margin-top: var(--space-sm); }
.social-link { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--border); border-radius: 50%; color: var(--ink-light); transition: all .2s; }
.social-link svg { width: 18px; height: 18px; }
.social-link:hover { border-color: var(--ink); color: var(--ink); transform: translateY(-2px); }

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; gap: var(--space-lg); }
  .about-img-accent { display: none; }
}
</style>
