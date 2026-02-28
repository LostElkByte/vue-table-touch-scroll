/**
 * 构建配置信息模块
 * 定义项目的构建目标、输出格式和路径配置
 */

import path from 'path'
import { PKG_NAME } from '@vue-table-touch-scroll/build-constants'
import { vueTableTouchScrollOutput } from '@vue-table-touch-scroll/build-utils'

import type { ModuleFormat } from 'rollup'

/**
 * 支持的模块格式数组
 * 包含 ESM (ES Modules) 和 CJS (CommonJS) 两种格式
 *
 * 使用位置：
 * - internal/build/src/build-info.ts (定义 Module 类型)
 * - internal/build/gulpfile.ts (copyTypesDefinitions 任务)
 * 导出状态：已使用
 */
export const modules = ['esm', 'cjs'] as const

/**
 * 模块格式类型
 * 从 modules 数组中提取的联合类型：'esm' | 'cjs'
 *
 * 使用位置：
 * - internal/build/src/build-info.ts (BuildConfig, BuildConfigEntries 类型定义)
 * - internal/build/src/utils/pkg.ts (pathRewriter 函数参数)
 * - internal/build/gulpfile.ts (copyTypes 函数参数)
 * 导出状态：已使用
 */
export type Module = (typeof modules)[number]

/**
 * 构建信息接口
 * 定义每种模块格式的构建配置结构
 *
 * 属性说明：
 * - module: TypeScript 编译目标模块系统
 * - format: Rollup 输出格式
 * - ext: 输出文件扩展名
 * - output: 输出目录配置
 * - bundle: 打包路径配置
 *
 * 使用位置：
 * - internal/build/src/build-info.ts (buildConfig, BuildConfigEntries 类型定义)
 * 导出状态：已使用（类型定义）
 */
export interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: ModuleFormat
  ext: 'mjs' | 'cjs' | 'js'
  output: {
    name: string
    path: string
  }

  bundle: {
    path: string
  }
}

/**
 * 构建配置对象
 * 为 ESM 和 CJS 两种模块格式定义详细的构建参数
 *
 * 配置说明：
 * - esm: ES Modules 格式配置
 *   - 输出到 es 目录
 *   - 使用 .mjs 扩展名
 *   - 目标为 ESNext
 * - cjs: CommonJS 格式配置
 *   - 输出到 lib 目录
 *   - 使用 .js 扩展名
 *   - 目标为 CommonJS
 *
 * 使用位置：
 * - internal/build/src/build-info.ts (buildConfigEntries)
 * - internal/build/src/utils/pkg.ts (pathRewriter 函数)
 * - internal/build/gulpfile.ts (copyTypesDefinitions 任务)
 * 导出状态：已使用
 */
export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    module: 'ESNext',
    format: 'esm',
    ext: 'mjs',
    output: {
      name: 'es',
      path: path.resolve(vueTableTouchScrollOutput, 'es'),
    },
    bundle: {
      path: `${PKG_NAME}/es`,
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    ext: 'js',
    output: {
      name: 'lib',
      path: path.resolve(vueTableTouchScrollOutput, 'lib'),
    },
    bundle: {
      path: `${PKG_NAME}/lib`,
    },
  },
}

/**
 * 构建配置条目数组
 * 将 buildConfig 对象转换为 [Module, BuildInfo][] 格式的数组
 * 便于遍历处理多种构建格式
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const buildConfigEntries = Object.entries(
  buildConfig
) as BuildConfigEntries

/**
 * 构建配置类型
 * buildConfig 对象的类型定义
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用（类型定义）
 */
export type BuildConfig = typeof buildConfig

/**
 * 构建配置条目类型
 * 定义为 [Module, BuildInfo][] 的元组数组类型
 *
 * 使用位置：internal/build/src/build-info.ts (buildConfigEntries 的类型)
 * 导出状态：已使用（类型定义）
 */
export type BuildConfigEntries = [Module, BuildInfo][]

/**
 * 编译目标 ECMAScript 版本
 * 指定 TypeScript/Rollup 编译的目标 JavaScript 版本
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const target = 'es2018'
