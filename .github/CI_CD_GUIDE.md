# CI/CD 配置指南

本项目使用 GitHub Actions 实现自动化 CI/CD 流程。

## 📋 工作流概览

### 1. CI 工作流 (`.github/workflows/ci.yml`)

**触发条件**：
- Push 到 `main` 或 `dev` 分支
- 创建 Pull Request
- 手动触发

**包含的任务**：
- ✅ **Lint & Type Check** - 代码检查和类型检查
- ✅ **Test** - 在 Node.js 20 和 22 上运行测试
- ✅ **Coverage** - 生成测试覆盖率报告并上传到 Codecov
- ✅ **Build** - 构建项目并上传构建产物

### 2. Release 工作流 (`.github/workflows/release.yml`)

**触发条件**：
- 推送以 `v` 开头的 Git tag（如 `v1.0.0`）

**流程**：
1. **Test** - 运行完整测试套件
2. **Release** - 创建 GitHub Release
3. **Publish NPM** - 发布到 NPM registry

### 3. PR Check 工作流 (`.github/workflows/pr-check.yml`)

**触发条件**：
- Pull Request 打开、同步或重新打开

**检查项**：
- 代码质量检查（Lint + Type Check）
- 测试通过
- 构建成功
- Commit 信息符合规范

## 🚀 使用指南

### 日常开发

正常开发流程，CI 会自动运行：

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "feat: add new feature"

# 3. 推送并创建 PR
git push origin feature/new-feature
```

创建 PR 后，GitHub Actions 会自动：
- 运行 Lint 检查
- 运行类型检查
- 运行所有测试
- 生成覆盖率报告
- 验证构建

### 发布新版本

#### 方法 1: 使用 npm version（推荐）

```bash
# 1. 确保在 main 分支且代码是最新的
git checkout main
git pull

# 2. 更新版本号（会自动创建 tag）
npm version patch  # 0.0.1 -> 0.0.2
# 或
npm version minor  # 0.0.1 -> 0.1.0
# 或
npm version major  # 0.0.1 -> 1.0.0

# 3. 推送代码和 tag
git push && git push --tags
```

#### 方法 2: 手动创建 tag

```bash
# 1. 手动更新 package.json 中的版本号

# 2. 提交变更
git add package.json
git commit -m "chore: bump version to 1.0.0"

# 3. 创建 tag
git tag v1.0.0

# 4. 推送
git push && git push --tags
```

推送 tag 后，GitHub Actions 会自动：
1. 运行完整测试
2. 创建 GitHub Release
3. 构建项目
4. 发布到 NPM

## 🔐 必需的 Secrets

在 GitHub 仓库设置中配置以下 secrets：

### NPM_TOKEN
用于发布到 NPM registry。

**获取方式**：
1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入 Account Settings → Access Tokens
3. 生成新的 Automation token
4. 在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加

### CODECOV_TOKEN（可选）
用于上传测试覆盖率报告。

**获取方式**：
1. 登录 [codecov.io](https://codecov.io/)
2. 添加你的 GitHub 仓库
3. 复制 Upload Token
4. 在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加

## 📊 状态徽章

在 README.md 中已添加以下徽章：

```markdown
[![CI](https://github.com/yourusername/vue-table-touch-scroll/workflows/CI/badge.svg)](https://github.com/yourusername/vue-table-touch-scroll/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/yourusername/vue-table-touch-scroll/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/vue-table-touch-scroll)
```

**注意**：将 `yourusername` 替换为你的 GitHub 用户名。

## 🛠️ 工作流配置详解

### 并发控制

所有工作流都配置了并发控制：

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event.number || github.sha }}
  cancel-in-progress: true
```

这确保：
- 同一 PR 的新提交会取消之前的运行
- 节省 CI 资源
- 更快获得反馈

### 缓存策略

使用 pnpm 缓存加速依赖安装：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'
```

### 矩阵测试

在多个 Node.js 版本上测试：

```yaml
strategy:
  matrix:
    node-version: [20, 22]
```

## 🔍 故障排查

### CI 失败常见原因

1. **Lint 错误**
   ```bash
   # 本地运行检查
   pnpm lint
   # 自动修复
   pnpm lint:fix
   ```

2. **类型错误**
   ```bash
   # 本地运行检查
   pnpm typecheck
   ```

3. **测试失败**
   ```bash
   # 本地运行测试
   pnpm test
   # 查看详细输出
   pnpm test --reporter=verbose
   ```

4. **构建失败**
   ```bash
   # 本地构建
   pnpm build
   ```

### 查看 CI 日志

1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择失败的工作流
4. 查看详细日志

## 📝 最佳实践

### Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式
- `refactor:` - 重构
- `test:` - 测试
- `chore:` - 构建/工具

### PR 流程

1. 创建功能分支
2. 开发并提交（遵循 commit 规范）
3. 确保本地测试通过
4. 推送并创建 PR
5. 等待 CI 检查通过
6. Code Review
7. 合并到主分支

### 发布检查清单

发布前确认：

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新
- [ ] 版本号正确
- [ ] NPM_TOKEN 已配置

## 🔄 工作流更新

如需修改工作流：

1. 编辑 `.github/workflows/*.yml` 文件
2. 提交并推送
3. 在 Actions 标签查看运行结果

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [pnpm Action](https://github.com/pnpm/action-setup)
- [Codecov Action](https://github.com/codecov/codecov-action)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 💡 提示

- CI 运行时间通常 2-5 分钟
- 可以在 Actions 标签查看历史运行记录
- 失败的工作流会发送邮件通知
- 可以手动重新运行失败的工作流
