import path from 'path'
import { copyFile, mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
import { parallel, series } from 'gulp'
import {
  buildOutput,
  projRoot,
  vueTableTouchScrollOutput,
  vueTableTouchScrollPackage,
} from '@vue-table-touch-scroll/build-utils'
import { buildConfig, run, runTask, withTaskName } from './src'

import type { TaskFunction } from 'gulp'
import type { Module } from './src'

export const copyFiles = () =>
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

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () =>
    mkdir(vueTableTouchScrollOutput, { recursive: true })
  ),

  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypes')
  ),

  parallel(copyTypesDefinitions, copyFiles)
)

export * from './src'
