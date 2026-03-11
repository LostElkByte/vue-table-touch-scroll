/**
 * UI 库表格滚动容器选择器预设映射
 * Preset selector mapping for UI library table scroll containers
 *
 * 提供常见 UI 库的预设选择器，简化用户配置。
 * 用户可以直接使用预设名称而无需手动查找和配置 CSS 选择器。
 * Provides preset selectors for common UI libraries to simplify configuration.
 * Users can use preset names directly without manually finding and configuring CSS selectors.
 */

/**
 * 支持的 UI 库预设类型
 * Supported UI library preset types
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
 * UI library selector preset mapping table
 *
 * 映射关系 / Mappings:
 * - element-plus: Element Plus scroll container
 * - ant-design-vue: Ant Design Vue scroll container
 * - arco-design: Arco Design scroll container
 * - naive-ui: Naive UI scroll container
 * - primevue: PrimeVue scroll container
 * - vuetify: Vuetify scroll container
 * - vxe-table: VxeTable scroll container
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
 * Get the corresponding selector based on the preset name
 *
 * @param preset - UI 库预设名称 / UI library preset name
 * @returns 对应的 CSS 选择器，如果预设不存在则返回 undefined
 *          The corresponding CSS selector, or undefined if the preset does not exist
 *
 * @example
 * ```ts
 * const selector = getSelectorByPreset('element-plus')
 * // Returns: '.el-scrollbar__wrap'
 * ```
 */
export function getSelectorByPreset(preset: TablePreset): string | undefined {
  return UI_LIBRARY_SELECTORS[preset]
}
