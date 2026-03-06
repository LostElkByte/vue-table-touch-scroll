/**
 * UI 库表格滚动容器选择器预设映射
 *
 * 提供常见 UI 库的预设选择器,简化用户配置
 * 用户可以直接使用预设名称而无需手动查找和配置 CSS 选择器
 */

/**
 * 支持的 UI 库预设类型
 */
export type TablePreset =
  | 'element-plus'
  | 'ant-design-vue'
  | 'arco-design'
  | 'naive-ui'
  | 'primevue'
  | 'vuetify'
  | 'vxe-table'

/**
 * UI 库选择器预设映射表
 *
 * 映射关系:
 * - element-plus: Element Plus 表格组件的滚动容器
 * - ant-design-vue: Ant Design Vue 表格组件的滚动容器
 * - arco-design: Arco Design 表格组件的滚动容器
 * - naive-ui: Naive UI 表格组件的滚动容器
 * - primevue: PrimeVue 表格组件的滚动容器
 * - vuetify: Vuetify 表格组件的滚动容器
 * - vxe-table: VxeTable 表格组件的滚动容器
 */
export const UI_LIBRARY_SELECTORS: Record<TablePreset, string> = {
  'element-plus': '.el-scrollbar__wrap',
  'ant-design-vue': '.ant-table-body',
  'arco-design': '.arco-table-body',
  'naive-ui': '.n-scrollbar-container',
  primevue: '.p-datatable-table-container',
  vuetify: '.v-table__wrapper tbody',
  'vxe-table': '.vxe-table--body-inner-wrapper',
}

/**
 * 根据预设名称获取对应的选择器
 *
 * @param preset - UI 库预设名称
 * @returns 对应的 CSS 选择器,如果预设不存在则返回 undefined
 *
 * @example
 * ```ts
 * const selector = getSelectorByPreset('element-plus')
 * // 返回: '.el-scrollbar__wrap'
 * ```
 */
export function getSelectorByPreset(preset: TablePreset): string | undefined {
  return UI_LIBRARY_SELECTORS[preset]
}
