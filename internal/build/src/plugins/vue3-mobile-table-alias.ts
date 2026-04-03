import { PKG_NAME, PKG_PREFIX } from '@vue3-mobile-table/build-constants'

import type { Plugin } from 'rolldown'

export function Vue3MobileTableAlias(): Plugin {
  const sourcePrefix = PKG_PREFIX
  const bundleName = PKG_NAME

  return {
    name: 'vue3-mobile-table-alias-plugin',
    resolveId: {
      filter: {
        id: new RegExp(`^${sourcePrefix}`),
      },
      handler(id) {
        return {
          id: id.replace(sourcePrefix, bundleName),
          external: 'absolute',
        }
      },
    },
  }
}
