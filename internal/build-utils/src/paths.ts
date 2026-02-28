/**
 * 路径常量模块
 * 定义项目中所有重要的目录和文件路径
 */

import { resolve } from 'path'

/**
 * 项目根目录路径
 * 使用位置：
 * - internal/build-utils/src/pkg.ts (getWorkspacePackages, getWorkspaceNames, excludeFiles)
 * - internal/build/src/utils/process.ts (run 函数的默认 cwd 参数)
 * - internal/build/gulpfile.ts (copyFiles 任务)
 * - scripts/gen-version.ts
 * - scripts/update-version.ts
 * 导出状态：已使用
 */
export const projRoot = resolve(__dirname, '..', '..', '..')

/**
 * packages 目录路径
 * 使用位置：internal/build-utils/src/paths.ts (定义其他路径时使用)
 * 导出状态：已使用（内部使用）
 */
export const pkgRoot = resolve(projRoot, 'packages')

/**
 * core 包目录路径
 * 使用位置：internal/build-utils/src/paths.ts (定义 corePackage 时使用)
 * 导出状态：已使用（内部使用）
 */
export const coreRoot = resolve(pkgRoot, 'core')

/**
 * utils 包目录路径
 * 使用位置：internal/build-utils/src/paths.ts (定义 utilPackage 时使用)
 * 导出状态：已使用（内部使用）
 */
export const utilRoot = resolve(pkgRoot, 'utils')

/**
 * vue-table-touch-scroll 主包目录路径
 * 使用位置：internal/build-utils/src/paths.ts (定义 vueTableTouchScrollPackage 时使用)
 * 导出状态：已使用（内部使用）
 */
export const vueTableTouchScrollRoot = resolve(
  pkgRoot,
  'vue-table-touch-scroll'
)

/**
 * 构建脚本目录路径
 * 使用位置：
 * - internal/build/src/utils/gulp.ts (runTask 函数)
 * - internal/build/gulpfile.ts
 * 导出状态：已使用
 */
export const buildRoot = resolve(projRoot, 'internal', 'build')

/**
 * 文档目录名称常量
 * 使用位置：internal/build-utils/src/paths.ts (定义 docRoot 时使用)
 * 导出状态：已使用（内部使用）
 */
export const docsDirName = 'docs'

/**
 * 文档根目录路径
 * 使用位置：internal/build-utils/src/paths.ts (定义 vpRoot 和 docPackage 时使用)
 * 导出状态：已使用（内部使用）
 */
export const docRoot = resolve(projRoot, docsDirName)

/**
 * VitePress 配置目录路径
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const vpRoot = resolve(docRoot, '.vitepress')

/**
 * 构建输出根目录路径
 * 使用位置：
 * - internal/build/src/tasks/types-definitions.ts (generateTypesDefinitions 函数)
 * - internal/build/gulpfile.ts (copyTypesDefinitions 任务)
 * 导出状态：已使用
 */
export const buildOutput = resolve(projRoot, 'dist')

/**
 * vue-table-touch-scroll 包的构建输出目录路径
 * 使用位置：
 * - internal/build/src/build-info.ts (buildConfig 配置)
 * - internal/build/gulpfile.ts (copyFiles, createOutput 任务)
 * 导出状态：已使用
 */
export const vueTableTouchScrollOutput = resolve(
  buildOutput,
  'vue-table-touch-scroll'
)

/**
 * 项目根 package.json 文件路径
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const projPackage = resolve(projRoot, 'package.json')

/**
 * core 包的 package.json 文件路径
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const corePackage = resolve(coreRoot, 'package.json')

/**
 * utils 包的 package.json 文件路径
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const utilPackage = resolve(utilRoot, 'package.json')

/**
 * vue-table-touch-scroll 包的 package.json 文件路径
 * 使用位置：
 * - internal/build/src/utils/rollup.ts (generateExternal 函数)
 * - internal/build/gulpfile.ts (copyFiles 任务)
 * 导出状态：已使用
 */
export const vueTableTouchScrollPackage = resolve(
  vueTableTouchScrollRoot,
  'package.json'
)

/**
 * 文档的 package.json 文件路径
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const docPackage = resolve(docRoot, 'package.json')

/**
 * Windows 路径反斜杠正则表达式
 * 用于路径标准化处理
 */
const windowsSlashRE = /\\/g

/**
 * 标准化路径格式
 * 在 Windows 平台将反斜杠转换为正斜杠
 * @param p - 待标准化的路径字符串
 * @returns 标准化后的路径字符串
 *
 * 使用位置：internal/build-utils/src/pkg.ts (excludeFiles 函数)
 * 导出状态：已使用
 */
export function normalizePath(p: string): string {
  if (typeof process !== 'undefined' && process.platform === 'win32') {
    return p.replace(windowsSlashRE, '/')
  }
  return p
}
