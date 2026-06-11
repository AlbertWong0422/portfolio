<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-name">{{ config.name }}</span>
        <span class="footer-tagline">{{ config.tagline }}</span>
      </div>
      <nav class="footer-nav" aria-label="页脚导航">
        <a href="#work">Work</a>
        <a href="#resume">Resume</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <p class="footer-copy">&copy; {{ year }} {{ config.name }}. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
import { siteConfig } from '../config.js'
const config = siteConfig
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer { background: var(--ink); color: #fff; padding: 2.5rem 2rem; }
.footer-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.footer-brand { display: flex; flex-direction: column; }
.footer-name { font-size: .9rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.footer-tagline { font-size: .7rem; color: rgba(255,255,255,.35); letter-spacing: .08em; }
.footer-nav { display: flex; gap: 1.5rem; }
.footer-nav a { font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.45); transition: color .2s; }
.footer-nav a:hover { color: #fff; }
.footer-copy { font-size: .72rem; color: rgba(255,255,255,.25); }

@media (max-width: 480px) {
  .footer-inner { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .footer-nav { flex-wrap: wrap; gap: 1rem; }
}
</style>
