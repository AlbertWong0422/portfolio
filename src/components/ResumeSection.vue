<template>
  <section class="section section--dark" id="resume">
    <div class="section-inner">
      <header class="section-header">
        <div class="section-label">02 — CURRICULUM VITAE</div>
        <h2 class="section-title">在线简历</h2>
      </header>

      <div class="resume-grid">
        <!-- 时间轴 -->
        <div class="timeline-col">
          <h3 class="col-title">工作经历</h3>
          <div class="timeline">
            <div v-for="item in config.experience" :key="item.year" class="tl-item fade-in">
              <div class="tl-year">{{ item.year }}</div>
              <div class="tl-dot"></div>
              <div class="tl-content">
                <h4 class="tl-role">{{ item.role }}</h4>
                <p class="tl-org">{{ item.org }}</p>
                <p v-if="item.desc" class="tl-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>

          <h3 class="col-title col-title--mt">教育背景</h3>
          <div class="timeline">
            <div v-for="item in config.education" :key="item.year" class="tl-item fade-in">
              <div class="tl-year">{{ item.year }}</div>
              <div class="tl-dot"></div>
              <div class="tl-content">
                <h4 class="tl-role">{{ item.role }}</h4>
                <p class="tl-org">{{ item.org }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 技能 -->
        <div class="skills-col">
          <h3 class="col-title">专业技能</h3>
          <div class="skills-list">
            <div v-for="skill in config.skills" :key="skill.name" class="skill-item fade-in" ref="skillItems">
              <div class="skill-info">
                <span>{{ skill.name }}</span>
                <span class="skill-pct">{{ skill.pct }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: animatedSkills[skill.name] + '%' }"></div>
              </div>
            </div>
          </div>

          <h3 class="col-title col-title--mt">软件工具</h3>
          <div class="tools-grid">
            <span v-for="t in config.tools" :key="t" class="tool-tag">{{ t }}</span>
          </div>
        </div>
      </div>

      <div class="resume-download fade-in">
        <a href="#" class="btn-outline" download>下载完整简历 PDF ↓</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { siteConfig } from '../config.js'

const config = siteConfig
const animatedSkills = reactive({})
config.skills.forEach(s => (animatedSkills[s.name] = 0))

const skillItems = ref([])
let io

onMounted(() => {
  io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      // find skill by position in DOM
      const idx = skillItems.value.indexOf(entry.target)
      if (idx !== -1) {
        const skill = config.skills[idx]
        setTimeout(() => { animatedSkills[skill.name] = skill.pct }, idx * 80)
      }
      io.unobserve(entry.target)
    })
  }, { threshold: 0.2 })

  skillItems.value.forEach(el => io.observe(el))

  // fade-in observer
  document.querySelectorAll('#resume .fade-in').forEach((el, i) => {
    const fadeIo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        e.target.style.transitionDelay = `${i * 50}ms`
        e.target.classList.add('visible')
        fadeIo.unobserve(e.target)
      })
    }, { threshold: 0.15 })
    fadeIo.observe(el)
  })
})

onUnmounted(() => io?.disconnect())
</script>

<style scoped>
.resume-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); }

.timeline { position: relative; }
.timeline::before { content: ''; position: absolute; left: 72px; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,.1); }

.tl-item { display: grid; grid-template-columns: 56px 32px 1fr; gap: 0 1rem; margin-bottom: var(--space-md); align-items: start; }
.tl-year { font-size: .7rem; font-weight: 700; letter-spacing: .08em; color: rgba(255,255,255,.3); padding-top: .2rem; text-align: right; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--accent); background: var(--bg-dark); margin: .2rem auto 0; position: relative; z-index: 1; }
.tl-role { font-size: .95rem; font-weight: 600; color: #fff; margin-bottom: .2rem; }
.tl-org { font-size: .78rem; color: rgba(255,255,255,.45); margin-bottom: .5rem; font-weight: 500; }
.tl-desc { font-size: .82rem; color: rgba(255,255,255,.55); line-height: 1.6; }

.skills-list { display: flex; flex-direction: column; gap: 1.25rem; }
.skill-info { display: flex; justify-content: space-between; font-size: .8rem; font-weight: 500; color: rgba(255,255,255,.75); margin-bottom: .4rem; }
.skill-pct { color: rgba(255,255,255,.35); font-size: .72rem; }
.skill-bar { height: 3px; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; }
.skill-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); border-radius: 2px; transition: width 1s cubic-bezier(0,.55,.45,1); }

.tools-grid { display: flex; flex-wrap: wrap; gap: .5rem; }
.tool-tag { padding: .35rem .85rem; border: 1px solid rgba(255,255,255,.15); border-radius: 999px; font-size: .72rem; font-weight: 500; color: rgba(255,255,255,.6); transition: border-color .2s, color .2s; cursor: default; }
.tool-tag:hover { border-color: var(--accent); color: var(--accent); }

.resume-download { margin-top: var(--space-lg); display: flex; justify-content: center; }

@media (max-width: 768px) {
  .resume-grid { grid-template-columns: 1fr; gap: var(--space-lg); }
  .timeline::before { left: 56px; }
}
</style>
