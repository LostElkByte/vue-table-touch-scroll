import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { OUTPUT_DIR, PKG_ROOT } from '../utils/paths'

export async function buildFullBundle() {
  const input = path.resolve(PKG_ROOT, 'vue-table-touch-scroll/index.ts')

  const bundle = await rollup({
    input,
    plugins: [
      vue(),
      nodeResolve(),
      commonjs(),
      esbuild({
        target: 'es2015',
        minify: true,
      }),
    ],
    external: ['vue'],
  })

  await bundle.write({
    format: 'umd',
    file: path.resolve(OUTPUT_DIR, 'dist/index.full.js'),
    exports: 'named',
    name: 'VueTableTouchScroll',
    globals: {
      vue: 'Vue',
    },
    sourcemap: false,
  })
}
