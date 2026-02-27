import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { OUTPUT_DIR, PKG_ROOT } from '../utils/paths'

export async function buildModules() {
  const input = path.resolve(PKG_ROOT, 'vue-table-touch-scroll/index.ts')

  const bundle = await rollup({
    input,
    plugins: [
      vue(),
      nodeResolve(),
      commonjs(),
      esbuild({
        target: 'es2020',
        sourceMap: true,
      }),
    ],
    external: ['vue'],
  })

  await Promise.all([
    bundle.write({
      format: 'esm',
      dir: path.resolve(OUTPUT_DIR, 'es'),
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: PKG_ROOT,
      sourcemap: true,
      entryFileNames: '[name].mjs',
    }),
    bundle.write({
      format: 'cjs',
      dir: path.resolve(OUTPUT_DIR, 'lib'),
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: PKG_ROOT,
      sourcemap: true,
      entryFileNames: '[name].js',
    }),
  ])
}
