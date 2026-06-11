#!/bin/bash
# 服务器初始化脚本
# 在服务器上执行此脚本进行环境配置

set -e

echo "=== 开始初始化服务器环境 ==="

# 1. 更新系统
echo "1. 更新系统包..."
apt update

# 2. 安装 Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    echo "2. 安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
else
    echo "2. Node.js 已安装: $(node -v)"
fi

# 3. 安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo "3. 安装 PM2..."
    npm install -g pm2
else
    echo "3. PM2 已安装: $(pm2 -v)"
fi

# 4. 安装 Nginx (可选)
if ! command -v nginx &> /dev/null; then
    read -p "是否安装 Nginx? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "4. 安装 Nginx..."
        apt install -y nginx
        systemctl enable nginx
        systemctl start nginx
    fi
else
    echo "4. Nginx 已安装: $(nginx -v 2>&1)"
fi

# 5. 创建项目目录
echo "5. 创建项目目录..."
mkdir -p /var/www/portfolio/{frontend,server,uploads,logs}
chmod 755 /var/www/portfolio
chmod 777 /var/www/portfolio/uploads

# 6. 配置防火墙 (如果使用 ufw)
if command -v ufw &> /dev/null; then
    echo "6. 配置防火墙..."
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
fi

# 7. PM2 开机自启
echo "7. 配置 PM2 开机自启..."
pm2 startup | tail -1 | bash || true

echo ""
echo "=== ✓ 服务器初始化完成 ==="
echo ""
echo "下一步："
echo "1. 在本地执行: bash deploy.sh"
echo "2. 首次部署后访问: http://$(curl -s ifconfig.me)"
echo ""
