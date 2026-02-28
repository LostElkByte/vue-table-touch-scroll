/**
 * 日志工具模块
 * 提供错误处理和日志输出功能
 */

import process from 'process'
import consola from 'consola'

/**
 * 输出错误信息并退出进程
 * @param err - 错误对象
 * @returns never - 此函数不会返回，因为会终止进程
 *
 * 功能说明：
 * - 使用 consola 输出错误信息到控制台
 * - 以退出码 1 终止当前进程
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export function errorAndExit(err: Error): never {
  consola.error(err)
  process.exit(1)
}
