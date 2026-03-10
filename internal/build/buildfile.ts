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

  // 替换 workspace 依赖
  const dependencies = packageJson.dependencies || {}
  const devDependencies = packageJson.devDependencies || {}

  // 替换 workspace 依赖为当前版本
  const currentVersion = packageJson.version

  // 处理 dependencies
  for (const [key, value] of Object.entries(dependencies)) {
    if (typeof value === 'string' && value.startsWith('workspace:')) {
      dependencies[key] = currentVersion
    }
  }

  // 处理 devDependencies
  for (const [key, value] of Object.entries(devDependencies)) {
    if (typeof value === 'string' && value.startsWith('workspace:')) {
      devDependencies[key] = currentVersion
    }
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
