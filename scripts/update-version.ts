import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import chalk from 'chalk'
import consola from 'consola'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projRoot = path.resolve(__dirname, '..')

async function main() {
  const tagVersion = process.env.TAG_VERSION
  const gitHead = process.env.GIT_HEAD

  if (!tagVersion) {
    consola.error('No TAG_VERSION environment variable found')
    process.exit(1)
  }

  consola.log(chalk.cyan('Start updating version'))
  consola.log(chalk.cyan(`TAG_VERSION: ${tagVersion}`))
  if (gitHead) {
    consola.log(chalk.cyan(`GIT_HEAD: ${gitHead}`))
  }

  // Update main package version
  const mainPkgPath = path.resolve(
    projRoot,
    'packages/vue-table-touch-scroll/package.json'
  )
  const corePkgPath = path.resolve(projRoot, 'packages/core/package.json')
  const utilsPkgPath = path.resolve(projRoot, 'packages/utils/package.json')

  const updatePackageVersion = async (pkgPath: string) => {
    const content = await readFile(pkgPath, 'utf-8')
    const pkg = JSON.parse(content)
    pkg.version = tagVersion

    if (gitHead) {
      pkg.gitHead = gitHead
    }

    await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
    consola.success(chalk.green(`Updated ${path.basename(pkgPath)}`))
  }

  try {
    await updatePackageVersion(mainPkgPath)
    await updatePackageVersion(corePkgPath)
    await updatePackageVersion(utilsPkgPath)

    consola.success(chalk.green('All package versions updated successfully'))
  } catch (err: any) {
    consola.error(chalk.red('Failed to update versions:'), err)
    process.exit(1)
  }
}

main()
