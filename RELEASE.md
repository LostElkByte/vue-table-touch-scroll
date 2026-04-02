# 发布流程

## 发布命令

```bash
# 1. 更新版本号 (示例: 1.0.0)
export TAG_VERSION=1.0.0
pnpm update:version

# 2. 生成 Changelog
pnpm changelog

# 3. 提交并打标签
git add .
git commit -m "chore(release): v1.0.0"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

推送标签后，GitHub Actions 自动完成：
- 运行测试
- 构建包
- 创建 GitHub Release
- 发布到 NPM

## 验证发布

```bash
# 查看 NPM 版本
npm view vue3-mobile-table versions --json

# 安装测试
npm install vue3-mobile-table@latest
```

## 手动发布（备用）

如果 CI 失败，手动发布：

```bash
# 构建
pnpm build

# 进入构建目录并发布
cd dist/vue3-mobile-table
npm publish --access public
```

## NPM 权限配置

使用 **Trusted Publishing**（已配置）：

1. 访问 https://www.npmjs.com/package/vue3-mobile-table
2. Settings → Access → Grant access to GitHub Actions
3. 配置完成，无需手动设置 Token

## 文档部署

自动触发：push 到 main 分支且修改 `docs/**` 或 `packages/**`

手动部署：

```bash
pnpm build
pnpm docs:build
```

部署到: https://lostelkbyte.github.io/vue3-mobile-table/
