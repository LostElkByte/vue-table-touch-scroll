/**
 * 包路径重写工具模块
 * 用于在构建过程中重写模块导入路径
 */

import { PKG_PREFIX } from '@vue-table-touch-scroll/build-constants'
import { buildConfig } from '../build-info'

import type { Module } from '../build-info'

/**
 * 创建路径重写函数
 * 根据指定的模块格式生成路径转换函数
 *
 * @param module - 模块格式类型 ('esm' | 'cjs')
 * @returns 路径重写函数，接收原始路径并返回重写后的路径
 *
 * 功能说明：
 * - 根据不同的模块格式（ESM/CJS）重写导入路径
 * - 将包前缀路径替换为对应的 bundle 路径
 * - 确保生成的类型定义文件中的导入路径正确
 *
 * 示例：
 * - ESM: '@vue-table-touch-scroll/' -> 'vue-table-touch-scroll/es/'
 * - CJS: '@vue-table-touch-scroll/' -> 'vue-table-touch-scroll/lib/'
 *
 * 使用位置：
 * - internal/build/src/tasks/types-definitions.ts (generateTypesDefinitions 函数)
 * 导出状态：已使用
 */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module]

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}
