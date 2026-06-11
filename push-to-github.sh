#!/bin/bash
# 快速推送到 GitHub

echo "请输入你的 GitHub 用户名:"
read USERNAME

echo "请输入仓库名称 (默认: portfolio):"
read REPO_NAME
REPO_NAME=${REPO_NAME:-portfolio}

# 检查是否已经初始化
if [ ! -d .git ]; then
    echo "初始化 Git 仓库..."
    git init
fi

# 添加所有文件
echo "添加文件..."
git add .

# 提交
echo "提交代码..."
git commit -m "Initial commit: Portfolio project with GitHub Actions auto-deploy" || echo "已有提交，跳过"

# 设置远程仓库
echo "设置远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# 推送
echo "推送到 GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✓ 代码已推送到 GitHub"
echo ""
echo "下一步: 配置 GitHub Secrets"
echo "访问: https://github.com/$USERNAME/$REPO_NAME/settings/secrets/actions"
