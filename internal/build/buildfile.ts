import path from 'path'
import { copyFile, cp, mkdir, rm } from 'fs/promises'
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

const copyFiles = () =>
  Promise.all([
    copyFile(
      vueTableTouchScrollPackage,
      path.join(vueTableTouchScrollOutput, 'package.json')
    ),
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
