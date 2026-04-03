/**
 * 版本号生成脚本
 *
 * 功能说明：
 * - 从环境变量或 package.json 中获取版本号
 * - 生成包含版本号的 TypeScript 文件
 * - 用于构建时将版本信息嵌入到代码中
 *
 * 使用场景：
 * - CI/CD 流程中自动生成版本文件
 * - 开发环境中同步版本信息
 * - 构建时确保版本号的一致性
 *
 * 环境变量：
 * - TAG_VERSION: Git 标签版本号（如 v1.0.0）
 *
 * 输出文件：
 * - packages/vue3-mobile-table/version.ts
 */

import { writeFile } from 'fs/promises'
import path from 'path'
import { consola } from 'consola'
import {
  vue3MobileTablePackage,
  vue3MobileTableRoot,
} from '@vue3-mobile-table/build-utils'

/**
 * 获取当前版本号
 *
 * 优先级：
 * 1. 环境变量 TAG_VERSION（CI/CD 中通常通过 Git 标签设置）
 * 2. package.json 中的版本号（开发环境使用）
 *
 * @returns string - 标准化的版本号（不包含 v 前缀）
 *
 * 示例：
 * - 输入: v1.0.0 -> 输出: 1.0.0
 * - 输入: 1.0.0 -> 输出: 1.0.0
 */
function getVersion(): string {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  }

  // 从 package.json 读取版本号
  const pkg = require(vue3MobileTablePackage)
  return pkg.version
}

/**
 * 获取当前版本号
 * 在脚本启动时立即获取，确保版本号的一致性
 */
const version = getVersion()

/**
 * 主函数：生成版本文件
 *
 * 执行流程：
 * 1. 输出当前版本信息
 * 2. 构建版本文件路径
 * 3. 写入版本号到 TypeScript 文件
 * 4. 输出成功信息
 *
 * 生成的文件内容：
 * ```typescript
 * export const version = '1.0.0'
 * ```
 *
 * 使用位置：
 * - 在构建流程中自动调用
 * - 可通过 `pnpm run gen:version` 手动执行
 */
async function main(): Promise<void> {
  consola.info(`Generating version: ${version}`)

  const versionFilePath = path.resolve(vue3MobileTableRoot, 'version.ts')

  await writeFile(versionFilePath, `export const version = '${version}'\n`)

  consola.success(`Version file generated: ${versionFilePath}`)
}

// 执行主函数
main()
