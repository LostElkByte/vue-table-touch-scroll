import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { glob } from 'tinyglobby'
import { copy, remove } from 'fs-extra'
import { buildOutput } from '@vue-table-touch-scroll/build-utils'
import { pathRewriter, run } from '../utils'

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
