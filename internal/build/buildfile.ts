import path from 'path'
import { copyFile, cp, mkdir, readFile, rm, writeFile } from 'fs/promises'
import {
  buildOutput,
  execCommand,
  projRoot,
  vueTableTouchScrollOutput,
  vueTableTouchScrollPackage,
} from '@vue-table-touch-scroll/build-utils'
import {
  buildConfig,
  buildFullBundle,
  buildModules,
  generateTypesDefinitions,
  run,
} from './src'

import type { Module } from './src'

const processPackageJson = async () => {
  // 读取原始 package.json
  const packageJsonPath = vueTableTouchScrollPackage
  const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)

  // 删除 workspace 依赖（因为这些代码已经打包到主包中了）
  const dependencies = packageJson.dependencies || {}

  // 删除所有 workspace 依赖
  for (const key of Object.keys(dependencies)) {
    if (
      typeof dependencies[key] === 'string' &&
      dependencies[key].startsWith('workspace:')
    ) {
      delete dependencies[key]
    }
  }

  // 如果 dependencies 为空对象，则删除整个 dependencies 字段
  if (Object.keys(dependencies).length === 0) {
    delete packageJson.dependencies
  }

  // 写回处理后的 package.json
  const outputPath = path.join(vueTableTouchScrollOutput, 'package.json')
  await writeFile(outputPath, JSON.stringify(packageJson, null, 2))
}

const copyFiles = () =>
  Promise.all([
    processPackageJson(),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(vueTableTouchScrollOutput, 'README.md')
    ),
    copyFile(
      path.resolve(projRoot, 'LICENSE'),
      path.resolve(vueTableTouchScrollOutput, 'LICENSE')
    ),
  ])

const copyTypesDefinitions = () => {
  const src = path.resolve(buildOutput, 'types')
  const copyTypes = (module: Module) => {
    return execCommand(
      () => cp(src, buildConfig[module].output.path, { recursive: true }),
      `copyTypes:${module}`
    )
  }

  return Promise.all([copyTypes('esm'), copyTypes('cjs')])
}

const makeOutput = async () => {
  await execCommand(() => run('pnpm run clean'), 'clean output')
  await execCommand(
    () => mkdir(vueTableTouchScrollOutput, { recursive: true }),
    'create output'
  )
}

const cleanupTypesDefinitions = () => {
  return rm(path.resolve(buildOutput, 'types'), { recursive: true })
}

async function build() {
  await makeOutput()
  await Promise.all([
    execCommand(generateTypesDefinitions),
    execCommand(buildModules),
    execCommand(buildFullBundle),
    execCommand(copyFiles),
  ])
  await execCommand(copyTypesDefinitions)
  await execCommand(cleanupTypesDefinitions)
}

function main() {
  return execCommand(build)
}

main()
