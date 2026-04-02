/**
 * 包相关常量定义
 *
 * 这些常量用于统一管理包的各种命名格式，避免在构建过程中硬编码
 * 当包名变更时，只需修改这些常量即可
 */

/**
 * npm 包前缀
 * 用于工作空间包的命名空间
 *
 * @example
 */
export const PKG_PREFIX = '@vue3-mobile-table'

/**
 * 主包名
 * 用于 npm 发布和包管理
 *
 * @example
 * import { vTableTouchScroll } from 'vue3-mobile-table'
 */
export const PKG_NAME = 'vue3-mobile-table'

/**
 * 驼峰命名格式的包名
 * 用于 UMD 构建的全局变量名
 *
 * @example
 * // 在浏览器中通过全局变量访问
 * window.VueTableTouchScroll
 */
export const PKG_CAMELCASE_NAME = 'VueTableTouchScroll'

/**
 * 品牌名称
 * 用于文档、README、构建文件 banner 等展示
 *
 * @example
 * // 在构建文件中作为 banner
 */
export const PKG_BRAND_NAME = 'Vue3 Mobile Table'
