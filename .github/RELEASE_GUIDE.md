# 发布指南

本文档说明如何发布新版本的 `vue-table-touch-scroll`。

## 📋 发布前检查清单

在发布新版本之前，请确保：

- [ ] 所有测试通过 (`pnpm test`)
- [ ] 代码检查通过 (`pnpm lint`)
- [ ] 类型检查通过 (`pnpm typecheck`)
- [ ] 构建成功 (`pnpm build`)
- [ ] 文档已更新
- [ ] CHANGELOG.md 已更新
- [ ] 版本号符合语义化版本规范

## 🔢 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

- **MAJOR (x.0.0)**: 不兼容的 API 变更
- **MINOR (0.x.0)**: 向后兼容的新功能
- **PATCH (0.0.x)**: 向后兼容的 Bug 修复

### 示例

```bash
# Bug 修复
0.0.1 -> 0.0.2

# 新功能
0.0.2 -> 0.1.0

# 破坏性变更
0.1.0 -> 1.0.0
```

## 🚀 发布流程

### 方式 1: 自动发布（推荐）

使用 npm version 命令自动更新版本并创建 tag：

```bash
# 1. 确保在 main 分支且代码最新
git checkout main
git pull origin main

# 2. 运行测试和构建
pnpm test
pnpm build

# 3. 更新 CHANGELOG
pnpm changelog

# 4. 提交 CHANGELOG
git add CHANGELOG.md
git commit -m "docs: update changelog"

# 5. 更新版本（自动创建 git tag）
# Patch 版本 (0.0.1 -> 0.0.2)
npm version patch

# Minor 版本 (0.0.2 -> 0.1.0)
npm version minor

# Major 版本 (0.1.0 -> 1.0.0)
npm version major

# 6. 推送代码和 tag
git push origin main
git push origin --tags

# 7. GitHub Actions 自动完成：
#    - 运行完整测试
#    - 创建 GitHub Release
#    - 发布到 NPM
```

### 方式 2: 手动发布

```bash
# 1. 手动更新版本号
# 编辑 packages/vue-table-touch-scroll/package.json
# 编辑 packages/core/package.json
# 编辑 packages/utils/package.json

# 2. 更新 CHANGELOG
vim CHANGELOG.md

# 3. 提交变更
git add .
git commit -m "chore: release v1.0.0"

# 4. 创建 tag
git tag v1.0.0

# 5. 推送
git push origin main
git push origin v1.0.0

# 6. 在 GitHub 上手动创建 Release
# 或等待 GitHub Actions 自动创建
```

## 📝 更新 CHANGELOG

### 自动生成

使用 conventional-changelog：

```bash
pnpm changelog
```

这会基于 commit 信息自动生成 CHANGELOG。

### 手动编辑

CHANGELOG 格式：

```markdown
## [1.0.0] - 2024-03-20

### Added
- 新功能描述

### Changed
- 变更描述

### Fixed
- Bug 修复描述

### Breaking Changes
- 破坏性变更说明
```

## 🔄 GitHub Actions 工作流

推送 tag 后，GitHub Actions 会自动执行：

### 1. Release Workflow (`release.yml`)

```yaml
触发条件: 推送 v* tag
步骤:
  1. 运行测试
  2. 构建项目
  3. 创建 GitHub Release
  4. 发布到 NPM
```

### 2. Docs Deployment (`docs-deploy-release.yml`)

```yaml
触发条件: 创建 Release
步骤:
  1. 构建文档
  2. 部署到 GitHub Pages
```

## 🔐 必需的 Secrets

确保在 GitHub 仓库设置中配置了以下 Secrets：

- **NPM_TOKEN**: NPM 发布令牌
  - 获取方式: https://www.npmjs.com/settings/[username]/tokens
  - 类型: Automation token
  - 权限: Read and Publish

- **CODECOV_TOKEN**: Codecov 上传令牌（可选）
  - 获取方式: https://codecov.io/

## 📦 NPM 发布配置

### package.json 配置

```json
{
  "name": "vue-table-touch-scroll",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public"
  }
}
```

### 发布的文件

通过 `.npmignore` 或 `package.json` 的 `files` 字段控制：

```json
{
  "files": [
    "lib",
    "es",
    "dist"
  ]
}
```

## 🐛 故障排查

### 发布失败

**问题**: NPM 发布失败

**解决**:
```bash
# 检查 NPM_TOKEN 是否正确配置
# 检查包名是否已被占用
# 检查版本号是否已存在
npm view vue-table-touch-scroll versions
```

### Tag 已存在

**问题**: Git tag 已存在

**解决**:
```bash
# 删除本地 tag
git tag -d v1.0.0

# 删除远程 tag
git push origin :refs/tags/v1.0.0

# 重新创建
git tag v1.0.0
git push origin v1.0.0
```

### 版本不一致

**问题**: 多个 package.json 版本不一致

**解决**:
```bash
# 使用版本更新脚本
TAG_VERSION=1.0.0 pnpm update:version
```

## 📊 发布后验证

### 1. 检查 NPM

```bash
# 查看最新版本
npm view vue-table-touch-scroll version

# 安装测试
npm install vue-table-touch-scroll@latest
```

### 2. 检查 GitHub Release

访问: https://github.com/yourusername/vue-table-touch-scroll/releases

确认:
- Release notes 正确
- Assets 已上传
- Tag 正确

### 3. 检查文档

访问: https://yourusername.github.io/vue-table-touch-scroll/

确认文档已更新到最新版本。

## 🎯 最佳实践

### 1. 发布频率

- **Patch**: 随时发布 Bug 修复
- **Minor**: 每 2-4 周发布新功能
- **Major**: 谨慎发布，提前通知用户

### 2. Commit 规范

遵循 Conventional Commits：

```bash
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试
build: 构建系统
ci: CI 配置
chore: 其他
```

### 3. 破坏性变更

如果有破坏性变更：

1. 在 commit 信息中添加 `BREAKING CHANGE:`
2. 在 CHANGELOG 中详细说明
3. 提供迁移指南
4. 考虑提供兼容层

### 4. 预发布版本

测试新功能时使用预发布版本：

```bash
# Beta 版本
npm version prerelease --preid=beta
# 结果: 1.0.0-beta.0

# Alpha 版本
npm version prerelease --preid=alpha
# 结果: 1.0.0-alpha.0

# RC 版本
npm version prerelease --preid=rc
# 结果: 1.0.0-rc.0
```

## 📚 相关资源

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

## ✅ 快速参考

```bash
# 完整发布流程
git checkout main && git pull
pnpm test && pnpm build
pnpm changelog
git add CHANGELOG.md && git commit -m "docs: update changelog"
npm version patch  # 或 minor/major
git push origin main --tags

# 查看发布状态
# GitHub Actions: https://github.com/yourusername/vue-table-touch-scroll/actions
# NPM: https://www.npmjs.com/package/vue-table-touch-scroll
```

---

遵循此指南可确保发布流程顺畅、可靠！
