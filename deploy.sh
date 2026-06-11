#!/bin/bash
# 部署脚本：将本地构建产物和后端代码上传到服务器
# 使用方法：bash deploy.sh

set -e  # 遇到错误立即退出

SERVER="root@8.134.188.153"
REMOTE_DIR="/var/www/portfolio"

echo "=== 1. 构建前台 ==="
cd "$(dirname "$0")"
npm install
npm run build

echo "=== 2. 创建服务器目录结构 ==="
ssh $SERVER "mkdir -p $REMOTE_DIR/{frontend,server,uploads,logs}"

echo "=== 3. 上传前台静态文件 ==="
scp -r dist/* $SERVER:$REMOTE_DIR/frontend/

echo "=== 4. 上传后端代码 ==="
scp server/index.js server/package.json $SERVER:$REMOTE_DIR/server/

echo "=== 5. 上传 Nginx 配置 ==="
scp nginx.conf $SERVER:/etc/nginx/conf.d/portfolio.conf

echo "=== 6. 服务器端操作 ==="
ssh $SERVER << 'EOF'
  set -e

  # 安装后端依赖
  cd /var/www/portfolio/server
  npm install --production

  # 检查并重载 Nginx
  if command -v nginx &> /dev/null; then
    nginx -t && systemctl reload nginx
    echo "✓ Nginx 已重载"
  else
    echo "⚠ Nginx 未安装，跳过"
  fi

  # 启动/重启后端
  if command -v pm2 &> /dev/null; then
    pm2 delete portfolio 2>/dev/null || true
    pm2 start index.js --name portfolio
    pm2 save
    echo "✓ PM2 服务已启动"
  else
    echo "⚠ PM2 未安装，请手动安装: npm install -g pm2"
  fi

  echo ""
  echo "=== ✓ 部署完成 ==="
  echo "访问地址: http://8.134.188.153"
  echo "默认账号: admin / admin123"
  echo ""
EOF
