<template>
  <div class="login-wrap">
    <div class="login-box">
      <h1 class="login-title">管理后台</h1>
      <p class="login-sub">Portfolio CMS</p>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>用户名</label>
          <input v-model="form.username" type="text" placeholder="admin" autocomplete="username" />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="••••••" autocomplete="current-password" />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? '登录中…' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api.js'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await api.login(form)
    localStorage.setItem('admin_token', res.token)
    router.push('/admin')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
}
.login-box {
  width: 100%;
  max-width: 380px;
  padding: 2.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.login-title { font-family: var(--font-serif); font-size: 1.8rem; font-weight: 700; margin-bottom: .25rem; }
.login-sub { font-size: .78rem; color: var(--ink-light); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 2rem; }
.field { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1.25rem; }
.field label { font-size: .72rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-light); }
.field input {
  padding: .75rem 1rem; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  font-size: .95rem; outline: none; transition: border-color .2s;
}
.field input:focus { border-color: var(--ink); }
.error-msg { font-size: .82rem; color: #e53e3e; margin-bottom: 1rem; }
.btn-login {
  width: 100%; padding: .85rem; background: var(--ink); color: #fff;
  font-weight: 700; letter-spacing: .06em; border-radius: var(--radius-sm);
  cursor: pointer; transition: opacity .2s;
}
.btn-login:disabled { opacity: .6; cursor: not-allowed; }
</style>
