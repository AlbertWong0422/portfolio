const express = require('express')
const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production'
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/var/www/portfolio/uploads'

// ── 初始化数据库 ────────────────────────────
const db = new Database(path.join(__dirname, 'db.sqlite'))

db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL DEFAULT 'YourName',
    tagline TEXT DEFAULT 'Visual Creator',
    title_1 TEXT DEFAULT 'CREATING',
    title_2 TEXT DEFAULT 'Meaningful',
    title_3 TEXT DEFAULT 'VISUALS',
    hero_subtitle TEXT DEFAULT '',
    bio_1 TEXT DEFAULT '',
    bio_2 TEXT DEFAULT '',
    bio_3 TEXT DEFAULT '',
    location TEXT DEFAULT '',
    response_time TEXT DEFAULT '',
    service_types TEXT DEFAULT '',
    email TEXT DEFAULT '',
    stat_1_num TEXT DEFAULT '120+',
    stat_1_desc TEXT DEFAULT '作品完成',
    stat_2_num TEXT DEFAULT '6',
    stat_2_desc TEXT DEFAULT '年经验',
    stat_3_num TEXT DEFAULT '40+',
    stat_3_desc TEXT DEFAULT '客户合作',
    tags TEXT DEFAULT '[]',
    socials TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL DEFAULT 'photo',
    title TEXT NOT NULL,
    img TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    tall INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS resume (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    experience TEXT DEFAULT '[]',
    education TEXT DEFAULT '[]',
    skills TEXT DEFAULT '[]',
    tools TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

// 初始化默认数据
const adminExists = db.prepare('SELECT id FROM admin WHERE id = 1').get()
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT OR IGNORE INTO admin (id, username, password) VALUES (1, ?, ?)').run('admin', hash)
}
db.prepare('INSERT OR IGNORE INTO profile (id) VALUES (1)').run()
db.prepare('INSERT OR IGNORE INTO resume (id) VALUES (1)').run()

// ── 中间件 ──────────────────────────────────
app.use(cors())
app.use(express.json())

// 提供静态文件服务
app.use(express.static(path.join(__dirname, '../dist')))
app.use('/uploads', express.static(UPLOADS_DIR))

// 图片上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    cb(null, UPLOADS_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext
    cb(null, name)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('只允许上传图片文件（jpg/png/webp/gif）'))
  }
})

// JWT 鉴权中间件
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: '未登录' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token 无效或已过期' })
  }
}

// ── 登录 ────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: '请填写用户名和密码' })

  const admin = db.prepare('SELECT * FROM admin WHERE username = ?').get(username)
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: '用户名或密码错误' })
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, username: admin.username })
})

// 修改密码
app.put('/api/admin/password', auth, (req, res) => {
  const { oldPassword, newPassword } = req.body
  const admin = db.prepare('SELECT * FROM admin WHERE id = 1').get()
  if (!bcrypt.compareSync(oldPassword, admin.password)) {
    return res.status(400).json({ error: '旧密码错误' })
  }
  const hash = bcrypt.hashSync(newPassword, 10)
  db.prepare('UPDATE admin SET password = ? WHERE id = 1').run(hash)
  res.json({ ok: true })
})

// ── 个人信息 ────────────────────────────────
app.get('/api/profile', (req, res) => {
  const row = db.prepare('SELECT * FROM profile WHERE id = 1').get()
  res.json(row)
})

app.put('/api/profile', auth, (req, res) => {
  const fields = [
    'name','tagline','title_1','title_2','title_3','hero_subtitle',
    'bio_1','bio_2','bio_3','location','response_time','service_types','email',
    'stat_1_num','stat_1_desc','stat_2_num','stat_2_desc','stat_3_num','stat_3_desc',
    'tags','socials'
  ]
  const sets = fields.map(f => `${f} = ?`).join(', ')
  const values = fields.map(f => {
    const v = req.body[f]
    return (Array.isArray(v) || typeof v === 'object') ? JSON.stringify(v) : (v ?? '')
  })
  db.prepare(`UPDATE profile SET ${sets} WHERE id = 1`).run(...values)
  res.json({ ok: true })
})

// ── 作品集 ──────────────────────────────────
app.get('/api/works', (req, res) => {
  const rows = db.prepare('SELECT * FROM works ORDER BY sort_order ASC, created_at DESC').all()
  res.json(rows)
})

app.post('/api/works', auth, (req, res) => {
  const { category, title, img, featured, tall, sort_order } = req.body
  if (!title || !img) return res.status(400).json({ error: '标题和图片不能为空' })
  const result = db.prepare(
    'INSERT INTO works (category, title, img, featured, tall, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(category || 'photo', title, img, featured ? 1 : 0, tall ? 1 : 0, sort_order || 0)
  res.json({ id: result.lastInsertRowid, ok: true })
})

app.put('/api/works/:id', auth, (req, res) => {
  const { category, title, img, featured, tall, sort_order } = req.body
  db.prepare(
    'UPDATE works SET category=?, title=?, img=?, featured=?, tall=?, sort_order=? WHERE id=?'
  ).run(category, title, img, featured ? 1 : 0, tall ? 1 : 0, sort_order || 0, req.params.id)
  res.json({ ok: true })
})

app.delete('/api/works/:id', auth, (req, res) => {
  const work = db.prepare('SELECT img FROM works WHERE id = ?').get(req.params.id)
  if (work && work.img.startsWith('/uploads/')) {
    const filePath = path.join(UPLOADS_DIR, path.basename(work.img))
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
  db.prepare('DELETE FROM works WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ── 图片上传 ─────────────────────────────────
app.post('/api/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未收到文件' })
  const url = `/uploads/${req.file.filename}`
  res.json({ url, ok: true })
})

// ── 简历 ────────────────────────────────────
app.get('/api/resume', (req, res) => {
  const row = db.prepare('SELECT * FROM resume WHERE id = 1').get()
  res.json({
    experience: JSON.parse(row.experience || '[]'),
    education: JSON.parse(row.education || '[]'),
    skills: JSON.parse(row.skills || '[]'),
    tools: JSON.parse(row.tools || '[]'),
  })
})

app.put('/api/resume', auth, (req, res) => {
  const { experience, education, skills, tools } = req.body
  db.prepare('UPDATE resume SET experience=?, education=?, skills=?, tools=? WHERE id=1').run(
    JSON.stringify(experience || []),
    JSON.stringify(education || []),
    JSON.stringify(skills || []),
    JSON.stringify(tools || [])
  )
  res.json({ ok: true })
})

// ── 留言 ────────────────────────────────────
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: '请填写所有字段' })
  db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').run(name, email, message)
  res.json({ ok: true })
})

app.get('/api/messages', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()
  res.json(rows)
})

app.put('/api/messages/:id/read', auth, (req, res) => {
  db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

app.delete('/api/messages/:id', auth, (req, res) => {
  db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ── SPA 路由回退 ─────────────────────────────
// 所有非 API 请求都返回 index.html（Vue Router history 模式）
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  }
})

// ── 错误处理 ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: err.message || '服务器错误' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
