/**
 * 文件系统工具模块
 * 提供文件和目录操作的辅助函数
 */

import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'

/**
 * 将数据对象写入 JSON 文件
 * @param path - 目标文件路径
 * @param data - 要写入的数据对象
 * @param spaces - JSON 格式化缩进空格数，默认为 0（不格式化）
 * @returns Promise<void>
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const writeJson = (path: string, data: any, spaces = 0) =>
  writeFile(path, JSON.stringify(data, undefined, spaces), 'utf-8')

/**
 * 确保目录存在，如果不存在则递归创建
 * @param path - 目录路径
 * @returns Promise<void>
 *
 * 使用位置：目前未被项目中其他文件直接使用
 * 导出状态：已导出但未使用
 */
export const ensureDir = async (path: string) => {
  if (!existsSync(path)) await mkdir(path, { recursive: true })
}
