<template>
  <div class="admin">
    <aside class="sidebar">
      <div class="sidebar-logo">管理后台</div>
      <nav class="sidebar-nav">
        <button v-for="tab in tabs" :key="tab.key"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </nav>
      <button class="logout-btn" @click="logout">退出登录</button>
    </aside>

    <main class="admin-main">
      <!-- 作品管理 -->
      <section v-if="activeTab === 'works'">
        <div class="section-header">
          <h2>作品管理</h2>
          <button class="btn-primary" @click="showAddWork = true">+ 添加作品</button>
        </div>

        <div class="works-grid">
          <div v-for="work in works" :key="work.id" class="work-card">
            <img :src="work.img" :alt="work.title" />
            <div class="work-info">
              <span class="work-cat">{{ catMap[work.category] || work.category }}</span>
              <span class="work-title">{{ work.title }}</span>
              <div class="work-flags">
                <span v-if="work.featured" class="flag">精选</span>
                <span v-if="work.tall" class="flag">高图</span>
              </div>
            </div>
            <button class="del-btn" @click="deleteWork(work.id)">删除</button>
          </div>
        </div>

        <!-- 添加作品弹窗 -->
        <div v-if="showAddWork" class="modal-mask" @click.self="showAddWork = false">
          <div class="modal">
            <h3>添加作品</h3>
            <div class="form-field">
              <label>标题</label>
              <input v-model="newWork.title" placeholder="作品标题" />
            </div>
            <div class="form-field">
              <label>分类</label>
              <select v-model="newWork.category">
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-field">
              <label>上传图片</label>
              <input type="file" accept="image/*" @change="onFileChange" />
              <div v-if="uploadProgress" class="progress">{{ uploadProgress }}</div>
            </div>
            <div class="form-field" v-if="newWork.img">
              <label>预览</label>
              <img :src="newWork.img" style="max-height:120px;border-radius:4px" />
            </div>
            <div class="form-field">
              <label>图片 URL（或上传后自动填入）</label>
              <input v-model="newWork.img" placeholder="https://... 或上传后自动填入" />
            </div>
            <div class="form-field full">
              <label>作品描述（可选，预览时右侧显示）</label>
              <textarea v-model="newWork.description" rows="3" placeholder="关于这个作品的描述..."></textarea>
            </div>
            <div class="form-row">
              <label><input type="checkbox" v-model="newWork.featured" /> 设为精选（大图）</label>
              <label><input type="checkbox" v-model="newWork.tall" /> 高图（占两行）</label>
            </div>
            <div class="modal-actions">
              <button class="btn-primary" @click="addWork" :disabled="!newWork.title || !newWork.img">保存</button>
              <button @click="showAddWork = false">取消</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 分类管理 -->
      <section v-if="activeTab === 'categories'">
        <h2>分类管理</h2>
        <div class="works-grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));">
          <div v-for="cat in categories" :key="cat.id" class="work-card" style="padding:.75rem 1rem;display:flex;align-items:center;justify-content:space-between;">
            <span class="work-title">{{ cat.name }}</span>
            <button class="del-btn" style="position:static;width:22px;height:22px;font-size:.65rem;" @click="deleteCategory(cat.id)">✕</button>
          </div>
        </div>
        <div class="form-grid narrow mt">
          <div class="form-field full" style="flex-direction:row;gap:.5rem;align-items:end;">
            <input v-model="newCatName" placeholder="新分类名称" style="flex:1" />
            <button class="btn-primary" @click="addCategory" :disabled="!newCatName.trim()">添加</button>
          </div>
        </div>
        <div v-if="catMsg" class="save-msg">{{ catMsg }}</div>
      </section>

      <!-- 个人信息 -->
      <section v-if="activeTab === 'profile'">
        <h2>个人信息</h2>
        <div v-if="profile" class="form-grid">
          <div class="form-field"><label>姓名</label><input v-model="profile.name" /></div>
          <div class="form-field"><label>标语</label><input v-model="profile.tagline" /></div>
          <div class="form-field"><label>标题行1</label><input v-model="profile.title_1" /></div>
          <div class="form-field"><label>标题行2（斜体）</label><input v-model="profile.title_2" /></div>
          <div class="form-field"><label>标题行3</label><input v-model="profile.title_3" /></div>
          <div class="form-field full"><label>Hero 副标题</label><input v-model="profile.hero_subtitle" /></div>
          <div class="form-field full"><label>简介段落1</label><textarea v-model="profile.bio_1" rows="3"></textarea></div>
          <div class="form-field full"><label>简介段落2</label><textarea v-model="profile.bio_2" rows="3"></textarea></div>
          <div class="form-field full"><label>简介段落3</label><textarea v-model="profile.bio_3" rows="2"></textarea></div>
          <div class="form-field"><label>地点</label><input v-model="profile.location" /></div>
          <div class="form-field"><label>邮箱</label><input v-model="profile.email" /></div>
          <div class="form-field"><label>响应时间</label><input v-model="profile.response_time" /></div>
          <div class="form-field full"><label>合作类型</label><input v-model="profile.service_types" /></div>
          <div class="form-field"><label>统计1 数字</label><input v-model="profile.stat_1_num" /></div>
          <div class="form-field"><label>统计1 说明</label><input v-model="profile.stat_1_desc" /></div>
          <div class="form-field"><label>统计2 数字</label><input v-model="profile.stat_2_num" /></div>
          <div class="form-field"><label>统计2 说明</label><input v-model="profile.stat_2_desc" /></div>
          <div class="form-field"><label>统计3 数字</label><input v-model="profile.stat_3_num" /></div>
          <div class="form-field"><label>统计3 说明</label><input v-model="profile.stat_3_desc" /></div>
        </div>
        <button class="btn-primary mt" @click="saveProfile">保存个人信息</button>
        <div v-if="profileMsg" class="save-msg">{{ profileMsg }}</div>
      </section>

      <!-- 简历 -->
      <section v-if="activeTab === 'resume'">
        <h2>简历管理</h2>

        <h3>工作经历</h3>
        <div v-for="(item, i) in resume.experience" :key="i" class="timeline-edit">
          <input v-model="item.year" placeholder="年份" style="width:80px" />
          <input v-model="item.role" placeholder="职位" />
          <input v-model="item.org" placeholder="公司" />
          <input v-model="item.desc" placeholder="描述" style="flex:2" />
          <button @click="resume.experience.splice(i,1)">删除</button>
        </div>
        <button @click="resume.experience.push({year:'',role:'',org:'',desc:''})">+ 添加工作经历</button>

        <h3 class="mt">教育背景</h3>
        <div v-for="(item, i) in resume.education" :key="i" class="timeline-edit">
          <input v-model="item.year" placeholder="年份" style="width:80px" />
          <input v-model="item.role" placeholder="学位/专业" />
          <input v-model="item.org" placeholder="学校" />
          <button @click="resume.education.splice(i,1)">删除</button>
        </div>
        <button @click="resume.education.push({year:'',role:'',org:'',desc:''})">+ 添加教育经历</button>

        <h3 class="mt">技能（名称 + 百分比）</h3>
        <div v-for="(item, i) in resume.skills" :key="i" class="timeline-edit">
          <input v-model="item.name" placeholder="技能名称" />
          <input v-model.number="item.pct" type="number" min="0" max="100" placeholder="%" style="width:80px" />
          <button @click="resume.skills.splice(i,1)">删除</button>
        </div>
        <button @click="resume.skills.push({name:'',pct:80})">+ 添加技能</button>

        <h3 class="mt">软件工具（逗号分隔）</h3>
        <input class="full-input" v-model="toolsStr" placeholder="Photoshop, Lightroom, Figma..." />

        <button class="btn-primary mt" @click="saveResume">保存简历</button>
        <div v-if="resumeMsg" class="save-msg">{{ resumeMsg }}</div>
      </section>

      <!-- 留言 -->
      <section v-if="activeTab === 'messages'">
        <h2>联系留言 <span class="badge">{{ unread }}</span></h2>
        <div v-if="messages.length === 0" class="empty">暂无留言</div>
        <div v-for="msg in messages" :key="msg.id"
          class="message-card" :class="{ unread: !msg.read }">
          <div class="msg-meta">
            <strong>{{ msg.name }}</strong>
            <span>{{ msg.email }}</span>
            <span class="msg-time">{{ msg.created_at }}</span>
          </div>
          <p class="msg-body">{{ msg.message }}</p>
          <div class="msg-actions">
            <button v-if="!msg.read" @click="markRead(msg.id)">标记已读</button>
            <button @click="deleteMsg(msg.id)" class="del">删除</button>
          </div>
        </div>
      </section>

      <!-- 账号管理 -->
      <section v-if="activeTab === 'accounts'">
        <div class="section-header">
          <h2>账号管理</h2>
        </div>

        <div class="works-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
          <div v-for="acc in accounts" :key="acc.id" class="work-card" style="padding:1rem;">
            <div class="work-info">
              <span class="work-title">{{ acc.username }}</span>
              <span class="work-cat">ID: {{ acc.id }}</span>
            </div>
            <button class="del-btn" style="position:static;margin-top:.5rem;" @click="deleteAccount(acc.id, acc.username)">删除</button>
          </div>
        </div>

        <h3 class="mt">添加新账号</h3>
        <div class="form-grid narrow">
          <div class="form-field full"><label>用户名</label><input v-model="newAccount.username" placeholder="新用户名" /></div>
          <div class="form-field full"><label>密码</label><input type="password" v-model="newAccount.password" placeholder="至少6位" /></div>
        </div>
        <button class="btn-primary mt" @click="addAccount">添加账号</button>
        <div v-if="accountMsg" class="save-msg">{{ accountMsg }}</div>
      </section>

      <!-- 修改密码 -->
      <section v-if="activeTab === 'password'">
        <h2>修改密码</h2>
        <div class="form-grid narrow">
          <div class="form-field full"><label>旧密码</label><input type="password" v-model="pwd.old" /></div>
          <div class="form-field full"><label>新密码</label><input type="password" v-model="pwd.new1" /></div>
          <div class="form-field full"><label>确认新密码</label><input type="password" v-model="pwd.new2" /></div>
        </div>
        <button class="btn-primary mt" @click="changePassword">修改密码</button>
        <div v-if="pwdMsg" class="save-msg">{{ pwdMsg }}</div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api.js'

