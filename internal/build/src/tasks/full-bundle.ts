import path from 'path'
import { rolldown } from 'rolldown'
import vue from '@vitejs/plugin-vue'
import {
  execCommand,
  getPackageManifest,
  vue3MobileTableOutput,
  vue3MobileTableRoot,
} from '@vue3-mobile-table/build-utils'
import {
  PKG_BRAND_NAME,
  PKG_CAMELCASE_NAME,
} from '@vue3-mobile-table/build-constants'
import { formatBundleFilename, generateExternal, writeBundles } from '../utils'

import type { Plugin } from 'rolldown'

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [vue() as Plugin]
  const { version } = getPackageManifest(
    path.resolve(vue3MobileTableRoot, 'package.json')
  )
  const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`

  const bundle = await rolldown({
    input: path.resolve(vue3MobileTableRoot, 'index.ts'),
    plugins,
    external: generateExternal({ full: true }),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        vue3MobileTableOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
      minify,
    },
    {
      format: 'esm',
      file: path.resolve(
        vue3MobileTableOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
      minify,
    },
  ])
}

export const buildFull = (minify: boolean) => async () => buildFullEntry(minify)

export const buildFullBundle = () => {
  return Promise.all([
    execCommand(buildFull(true), 'buildFullMinified'),
    execCommand(buildFull(false), 'buildFull'),
  ])
}
