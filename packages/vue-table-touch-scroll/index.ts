import { vTableTouchScroll } from './src/directive'

import type { App, Plugin } from 'vue'

export * from './src/directive'
export type { TableTouchScrollOptions } from './src/types'
export type { TablePreset } from './src/presets'
export { UI_LIBRARY_SELECTORS, getSelectorByPreset } from './src/presets'

const installer: Plugin = {
  install(app: App) {
    app.directive('table-touch-scroll', vTableTouchScroll)
  },
}

export default installer
