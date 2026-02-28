/**
 * 完整打包构建任务
 * 负责构建用于浏览器直接引用的 UMD 格式打包文件
 */

import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { OUTPUT_DIR, PKG_ROOT } from '../utils/paths'
import {
  PKG_BRAND_NAME,
  PKG_CAMELCASE_NAME,
} from '@vue-table-touch-scroll/build-constants'
import { getPackageManifest } from '@vue-table-touch-scroll/build-utils'

/**
 * 构建完整的 UMD 打包文件
 * 生成可在浏览器中通过 <script> 标签直接引用的文件
 *
 * 功能说明：
 * - 使用 UMD 格式，支持多种模块系统（AMD、CommonJS、全局变量）
 * - 使用 esbuild 进行代码压缩 (minify)
 * - 目标为 ES2015，确保较好的浏览器兼容性
 * - 将 Vue 声明为外部依赖和全局变量
 * - 添加版本号 banner 注释
 * - 不生成 source map
 *
 * 输出文件：
 * - 路径: dist/vue-table-touch-scroll/dist/index.full.js
 * - 格式: UMD (Universal Module Definition)
 * - 全局变量名: VueTableTouchScroll (驼峰命名)
 *
 * 使用位置：
 * - internal/build/gulpfile.ts (通过 runTask('buildFullBundle') 调用)
 * 导出状态：已使用
 */
export async function buildFullBundle() {
  const input = path.resolve(PKG_ROOT, 'vue-table-touch-scroll/index.ts')
  const { version } = getPackageManifest(
    path.resolve(PKG_ROOT, 'vue-table-touch-scroll/package.json')
  )

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
    name: PKG_CAMELCASE_NAME,
    globals: {
      vue: 'Vue',
    },
    sourcemap: false,
    banner: `/*! ${PKG_BRAND_NAME} v${version} */`,
  })
}
