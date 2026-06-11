#!/bin/bash
# 自动部署脚本（在服务器上执行）

set -e

PROJECT_DIR="/var/www/portfolio"
REPO_URL="https://gitlab.com/your-username/portfolio.git"  # 修改为你的仓库地址

cd $PROJECT_DIR

echo "[$(date)] 开始自动部署..."

# 1. 拉取最新代码
git pull origin main

# 2. 构建前端
npm install
npm run build

# 3. 复制前端文件
rm -rf frontend/*
cp -r dist/* frontend/

# 4. 更新后端依赖
cd server
npm install --production
cd ..

# 5. 重启服务
pm2 restart portfolio

# 6. 重载 Nginx（如果有）
if command -v nginx &> /dev/null; then
  nginx -t && systemctl reload nginx
fi

echo "[$(date)] 部署完成"
