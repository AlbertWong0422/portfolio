# 部署检查清单

## 📋 部署前检查

### 本地环境
- [ ] 已安装 Node.js 和 npm
- [ ] 已克隆/下载项目代码
- [ ] 可以正常运行 `npm run dev`
- [ ] 可以正常构建 `npm run build`

### 服务器准备
- [ ] 服务器 IP: `8.134.188.153`
- [ ] 可以 SSH 登录: `ssh root@8.134.188.153`
- [ ] 服务器已安装 Node.js (16+)
- [ ] 服务器已安装 PM2
- [ ] 服务器已安装 Nginx（可选）
- [ ] 防火墙开放 80 端口（Nginx）或 3000 端口（纯 Node.js）

## 🚀 首次部署步骤

### 步骤 1: 服务器初始化
```bash
# 将初始化脚本上传到服务器
scp server-setup.sh root@8.134.188.153:/root/

# SSH 登录服务器并执行
ssh root@8.134.188.153
bash /root/server-setup.sh
exit
```

### 步骤 2: 修改配置
在本地修改以下配置（如果需要）：

1. `deploy.sh` - 确认服务器 IP 正确
2. `nginx.conf` - 如果有域名，修改 `server_name`
3. `ecosystem.config.js` - 调整端口或内存限制

### 步骤 3: 执行部署
```bash
# 在本地项目目录执行
bash deploy.sh
```

### 步骤 4: 验证部署
访问: http://8.134.188.153

- [ ] 首页可以正常访问
- [ ] 可以登录后台 (admin / admin123)
- [ ] 修改密码成功
- [ ] 上传图片功能正常
- [ ] API 接口正常

## 🔄 后续更新部署

每次代码更新后，只需执行：
```bash
bash deploy.sh
```

## 🛠 常用维护命令

### 在服务器上执行：

```bash
# 查看服务状态
pm2 status

# 查看实时日志
pm2 logs portfolio

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 重启服务
pm2 restart portfolio

# 查看资源占用
pm2 monit

# 测试 Nginx 配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

## ⚠️ 安全建议

- [ ] 修改默认管理员密码
- [ ] 修改 `.env` 中的 `JWT_SECRET` 为随机字符串
- [ ] 配置 HTTPS（推荐使用 Let's Encrypt）
- [ ] 配置防火墙，只开放必要端口
- [ ] 定期备份数据库文件: `server/db.sqlite`
- [ ] 定期备份上传的图片: `/var/www/portfolio/uploads/`

## 🔐 配置 HTTPS (可选)

```bash
# 在服务器上安装 certbot
apt install -y certbot python3-certbot-nginx

# 获取证书（需要域名）
certbot --nginx -d your-domain.com

# 自动续期
certbot renew --dry-run
```

## 📊 监控建议

- 使用 PM2 Plus 进行应用监控
- 配置日志轮转，避免日志文件过大
- 定期检查磁盘空间（上传目录）

## 🐛 故障排查

### 服务无法启动
```bash
pm2 logs portfolio --lines 50
```

### Nginx 502 错误
- 检查 Node.js 服务是否运行: `pm2 status`
- 检查端口是否正确: `netstat -tlnp | grep 3000`

### 无法上传图片
- 检查上传目录权限: `ls -la /var/www/portfolio/uploads/`
- 检查磁盘空间: `df -h`

## 📝 备份恢复

### 备份
```bash
# 在服务器上
tar -czf portfolio-backup-$(date +%Y%m%d).tar.gz \
  /var/www/portfolio/server/db.sqlite \
  /var/www/portfolio/uploads/
```

### 恢复
```bash
tar -xzf portfolio-backup-YYYYMMDD.tar.gz -C /
pm2 restart portfolio
```
