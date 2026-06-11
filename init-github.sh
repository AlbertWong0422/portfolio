#!/bin/bash
# GitHub 仓库初始化脚本

read -p "请输入你的 GitHub 用户名: " USERNAME
read -p "请输入仓库名称 (默认: portfolio): " REPO_NAME
REPO_NAME=${REPO_NAME:-portfolio}

echo ""
echo "=== 初始化 Git 仓库 ==="

# 初始化 Git
if [ ! -d .git ]; then
    git init
    echo "✓ Git 仓库已初始化"
else
    echo "✓ Git 仓库已存在"
fi

# 添加文件
git add .

# 提交
git commit -m "Initial commit: Vue portfolio project with auto-deploy" || echo "已有提交"

# 添加远程仓库
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# 推送
git branch -M main
echo ""
echo "=== 推送到 GitHub ==="
echo "如果提示输入用户名密码，建议使用 Personal Access Token"
echo "获取 Token: https://github.com/settings/tokens"
echo ""
git push -u origin main

echo ""
echo "=== ✓ 推送完成 ==="
echo ""
echo "下一步："
echo "1. 访问: https://github.com/$USERNAME/$REPO_NAME/settings/secrets/actions"
echo "2. 添加 4 个 Secrets（详见 GITHUB_DEPLOY_GUIDE.md）"
echo "3. 推送代码即可自动部署！"
echo ""
