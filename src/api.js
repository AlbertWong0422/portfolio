/**
 * API 请求工具
 * 开发时代理到 localhost:3000，生产环境直接走相对路径 /api/
 */

const BASE = import.meta.env.VITE_API_URL || ''

async function request(method, path, data) {
  const token = localStorage.getItem('admin_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || '请求失败')
  }
  return res.json()
}

export const api = {
  // 公开接口
  getProfile: () => request('GET', '/api/profile'),
  getWorks:   () => request('GET', '/api/works'),
  getResume:  () => request('GET', '/api/resume'),
  postMessage: (data) => request('POST', '/api/messages', data),

  // 管理接口（需要 token）
  login: (data) => request('POST', '/api/login', data),

  updateProfile: (data) => request('PUT', '/api/profile', data),

  createWork: (data) => request('POST', '/api/works', data),
  updateWork: (id, data) => request('PUT', `/api/works/${id}`, data),
  deleteWork: (id) => request('DELETE', `/api/works/${id}`),

  updateResume: (data) => request('PUT', '/api/resume', data),

  getMessages: () => request('GET', '/api/messages'),
  markMessageRead: (id) => request('PUT', `/api/messages/${id}/read`),
  deleteMessage: (id) => request('DELETE', `/api/messages/${id}`),

  changePassword: (data) => request('PUT', '/api/admin/password', data),

  // 图片上传（FormData，不用 JSON）
  uploadImage: async (file) => {
    const token = localStorage.getItem('admin_token')
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(BASE + '/api/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error || '上传失败')
    }
    return res.json()
  },
}
