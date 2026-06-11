#!/bin/bash
# 清理并重新配置 authorized_keys 文件

echo "=== 清理 SSH authorized_keys 文件 ==="

# 备份原文件
cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.backup
echo "✓ 已备份原文件到 ~/.ssh/authorized_keys.backup"

# 创建新的 authorized_keys 文件
cat > ~/.ssh/authorized_keys << 'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC3LJ6aIsfDNK8+ApECMWAZPWf4EF8/XoRwRHMhPJpj97UvzKVsDf7LmXzxtnPq+ucYnyidLXfke+wrzHsYIfH16ym22LFs1Uu2KTcAYKhF6xvHZ+jhDfS1D0MCHxDRjkgdoaudjC0JtNnQLKl/e8nHCJj1Em2TnuxpK1VGyFXEHDAOpm/wo+hCArqWWd0c2sr/RIKhSe3Sxf2qb1KJ4GGJcadvwxuRcz5XwGwtTcyRpDh+QvLzUo28rjzmPbk4UVSSNq7Jj1B8ythYkql+UmGvlenDwA9IEs1B/czrlMZREqlR+Xh7DgmnDRw+cFk9HivWwJsckaZS6e+magbWkPcSGtBgQN5fyofxOtsVJHSTMN+fkjObPkXFM7exAyPVvt41v9Q8/aSbCYgXZfTB/tscFY+w4XpCaZjoPpam7fVNwu7jCkr9LOI1Yr0uBY9rrcQLpCStAB03MlUl5pWUUXGODBlk4B32wRm2aR3jz8BDZ/iK9YsAzR+fG9YmVUwCI1c= mi@DESKTOP-0ID64E7
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCu70ff1Ux3A8OGNiTrTlTvCCv5PigBvb5x+TYIq8KnLHfbC/06iYBG5ZyIVfYb1WP52utm8EK5KIJRRIy0ei0E9rjPF5sABbMBO/SkprCBeLysTou3Rt9rCcepED+HKkiCC15EzzaXHvm0UQCTnlz09KpyojSb4N8s617gYlm6AT06p1B+lR/QT6CT/8xX+AbMs8EpTJ6O4Tfb4yRXiCQp6Q2lH6qVVQxBh4qRJmBo9GdNXFfkXMxjjQq/6ZejefB2AbhcaJK3pKZn3+Kqb1ufpfeouM5J3FI27lm+p3y+d4AmlpdWT4hQ2AbsL2VL4iYTfLb+QqPSGvmrKagqnJR+1dZl2JgTlwUtlPWi0m4X5bQFPpMrmPjrmohOt+ANndr1nx71d91gAwnIxlYSvx3xd13kZqF8mC/nWJWxJIk1FtIoG4TV2on5OI58TNYfeckaAQ8R1aVJ8fvOxMYkTZqClv457NduQykXvb4U7J484K/V5k1jTjYCvY2VCxE+T1k5MB77OM0PRd7EirkMV+avESQQRZK+U/aM7Li75rjL2A9UIEp1udiQM+9235os/wBQb2bj9f0n4FHiGTPtES++4OdEjXnrio0RNDzrJaQLZrCLRNY9MJR2p94kIVOu3/RejWEynDvvoud00I8M47A3Dl+u5pKuquNEy67pIEhDPw== github-actions
EOF

# 设置正确的权限
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

echo "✓ 已清理并重新写入正确的密钥"
echo ""
echo "=== 验证结果 ==="
echo "应该只有 2 行密钥："
wc -l ~/.ssh/authorized_keys
echo ""
echo "内容预览："
cat ~/.ssh/authorized_keys
echo ""
echo "✓ 配置完成！"
