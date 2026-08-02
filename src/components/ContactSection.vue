<template>
  <section class="section section--accent" id="contact">
    <div class="section-inner">
      <header class="section-header">
        <div class="section-label">04 — GET IN TOUCH</div>
        <h2 class="section-title">联系我</h2>
      </header>

      <div class="contact-grid">
        <div class="contact-left fade-in">
          <p class="contact-intro">有项目想聊？欢迎随时联系。<br />无论是商业合作还是创意探讨。</p>
          <button class="email-copy" @click="copyEmail" :aria-label="`点击复制邮箱 ${config.email}`">
            <span class="email-text">{{ config.email }}</span>
            <span class="copy-icon" aria-hidden="true">⌘C</span>
          </button>
          <div class="copy-toast" :class="{ show: toastVisible }" role="status" aria-live="polite">已复制到剪贴板</div>
          <div class="contact-info">
            <div class="info-row"><span class="info-label">地点</span><span>{{ config.location }}</span></div>
            <div class="info-row"><span class="info-label">响应时间</span><span>{{ config.responseTime }}</span></div>
            <div class="info-row"><span class="info-label">合作类型</span><span>{{ config.serviceTypes }}</span></div>
          </div>
        </div>

        <form class="contact-form fade-in" @submit.prevent="submitForm" novalidate>
          <div class="form-field">
            <label for="c-name">姓名</label>
            <input id="c-name" v-model="form.name" type="text" placeholder="您的姓名" :class="{ invalid: errors.name }" @input="errors.name = false" required />
          </div>
          <div class="form-field">
            <label for="c-email">邮箱</label>
            <input id="c-email" v-model="form.email" type="email" placeholder="your@email.com" :class="{ invalid: errors.email }" @input="errors.email = false" required />
          </div>
          <div class="form-field">
            <label for="c-msg">留言</label>
            <textarea id="c-msg" v-model="form.message" rows="5" placeholder="简单描述您的项目或想法..." :class="{ invalid: errors.message }" @input="errors.message = false" required></textarea>
          </div>
          <button type="submit" class="btn-primary btn-full" :disabled="submitting">
            {{ submitting ? '发送中…' : '发送消息 →' }}
          </button>
          <p class="form-note">{{ formNote }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { siteData } from '../store.js'
import { api } from '../api.js'

const config = siteData
const toastVisible = ref(false)
let toastTimer = null

async function copyEmail() {
  try { await navigator.clipboard.writeText(config.email) } catch {
    const el = Object.assign(document.createElement('textarea'), { value: config.email, style: 'position:absolute;left:-9999px' })
    document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el)
  }
  toastVisible.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toastVisible.value = false), 2200)
}

const form = reactive({ name: '', email: '', message: '' })
const errors = reactive({ name: false, email: false, message: false })
const submitting = ref(false)
const formNote = ref('')

async function submitForm() {
  errors.name    = !form.name.trim()
  errors.email   = !form.email.trim()
  errors.message = !form.message.trim()
  if (errors.name || errors.email || errors.message) { formNote.value = '请填写所有必填项。'; return }

  submitting.value = true
  try {
    await api.postMessage({ name: form.name, email: form.email, message: form.message })
    formNote.value = '消息已发送！感谢您的联系，我会尽快回复。'
    Object.assign(form, { name: '', email: '', message: '' })
  } catch (e) {
    formNote.value = '发送失败，请稍后重试。'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return
      e.target.style.transitionDelay = `${i * 80}ms`
      e.target.classList.add('visible')
      io.unobserve(e.target)
    })
  }, { threshold: 0.15 })
  document.querySelectorAll('#contact .fade-in').forEach(el => io.observe(el))
})
</script>

<style scoped>
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); align-items: start; }

.contact-intro { font-family: var(--font-serif); font-size: clamp(1rem,2.5vw,1.25rem); line-height: 1.6; margin-bottom: var(--space-md); color: rgba(255,255,255,.9); }

.email-copy {
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 1rem 1.25rem; border: 1.5px solid rgba(255,255,255,.3); border-radius: var(--radius-sm);
  color: #fff; font-family: var(--font-sans); font-size: clamp(.85rem,2vw,1.1rem); font-weight: 600;
  margin-bottom: var(--space-sm); cursor: pointer; background: none;
  transition: background .2s, border-color .2s, transform .2s;
}
.email-copy:hover { background: rgba(255,255,255,.1); border-color: #fff; transform: translateY(-2px); }
.copy-icon { font-size: .75rem; font-weight: 700; letter-spacing: .05em; opacity: .5; padding: .2rem .5rem; border: 1px solid rgba(255,255,255,.3); border-radius: 3px; }

.copy-toast { font-size: .75rem; color: rgba(255,255,255,.7); margin-bottom: var(--space-md); height: 1em; opacity: 0; transition: opacity .3s; }
.copy-toast.show { opacity: 1; }

.contact-info { display: flex; flex-direction: column; gap: .75rem; margin-top: var(--space-sm); }
.info-row { display: flex; gap: 1rem; font-size: .85rem; border-top: 1px solid rgba(255,255,255,.1); padding-top: .75rem; }
.info-label { font-weight: 700; letter-spacing: .04em; color: rgba(255,255,255,.45); min-width: 80px; font-size: .72rem; text-transform: uppercase; }

.contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-field { display: flex; flex-direction: column; gap: .4rem; }
.form-field label { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.5); }
.form-field input, .form-field textarea {
  width: 100%; padding: .85rem 1rem; background: rgba(255,255,255,.08);
  border: 1.5px solid rgba(255,255,255,.15); border-radius: var(--radius-sm);
  color: #fff; font-family: var(--font-sans); font-size: .9rem; outline: none; resize: vertical;
  transition: border-color .2s, background .2s;
}
.form-field input::placeholder, .form-field textarea::placeholder { color: rgba(255,255,255,.25); }
.form-field input:focus, .form-field textarea:focus { border-color: rgba(255,255,255,.5); background: rgba(255,255,255,.12); }
.form-field input.invalid, .form-field textarea.invalid { border-color: rgba(255,255,255,.7); }

.contact-form .btn-primary { background: #fff; color: var(--accent); margin-top: .5rem; }
.contact-form .btn-primary:hover:not(:disabled) { background: var(--ink); color: #fff; }
.contact-form .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }

.form-note { font-size: .8rem; color: rgba(255,255,255,.6); text-align: center; min-height: 1.2em; }

@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; gap: var(--space-lg); } }
</style>
