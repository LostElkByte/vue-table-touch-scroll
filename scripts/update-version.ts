/**
 * 版本号批量更新脚本
 *
 * 功能说明：
 * - 批量更新项目中所有包的版本号
 * - 可选添加 Git HEAD 信息到 package.json
 * - 自动更新文档中的版本号
 * - 用于发布流程中的版本同步
 * - 动态发现工作区中的所有包
 *
 * 使用场景：
 * - CI/CD 发布流程中更新版本号
 * - 手动发布时同步所有包版本
 * - 确保多包项目版本一致性
 *
 * 环境变量：
 * - TAG_VERSION: 目标版本号（必需）
 * - GIT_HEAD: Git 提交哈希值（可选）
 *
 * 更新的包：
 * - 自动发现并更新工作区中的所有包
 * - 包括 vue3-mobile-table、core、utils 等
 *
 * 更新的文档：
 * - docs/content/index.md（英文首页）公告中的 Release 版本号
 * - docs/content/zh/index.md（中文首页）公告中的 Release 版本号
 */

import { readFile, writeFile } from 'fs/promises'
import chalk from 'chalk'
import { consola } from 'consola'
import {
  errorAndExit,
  getWorkspacePackages,
} from '@vue3-mobile-table/build-utils'

import type { Project } from '@pnpm/find-workspace-packages'

/**
 * 主函数：批量更新包版本号
 *
 * 执行流程：
 * 1. 验证必需的环境变量
 * 2. 动态获取工作区中的所有包
 * 3. 更新各个包的 package.json
 * 4. 输出更新结果
 *
 * 错误处理：
 * - 缺少必需环境变量时使用标准化错误处理退出
 * - 文件操作失败时输出错误信息并退出
 *
 * 改进点：
 * - 使用 getWorkspacePackages 动态发现包，无需硬编码
 * - 使用 project.writeProjectManifest 标准化写入
 * - 使用 errorAndExit 统一错误处理
 */
async function main(): Promise<void> {
  const tagVersion = process.env.TAG_VERSION
  const gitHead = process.env.GIT_HEAD

  // 验证必需的环境变量
  if (!tagVersion) {
    errorAndExit(
      new Error(
        'No TAG_VERSION environment variable found.\n' +
          'Please set TAG_VERSION before running this script.\n' +
          'Example: TAG_VERSION=1.0.0 pnpm run update:version'
      )
    )
  }

  consola.log(chalk.cyan('Start updating version'))
  consola.log(chalk.cyan(`TAG_VERSION: ${tagVersion}`))
  if (gitHead) {
    consola.log(chalk.cyan(`GIT_HEAD: ${gitHead}`))
  }

  consola.debug(chalk.yellow('Fetching workspace packages...'))

  /**
   * 更新单个包的版本号
   *
   * @param project - pnpm 工作区包项目对象
   *
   * 功能说明：
   * - 使用 pnpm 标准 API 更新 package.json
   * - 更新 version 字段
   * - 可选添加 gitHead 字段
   * - 自动格式化并写回文件
   */
  const writeVersion = async (project: Project): Promise<void> => {
    await project.writeProjectManifest({
      ...project.manifest,
      version: tagVersion,
      ...(gitHead ? { gitHead } : {}),
    } as any)

    consola.success(
      chalk.green(
        `Updated ${project.manifest.name || 'package'} to ${tagVersion}`
      )
    )
  }

  /**
   * 更新文档首页公告中的版本号（中英文）
   *
   * 功能说明：
   * - 同步 docs/content/index.md 与 docs/content/zh/index.md 中的公告版本号
   * - 使用正则表达式匹配并替换版本号
   *
   * 匹配模式：
   * - title: 'Release v{version}'
   *
   * @param version - 目标版本号（如 1.0.0）
   */
  const updateDocsVersion = async (version: string): Promise<void> => {
    const docsPaths = ['docs/content/index.md', 'docs/content/zh/index.md']
    const versionPattern = /title: 'Release v\d+\.\d+\.\d+'/

    for (const docsPath of docsPaths) {
      try {
        const content = await readFile(docsPath, 'utf-8')
        const newContent = content.replace(
          versionPattern,
          `title: 'Release v${version}'`
        )

        if (content === newContent) {
          consola.warn(chalk.yellow(`No version found in ${docsPath}`))
          continue
        }

        await writeFile(docsPath, newContent, 'utf-8')
        consola.success(
          chalk.green(`Updated ${docsPath} announcement to v${version}`)
        )
      } catch (err: any) {
        consola.error(
          chalk.red(
            `Failed to update docs version (${docsPath}): ${err.message}`
          )
        )
        throw err
      }
    }
  }

  try {
    // 动态获取工作区中的所有包
    const packages = await getWorkspacePackages()

    // 过滤出需要更新版本的包（排除私有包和构建工具包，但保留根目录的 package.json）
    const packagesToUpdate = packages.filter((pkg) => {
      const name = pkg.manifest.name || ''
      const isPrivate = pkg.manifest.private === true
      const isBuildTool =
        name.includes('/build') || name.includes('/eslint-config')
      const isRootPackage = pkg.dir === process.cwd()

      return (!isPrivate || isRootPackage) && !isBuildTool
    })

    if (packagesToUpdate.length === 0) {
      consola.warn(chalk.yellow('No packages found to update'))
      return
    }

    consola.info(
      chalk.cyan(`Found ${packagesToUpdate.length} package(s) to update`)
    )

    // 批量更新所有包的版本号
    await Promise.all(packagesToUpdate.map(writeVersion))

    consola.success(
      chalk.green(
        `All ${packagesToUpdate.length} package(s) updated successfully to version ${tagVersion}`
      )
    )

    // 更新文档中的版本号
    await updateDocsVersion(tagVersion)

    if (gitHead) {
      consola.success(chalk.green(`Git HEAD set to ${gitHead}`))
    }
  } catch (err: any) {
    errorAndExit(err)
  }
}

// 执行主函数
main().catch((err) => {
  errorAndExit(err)
  process.exit(1)
})
