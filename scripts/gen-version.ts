import { writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import consola from 'consola'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projRoot = path.resolve(__dirname, '..')

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  } else {
    // Read from package.json
    const pkg = require('../packages/vue-table-touch-scroll/package.json')
    return pkg.version
  }
}

const version = getVersion()

async function main() {
  consola.info(`Generating version: ${version}`)

  const versionFilePath = path.resolve(
    projRoot,
    'packages/vue-table-touch-scroll/version.ts'
  )

  await writeFile(versionFilePath, `export const version = '${version}'\n`)

  consola.success(`Version file generated: ${versionFilePath}`)
}

main()
