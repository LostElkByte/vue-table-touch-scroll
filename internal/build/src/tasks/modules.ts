/**
 * 模块构建任务
 * 负责将源代码编译为 ESM 和 CJS 两种模块格式
 */

import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { OUTPUT_DIR, PKG_ROOT } from '../utils/paths'

/**
 * 构建模块文件
 * 使用 Rollup 将源代码编译为 ESM 和 CJS 两种格式
 *
 * 功能说明：
 * - 使用 Vue 插件处理 .vue 文件
 * - 使用 esbuild 进行快速编译和转译
 * - 保留模块结构 (preserveModules)
 * - 同时输出 ESM (.mjs) 和 CJS (.js) 格式
 * - 生成 source map 文件用于调试
 * - 将 vue 标记为外部依赖，不打包进输出文件
 *
 * 输出目录：
 * - ESM: dist/vue-table-touch-scroll/es/
 * - CJS: dist/vue-table-touch-scroll/lib/
 *
 * 使用位置：
 * - internal/build/gulpfile.ts (通过 runTask('buildModules') 调用)
 * 导出状态：已使用
 */
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
