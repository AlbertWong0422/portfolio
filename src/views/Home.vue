<template>
  <SiteHeader :activeSection="activeSection" :glass="config.ui.glassmorphism" />

  <main>
    <HeroSection />
    <GallerySection @openLightbox="openLightbox" />
    <ResumeSection />
    <AboutSection />
    <ContactSection />
  </main>

  <SiteFooter />

  <LightboxModal
    :items="lbItems"
    :index="lbIndex"
    :open="lbOpen"
    :glass="config.ui.glassmorphism"
    @close="lbOpen = false"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { siteConfig } from '../config.js'
import { loadSiteData } from '../store.js'

import SiteHeader     from '../components/SiteHeader.vue'
import HeroSection    from '../components/HeroSection.vue'
import GallerySection from '../components/GallerySection.vue'
import ResumeSection  from '../components/ResumeSection.vue'
import AboutSection   from '../components/AboutSection.vue'
import ContactSection from '../components/ContactSection.vue'
import SiteFooter     from '../components/SiteFooter.vue'
import LightboxModal  from '../components/LightboxModal.vue'

const config = siteConfig

// ── Scroll spy ──────────────────────────────
const activeSection = ref('top')
const sectionIds = ['top', 'work', 'resume', 'about', 'contact']

function onScroll() {
  const headerH = document.querySelector('.site-header')?.offsetHeight || 70
  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const el = document.getElementById(sectionIds[i])
    if (el && el.getBoundingClientRect().top <= headerH + 10) {
      activeSection.value = sectionIds[i]
      break
    }
  }
}

// ── Lightbox ────────────────────────────────
const lbOpen  = ref(false)
const lbItems = ref([])
const lbIndex = ref(0)

function openLightbox(index, items) {
  lbItems.value = items
  lbIndex.value = index
  lbOpen.value  = true
}

// ── Global fade-in observer ─────────────────
let fadeIo

onMounted(() => {
  loadSiteData()
  window.addEventListener('scroll', onScroll, { passive: true })

  fadeIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const siblings = [...(el.parentElement?.children || [])]
      el.style.transitionDelay = `${siblings.indexOf(el) * 60}ms`
      el.classList.add('visible')
      fadeIo.unobserve(el)
    })
  }, { threshold: 0.15 })

  document.querySelectorAll('.fade-in').forEach(el => fadeIo.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  fadeIo?.disconnect()
})
</script>
