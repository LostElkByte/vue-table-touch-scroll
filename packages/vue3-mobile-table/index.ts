import { vMobileTable } from './src/directive'

import type { App, ObjectDirective, Plugin } from 'vue'
import type { MobileTableOptions } from './src/types'

export * from './src/directive'
export type { MobileTableOptions, DeviceType, HijackState } from './src/types'
export type { TablePreset } from './src/presets'
export { UI_LIBRARY_SELECTORS, getSelectorByPreset } from './src/presets'

const installer: Plugin = {
  install(app: App) {
    app.directive('mobile-table', vMobileTable)
  },
}

export default installer

// 为 Vue 模板提供类型支持
// 类型扩展：为 Volar 和 Vue 模板提供支持
declare module 'vue' {
  export interface GlobalDirectives {
    /**
     * 移动端表格滚动增强指令
     * Mobile table scroll enhancement directive.
     * 模板用法 / Template: <div v-mobile-table="{...}"></div>
     */
    'mobile-table': ObjectDirective<HTMLElement, MobileTableOptions | undefined>
  }
}
