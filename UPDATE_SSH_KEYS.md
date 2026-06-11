# 更新 SSH 密钥配置

## 问题说明

GitHub Actions 不支持 OpenSSH 格式的密钥，需要使用 RSA PEM 格式。

---

## 步骤 1: 清理并更新服务器公钥

通过阿里云 VNC 登录服务器，执行以下命令：

### 1.1 备份现有文件
```bash
cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.backup.old
```

### 1.2 清空并写入正确的密钥
```bash
cat > ~/.ssh/authorized_keys << 'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3LJ6aIsfDNK8+ApECMWAZPWf4EF8/XoRwRHMhPJpj97UvzKVsDf7LmXzxtnPq+ucYnyidLXfke+wrzHsYIfH16ym22LFs1Uu2KTcAYKhF6xvHZ+jhDfS1D0MCHxDRjkgdoaudjC0JtNnQLKl/e8nHCJj1Em2TnuxpK1VGyFXEHDAOpm/wo+hCArqWWd0c2sr/RIKhSe3Sxf2qb1KJ4GGJcadvwxuRcz5XwGwtTcyRpDh+QvLzUo28rjzmPbk4UVSSNq7Jj1B8ythYkql+UmGvlenDwA9IEs1B/czrlMZREqlR+Xh7DgmnDRw+cFk9HivWwJsckaZS6e+magbWkPcSGtBgQN5fyofxOtsVJHSTMN+fkjObPkXFM7exAyPVvt41v9Q8/aSbCYgXZfTB/tscFY+w4XpCaZjoPpam7fVNwu7jCkr9LOI1Yr0uBY9rrcQLpCStAB03MlUl5pWUUXGODBlk4B32wRm2aR3jz8BDZ/iK9YsAzR+fG9YmVUwCI1c= mi@DESKTOP-0ID64E7
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCdZ/ocBR2yewwXJd7uMoZ1HZVwZZ6BJHQ3z8Lan3CmiSLwD7rgA6SqFWvqCSTmhU/aukejsSL8VQEdwXNcMik/MTDFHF5DpuiGxEA6dk0cCd4GMlvxOmlVIYqyHt6ZJ2QWD0nnt77HQPzBcIj2zzT/FMVltnOor99KYHmrygH01QuGGBvGmAxNlonVzHeaa4edlwRjlJ6jeeXRrUmld2f7kxIcn38y7zq4F0tyB48bycuTjiXXr+UImR2nG6I7irPHvHy57b7ywYWJDzZLIblJ1r885eIBLUqyF/tqt2Mg2KbioLmxqptb1SQ9+EyZLn5AacBcqAPBRsID1TaLrkKVKH0FVbznIy8hiLCP4cDNqowwCQLHnytrNCexzSBYFWzZ6IC+LlV+BLviyOkZ9qmA+Ql6uFnEfpUCwmWkrmbiiSjtnU/7JuDdRYYiGE/oHX8PRkyQ8UV1Kualqpt/MQdx1oS+E2XOY4vdNxQmHrnP2nXYkw65Gxqo76Q1KUwP7b7iCtvkCKusXSisAPm6Jg1NbcKm1RUCAliuRrwPeUe4IhWlfo5x1sgbyLh7LsN8Bs2l8IsjZLTysuGXocrxhPOmMfuSrAENiz//KERqpw/MCZDeGwe6FZWIzyLF5yl1MZSQwLQZ/oP4/Bfe85wiRe//QQOJyWEhdC1PmMHM83WNZQ== github-actions-rsa
EOF
```

### 1.3 设置权限
```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 1.4 验证结果
```bash
echo "应该有 2 行密钥："
wc -l ~/.ssh/authorized_keys
echo ""
echo "内容预览："
cat ~/.ssh/authorized_keys
```

应该看到正好 **2 行**，每行都是 `ssh-rsa` 开头的完整密钥。

---

## 步骤 2: 更新 GitHub Secret

### 2.1 访问 Secrets 页面
https://github.com/AlbertWong0422/portfolio/settings/secrets/actions

### 2.2 更新 SSH_PRIVATE_KEY

1. 找到 `SSH_PRIVATE_KEY`
2. 点击右侧的 **Update** 按钮
3. 删除旧内容
4. 粘贴以下新的私钥内容（完整复制，包括 BEGIN 和 END 行）：

```
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
```

5. 点击 **Update secret**

---

## 步骤 3: 测试部署

配置完成后，手动触发一次部署测试：

1. 访问 https://github.com/AlbertWong0422/portfolio/actions
2. 点击左侧 **Deploy to Server**
3. 点击右侧 **Run workflow**
4. 选择 `main` 分支
5. 点击绿色的 **Run workflow** 按钮

---

## ✅ 验证成功

- 服务器上应该只有 2 个公钥（本地 + GitHub Actions）
- GitHub Actions 部署应该能成功连接服务器
- 部署完成后访问 http://8.134.188.153 查看网站

---

## 🔍 故障排查

如果还是失败，检查：

```bash
# 在服务器上执行
cat ~/.ssh/authorized_keys | wc -l  # 应该显示 2
tail -1 ~/.ssh/authorized_keys | grep "github-actions-rsa"  # 应该能找到
```

如果密钥不对，重新执行步骤 1.2。
