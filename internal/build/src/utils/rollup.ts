/**
 * Rollup 构建工具模块
 * 提供 Rollup 打包过程中使用的辅助函数
 */

import {
  getPackageDependencies,
  vueTableTouchScrollPackage,
} from '@vue-table-touch-scroll/build-utils'

import type { OutputOptions, RollupBuild } from 'rollup'

/**
 * 生成 Rollup external 配置函数
 * 根据构建模式决定哪些依赖需要外部化（不打包进输出文件）
 *
 * @param options - 配置选项
 * @param options.full - 是否为完整打包模式
 * @returns 外部依赖判断函数
 *
 * 功能说明：
 * - 读取 package.json 中的 dependencies 和 peerDependencies
 * - peerDependencies 始终标记为外部依赖
 * - 非完整打包模式下，dependencies 也标记为外部依赖
 * - 完整打包模式下，只有 peerDependencies 为外部依赖
 * - 支持子路径匹配（如 'vue/dist/vue.esm.js'）
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(
    vueTableTouchScrollPackage
  )

  return (id: string) => {
    const packages: string[] = [...peerDependencies]
    if (!options.full) {
      packages.push('@vue', ...dependencies)
    }

    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}

/**
 * 批量写入 Rollup 构建产物
 * 用于同时生成多种格式的输出文件
 *
 * @param bundle - Rollup 构建的 bundle 对象
 * @param options - 输出配置数组
 * @returns Promise<void[]> - 所有写入操作的 Promise 数组
 *
 * 功能说明：
 * - 接收一个 bundle 和多个输出配置
 * - 并行执行所有输出操作
 * - 适用于同时生成多种格式（如 ESM、CJS、UMD）
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

/**
 * 格式化构建文件名
 * 根据是否压缩添加 .min 后缀
 *
 * @param name - 基础文件名
 * @param minify - 是否为压缩版本
 * @param ext - 文件扩展名
 * @returns 格式化后的完整文件名
 *
 * 功能说明：
 * - 为压缩版本添加 .min 后缀
 * - 拼接文件扩展名
 *
 * 示例：
 * - formatBundleFilename('index', true, 'js') -> 'index.min.js'
 * - formatBundleFilename('index', false, 'js') -> 'index.js'
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export function formatBundleFilename(
  name: string,
  minify: boolean,
  ext: string
) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}
