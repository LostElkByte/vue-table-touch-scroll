import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const coreRoot = resolve(pkgRoot, 'core')
export const utilRoot = resolve(pkgRoot, 'utils')
export const vueTableTouchScrollRoot = resolve(
  pkgRoot,
  'vue-table-touch-scroll'
)
export const buildRoot = resolve(projRoot, 'internal', 'build')

export const docsDirName = 'docs'
export const docRoot = resolve(projRoot, docsDirName)
export const vpRoot = resolve(docRoot, '.vitepress')

export const buildOutput = resolve(projRoot, 'dist')
export const vueTableTouchScrollOutput = resolve(
  buildOutput,
  'vue-table-touch-scroll'
)

export const projPackage = resolve(projRoot, 'package.json')
export const corePackage = resolve(coreRoot, 'package.json')
export const utilPackage = resolve(utilRoot, 'package.json')
export const vueTableTouchScrollPackage = resolve(
  vueTableTouchScrollRoot,
  'package.json'
)
export const docPackage = resolve(docRoot, 'package.json')

const windowsSlashRE = /\\/g
export function normalizePath(p: string): string {
  if (typeof process !== 'undefined' && process.platform === 'win32') {
    return p.replace(windowsSlashRE, '/')
  }
  return p
}
