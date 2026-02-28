/**
 * Gulp 构建任务配置文件
 * 定义项目的完整构建流程，包括清理、编译、类型生成和文件复制
 */

import path from 'path'
import { copyFile, mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
import { parallel, series } from 'gulp'
import {
  buildOutput,
  projRoot,
  vueTableTouchScrollOutput,
  vueTableTouchScrollPackage,
} from '@vue-table-touch-scroll/build-utils'
import { buildConfig, run, runTask, withTaskName } from './src'

import type { TaskFunction } from 'gulp'
import type { Module } from './src'

/**
 * 复制必要的项目文件到构建输出目录
 *
 * 功能说明：
 * - 复制 package.json 文件到输出目录
 * - 复制 README.md 文档到输出目录
 * - 复制 LICENSE 许可证文件到输出目录
 *
 * 这些文件是 npm 包发布所必需的元数据和文档文件
 *
 * 使用位置：
 * - 在默认构建流程的最后阶段执行（与 copyTypesDefinitions 并行）
 *
 * @returns Promise - 所有文件复制操作的 Promise 数组
 */
export const copyFiles = () =>
  Promise.all([
    copyFile(
      vueTableTouchScrollPackage,
      path.join(vueTableTouchScrollOutput, 'package.json')
    ),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(vueTableTouchScrollOutput, 'README.md')
    ),
    copyFile(
      path.resolve(projRoot, 'LICENSE'),
      path.resolve(vueTableTouchScrollOutput, 'LICENSE')
    ),
  ])

/**
 * 复制 TypeScript 类型定义文件到各模块格式的输出目录
 *
 * 功能说明：
 * - 将生成的类型定义文件复制到 ESM 和 CJS 两个输出目录
 * - 使用并行任务同时复制到两个目标位置
 * - 递归复制整个类型定义目录结构
 *
 * 执行流程：
 * 1. 定位类型定义源目录 (dist/types/packages)
 * 2. 创建针对 ESM 和 CJS 的复制任务
 * 3. 并行执行两个复制任务
 *
 * 目标目录：
 * - ESM: dist/vue-table-touch-scroll/es/
 * - CJS: dist/vue-table-touch-scroll/lib/
 *
 * 使用位置：
 * - 在默认构建流程的最后阶段执行（与 copyFiles 并行）
 *
 * @param done - Gulp 任务完成回调函数
 * @returns Gulp 并行任务
 */
export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

/**
 * 默认构建任务流程
 * 按顺序执行完整的构建流程，生成可发布的 npm 包
 *
 * 构建流程说明：
 *
 * 第一阶段（串行）：
 * 1. clean - 清理之前的构建产物
 *    - 执行 'pnpm run clean' 命令
 *    - 删除 dist 目录中的旧文件
 *
 * 2. createOutput - 创建输出目录
 *    - 创建 vue-table-touch-scroll 输出目录
 *    - 使用递归模式确保父目录也被创建
 *
 * 第二阶段（并行）：
 * 3. 并行执行三个主要构建任务：
 *    - buildModules: 构建 ESM 和 CJS 模块
 *    - buildFullBundle: 构建 UMD 完整打包文件
 *    - generateTypesDefinitions: 生成 TypeScript 类型定义
 *
 * 第三阶段（并行）：
 * 4. 并行执行文件复制任务：
 *    - copyTypesDefinitions: 复制类型定义到各模块目录
 *    - copyFiles: 复制 package.json、README.md、LICENSE 等文件
 *
 * 最终输出：
 * - dist/vue-table-touch-scroll/es/ (ESM 模块 + 类型定义)
 * - dist/vue-table-touch-scroll/lib/ (CJS 模块 + 类型定义)
 * - dist/vue-table-touch-scroll/dist/ (UMD 完整打包)
 * - dist/vue-table-touch-scroll/package.json
 * - dist/vue-table-touch-scroll/README.md
 * - dist/vue-table-touch-scroll/LICENSE
 */
export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () =>
    mkdir(vueTableTouchScrollOutput, { recursive: true })
  ),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions')
  ),

  parallel(copyTypesDefinitions, copyFiles)
)

export * from './src'
