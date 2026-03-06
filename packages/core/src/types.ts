import type { TablePreset } from './presets'

/**
 * v-table-touch-scroll 指令配置项
 */
export interface TableTouchScrollOptions {
  /**
   * 是否启用自定义滚动
   * @default true
   */
  enabled?: boolean
  /**
   * 判定滚动方向前的位移阈值 (px)
   * 用于区分轻微抖动点击和有意识的拖拽
   * @default 5
   */
  dragThreshold?: number
  /**
   * 摩擦力/衰减率
   * 控制惯性滚动的物理体感，值越大滚动越丝滑（衰减慢），值越小即停感越强（衰减快）
   * 建议范围: 0.8 - 0.99
   * @default 0.95
   */
  friction?: number
  /**
   * UI 库预设名称
   * 使用预设可以自动应用对应 UI 库的滚动容器选择器
   * 支持的 UI 库: 'element-plus' | 'ant-design-vue' | 'arco-design' | 'naive-ui' | 'primevue' | 'vuetify' | 'vxe-table'
   *
   * @example
   * ```vue
   * <div v-table-touch-scroll="{ preset: 'element-plus' }">
   *   <el-table />
   * </div>
   * ```
   */
  preset?: TablePreset
  /**
   * 目标滚动元素的 CSS 选择器
   * 适用于自定义组件或需要精确控制的场景
   * 如果同时提供了 preset 和 selector，selector 优先级更高
   * 如果都未提供，则默认为绑定指令的元素本身
   *
   * @example
   * ```vue
   * <div v-table-touch-scroll="{ selector: '.custom-scroll-container' }">
   *   <CustomTable />
   * </div>
   * ```
   */
  selector?: string
}

/**
 * 滚动引擎内部上下文状态
 * 使用 WeakMap 存储，确保 DOM 销毁时自动进行垃圾回收
 */
export interface ScrollContext {
  /** 实际执行滚动的 DOM 元素 */
  scrollEl: HTMLElement
  /** 控制器：用于一键移除所有绑定的事件监听器 */
  abortController: AbortController
  /** 原始样式备份：用于指令卸载时恢复元素初始状态 */
  originalStyles: Map<string, string>

  // 手势追踪
  touchStartX: number
  touchStartY: number
  lastTouchX: number
  lastTouchY: number
  lastTouchTime: number

  // 动画与物理状态
  lastFrameTime: number
  gestureDirection: 'horizontal' | 'vertical' | null
  lockedDirection: 'horizontal' | 'vertical' | null
  velocity: number // 像素/毫秒 (px/ms)
  rafId: number | null
  friction: number // 摩擦力/衰减率

  // 状态位
  isTouching: boolean
  targetScrollLeft: number
  targetScrollTop: number
  isMoved: boolean

  /**
   * 原生滚动接管标记
   * 为 true 时，当前手势将被 JS 忽略，允许浏览器触发原生行为（如侧滑返回或外层滚动）
   */
  isNativeScroll: boolean

  /**
   * 点击拦截标记
   * 为 true 时，将拦截接下来的 'click' 事件，防止"急停"时产生误触
   */
  shouldBlockClick: boolean
}
