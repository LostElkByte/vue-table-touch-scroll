import {
  getPackageManifest,
  vueTableTouchScrollPackage,
} from '@vue-table-touch-scroll/build-utils'

export const buildHelper = () => {
  // Helper function for building component documentation
  // This is a placeholder implementation
  const { name, version } = getPackageManifest(vueTableTouchScrollPackage)
  console.log(`Building helper for ${name} v${version}`)
}
