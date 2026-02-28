import {
  getPackageDependencies,
  vueTableTouchScrollPackage,
} from '@vue-table-touch-scroll/build-utils'

import type { OutputOptions, RollupBuild } from 'rollup'

/**
 * 生成 Rollup external 配置
 * 根据构建模式决定哪些依赖需要外部化
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
 * 用于同时生成多种格式的输出
 */
export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

/**
 * 格式化构建文件名
 * 根据是否压缩添加 .min 后缀
 */
export function formatBundleFilename(
  name: string,
  minify: boolean,
  ext: string
) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}
