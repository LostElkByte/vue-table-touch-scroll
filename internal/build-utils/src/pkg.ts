/**
 * 包管理工具模块
 * 提供 monorepo 工作区包的查询和依赖管理功能
 */

import findWorkspacePackages from '@pnpm/find-workspace-packages'
import { normalizePath, projRoot } from './paths'

import type { ProjectManifest } from '@pnpm/types'

/**
 * 获取工作区中的所有包
 * @returns Promise<Package[]> - 返回工作区包数组
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const getWorkspacePackages = () => findWorkspacePackages(projRoot)

/**
 * 获取工作区中所有包的名称
 * @param dir - 要查询的目录路径，默认为项目根目录
 * @returns Promise<string[]> - 返回包名称数组
 *
 * 功能说明：
 * - 查找指定目录下的所有工作区包
 * - 过滤出以指定目录开头的包
 * - 提取并返回包的名称列表
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const getWorkspaceNames = async (dir = projRoot) => {
  const pkgs = await findWorkspacePackages(projRoot)
  return pkgs
    .filter((pkg) => pkg.dir.startsWith(dir))
    .map((pkg) => pkg.manifest.name)
    .filter((name): name is string => !!name)
}

/**
 * 获取包的 manifest 配置信息
 * @param pkgPath - package.json 文件的完整路径
 * @returns ProjectManifest - 包的配置清单对象
 *
 * 使用位置：
 * - internal/build-utils/src/pkg.ts (getPackageDependencies 函数)
 * - internal/build/src/tasks/full-bundle.ts (buildFullBundle 函数)
 * 导出状态：已使用
 */
export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath) as ProjectManifest
}

/**
 * 获取包的依赖信息
 * @param pkgPath - package.json 文件的完整路径
 * @returns 包含 dependencies 和 peerDependencies 的对象
 *
 * 功能说明：
 * - 读取 package.json 文件
 * - 提取 dependencies 和 peerDependencies 字段
 * - 返回依赖包名称数组
 *
 * 使用位置：internal/build/src/utils/rollup.ts (generateExternal 函数)
 * 导出状态：已使用
 */
export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}

/**
 * 过滤排除特定文件
 * @param files - 文件路径数组
 * @returns string[] - 过滤后的文件路径数组
 *
 * 功能说明：
 * - 排除 node_modules、test、mock、gulpfile、dist 等目录中的文件
 * - 使用标准化路径进行比较
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
  const projRootPath = normalizePath(projRoot)
  return files.filter((file) => {
    const position = file.startsWith(projRootPath) ? projRootPath.length : 0
    return !excludes.some((exclude) => file.includes(exclude, position))
  })
}
