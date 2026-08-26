const express = require('express')
const initSqlJs = require('sql.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads')
const DB_PATH = path.join(__dirname, 'db.sqlite')
const SECRET_PATH = path.join(__dirname, '.jwt_secret')

// JWT_SECRET 持久化：优先环境变量，否则从文件读取或生成
let JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  if (fs.existsSync(SECRET_PATH)) {
    JWT_SECRET = fs.readFileSync(SECRET_PATH, 'utf8').trim()
  } else {
    JWT_SECRET = require('crypto').randomBytes(32).toString('hex')
    fs.writeFileSync(SECRET_PATH, JWT_SECRET, 'utf8')
  }
}

let db

function saveDb() {
  const data = db.export()
  fs.writeFileSync(DB_PATH, Buffer.from(data))
}

async function start() {
  const SQL = await initSqlJs()

  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buf)
  } else {
    db = new SQL.Database()
  }

  db.run(`
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
      description TEXT DEFAULT '',
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
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      sort_order INTEGER DEFAULT 0
    );
  `)

  // 数据库迁移：给旧表加新列
  try { db.run('ALTER TABLE works ADD COLUMN description TEXT DEFAULT ""') } catch {}
  try { db.run('ALTER TABLE works ADD COLUMN is_sample INTEGER DEFAULT 0') } catch {}

  // 初始化默认分类
  const catExists = db.exec('SELECT id FROM categories LIMIT 1')
  if (catExists.length === 0 || catExists[0].values.length === 0) {
    db.run("INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('未分类', 0)")
    db.run("INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('摄影', 1)")
    db.run("INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('设计', 2)")
    db.run("INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('插画', 3)")
    db.run("INSERT OR IGNORE INTO categories (name, sort_order) VALUES ('其他', 4)")
  }

  // 初始化默认数据
  const adminExists = db.exec('SELECT id FROM admin WHERE id = 1')
  if (adminExists.length === 0 || adminExists[0].values.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10)
    db.run('INSERT OR IGNORE INTO admin (id, username, password) VALUES (1, ?, ?)', ['admin', hash])
  }
  db.run('INSERT OR IGNORE INTO profile (id) VALUES (1)')
  db.run('INSERT OR IGNORE INTO resume (id) VALUES (1)')
  saveDb()

  // ── 中间件 ──────────────────────────────────
  app.use(cors())
  app.use(express.json())
  app.use(express.static(path.join(__dirname, '../dist')))
  app.use('/uploads', express.static(UPLOADS_DIR))

  // PLACEHOLDER_ROUTES

  // Helper: get single row
  function getRow(sql, params = []) {
    const result = db.exec(sql, params)
    if (result.length === 0 || result[0].values.length === 0) return null
    const cols = result[0].columns
    const vals = result[0].values[0]
    const row = {}
    cols.forEach((c, i) => row[c] = vals[i])
    return row
  }

  // Helper: get all rows
  function getAll(sql, params = []) {
    const result = db.exec(sql, params)
    if (result.length === 0) return []
    const cols = result[0].columns
    return result[0].values.map(vals => {
      const row = {}
      cols.forEach((c, i) => row[c] = vals[i])
      return row
    })
  }

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
    limits: { fileSize: 10 * 1024 * 1024 },
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
    const admin = getRow('SELECT * FROM admin WHERE username = ?', [username])
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, username: admin.username })
  })

  // PLACEHOLDER_MORE_ROUTES

  app.put('/api/admin/password', auth, (req, res) => {
    const { oldPassword, newPassword } = req.body
    const admin = getRow('SELECT * FROM admin WHERE id = ?', [req.user.id])
    if (!admin || !bcrypt.compareSync(oldPassword, admin.password)) {
      return res.status(400).json({ error: '旧密码错误' })
    }
    const hash = bcrypt.hashSync(newPassword, 10)
    db.run('UPDATE admin SET password = ? WHERE id = ?', [hash, req.user.id])
    saveDb()
    res.json({ ok: true })
  })

  // ── 账号管理 ────────────────────────────────
  app.get('/api/admin/accounts', auth, (req, res) => {
    const rows = getAll('SELECT id, username FROM admin')
    res.json(rows)
  })

  app.post('/api/admin/accounts', auth, (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' })
    if (password.length < 6) return res.status(400).json({ error: '密码至少6位' })
    const existing = getRow('SELECT id FROM admin WHERE username = ?', [username])
    if (existing) return res.status(400).json({ error: '用户名已存在' })
    const hash = bcrypt.hashSync(password, 10)
    db.run('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hash])
    saveDb()
    res.json({ ok: true })
  })

  app.delete('/api/admin/accounts/:id', auth, (req, res) => {
    const id = parseInt(req.params.id)
    if (id === req.user.id) return res.status(400).json({ error: '不能删除当前登录的账号' })
    db.run('DELETE FROM admin WHERE id = ?', [id])
    saveDb()
    res.json({ ok: true })
  })

  // ── 个人信息 ────────────────────────────────
  app.get('/api/profile', (req, res) => {
    const row = getRow('SELECT * FROM profile WHERE id = 1')
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
    db.run(`UPDATE profile SET ${sets} WHERE id = 1`, values)
    saveDb()
    res.json({ ok: true })
  })

  // ── 作品集 ──────────────────────────────────
  app.get('/api/works', (req, res) => {
    const rows = getAll('SELECT * FROM works ORDER BY sort_order ASC, created_at DESC')
    res.json(rows)
  })

  app.post('/api/works', auth, (req, res) => {
    const { category, title, img, description, featured, tall, sort_order } = req.body
    if (!title || !img) return res.status(400).json({ error: '标题和图片不能为空' })
    db.run(
      'INSERT INTO works (category, title, img, description, featured, tall, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category || 'photo', title, img, description || '', featured ? 1 : 0, tall ? 1 : 0, sort_order || 0]
    )
    saveDb()
    res.json({ ok: true })
  })

  app.put('/api/works/:id', auth, (req, res) => {
    const { category, title, img, description, featured, tall, sort_order } = req.body
    db.run(
      'UPDATE works SET category=?, title=?, img=?, description=?, featured=?, tall=?, sort_order=? WHERE id=?',
      [category, title, img, description || '', featured ? 1 : 0, tall ? 1 : 0, sort_order || 0, req.params.id]
    )
    saveDb()
    res.json({ ok: true })
  })

  app.delete('/api/works/:id', auth, (req, res) => {
    const work = getRow('SELECT img FROM works WHERE id = ?', [req.params.id])
    if (work && work.img && work.img.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_DIR, path.basename(work.img))
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    db.run('DELETE FROM works WHERE id = ?', [req.params.id])
    saveDb()
    res.json({ ok: true })
  })

  // PLACEHOLDER_FINAL_ROUTES

  // ── 分类管理 ─────────────────────────────────
  app.get('/api/categories', (req, res) => {
    const rows = getAll('SELECT * FROM categories ORDER BY sort_order ASC, id ASC')
    res.json(rows)
  })

  app.post('/api/categories', auth, (req, res) => {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).json({ error: '分类名称不能为空' })
    const existing = getRow('SELECT id FROM categories WHERE name = ?', [name.trim()])
    if (existing) return res.status(400).json({ error: '该分类已存在' })
    db.run('INSERT INTO categories (name) VALUES (?)', [name.trim()])
    saveDb()
    res.json({ ok: true })
  })

  app.delete('/api/categories/:id', auth, (req, res) => {
    db.run('DELETE FROM categories WHERE id = ?', [req.params.id])
    saveDb()
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
    const row = getRow('SELECT * FROM resume WHERE id = 1')
    res.json({
      experience: JSON.parse(row.experience || '[]'),
      education: JSON.parse(row.education || '[]'),
      skills: JSON.parse(row.skills || '[]'),
      tools: JSON.parse(row.tools || '[]'),
    })
  })

  app.put('/api/resume', auth, (req, res) => {
    const { experience, education, skills, tools } = req.body
    db.run('UPDATE resume SET experience=?, education=?, skills=?, tools=? WHERE id=1', [
      JSON.stringify(experience || []),
      JSON.stringify(education || []),
      JSON.stringify(skills || []),
      JSON.stringify(tools || [])
    ])
    saveDb()
    res.json({ ok: true })
  })

  // ── 留言 ────────────────────────────────────
  app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ error: '请填写所有字段' })
    db.run('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message])
    saveDb()
    res.json({ ok: true })
  })

  app.get('/api/messages', auth, (req, res) => {
    const rows = getAll('SELECT * FROM messages ORDER BY created_at DESC')
    res.json(rows)
  })

  app.put('/api/messages/:id/read', auth, (req, res) => {
    db.run('UPDATE messages SET read = 1 WHERE id = ?', [req.params.id])
    saveDb()
    res.json({ ok: true })
  })

  app.delete('/api/messages/:id', auth, (req, res) => {
    db.run('DELETE FROM messages WHERE id = ?', [req.params.id])
    saveDb()
    res.json({ ok: true })
  })

  // ── SPA 路由回退 ─────────────────────────────
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'))
    } else {
      next()
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
}

start().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
})