const router = useRouter()

const tabs = [
  { key: 'works',      label: '作品管理' },
  { key: 'categories', label: '分类管理' },
  { key: 'profile',    label: '个人信息' },
  { key: 'resume',     label: '简历' },
  { key: 'messages',   label: '留言' },
  { key: 'accounts',   label: '账号管理' },
  { key: 'password',   label: '修改密码' },
]

const activeTab = ref('works')
const catMap = { photo: '摄影', design: '设计', illustration: '插画', other: '其他' }

// ── 分类 ──
const categories = ref([])
const newCatName = ref('')
const catMsg = ref('')

async function loadCategories() {
  categories.value = await api.getCategories()
}

async function addCategory() {
  if (!newCatName.value.trim()) return
  try {
    await api.createCategory({ name: newCatName.value.trim() })
    newCatName.value = ''
    catMsg.value = '添加成功 ✓'
    await loadCategories()
  } catch (e) {
    catMsg.value = e.message
  }
  setTimeout(() => (catMsg.value = ''), 2000)
}

async function deleteCategory(id) {
  if (!confirm('确认删除该分类？')) return
  await api.deleteCategory(id)
  await loadCategories()
}

// ── 作品 ──
const works = ref([])
const showAddWork = ref(false)
const uploadProgress = ref('')
const newWork = reactive({ title: '', category: '', img: '', description: '', featured: false, tall: false })

