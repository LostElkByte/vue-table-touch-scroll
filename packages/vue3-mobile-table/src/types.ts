import type { TablePreset } from './presets'

/**
 * 设备类型 / Device type
 * - 'mobile': 纯移动端（手机/平板），粗指针 + 触摸能力 / Pure mobile with coarse pointer + touch
 * - 'desktop': 纯 PC，无触摸能力 / Pure desktop without touch capability
 * - 'hybrid': 混合设备（Surface / 触屏笔记本），有触摸但主指针为精细指针 / Hybrid device with touch but fine pointer
 */
export type DeviceType = 'mobile' | 'desktop' | 'hybrid'

/**
 * 懒接管状态机 / Lazy hijacking state machine
 * - 'dormant': 休眠，纯 PC 设备，不做任何操作 / Dormant: pure PC, no-op
 * - 'standby': 待命，混合设备默认状态，仅挂哨兵事件 / Standby: hybrid default, sentinel events only
 * - 'pending-active': 待确认激活，touchstart 后记录坐标但不劫持样式 / Pending: touchstart recorded, no style hijacking yet
 * - 'active': 激活，劫持样式并绑定全套触摸事件 / Active: styles hijacked, full touch event binding
 */
export type HijackState = 'dormant' | 'standby' | 'pending-active' | 'active'

/**
 * v-mobile-table 指令配置项
 * Configuration options for the v-mobile-table directive
 */
export interface MobileTableOptions {
  /**
   * 是否启用自定义滚动
   * Whether to enable custom scrolling
   * @default true
   */
  enabled?: boolean
  /**
   * 判定滚动方向前的位移阈值 (px)
   * 用于区分轻微抖动点击和有意识的拖拽
   * Displacement threshold (px) before determining scroll direction.
   * Used to distinguish between slight jittery clicks and intentional drags.
   * @default 5
   */
  dragThreshold?: number
  /**
   * 摩擦力/衰减率
   * 控制惯性滚动的物理体感，值越大滚动越丝滑（衰减慢），值越小即停感越强（衰减快）
   * Friction/Decay rate.
   * Controls the physical feel of inertial scrolling. Higher values result in smoother
   * scrolling (slower decay), while lower values result in a sharper stop (faster decay).
   * 建议范围 / Recommended range: 0.8 - 0.99
   * @default 0.95
   */
  friction?: number
  /**
   * 滚动开始时的回调函数
   * 触发时机：用户开始拖拽滚动时（超过 dragThreshold 阈值后）
   * Callback function when scrolling starts.
   * Triggered when the user starts dragging (after exceeding dragThreshold).
   * 使用场景：关闭浮层、记录开始时间等 / Use cases: Close popovers, log start time, etc.
   */
  onScrollStart?: () => void
  /**
   * 滚动结束时的回调函数
   * 触发时机：惯性动画完全停止后
   * Callback function when scrolling ends.
   * Triggered after the inertial animation has fully stopped.
   * 使用场景：触发埋点、加载更多数据、同步状态等 / Use cases: Trigger tracking, load more data, sync state, etc.
   */
  onScrollEnd?: () => void
  /**
   * 是否禁用惯性滚动
   * 为 true 时，手指停止即滚动停止，不会有惯性效果
   * Whether to disable inertial scrolling.
   * If true, scrolling stops immediately when the finger is released, with no inertial effect.
   * 适用场景：低性能设备、表单输入场景等需要精确控制的场景
   * Use cases: Low-performance devices, form input scenarios requiring precise control.
   * @default false
   */
  disableInertia?: boolean
  /**
   * 急停点击拦截的速度阈值 (px/ms)
   * 当滚动速度超过此阈值时，停止后会拦截点击事件，防止误触
   * Velocity threshold for intercepting clicks (px/ms).
   * When scrolling speed exceeds this threshold, click events are intercepted after stopping to prevent accidental triggers.
   * 值越大越宽松（不容易拦截），值越小越严格（容易拦截）
   * Larger values are looser (harder to block), smaller values are stricter (easier to block).
   * 建议范围 / Recommended range: 0.3 - 1.0
   * @default 0.5
   */
  clickBlockThreshold?: number
  /**
   * UI 库预设名称
   * 使用预设可以自动应用对应 UI 库的滚动容器选择器
   * UI library preset name.
   * Using a preset automatically applies the scroll container selector for the corresponding UI library.
   * 支持的 UI 库 / Supported libraries: 'element-plus' | 'ant-design-vue' | 'arco-design' | 'naive-ui' | 'primevue' | 'vuetify' | 'vxe-table'
   *
   * @example
   * ```vue
   * <div v-mobile-table="{ preset: 'element-plus' }">
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
   * Target scroll element CSS selector.
   * Suitable for custom components or scenarios requiring precise control.
   * If both preset and selector are provided, selector has higher priority.
   * If neither is provided, defaults to the element bound to the directive itself.
   *
   * @example
   * ```vue
   * <div v-mobile-table="{ selector: '.custom-scroll-container' }">
   *   <CustomTable />
   * </div>
   * ```
   */
  selector?: string
  /**
   * 设备检测模式 / Device detection mode.
   * - 'auto': 自动检测（默认），混合设备启用懒接管 / Automatic detection, lazy hijacking for hybrids
   * - 'always': 始终激活触摸处理，忽略设备类型 / Always activate touch handling regardless of device
   * @default 'auto'
   */
  mode?: 'auto' | 'always'
  /**
   * CSS 旋转角度（度数）。
   * 当容器通过 CSS transform: rotate() 模拟横屏时，
   * 指令会对触摸坐标进行逆变换以正确映射滚动方向。
   * CSS rotation angle (degrees).
   * When the container uses CSS transform: rotate() to simulate landscape mode,
   * the directive applies an inverse transform to touch coordinates for correct scroll mapping.
   * 支持 0 / 90 / -90 / 180。
   * @default 0
   */
  rotation?: 0 | 90 | -90 | 180
  /**
   * 是否禁用边缘检测。
   * 为 true 时，滚动到达边界后不会交还控制权给浏览器，始终由指令接管。
   * 适用于全屏覆盖层等不希望触发浏览器原生手势（如 iOS 侧滑返回）的场景。
   * Whether to disable edge detection.
   * When true, the directive will not hand control back to the browser when scrolling
   * reaches the boundary, keeping full control at all times.
   * Useful for fullscreen overlays where native browser gestures (e.g. iOS swipe-back) are unwanted.
   * @default false
   */
  disableEdgeDetection?: boolean
}

