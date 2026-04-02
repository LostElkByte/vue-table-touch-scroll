import path from 'path'
import { glob } from 'tinyglobby'
import {
  buildOutput,
  excludeFiles,
  getPackageDependencies,
  projRoot,
  vueTableTouchScrollPackage,
  vueTableTouchScrollRoot,
} from '@vue3-mobile-table/build-utils'
import { build } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import { target } from '../build-info'

import type { BuildOptions } from 'rolldown'

const tsconfig = path.resolve(projRoot, 'tsconfig.web.json')
const pkgDeps = getPackageDependencies(vueTableTouchScrollPackage)
const pkgExternal = Object.values(pkgDeps).flat()
const external = [/^@vue/, /^vue/, ...pkgExternal]

export async function generateTypesDefinitions() {
  const input = excludeFiles(
    await glob(['**/*.ts', '!**/*.d.ts'], {
      cwd: vueTableTouchScrollRoot,
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
      preserveModulesRoot: vueTableTouchScrollRoot,
      dir: path.resolve(buildOutput, 'types'),
    },
  }

  return build(options)
}