async function loadWorks() {
  works.value = await api.getWorks()
}

async function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  uploadProgress.value = '上传中...'
  try {
    const { url } = await api.uploadImage(file)
    newWork.img = url
    uploadProgress.value = '上传成功 ✓'
  } catch (err) {
    uploadProgress.value = '上传失败：' + err.message
  }
}

async function addWork() {
  await api.createWork({ ...newWork })
  Object.assign(newWork, { title: '', category: '', img: '', description: '', featured: false, tall: false })
  showAddWork.value = false
  uploadProgress.value = ''
  await loadWorks()
}

async function deleteWork(id) {
  if (!confirm('确认删除这个作品？')) return
  await api.deleteWork(id)
  await loadWorks()
}

// ── 个人信息 ──
const profile = ref(null)
const profileMsg = ref('')

async function loadProfile() {
  profile.value = await api.getProfile()
}

async function saveProfile() {
  await api.updateProfile(profile.value)
  profileMsg.value = '保存成功 ✓'
  setTimeout(() => (profileMsg.value = ''), 2000)
}

// ── 简历 ──
const resume = reactive({ experience: [], education: [], skills: [], tools: [] })
const toolsStr = ref('')
const resumeMsg = ref('')

async function loadResume() {
  const data = await api.getResume()
  Object.assign(resume, data)
  toolsStr.value = (data.tools || []).join(', ')
}

