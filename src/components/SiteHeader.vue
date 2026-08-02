<template>
  <header class="site-header" :class="{ scrolled, 'glass-on': glass }" ref="headerEl">
    <div class="header-inner">
      <a href="#top" class="logo" @click.prevent="scrollTo('#top')">
        <span class="logo-name">{{ config.name }}</span>
        <span class="logo-dot" aria-hidden="true"></span>
      </a>
      <nav class="main-nav" :class="{ open: menuOpen }" id="main-nav">
        <a v-for="link in navLinks" :key="link.href"
           :href="link.href"
           class="nav-link"
           :class="{ active: activeSection === link.href.slice(1) }"
           @click.prevent="onNavClick(link.href)">
          {{ link.label }}
        </a>
      </nav>
      <button class="hamburger" :class="{ open: menuOpen }"
              @click="menuOpen = !menuOpen" aria-label="菜单">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { siteData } from '../store.js'

const props = defineProps({ activeSection: String, glass: Boolean })

const config = siteData
const scrolled = ref(false)
const menuOpen = ref(false)
const headerEl = ref(null)

const navLinks = [
  { href: '#work',    label: 'WORK' },
  { href: '#resume',  label: 'RESUME' },
  { href: '#about',   label: 'ABOUT' },
  { href: '#contact', label: 'CONTACT' },
]

function scrollTo(hash) {
  const el = document.querySelector(hash)
  if (!el) return
  const offset = headerEl.value?.offsetHeight || 0
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
}

function onNavClick(href) {
  scrollTo(href)
  menuOpen.value = false
}

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  background: rgba(245,243,239,.95);
  transition: box-shadow .3s;
}
/* 毛玻璃开启时才加 blur */
.site-header.glass-on {
  background: rgba(245,243,239,.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.site-header.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,.08); }

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo { display: flex; align-items: center; gap: .4rem; }
.logo-name { font-size: 1rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.logo-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

.main-nav { display: flex; gap: 2rem; }
.nav-link {
  font-size: .72rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink-light); position: relative; padding-bottom: 2px; transition: color .2s;
}
.nav-link::after {
  content: ''; position: absolute; bottom: 0; left: 0;
  width: 0; height: 1.5px; background: var(--accent); transition: width .25s ease;
}
.nav-link:hover, .nav-link.active { color: var(--ink); }
.nav-link:hover::after, .nav-link.active::after { width: 100%; }

.hamburger { display: none; flex-direction: column; gap: 5px; padding: 4px; }
.hamburger span { display: block; width: 22px; height: 1.5px; background: var(--ink); transition: transform .25s, opacity .25s; }
.hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

@media (max-width: 768px) {
  .hamburger { display: flex; }
  .main-nav {
    position: fixed; top: 65px; left: 0; right: 0;
    background: rgba(245,243,239,.97);
    flex-direction: column; gap: 0;
    transform: translateY(-120%); opacity: 0;
    transition: transform .3s ease, opacity .3s;
    border-bottom: 1px solid var(--border); z-index: 99;
  }
  .main-nav.glass-on { backdrop-filter: blur(12px); }
  .main-nav.open { transform: translateY(0); opacity: 1; }
  .nav-link { padding: 1rem 2rem; border-bottom: 1px solid var(--border); font-size: .8rem; display: block; }
  .nav-link::after { display: none; }
}
</style>
