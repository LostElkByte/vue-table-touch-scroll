import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const vue3MobileTableRoot = resolve(pkgRoot, 'vue3-mobile-table')
export const buildRoot = resolve(projRoot, 'internal', 'build')
export const docsDirName = 'docs'
export const docRoot = resolve(projRoot, docsDirName)
export const vpRoot = resolve(docRoot, '.vitepress')
export const buildOutput = resolve(projRoot, 'dist')
export const vue3MobileTableOutput = resolve(buildOutput, 'vue3-mobile-table')
export const projPackage = resolve(projRoot, 'package.json')
export const vue3MobileTablePackage = resolve(
  vue3MobileTableRoot,
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
