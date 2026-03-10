import path from 'path'
import { glob } from 'tinyglobby'
import {
  buildOutput,
  vueTableTouchScrollPackage,
  excludeFiles,
  getPackageDependencies,
  pkgRoot,
  projRoot,
} from '@vue-table-touch-scroll/build-utils'
import { build } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import { target } from '../build-info'

import type { BuildOptions } from 'rolldown'

const tsconfig = path.resolve(projRoot, 'tsconfig.web.json')
const epDeps = getPackageDependencies(vueTableTouchScrollPackage)
const pkgExternal = Object.values(epDeps).flat()
const external = [/^@vue/, /^vue/, ...pkgExternal]

export async function generateTypesDefinitions() {
  const input = excludeFiles(
    await glob(['**/index.ts', '!**/*.d.ts'], {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const options: BuildOptions = {
    input,
    external,
    tsconfig,
    transform: {
      target,
    },
    plugins: dts({
      parallel: true,
      tsconfig,
      eager: true,
      vue: true,
      emitDtsOnly: true,
      compilerOptions: {
        emitDeclarationOnly: true,
        declaration: true,
      },
    }),
    output: {
      preserveModules: true,
      preserveModulesRoot: pkgRoot,
      dir: path.resolve(buildOutput, 'types'),
    },
  }

  return build(options)
}
