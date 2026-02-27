import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PROJECT_ROOT = path.resolve(__dirname, '../../../../')
export const PKG_ROOT = path.resolve(PROJECT_ROOT, 'packages')
export const OUTPUT_DIR = path.resolve(
  PROJECT_ROOT,
  'packages/vue-table-touch-scroll'
)
