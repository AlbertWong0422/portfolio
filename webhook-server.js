const express = require('express')
const { exec } = require('child_process')
const crypto = require('crypto')

const app = express()
const PORT = 9000
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret'
const DEPLOY_SCRIPT = '/var/www/portfolio/auto-deploy.sh'

app.use(express.json())

// GitLab/GitHub Webhook 端点
app.post('/webhook', (req, res) => {
  // 验证签名（GitLab 使用 X-Gitlab-Token，GitHub 使用 X-Hub-Signature-256）
  const gitlabToken = req.headers['x-gitlab-token']
  const githubSignature = req.headers['x-hub-signature-256']

  if (gitlabToken) {
    // GitLab webhook
    if (gitlabToken !== SECRET) {
      return res.status(403).send('Invalid token')
    }
  } else if (githubSignature) {
    // GitHub webhook
    const signature = crypto
      .createHmac('sha256', SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex')
    if (`sha256=${signature}` !== githubSignature) {
      return res.status(403).send('Invalid signature')
    }
  } else {
    return res.status(403).send('No authentication header')
  }

  console.log(`[${new Date().toISOString()}] 收到部署请求`)

  // 执行部署脚本
  exec(DEPLOY_SCRIPT, (error, stdout, stderr) => {
    if (error) {
      console.error('部署失败:', error)
      return
    }
    console.log('部署输出:', stdout)
    if (stderr) console.error('部署错误:', stderr)
  })

  res.status(200).send('Webhook received, deploying...')
})

// 健康检查
app.get('/health', (req, res) => {
  res.send('Webhook server is running')
})

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`)
})
