/**
 * TypeScript 类型定义生成任务
 * 负责生成和处理 .d.ts 类型声明文件
 */

import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { glob } from 'tinyglobby'
import { copy, remove } from 'fs-extra'
import { buildOutput } from '@vue-table-touch-scroll/build-utils'
import { pathRewriter, run } from '../utils'

/**
 * 生成 TypeScript 类型定义文件
 * 使用 vue-tsc 编译器生成类型声明，并进行路径重写和文件整理
 *
 * 功能说明：
 * 1. 使用 vue-tsc 生成类型定义文件
 *    - 基于 tsconfig.web.json 配置
 *    - 只生成声明文件，不生成 JS 代码
 *    - 输出到 dist/types 目录
 *
 * 2. 重写导入路径
 *    - 查找所有生成的 .d.ts 文件
 *    - 使用 pathRewriter 重写内部导入路径
 *    - 确保路径指向正确的模块位置
 *
 * 3. 整理文件结构
 *    - 将 vue-table-touch-scroll 目录中的类型文件复制到上层
 *    - 删除原始的嵌套目录
 *    - 简化最终的类型定义文件结构
 *
 * 输出目录：dist/types/packages/
 *
 * 使用位置：
 * - internal/build/gulpfile.ts (通过 runTask('generateTypesDefinitions') 调用)
 * 导出状态：已使用
 */
export const generateTypesDefinitions = async () => {
  // 使用 vue-tsc 生成类型定义
  await run(
    'npx vue-tsc -p tsconfig.web.json --declaration --emitDeclarationOnly --declarationDir dist/types'
  )

  const typesDir = path.join(buildOutput, 'types', 'packages')

  // 查找所有生成的 .d.ts 文件
  const filePaths = await glob('**/*.d.ts', {
    cwd: typesDir,
    absolute: true,
  })

  // 重写导入路径
  const rewriteTasks = filePaths.map(async (filePath) => {
    const content = await readFile(filePath, 'utf8')
    await writeFile(filePath, pathRewriter('esm')(content), 'utf8')
  })
  await Promise.all(rewriteTasks)

  // 复制类型定义到目标目录
  const sourceDir = path.join(typesDir, 'vue-table-touch-scroll')
  await copy(sourceDir, typesDir)
  await remove(sourceDir)
}
