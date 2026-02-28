/**
 * 构建路径常量模块
 * 定义构建过程中使用的关键路径
 */

import path from 'path'
import { fileURLToPath } from 'url'

/**
 * 当前模块的目录路径
 * 使用 import.meta.url 获取 ES 模块的文件路径
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 项目根目录路径
 * 从当前文件向上查找 4 级到达项目根目录
 *
 * 使用位置：
 * - internal/build/src/utils/paths.ts (定义 PKG_ROOT, OUTPUT_DIR)
 * 导出状态：已使用（内部使用）
 */
export const PROJECT_ROOT = path.resolve(__dirname, '../../../../')

/**
 * packages 目录路径
 * 存放所有项目包的根目录
 *
 * 使用位置：
 * - internal/build/src/tasks/modules.ts (buildModules 函数，作为 input 和 preserveModulesRoot)
 * - internal/build/src/tasks/full-bundle.ts (buildFullBundle 函数，作为 input 路径)
 * 导出状态：已使用
 */
export const PKG_ROOT = path.resolve(PROJECT_ROOT, 'packages')

/**
 * 构建输出目录路径
 * vue-table-touch-scroll 包的源码目录，也是部分构建输出的目标目录
 *
 * 使用位置：
 * - internal/build/src/tasks/modules.ts (buildModules 函数，作为 ESM 和 CJS 输出目录)
 * - internal/build/src/tasks/full-bundle.ts (buildFullBundle 函数，作为 UMD 输出目录)
 * 导出状态：已使用
 */
export const OUTPUT_DIR = path.resolve(
  PROJECT_ROOT,
  'packages/vue-table-touch-scroll'
)
