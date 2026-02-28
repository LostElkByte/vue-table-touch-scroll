# GitHub 配置总结

vue-table-touch-scroll 项目的完整 GitHub 配置文档。

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
   - 简洁清晰的格式
   - 完整的检查清单

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

## 🎯 核心特性

### 自动化流程 ✅

- ✅ **CI/CD 完整** - 测试、构建、发布全自动化
- ✅ **代码质量保障** - Lint、Type Check、测试覆盖率
- ✅ **依赖自动更新** - Renovate 每周检查依赖
- ✅ **规范化提交** - Commit 模板和规范检查
- ✅ **多版本测试** - Node.js 20 和 22 版本支持

### 开发体验 �

- 📝 **清晰的模板** - Issue 和 PR 模板完善
- � **快速反馈** - PR 自动检查代码质量
- 📊 **测试覆盖率** - Codecov 集成
- 🔄 **自动发布** - Tag 触发自动发布到 NPM

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

### 初始配置

- [ ] 所有 `yourusername` 已替换为实际用户名
- [ ] NPM_TOKEN 已配置到 GitHub Secrets
- [ ] CODECOV_TOKEN 已配置（可选）
- [ ] Renovate App 已安装并授权
- [ ] Git commit 模板已配置

### 发布前确认

- [ ] 至少有一个成功的 CI 运行
- [ ] 所有测试通过
- [ ] 代码检查通过
- [ ] 文档已更新

## 📚 相关文档

- [CONTRIBUTING.md](./CONTRIBUTING.md) - 贡献指南
- [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) - CI/CD 使用指南
- [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) - 发布指南
- [PACKAGE_PUBLISHING_SUMMARY.md](./PACKAGE_PUBLISHING_SUMMARY.md) - 包发布配置

## ✅ 配置完成状态

vue-table-touch-scroll 项目的 GitHub 配置已完成：

1. ✅ **完整的 CI/CD 流程** - 自动化测试、构建、发布
2. ✅ **规范的贡献指南** - Issue/PR 模板和 Commit 规范
3. ✅ **自动化依赖更新** - Renovate 配置完善
4. ✅ **清晰的工作流** - 多版本测试和质量保障
5. ✅ **专业的项目管理** - 文档完整，流程清晰

现在你的项目拥有了完整的专业 GitHub 配置！
