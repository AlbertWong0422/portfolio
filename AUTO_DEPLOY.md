# 自动部署配置指南

## 📦 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **GitLab CI/CD** | 配置简单，集成度高，免费 | 需要 GitLab Runner | 推荐使用 GitLab 托管代码 |
| **GitHub Actions** | 配置简单，无需额外服务器 | 私有仓库有分钟数限制 | 推荐使用 GitHub 托管代码 |
| **Git Webhook** | 完全自主控制，无限制 | 需要自己维护 webhook 服务 | 自托管 Git 或需要定制化 |

---

## 方案一：GitLab CI/CD

### 1. 创建 GitLab 仓库
```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit"

# 添加 GitLab 远程仓库
git remote add origin https://gitlab.com/your-username/portfolio.git
git push -u origin main
```

### 2. 配置 SSH 密钥

在本地生成 SSH 密钥（如果没有）：
```bash
ssh-keygen -t rsa -b 4096 -C "gitlab-ci@portfolio"
cat ~/.ssh/id_rsa
```

### 3. 在 GitLab 配置 CI/CD Variables

进入项目 → Settings → CI/CD → Variables，添加：

| Key | Value | Protected | Masked |
|-----|-------|-----------|--------|
| `SSH_PRIVATE_KEY` | 你的私钥内容 | ✓ | ✓ |

### 4. 在服务器添加公钥

```bash
# 在服务器上执行
cat >> ~/.ssh/authorized_keys << 'EOF'
你的公钥内容
EOF
chmod 600 ~/.ssh/authorized_keys
```

### 5. 推送代码触发部署

```bash
git push origin main
```

GitLab 会自动执行 `.gitlab-ci.yml` 中定义的流程。

### 6. 查看部署状态

进入项目 → CI/CD → Pipelines，查看执行状态。

---

## 方案二：GitHub Actions

### 1. 创建 GitHub 仓库

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/portfolio.git
git push -u origin main
```

### 2. 配置 Secrets

进入仓库 → Settings → Secrets and variables → Actions，添加：

| Name | Value |
|------|-------|
| `SERVER_IP` | 8.134.188.153 |
| `SERVER_USER` | root |
| `REMOTE_DIR` | /var/www/portfolio |
| `SSH_PRIVATE_KEY` | 你的私钥内容 |

### 3. 在服务器添加公钥

同 GitLab 方案的步骤 4。

### 4. 推送代码自动部署

```bash
git push origin main
```

查看部署：仓库 → Actions → 查看 workflow 执行状态。

---

## 方案三：Git Webhook（自托管）

### 1. 在服务器上设置

```bash
# SSH 到服务器
ssh root@8.134.188.153

# 克隆代码到服务器
cd /var/www
git clone https://gitlab.com/your-username/portfolio.git portfolio
cd portfolio

# 配置 Git（避免后续 pull 时提示）
git config pull.rebase false

# 设置部署脚本权限
chmod +x auto-deploy.sh

# 启动 webhook 服务器
npm install
pm2 start webhook-server.js --name webhook
pm2 save
```

### 2. 配置防火墙

```bash
# 开放 webhook 端口
ufw allow 9000/tcp
```

### 3. 在 GitLab/GitHub 配置 Webhook

**GitLab:**
- 进入项目 → Settings → Webhooks
- URL: `http://8.134.188.153:9000/webhook`
- Secret token: `your-webhook-secret`
- Trigger: Push events
- 点击 Add webhook

**GitHub:**
- 进入仓库 → Settings → Webhooks → Add webhook
- Payload URL: `http://8.134.188.153:9000/webhook`
- Content type: `application/json`
- Secret: `your-webhook-secret`
- Events: Just the push event
- 点击 Add webhook

### 4. 设置环境变量

```bash
# 在服务器上
pm2 delete webhook
WEBHOOK_SECRET=your-webhook-secret pm2 start webhook-server.js --name webhook
pm2 save
```

### 5. 测试 Webhook

推送代码到仓库，检查服务器日志：
```bash
pm2 logs webhook
```

---

## 🔧 推荐配置

### 对于个人项目
推荐使用 **GitLab CI/CD** 或 **GitHub Actions**：
- 无需在服务器上额外运行服务
- 配置简单，维护成本低
- 有完整的日志和历史记录

### 对于企业项目
推荐使用 **Git Webhook**：
- 更灵活，可以自定义部署流程
- 更安全，不需要把 SSH 密钥放在第三方平台
- 可以与内部系统集成

---

## ⚙️ 进阶配置

### 1. 仅在特定分支部署

**GitLab CI/CD:**
```yaml
deploy:
  only:
    - main
    - production
```

**GitHub Actions:**
```yaml
on:
  push:
    branches:
      - main
      - production
```

### 2. 部署前运行测试

**GitLab CI/CD:**
```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm run test
```

**GitHub Actions:**
```yaml
- name: 运行测试
  run: |
    npm install
    npm run test
```

### 3. 部署通知

可以集成 Slack、钉钉、企业微信等通知：

```bash
# 在 auto-deploy.sh 末尾添加
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text":"Portfolio 部署成功"}' \
  https://your-webhook-url
```

### 4. 回滚机制

```bash
# 在服务器上保留历史版本
cd /var/www/portfolio
git log --oneline -5  # 查看最近 5 次提交

# 回滚到指定版本
git reset --hard <commit-hash>
bash auto-deploy.sh
```

---

## 🐛 常见问题

### Q1: SSH 连接失败
```bash
# 检查密钥格式
ssh-keygen -p -f ~/.ssh/id_rsa -m pem

# 测试连接
ssh -i ~/.ssh/id_rsa root@8.134.188.153
```

### Q2: Webhook 未触发
- 检查防火墙是否开放端口
- 检查 Secret 是否匹配
- 查看 webhook 日志: `pm2 logs webhook`

### Q3: 部署卡住
- 检查服务器磁盘空间: `df -h`
- 检查 PM2 服务状态: `pm2 status`
- 查看详细日志: `pm2 logs portfolio --lines 100`

---

## 📊 监控部署

### 查看部署历史
```bash
# GitLab
访问项目 → CI/CD → Pipelines

# GitHub
访问仓库 → Actions

# Webhook
pm2 logs webhook --lines 50
```

### 部署统计
```bash
# 查看最近 10 次部署
git log --oneline -10

# 查看今天的部署次数
git log --since="today" --oneline | wc -l
```

---

## ✅ 快速开始

选择一个方案，按照上面的步骤操作：

1. **GitLab CI/CD**: 适合大多数场景 ✨
2. **GitHub Actions**: 如果你使用 GitHub
3. **Git Webhook**: 需要更多控制权

配置完成后，每次推送代码都会自动部署到服务器！
