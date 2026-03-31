import { vTableTouchScroll } from './src/directive'

import type { App, ObjectDirective, Plugin } from 'vue'
import type { TableTouchScrollOptions } from './src/types'

export * from './src/directive'
export type {
  TableTouchScrollOptions,
  DeviceType,
  HijackState,
} from './src/types'
export type { TablePreset } from './src/presets'
export { UI_LIBRARY_SELECTORS, getSelectorByPreset } from './src/presets'

const installer: Plugin = {
  install(app: App) {
    app.directive('table-touch-scroll', vTableTouchScroll)
  },
}

export default installer

// 为 Vue 模板提供类型支持
// 类型扩展：为 Volar 和 Vue 模板提供支持
declare module 'vue' {
  export interface GlobalDirectives {
    /**
     * Touch scroll directive for tables.
     * Use in template as: <div v-table-touch-scroll="{...}"></div>
     */
    'table-touch-scroll': ObjectDirective<
      HTMLElement,
      TableTouchScrollOptions | undefined
    >
  }
}