async function saveResume() {
  resume.tools = toolsStr.value.split(',').map(s => s.trim()).filter(Boolean)
  await api.updateResume({ ...resume })
  resumeMsg.value = '保存成功 ✓'
  setTimeout(() => (resumeMsg.value = ''), 2000)
}

// ── 留言 ──
const messages = ref([])
const unread = computed(() => messages.value.filter(m => !m.read).length)

async function loadMessages() {
  messages.value = await api.getMessages()
}

async function markRead(id) {
  await api.markMessageRead(id)
  await loadMessages()
}

async function deleteMsg(id) {
  if (!confirm('确认删除这条留言？')) return
  await api.deleteMessage(id)
  await loadMessages()
}

// ── 账号管理 ──
const accounts = ref([])
const newAccount = reactive({ username: '', password: '' })
const accountMsg = ref('')

async function loadAccounts() {
  accounts.value = await api.getAccounts()
}

async function addAccount() {
  if (!newAccount.username || !newAccount.password) { accountMsg.value = '请填写用户名和密码'; return }
  if (newAccount.password.length < 6) { accountMsg.value = '密码至少6位'; return }
  try {
    await api.createAccount({ username: newAccount.username, password: newAccount.password })
    accountMsg.value = '添加成功 ✓'
    Object.assign(newAccount, { username: '', password: '' })
    await loadAccounts()
  } catch (e) {
    accountMsg.value = e.message
  }
  setTimeout(() => (accountMsg.value = ''), 3000)
}

async function deleteAccount(id, username) {
  if (!confirm(`确认删除账号 "${username}"？`)) return
  try {
    await api.deleteAccount(id)
    await loadAccounts()
  } catch (e) {
    alert(e.message)
  }
}

// ── 密码 ──
const pwd = reactive({ old: '', new1: '', new2: '' })
const pwdMsg = ref('')

async function changePassword() {
  if (pwd.new1 !== pwd.new2) { pwdMsg.value = '两次密码不一致'; return }
  try {
    await api.changePassword({ oldPassword: pwd.old, newPassword: pwd.new1 })
    pwdMsg.value = '密码修改成功 ✓'
    Object.assign(pwd, { old: '', new1: '', new2: '' })
  } catch (err) {
    pwdMsg.value = err.message
  }
  setTimeout(() => (pwdMsg.value = ''), 3000)
}

// ── 退出 ──
function logout() {
  localStorage.removeItem('admin_token')
  router.push('/admin/login')
}

onMounted(async () => {
  await Promise.all([loadWorks(), loadCategories(), loadProfile(), loadResume(), loadMessages(), loadAccounts()])
})
</script>

<style scoped>
.admin { display: flex; min-height: 100vh; font-family: var(--font-sans); }

