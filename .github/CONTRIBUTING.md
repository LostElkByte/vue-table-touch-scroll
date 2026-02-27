# Vue Table Touch Scroll Contributing Guide

Hi! Thank you for choosing Vue Table Touch Scroll.

We are excited that you are interested in contributing to Vue Table Touch Scroll. Before submitting your contribution though, please make sure to take a moment and read through the following guidelines.

## Issue Guidelines

- Issues are exclusively for bug reports, feature requests and design-related topics. Other questions may be closed directly.

- Before submitting an issue, please check if similar problems have already been issued.

- Please specify which version of `vue-table-touch-scroll` and `Vue` you are using, and provide OS and browser information. A minimal reproduction is recommended.

## Pull Request Guidelines

- Fork this repository to your own account. Do not create branches here.

- Commit info should be formatted as `type(scope): description`. (e.g. `fix(directive): resolve edge detection bug`)
  1. **type**: must be one of [feat, fix, docs, style, refactor, perf, test, build, ci, chore]
  2. **scope**: must be one of [core, directive, utils, docs, ci, build, test, project]
  3. **description**: must not be longer than 72 characters

- Make sure that running `pnpm build` outputs the correct files.

- Rebase before creating a PR to keep commit history clear.

- Make sure PRs are created to `main` branch.

- If your PR fixes a bug, please provide a description about the related bug.

## Development Setup

### 环境要求

- Node.js >= 20
- pnpm >= 10

### 克隆仓库

```bash
git clone https://github.com/yourusername/vue-table-touch-scroll.git
cd vue-table-touch-scroll
```

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 运行测试（监听模式）
pnpm test --watch

# 生成测试覆盖率报告
pnpm test:coverage

# 代码检查
pnpm lint

# 自动修复代码风格
pnpm lint:fix

# 类型检查
pnpm typecheck

# 构建项目
pnpm build

# 格式化代码
pnpm format
```

## 开发流程

### 1. 创建分支

从 `main` 分支创建新的功能分支：

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发

- 遵循现有的代码风格
- 添加必要的测试用例
- 确保所有测试通过
- 更新相关文档

### 3. 提交代码

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能
git commit -m "feat: add new feature"

# 修复
git commit -m "fix: resolve bug in directive"

# 文档
git commit -m "docs: update README"

# 样式
git commit -m "style: format code"

# 重构
git commit -m "refactor: improve performance"

# 测试
git commit -m "test: add unit tests"

# 构建
git commit -m "build: update dependencies"

# CI
git commit -m "ci: update workflow"
```

### 4. 推送并创建 Pull Request

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## Pull Request 指南

### PR 标题

使用 Conventional Commits 格式：

- `feat: add new feature`
- `fix: resolve issue`
- `docs: update documentation`

### PR 描述

请包含：

1. **变更内容**：简要说明你做了什么
2. **动机**：为什么需要这个变更
3. **测试**：如何测试这个变更
4. **截图**（如果适用）：UI 变更的截图

### PR 检查清单

- [ ] 代码遵循项目风格指南
- [ ] 已添加/更新测试用例
- [ ] 所有测试通过
- [ ] 已更新相关文档
- [ ] Commit 信息遵循规范
- [ ] 已在本地运行 `pnpm lint` 和 `pnpm typecheck`

## 测试指南

### 编写测试

测试文件位于 `packages/core/__tests__/`：

```typescript
import { describe, expect, it } from 'vitest'
import { vTableTouchScroll } from '../index'

describe('Feature Name', () => {
  it('should do something', () => {
    // 测试代码
    expect(result).toBe(expected)
  })
})
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test directive.test.ts

# 生成覆盖率报告
pnpm test:coverage
```

## 代码风格

项目使用：

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查

在提交前，请运行：

```bash
pnpm lint:fix
pnpm format
```

## 项目结构

```
vue-table-touch-scroll/
├── packages/
│   ├── core/              # 核心指令实现
│   │   ├── src/
│   │   │   ├── directive.ts
│   │   │   └── types.ts
│   │   └── __tests__/     # 测试文件
│   ├── utils/             # 工具函数
│   └── vue-table-touch-scroll/  # 主包入口
├── internal/
│   └── build/             # 构建工具链
├── play/                  # 开发 playground
├── docs/                  # 文档站点
└── .github/
    └── workflows/         # CI/CD 配置
```

## 发布流程

发布由维护者处理：

1. 更新版本号
2. 更新 CHANGELOG
3. 创建 Git tag
4. GitHub Actions 自动发布到 NPM

## 需要帮助？

- 📖 查看 [文档](https://github.com/yourusername/vue-table-touch-scroll)
- 💬 提出 [Issue](https://github.com/yourusername/vue-table-touch-scroll/issues)
- 📧 联系维护者

## 行为准则

请遵守我们的 [行为准则](CODE_OF_CONDUCT.md)，保持友好和尊重。

感谢你的贡献！🎉