/**
 * 滚动引擎内部上下文状态
 * Internal scroll engine context state.
 * 使用 WeakMap 存储，确保 DOM 销毁时自动进行垃圾回收
 * Stored via WeakMap to ensure automatic garbage collection when the DOM is destroyed.
 */
export interface ScrollContext {
  /** 指令绑定的根元素 / Root element bound to the directive */
  el: HTMLElement
  /** 实际执行滚动的 DOM 元素 / The DOM element where scrolling is performed */
  scrollEl: HTMLElement
  /** 原始样式备份：用于指令卸载时恢复元素初始状态 / Original styles backup: used to restore initial state on unmount */
  originalStyles: Map<string, string>

  // 懒接管状态 / Lazy hijacking state
  deviceType: DeviceType
  hijackState: HijackState
  /**
   * 哨兵事件控制器，生命周期与指令一致（unmounted 时才销毁）
   * Sentinel event controller, lifecycle matches the directive (destroyed on unmount)
   */
  sentinelAbort: AbortController
  /**
   * Active 状态事件控制器，每次 deactivate 时 abort，每次 activate 时重建
   * Active-state event controller, abort on deactivate, recreate on activate
   */
  activeAbort: AbortController | null
  /** PendingActive 中间态的起始触摸坐标 / Starting touch coordinates for pending-active state */
  pendingStartX: number
  pendingStartY: number

  // 手势追踪 / Gesture tracking
  touchStartX: number
  touchStartY: number
  lastTouchX: number
  lastTouchY: number
  lastTouchTime: number

  // 动画与物理状态 / Animation and physical state
  lastFrameTime: number
  gestureDirection: 'horizontal' | 'vertical' | null
  lockedDirection: 'horizontal' | 'vertical' | null
  velocity: number // 像素/毫秒 (px/ms) / Pixels per millisecond (px/ms)
  rafId: number | null
  friction: number // 摩擦力衰减率 / Friction decay rate
  disableInertia: boolean // 是否禁用惯性滚动 / Whether to disable inertia
  clickBlockThreshold: number // 急停点击拦截的速度阈值 / Velocity threshold for click blocking
  dragThreshold: number // 触摸移动阈值 / Touch move threshold

  activeTouchId: number | null // 当前追踪的手指 ID，防止多指交替引起坐标跳变 / Currently tracked finger ID to prevent multi-touch coordinate jumps
  touchTracker: { time: number; x: number; y: number }[] // 历史滑动轨迹队列，用于精准计算惯性 / History trajectory queue for precise inertia calculation

  // 生命周期回调 / Lifecycle callbacks
  onScrollStart?: () => void
  onScrollEnd?: () => void

  // 状态位 / Status flags
  isTouching: boolean
  targetScrollLeft: number
  targetScrollTop: number
  isMoved: boolean

  /**
   * 原生滚动接管标记
   * 为 true 时，当前手势将被 JS 忽略，允许浏览器触发原生行为（如侧滑返回或外层滚动）
   * Native scroll take-over flag.
   * When true, the current gesture is ignored by JS, allowing native browser behavior (e.g., swipe back or outer scroll).
   */
  isNativeScroll: boolean

  /**
   * 点击拦截标记
   * 为 true 时，将拦截接下来的 'click' 事件，防止"急停"时产生误触
   * Click interception flag.
   * When true, subsequent 'click' events will be intercepted to prevent accidental triggers during an "emergency stop".
   */
  shouldBlockClick: boolean

  /**
   * 多指锁定标记
   * 为 true 时，引擎彻底"装死"，将控制权完全交给浏览器处理原生手势（如缩放）。
   * 只有当所有手指都离开屏幕后才解除。
   * Multi-touch lock flag.
   * When true, the engine goes completely silent, handing full control to the browser
   * for native gestures (e.g. pinch-to-zoom). Only released when all fingers leave the screen.
   */
  isMultiTouching: boolean

  /**
   * CSS 旋转角度，用于对触摸坐标进行逆变换
   * CSS rotation angle for inverse-transforming touch coordinates
   */
  rotation: number

  /**
   * 是否禁用边缘检测，为 true 时滚动到边界不交还控制权给浏览器
   * Whether edge detection is disabled; when true, never hands control back at boundaries
   */
  disableEdgeDetection: boolean
}
