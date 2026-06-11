# SSH 连接配置指南

## 问题说明

如果你遇到 `Permission denied (publickey)` 错误，说明服务器只允许密钥登录，需要先配置 SSH 密钥。

---

## 🔧 解决步骤

### 步骤 1: 登录阿里云控制台

1. 访问阿里云 ECS 控制台: https://ecs.console.aliyun.com/
2. 找到你的服务器实例（IP: `8.134.188.153`）
3. 点击实例右侧的 **远程连接** 按钮
4. 选择 **VNC 远程连接**（Workbench 也可以）
5. 输入 VNC 密码（如果是第一次使用会让你设置密码）

---

### 步骤 2: 在服务器上配置 SSH 密钥

登录 VNC 终端后，**逐行复制执行**以下命令：

#### 2.1 创建 SSH 目录
```bash
mkdir -p ~/.ssh
```

#### 2.2 添加你本地电脑的公钥
```bash
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3LJ6aIsfDNK8+ApECMWAZPWf4EF8/XoRwRHMhPJpj97UvzKVsDf7LmXzxtnPq+ucYnyidLXfke+wrzHsYIfH16ym22LFs1Uu2KTcAYKhF6xvHZ+jhDfS1D0MCHxDRjkgdoaudjC0JtNnQLKl/e8nHCJj1Em2TnuxpK1VGyFXEHDAOpm/wo+hCArqWWd0c2sr/RIKhSe3Sxf2qb1KJ4GGJcadvwxuRcz5XwGwtTcyRpDh+QvLzUo28rjzmPbk4UVSSNq7Jj1B8ythYkql+UmGvlenDwA9IEs1B/czrlMZREqlR+Xh7DgmnDRw+cFk9HivWwJsckaZS6e+magbWkPcSGtBgQN5fyofxOtsVJHSTMN+fkjObPkXFM7exAyPVvt41v9Q8/aSbCYgXZfTB/tscFY+w4XpCaZjoPpam7fVNwu7jCkr9LOI1Yr0uBY9rrcQLpCStAB03MlUl5pWUUXGODBlk4B32wRm2aR3jz8BDZ/iK9YsAzR+fG9YmVUwCI1c= mi@DESKTOP-0ID64E7" >> ~/.ssh/authorized_keys
```

#### 2.3 添加 GitHub Actions 的公钥
```bash
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCu70ff1Ux3A8OGNiTrTlTvCCv5PigBvb5x+TYIq8KnLHfbC/06iYBG5ZyIVfYb1WP52utm8EK5KIJRRIy0ei0E9rjPF5sABbMBO/SkprCBeLysTou3Rt9rCcepED+HKkiCC15EzzaXHvm0UQCTnlz09KpyojSb4N8s617gYlm6AT06p1B+lR/QT6CT/8xX+AbMs8EpTJ6O4Tfb4yRXiCQp6Q2lH6qVVQxBh4qRJmBo9GdNXFfkXMxjjQq/6ZejefB2AbhcaJK3pKZn3+Kqb1ufpfeouM5J3FI27lm+p3y+d4AmlpdWT4hQ2AbsL2VL4iYTfLb+QqPSGvmrKagqnJR+1dZl2JgTlwUtlPWi0m4X5bQFPpMrmPjrmohOt+ANndr1nx71d91gAwnIxlYSvx3xd13kZqF8mC/nWJWxJIk1FtIoG4TV2on5OI58TNYfeckaAQ8R1aVJ8fvOxMYkTZqClv457NduQykXvb4U7J484K/V5k1jTjYCvY2VCxE+T1k5MB77OM0PRd7EirkMV+avESQQRZK+U/aM7Li75rjL2A9UIEp1udiQM+9235os/wBQb2bj9f0n4FHiGTPtES++4OdEjXnrio0RNDzrJaQLZrCLRNY9MJR2p94kIVOu3/RejWEynDvvoud00I8M47A3Dl+u5pKuquNEy67pIEhDPw== github-actions" >> ~/.ssh/authorized_keys
```

#### 2.4 设置正确的权限
```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

#### 2.5 验证配置
```bash
cat ~/.ssh/authorized_keys
```

应该能看到两个 `ssh-rsa` 开头的密钥。

---

### 步骤 3: 测试 SSH 连接

在**本地电脑**的终端执行：

```bash
ssh root@8.134.188.153
```

如果能成功登录，说明配置完成！

---

## ✅ 配置完成后的下一步

SSH 连接成功后，继续以下步骤：

### 1. 创建 GitHub 仓库
- 访问: https://github.com/new
- 仓库名称: `portfolio`
- 类型: Public（免费）
- 不勾选任何初始化选项
- 点击 Create repository

### 2. 推送代码到 GitHub

在本地项目目录执行：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# 推送
git branch -M main
git push -u origin main
```

### 3. 配置 GitHub Secrets

打开仓库页面，进入 **Settings** → **Secrets and variables** → **Actions**

点击 **New repository secret**，添加以下 4 个密钥：

#### Secret 1: SSH_PRIVATE_KEY
```
名称: SSH_PRIVATE_KEY
值: 查看项目根目录的 github_deploy_key 文件内容（完整复制）
```

#### Secret 2: SERVER_IP
```
名称: SERVER_IP
值: 8.134.188.153
```

#### Secret 3: SERVER_USER
```
名称: SERVER_USER
值: root
```

#### Secret 4: REMOTE_DIR
```
名称: REMOTE_DIR
值: /var/www/portfolio
```

### 4. 测试自动部署

修改任意文件并推送：

```bash
echo "# My Portfolio" > README.md
git add README.md
git commit -m "Test auto deploy"
git push origin main
```

然后访问 GitHub 仓库的 **Actions** 标签，查看部署进度。

---

## 🔍 故障排查

### 问题 1: VNC 连接失败
- 确认 VNC 密码正确
- 尝试使用 Workbench 连接
- 重启实例后再试

### 问题 2: SSH 仍然无法连接
在服务器 VNC 终端检查：

```bash
# 检查 authorized_keys 文件
ls -la ~/.ssh/authorized_keys

# 查看内容
cat ~/.ssh/authorized_keys

# 查看 SSH 服务日志
tail -f /var/log/secure
```

### 问题 3: GitHub Actions 部署失败
查看 Actions 日志，常见原因：
- SSH_PRIVATE_KEY 格式错误（需要完整复制，包括 BEGIN 和 END 行）
- 服务器目录不存在（首次部署会自动创建）
- 服务器磁盘空间不足

---

## 📚 相关文档

- **完整部署指南**: `GITHUB_DEPLOY_GUIDE.md`
- **自动部署配置**: `AUTO_DEPLOY.md`
- **部署检查清单**: `DEPLOYMENT_CHECKLIST.md`

---

## 💡 提示

- SSH 密钥配置是**一次性**操作，配置完成后就可以直接用 SSH 登录
- GitHub Actions 会使用配置好的密钥自动部署
- 每次推送代码到 `main` 分支都会触发自动部署
- 部署过程大约 2-3 分钟

---

有问题随时查看文档或询问！🚀
