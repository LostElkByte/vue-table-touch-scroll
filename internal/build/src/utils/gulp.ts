/**
 * Gulp 任务工具模块
 * 提供 Gulp 任务的辅助函数，用于任务命名和执行
 */

import { buildRoot } from '@vue-table-touch-scroll/build-utils'
import { run } from './process'

import type { TaskFunction } from 'gulp'

/**
 * 为 Gulp 任务函数添加显示名称
 * @param name - 任务显示名称
 * @param fn - Gulp 任务函数
 * @returns 带有 displayName 属性的任务函数
 *
 * 功能说明：
 * - 为任务函数添加 displayName 属性
 * - 使任务在 Gulp 日志中显示友好的名称
 * - 便于调试和追踪任务执行
 *
 * 使用位置：
 * - internal/build/src/utils/gulp.ts (runTask 函数)
 * - internal/build/gulpfile.ts (copyTypesDefinitions, clean, createOutput 任务)
 * 导出状态：已使用
 */
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name })

/**
 * 创建并执行 shell 任务
 * @param name - 任务名称，对应 package.json 中的 script 命令
 * @returns Gulp 任务函数
 *
 * 功能说明：
 * - 通过 pnpm run start 执行指定的构建任务
 * - 在 buildRoot 目录下执行命令
 * - 自动添加 'shellTask:' 前缀作为显示名称
 *
 * 使用位置：
 * - internal/build/gulpfile.ts (buildModules, buildFullBundle, generateTypesDefinitions)
 * 导出状态：已使用
 */
export const runTask = (name: string) =>
  withTaskName(`shellTask:${name}`, () =>
    run(`pnpm run start ${name}`, buildRoot)
  )
