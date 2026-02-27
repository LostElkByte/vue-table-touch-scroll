import { vTableTouchScroll } from '@vue-table-touch-scroll/core'

import type { App, Plugin } from 'vue'

export * from '@vue-table-touch-scroll/core'

const installer: Plugin = {
  install(app: App) {
    app.directive('table-touch-scroll', vTableTouchScroll)
  },
}

export default installer
