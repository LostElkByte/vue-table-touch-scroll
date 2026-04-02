import vue from '@vitejs/plugin-vue'
import { glob } from 'tinyglobby'
import { rolldown } from 'rolldown'
import {
  excludeFiles,
  vueTableTouchScrollRoot,
} from '@vue3-mobile-table/build-utils'
import { generateExternal, writeBundles } from '../utils'
import { buildConfigEntries } from '../build-info'

import type { OutputOptions } from 'rolldown'

const plugins = [vue()]

export async function buildModules() {
  const input = excludeFiles(
    await glob(['**/*.ts', '!**/*.d.ts'], {
      cwd: vueTableTouchScrollRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rolldown({
    input,
    plugins,
    external: generateExternal({ full: false }),
    treeshake: { moduleSideEffects: false },
  })

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: vueTableTouchScrollRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