.sidebar {
  width: 200px; background: var(--ink); color: #fff;
  display: flex; flex-direction: column; padding: 1.5rem 0; flex-shrink: 0;
}
.sidebar-logo { font-weight: 700; font-size: .85rem; letter-spacing: .1em; padding: 0 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,.1); }
.sidebar-nav { display: flex; flex-direction: column; flex: 1; margin-top: 1rem; }
.sidebar-nav button {
  text-align: left; padding: .75rem 1.5rem; font-size: .82rem; font-weight: 500;
  color: rgba(255,255,255,.6); background: none; border: none; cursor: pointer; transition: all .2s;
}
.sidebar-nav button:hover, .sidebar-nav button.active { color: #fff; background: rgba(255,255,255,.1); }
.logout-btn { margin: 1rem 1.5rem 0; padding: .6rem 1rem; font-size: .78rem; font-weight: 600;
  border: 1px solid rgba(255,255,255,.2); color: rgba(255,255,255,.5); background: none; border-radius: 4px; cursor: pointer; }
.logout-btn:hover { color: #fff; border-color: rgba(255,255,255,.5); }

.admin-main { flex: 1; padding: 2rem; overflow-y: auto; background: #f7f6f3; }

h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
h3 { font-size: .95rem; font-weight: 600; margin: 1.5rem 0 .75rem; color: var(--ink-light); }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }

.works-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
.work-card { background: #fff; border-radius: 8px; overflow: hidden; position: relative; }
.work-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
.work-info { padding: .5rem .75rem; }
.work-cat { font-size: .65rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); display: block; }
.work-title { font-size: .82rem; font-weight: 600; display: block; }
.work-flags { display: flex; gap: .25rem; margin-top: .25rem; }
.flag { font-size: .6rem; padding: .15rem .4rem; background: var(--accent); color: #fff; border-radius: 2px; }
.del-btn { position: absolute; top: .5rem; right: .5rem; width: 26px; height: 26px; border-radius: 50%; background: rgba(0,0,0,.6); color: #fff; font-size: .75rem; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 12px; padding: 2rem; width: 480px; max-width: 95vw; max-height: 90vh; overflow-y: auto; }
.modal h3 { margin-bottom: 1.25rem; }
.modal-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-grid.narrow { grid-template-columns: 1fr; max-width: 400px; }
.form-field { display: flex; flex-direction: column; gap: .35rem; }
.form-field.full { grid-column: 1 / -1; }
.form-field label { font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-light); }
.form-field input, .form-field select, .form-field textarea {
  padding: .6rem .85rem; border: 1.5px solid var(--border); border-radius: 6px;
  font-size: .88rem; font-family: var(--font-sans); outline: none; transition: border-color .2s;
}
.form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: var(--ink); }
.form-row { display: flex; gap: 1.5rem; font-size: .85rem; align-items: center; }
.form-row label { display: flex; gap: .4rem; align-items: center; cursor: pointer; }
.full-input { width: 100%; padding: .6rem .85rem; border: 1.5px solid var(--border); border-radius: 6px; font-size: .88rem; font-family: var(--font-sans); outline: none; }

.timeline-edit { display: flex; gap: .5rem; margin-bottom: .5rem; }
.timeline-edit input { flex: 1; padding: .5rem .75rem; border: 1.5px solid var(--border); border-radius: 6px; font-size: .85rem; font-family: var(--font-sans); }
.timeline-edit button { padding: .4rem .75rem; font-size: .78rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 6px; cursor: pointer; }

.message-card { background: #fff; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; border-left: 3px solid transparent; }
.message-card.unread { border-left-color: var(--accent); }
.msg-meta { display: flex; gap: 1rem; align-items: center; margin-bottom: .5rem; font-size: .82rem; }
.msg-meta strong { font-size: .9rem; }
.msg-time { color: var(--ink-xlight); margin-left: auto; font-size: .75rem; }
.msg-body { font-size: .88rem; color: var(--ink-light); line-height: 1.6; margin-bottom: .75rem; }
.msg-actions { display: flex; gap: .5rem; }
.msg-actions button { padding: .35rem .75rem; font-size: .75rem; border: 1.5px solid var(--border); border-radius: 4px; cursor: pointer; background: none; }
.msg-actions button.del { color: #dc2626; border-color: #fca5a5; }
.badge { background: var(--accent); color: #fff; font-size: .7rem; padding: .15rem .5rem; border-radius: 999px; margin-left: .5rem; }
.empty { color: var(--ink-xlight); font-size: .9rem; text-align: center; padding: 3rem; }
.save-msg { margin-top: .75rem; font-size: .85rem; color: #16a34a; font-weight: 500; }
.progress { font-size: .78rem; color: var(--ink-light); margin-top: .25rem; }
.btn-primary { padding: .65rem 1.5rem; background: var(--ink); color: #fff; border: none; border-radius: 6px; font-size: .85rem; font-weight: 600; cursor: pointer; transition: opacity .2s; }
.btn-primary:hover:not(:disabled) { opacity: .85; }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.mt { margin-top: 1.5rem; }

@media (max-width: 640px) {
  .sidebar { width: 160px; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
