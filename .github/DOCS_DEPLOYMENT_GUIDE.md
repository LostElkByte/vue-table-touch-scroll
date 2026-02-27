# 文档部署指南

本项目使用 VitePress 构建文档，并通过 GitHub Actions 自动部署到 GitHub Pages。

## 📋 工作流概览

### 1. `docs-build.yml` - PR 文档构建检查

**触发条件**：
- Pull Request 中修改了 `docs/**` 或 `packages/**` 目录

**作用**：
- 验证文档能否成功构建
- 在合并前发现文档错误
- 上传构建产物供预览

**特点**：
- ✅ 仅在文档相关文件变更时运行
- ✅ 并发控制，新提交取消旧的运行
- ✅ 保留构建产物 7 天

---

### 2. `docs-deploy.yml` - 主分支文档部署

**触发条件**：
- Push 到 `main` 分支且修改了文档相关文件
- 手动触发

**作用**：
- 自动部署最新文档到 GitHub Pages
- 保持文档与代码同步

**部署地址**：
- `https://yourusername.github.io/vue-table-touch-scroll/`

**特点**：
- ✅ 自动部署，无需手动操作
- ✅ 使用 `gh-pages` 分支
- ✅ 清理旧文件，确保干净部署

---

### 3. `docs-deploy-release.yml` - 发布版本文档部署

**触发条件**：
- 创建新的 Release

**作用**：
- 在发布新版本时同步更新文档
- 确保文档版本与发布版本一致

**特点**：
- ✅ 基于 Release tag 构建
- ✅ 与 NPM 发布同步
- ✅ 版本化的 commit 信息

---

## 🚀 使用指南

### 本地开发文档

```bash
# 启动文档开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览构建后的文档
pnpm docs:preview
```

### 部署流程

#### 方式 1: 自动部署（推荐）

**日常更新**：
```bash
# 1. 修改文档
vim docs/guide/installation.md

# 2. 提交并推送到 main 分支
git add docs/
git commit -m "docs: update installation guide"
git push origin main

# 3. GitHub Actions 自动部署
# 访问 https://yourusername.github.io/vue-table-touch-scroll/
```

**版本发布**：
```bash
# 1. 创建新版本
npm version patch

# 2. 推送 tag
git push --tags

# 3. GitHub 自动创建 Release
# 4. 文档自动部署
```

#### 方式 2: 手动触发

1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "Deploy Docs" 工作流
4. 点击 "Run workflow"
5. 选择分支并运行

---

## ⚙️ 配置说明

### GitHub Pages 设置

1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 `gh-pages` 分支
4. 文件夹选择 `/ (root)`
5. 保存设置

### 自定义域名（可选）

在 `docs/.vitepress/config.ts` 中配置：

```typescript
export default defineConfig({
  base: '/vue-table-touch-scroll/', // GitHub Pages 路径
  // 或使用自定义域名
  // base: '/',
})
```

如果使用自定义域名：

1. 在 `docs/public/` 目录创建 `CNAME` 文件
2. 写入你的域名：`docs.yourdomain.com`
3. 在域名提供商处配置 DNS

---

## 📊 工作流触发条件对比

| 工作流 | 触发时机 | 部署 | 用途 |
|--------|---------|------|------|
| `docs-build.yml` | PR 创建/更新 | ❌ | 验证构建 |
| `docs-deploy.yml` | Push to main | ✅ | 日常部署 |
| `docs-deploy-release.yml` | 创建 Release | ✅ | 版本发布 |

---

## 🔍 故障排查

### 文档构建失败

**常见原因**：
1. VitePress 配置错误
2. Markdown 语法错误
3. 依赖未安装

**解决方法**：
```bash
# 本地测试构建
pnpm docs:build

# 查看详细错误信息
pnpm docs:build --debug
```

### 部署后页面 404

**原因**：`base` 配置不正确

**解决**：
```typescript
// docs/.vitepress/config.ts
export default defineConfig({
  base: '/vue-table-touch-scroll/', // 必须与仓库名一致
})
```

### 样式或资源加载失败

**原因**：资源路径不正确

**解决**：
- 使用相对路径或绝对路径
- 确保资源文件在 `docs/public/` 目录

---

## 📝 最佳实践

### 文档结构

```
docs/
├── .vitepress/
│   ├── config.ts          # VitePress 配置
│   └── theme/             # 自定义主题
├── public/                # 静态资源
├── guide/                 # 指南文档
│   ├── index.md
│   ├── installation.md
│   └── quick-start.md
├── api/                   # API 文档
└── index.md               # 首页
```

### Commit 规范

文档相关的 commit 使用 `docs:` 前缀：

```bash
git commit -m "docs: add installation guide"
git commit -m "docs: update API reference"
git commit -m "docs: fix typo in quick start"
```

### 版本管理

- 主分支文档始终反映最新开发状态
- Release 时自动部署对应版本文档
- 考虑使用版本选择器（VitePress 支持）

---

## 🎯 与 Element Plus 的对比

| 特性 | Element Plus | vue-table-touch-scroll |
|------|--------------|------------------------|
| 文档框架 | VitePress | VitePress ✅ |
| 自动部署 | 是 | 是 ✅ |
| PR 预览 | 是（Netlify） | 否（仅构建检查） |
| 多语言 | 是（Crowdin） | 否（暂不需要） |
| 部署平台 | GitHub Pages + Vercel | GitHub Pages |
| Staging 环境 | 是 | 否（暂不需要） |

### 适配说明

根据项目规模，我们做了以下简化：

1. **单一部署目标** - 仅使用 GitHub Pages
2. **无 PR 预览** - 通过构建检查确保文档正确性
3. **无多语言支持** - 暂时仅支持英文文档
4. **无 Staging 环境** - 直接部署到生产环境

---

## 🔄 升级路径

如果项目发展需要更复杂的文档部署策略：

### 添加 PR 预览

使用 Netlify 或 Vercel 部署 PR 预览：

```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2
  with:
    publish-dir: docs/.vitepress/dist
    production-deploy: false
```

### 添加多语言支持

集成 Crowdin 自动翻译：

```yaml
- name: Pull translations
  run: pnpm exec crowdin download
  env:
    CROWDIN_TOKEN: ${{ secrets.CROWDIN_TOKEN }}
```

### 添加版本选择器

在 VitePress 配置中添加版本切换功能。

---

## 📚 相关资源

- [VitePress 文档](https://vitepress.dev/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action)
- [Element Plus 文档部署](https://github.com/element-plus/element-plus/tree/dev/.github/workflows)

---

## ✅ 检查清单

部署前确认：

- [ ] VitePress 配置正确（`base` 路径）
- [ ] 本地构建成功
- [ ] GitHub Pages 已启用
- [ ] 选择 `gh-pages` 分支
- [ ] 文档路径正确
- [ ] 资源文件在 `public/` 目录

---

## 🎉 总结

现在你的项目拥有了专业的文档自动部署流程：

- ✅ PR 中自动验证文档构建
- ✅ 推送到 main 分支自动部署
- ✅ 发布新版本时同步更新文档
- ✅ 完全自动化，无需手动操作

参照 Element Plus 的最佳实践，确保文档始终保持最新！
