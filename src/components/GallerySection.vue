<template>
  <section class="section" id="work">
    <div class="section-inner">
      <header class="section-header">
        <div class="section-label">01 — SELECTED WORKS</div>
        <h2 class="section-title">作品集</h2>
      </header>

      <div class="filter-bar" role="tablist" aria-label="作品分类">
        <button v-for="f in filters" :key="f.value"
                class="filter-btn" :class="{ active: activeFilter === f.value }"
                :aria-selected="activeFilter === f.value"
                role="tab"
                @click="setFilter(f.value)">
          {{ f.label }}
        </button>
      </div>

      <TransitionGroup name="gallery" tag="div" class="gallery-grid">
        <div v-for="(item, i) in visibleWorks" :key="item.id"
             class="gallery-item"
             :class="{ featured: item.featured, tall: item.tall }"
             @click="$emit('openLightbox', i, visibleWorks)">
          <div class="gallery-img-wrap">
            <img :src="item.img" :alt="item.title" loading="lazy" />
            <div class="gallery-overlay">
              <span class="gallery-cat">{{ categoryLabel(item.category) }}</span>
              <h3 class="gallery-name">{{ item.title }}</h3>
              <span class="gallery-icon">↗</span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { siteConfig } from '../config.js'

defineEmits(['openLightbox'])

const filters = [
  { value: 'all',          label: '全部' },
  { value: 'photo',        label: '摄影' },
  { value: 'design',       label: '设计' },
  { value: 'illustration', label: '插画' },
  { value: 'other',        label: '其他' },
]

const catMap = { photo: '摄影', design: '设计', illustration: '插画', other: '其他' }
const categoryLabel = (cat) => catMap[cat] || cat

const activeFilter = ref('all')
const visibleWorks = computed(() =>
  activeFilter.value === 'all'
    ? siteConfig.works
    : siteConfig.works.filter(w => w.category === activeFilter.value)
)

function setFilter(val) {
  activeFilter.value = val
}
</script>

<style scoped>
.filter-bar { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: var(--space-md); }
.filter-btn {
  padding: .5rem 1.25rem; font-size: .72rem; font-weight: 600; letter-spacing: .1em;
  text-transform: uppercase; border: 1.5px solid var(--border); border-radius: 999px;
  color: var(--ink-light); cursor: pointer; transition: all .2s ease; background: none;
}
.filter-btn:hover { border-color: var(--ink); color: var(--ink); }
.filter-btn.active { background: var(--ink); border-color: var(--ink); color: var(--bg); }

.gallery-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  grid-auto-rows: 300px; gap: 1rem;
}
.gallery-item { border-radius: var(--radius-md); overflow: hidden; cursor: pointer; }
.gallery-item.featured { grid-column: span 2; grid-row: span 2; }
.gallery-item.tall { grid-row: span 2; }

.gallery-img-wrap { position: relative; width: 100%; height: 100%; }
.gallery-img-wrap img { transition: transform .5s ease; }
.gallery-item:hover .gallery-img-wrap img { transform: scale(1.06); }

.gallery-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 60%);
  opacity: 0; display: flex; flex-direction: column; justify-content: flex-end;
  padding: 1.25rem; transition: opacity .3s ease;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-cat { font-size: .62rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin-bottom: .3rem; }
.gallery-name { font-family: var(--font-serif); font-size: 1.1rem; color: #fff; font-weight: 700; }
.gallery-icon { position: absolute; top: 1rem; right: 1rem; font-size: 1.2rem; color: #fff; opacity: 0; transform: translate(-4px,4px); transition: opacity .3s, transform .3s; }
.gallery-item:hover .gallery-icon { opacity: 1; transform: translate(0,0); }

/* TransitionGroup animation */
.gallery-enter-active, .gallery-leave-active { transition: opacity .3s ease, transform .3s ease; }
.gallery-enter-from, .gallery-leave-to { opacity: 0; transform: scale(.95); }
.gallery-leave-active { position: absolute; }

@media (max-width: 768px) {
  .gallery-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 220px; }
  .gallery-item.featured { grid-column: 1 / -1; grid-row: span 1; }
}
@media (max-width: 480px) {
  .gallery-grid { grid-template-columns: 1fr; grid-auto-rows: 260px; }
  .gallery-item.featured, .gallery-item.tall { grid-column: 1; grid-row: span 1; }
}
</style>
