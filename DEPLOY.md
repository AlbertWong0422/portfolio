# Portfolio 部署文档

## 服务器要求

- Node.js 16+
- PM2 (进程管理)
- Nginx (可选，用于反向代理)

## 快速部署

### 方案一：Nginx + Node.js（推荐）

你的服务器需要安装：
```bash
# 在服务器上执行
sudo apt update
sudo apt install -y nginx nodejs npm
sudo npm install -g pm2

# 创建项目目录
sudo mkdir -p /var/www/portfolio/{frontend,server,uploads}
sudo chown -R $USER:$USER /var/www/portfolio
```

本地执行部署：
```bash
# 1. 构建并部署
bash deploy.sh

# 2. 首次部署后，配置 PM2 开机自启
ssh root@8.134.188.153 "pm2 startup && pm2 save"
```

### 方案二：仅 Node.js（简化方案）

如果不想配置 Nginx，可以让 Node.js 直接服务所有内容（已在 server/index.js 中配置好）。

在服务器上执行：
```bash
# 创建目录
mkdir -p /var/www/portfolio/{uploads,logs}
cd /var/www/portfolio

# 上传整个项目（或通过 git clone）
# 然后执行：
npm install
npm run build
cd server && npm install
cd ..

# 启动服务
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

本地访问：`http://8.134.188.153:3000`

## 环境变量配置

在服务器上创建 `.env` 文件（参考 `.env.example`）：
```bash
PORT=3000
JWT_SECRET=请修改为一个随机字符串
UPLOADS_DIR=/var/www/portfolio/uploads
NODE_ENV=production
```

## 常用命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs portfolio

# 重启服务
pm2 restart portfolio

# 停止服务
pm2 stop portfolio
```

## 默认账号

- 用户名: `admin`
- 密码: `admin123`

⚠️ **首次登录后请立即修改密码！**

## 访问地址

- 方案一（Nginx）: http://8.134.188.153
- 方案二（Node.js）: http://8.134.188.153:3000
