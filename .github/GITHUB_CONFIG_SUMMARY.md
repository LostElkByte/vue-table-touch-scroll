# GitHub 配置总结

本项目的 `.github` 配置已参照 Element Plus 的最佳实践进行完善。

## 📁 配置文件清单

### 工作流 (Workflows)

1. **`.github/workflows/ci.yml`** - CI 工作流
   - Lint & Type Check
   - 多版本 Node.js 测试 (20, 22)
   - 测试覆盖率上传到 Codecov
   - 构建验证

2. **`.github/workflows/release.yml`** - 发布工作流
   - 自动创建 GitHub Release
   - 自动发布到 NPM

3. **`.github/workflows/pr-check.yml`** - PR 检查工作流
   - 代码质量检查
   - Commit 信息规范检查

### 模板文件

4. **`.github/pull_request_template.md`** - PR 模板
   - 简洁的 Element Plus 风格
   - 清晰的检查清单

5. **`.github/ISSUE_TEMPLATE/bug_report.yml`** - Bug 报告模板
6. **`.github/ISSUE_TEMPLATE/feature_request.yml`** - 功能请求模板
7. **`.github/ISSUE_TEMPLATE/config.yml`** - Issue 配置
   - 禁用空白 Issue
   - 引导用户到 Discussions

### 配置文件

8. **`.github/.git_commit_template.txt`** - Git Commit 模板
   - 格式：`type(scope): description #issue`
   - 示例：`feat(core): add threshold option #123`

9. **`.github/renovate.json5`** - Renovate 依赖更新配置
   - 每周自动检查依赖更新
   - 自动分组非主版本更新
   - 忽略特定依赖（jsdom, vitest）

10. **`.github/CONTRIBUTING.md`** - 贡献指南
    - Issue 指南
    - PR 指南
    - Commit 规范
    - 开发设置

11. **`.github/CI_CD_GUIDE.md`** - CI/CD 使用指南

## 🎯 与 Element Plus 的对比

### 相同点 ✅

- ✅ 简洁的 PR 模板
- ✅ 清晰的 Commit 规范
- ✅ Renovate 自动依赖更新
- ✅ 完整的 Issue 模板
- ✅ 多版本 Node.js 测试
- ✅ 自动化发布流程

### 差异点 📝

| 项目 | Element Plus | vue-table-touch-scroll |
|------|--------------|------------------------|
| 主分支 | `dev` | `main` |
| Issue Helper | 自定义网站 | GitHub 原生模板 |
| 多语言文档 | 是 (4种语言) | 否 (仅英文) |
| SSR 测试 | 是 | 否 (暂不需要) |
| E2E 测试 | Playwright | 暂无 |

### 适配说明 🔧

根据项目规模和需求，我们做了以下适配：

1. **简化 Issue 流程** - 使用 GitHub 原生模板而非自定义网站
2. **单分支策略** - 使用 `main` 分支而非 `dev/master` 双分支
3. **聚焦核心功能** - 暂不包含 SSR 测试和 E2E 测试
4. **保持专业性** - 保留所有必要的质量保障流程

## 🚀 使用指南

### 配置 Git Commit 模板

```bash
git config commit.template .github/.git_commit_template.txt
```

### 启用 Renovate

1. 在 GitHub 上安装 [Renovate App](https://github.com/apps/renovate)
2. 授权访问你的仓库
3. Renovate 会自动读取 `.github/renovate.json5` 配置

### 配置 Secrets

在 GitHub 仓库设置中添加：

- `NPM_TOKEN` - NPM 发布令牌（必需）
- `CODECOV_TOKEN` - Codecov 上传令牌（可选）

### 更新仓库 URL

将所有文件中的 `yourusername` 替换为你的 GitHub 用户名：

```bash
# 批量替换
find .github -type f -name "*.md" -o -name "*.yml" | xargs sed -i '' 's/yourusername/YOUR_USERNAME/g'
```

## 📊 工作流触发条件

### CI 工作流
- Push 到 `main` 或 `dev` 分支
- 创建 Pull Request
- 手动触发

### Release 工作流
- 推送以 `v` 开头的 tag（如 `v1.0.0`）

### PR Check 工作流
- Pull Request 打开、同步或重新打开

## ✅ 检查清单

发布前确认：

- [ ] 所有 `yourusername` 已替换为实际用户名
- [ ] NPM_TOKEN 已配置
- [ ] Renovate App 已安装
- [ ] Git commit 模板已配置
- [ ] 至少有一个成功的 CI 运行

## 📚 参考资源

- [Element Plus GitHub](https://github.com/element-plus/element-plus)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Renovate 文档](https://docs.renovatebot.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 🎉 总结

你的项目现在拥有与 Element Plus 同等专业的 GitHub 配置：

- ✅ 完整的 CI/CD 流程
- ✅ 规范的贡献指南
- ✅ 自动化依赖更新
- ✅ 清晰的 Issue/PR 模板
- ✅ 专业的工作流管理

所有配置都经过精心调整，既保持了 Element Plus 的专业性，又适配了你的项目规模和需求。
