/**
 * @file vTableTouchScroll.ts
 * @author lostElk
 * @license MIT
 *
 * @description 高性能移动端触摸滚动引擎（专为 PC 端 Table 组件适配）
 * High-performance mobile touch scrolling engine (specifically adapted for desktop Table components)
 *
 * 【业务背景 / Business Background】
 * 在移动端直接使用 PC 端的 Table 组件时，原生滚动往往存在交互不跟手、惯性反馈缺失、同步表头撕裂等问题。
 * 本指令旨在通过精确的触摸流劫持与物理引擎仿真，实现"原生级"的滚动体感。
 * When using desktop Table components directly on mobile devices, native scrolling often suffers from
 * poor responsiveness, lack of inertial feedback, and synchronized header "tearing" issues.
 * This directive aims to provide a "native-grade" scrolling experience through precise touch stream
 * hijacking and physics engine simulation.
 *
 * 【核心解决的问题 / Core Problems Solved】
 * 1. 同步表头延迟：通过同步事件派发机制，确保移动端表体与表头在同帧渲染，杜绝滚动错位。
 *    Synchronized Header Lag: Ensures table body and header render in the same frame through
 *    synchronized event dispatching, eliminating scrolling misalignment.
 * 2. 惯性阻尼不一致：消除不同手机刷新率（60/120Hz）带来的滑动速度差异，提供统一的物理阻尼手感。
 *    Inconsistent Inertial Damping: Eliminates sliding speed differences caused by different screen
 *    refresh rates (60/120Hz), providing a unified physical damping feel.
 * 3. 触摸冲突与干扰：通过多指 ID 追踪与边缘探测，解决复杂嵌套列表下的手势误触与断触问题。
 *    Touch Conflicts & Interference: Solves gesture mis-triggers and disconnections in complex
 *    nested lists through multi-finger ID tracking and edge detection.
 * 4. 移动端兼容性：让不支持触摸滑动的 PC 表格，获得如同原生 App 的流畅交互。
 *    Mobile Compatibility: Grants desktop tables that lack touch-scroll support a smooth, native App-like interaction.
 * 5. 混合设备懒接管：通过"静态环境推断 + 动态手势捕获"的双保险机制，在纯 PC / 纯移动端 / 混合设备上
 *    各自采用最优策略，避免对鼠标/触控板用户造成任何干扰。
 *    Hybrid Device Lazy Hijacking: Uses a dual mechanism of static environment detection + dynamic
 *    gesture capture, applying optimal strategies for pure PC / pure mobile / hybrid devices,
 *    avoiding any interference with mouse/trackpad users.
 *
 * 【核心技术特性 / Core Technical Features】
 * - 方向轴锁定：自动判定手势意图，过滤对角线抖动，保障滚动方向的纯粹性。
 *   Axis Locking: Automatically determines gesture intent and filters diagonal jitter to ensure pure scroll direction.
 * - 智能边缘感知：自动探测滚动边界，当触及尽头时平滑交还控制权，支持 iOS 侧滑返回。
 *   Intelligent Edge Sensing: Detects scroll boundaries and smoothly hands control back to the browser at ends, supporting iOS slide-to-back.
 * - 物理仿真引擎：采用"历史轨迹队列法"计算惯性，彻底解决采样抖动导致的滚动异常（如：列表飞出）。
 *   Physics Simulation Engine: Uses "Historical Trajectory Queue" to calculate inertia, solving scrolling anomalies caused by sampling jitter.
 * - 零冗余性能开销：内置脏值检测，确保仅在位置变更时触发渲染，保障长列表渲染的流畅度。
 *   Zero Redundancy Overhead: Built-in dirty value checking ensures rendering only triggers on position changes, maintaining fluidity.
 * - 懒接管模式：纯 PC 零侵入，混合设备按需劫持，通过 pending-active 中间态消除误触激活。
 *   Lazy Hijacking Mode: Zero intrusion on pure PC, on-demand hijacking for hybrids, pending-active
 *   intermediate state eliminates accidental activation.
 */

import { getSelectorByPreset } from './presets'

import type { DirectiveBinding, ObjectDirective } from 'vue'
import type {
  DeviceType,
  ScrollContext,
  TableTouchScrollOptions,
} from './types'

/**
 * v-mobile-table 指令类型 / v-mobile-table Directive Type
 * 接受 TableTouchScrollOptions 配置对象 / Accepts TableTouchScrollOptions configuration object
 * @example
 * v-mobile-table="{ preset: 'element-plus', friction: 0.95 }"
 */
export type VTableTouchScrollDirective = ObjectDirective<
  HTMLElement,
  TableTouchScrollOptions
>

/** 物理引擎默认参数配置 / Physics engine default configuration */
const DEFAULT_FRICTION = 0.95 // 默认摩擦力/衰减率 (值越低摩擦力越大) / Default friction/decay rate (lower value = higher friction)
const MIN_VELOCITY = 0.05 // 停止动画的速度阈值 / Velocity threshold to stop animation
const MAX_DT = 32 // 最大帧间隔限制，防止掉帧后产生大幅度位移跳变 / Max frame interval limit to prevent jumpy movement after frame drops
const DEFAULT_DRAG_THRESHOLD = 5 // 默认判定阈值 / Default drag determination threshold
const INERTIA_STOP_DELAY = 80 // 惯性保护延迟：手指停顿超过此时间再松开，则不触发惯性 / Inertia protection delay: if finger pauses > 80ms, no inertia
const SAFE_CLICK_VELOCITY = 0.5 // 安全点击速度阈值 (px/ms) 作用于用户点击正在滚动的列表进行"刹车"时 / Safe click velocity threshold for "braking"
const STYLE_PROPS = ['overflow', 'willChange', 'touchAction'] as const // 需要接管并还原的 CSS 属性列表 / List of CSS properties to hijack and restore

/** 全局映射：维护元素与内部滚动上下文的弱引用关系，防止内存泄漏 / Global WeakMap: maintains element-context relationship to prevent memory leaks */
const contexts = new WeakMap<HTMLElement, ScrollContext>()

/**
 * 触摸坐标逆变换：将屏幕物理坐标系映射到旋转后的元素坐标系
 * Inverse-transforms touch coordinates from screen physical space to rotated element space.
 *
 * 使用离散角度的轴交换 + 符号翻转，零三角函数开销。
 * Uses axis swap + sign flip for discrete angles, zero trigonometric overhead.
 */
function transformCoords(
  clientX: number,
  clientY: number,
  rotation: number
): { x: number; y: number } {
  switch (rotation) {
    case 90:
      return { x: clientY, y: -clientX }
    case -90:
      return { x: -clientY, y: clientX }
    case 180:
      return { x: -clientX, y: -clientY }
    default:
      return { x: clientX, y: clientY }
  }
}

// ─── 设备检测 / Device Detection ───────────────────────────────────────

/**
 * 静态环境推断：检测当前设备类型
 * Static environment detection: determines current device type
 *
 * 判定策略 / Detection strategy:
 * - 无触摸能力 → desktop（纯 PC）
 * - 有触摸 + 粗指针(pointer: coarse) → mobile（手机/平板）
 * - 有触摸 + 精细指针 → hybrid（Surface / 触屏笔记本）
 */
export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop'

  const hasTouchScreen =
    navigator.maxTouchPoints > 0 || 'ontouchstart' in window

  if (!hasTouchScreen) return 'desktop'

  const hasCoarsePointer =
    window.matchMedia?.('(pointer: coarse)')?.matches ?? false

  if (hasCoarsePointer) return 'mobile'
  return 'hybrid'
}

// ─── 指令定义 / Directive Definition ───────────────────────────────────

/**
 * @directive v-mobile-table
 * @description 移动端表格滚动增强指令 / Mobile table scrolling enhancement directive.
 *
 * @example
 * <div v-mobile-table="{ selector: '.table-body', friction: 0.9 }"></div>
 */
export const vTableTouchScroll: VTableTouchScrollDirective = {
  mounted(el, binding) {
    initOrUpdate(el, binding)
  },
  updated(el, binding) {
    const { value, oldValue } = binding
    const ctx = contexts.get(el)

    // 检测配置变化，若涉及滚动容器变更则重置实例 / Detect config changes; reset instance if container selector or preset changes
    if (
      value?.enabled !== oldValue?.enabled ||
      value?.selector !== oldValue?.selector ||
      value?.preset !== oldValue?.preset ||
      value?.mode !== oldValue?.mode
    ) {
      initOrUpdate(el, binding)
      return
    }

    // 浅更新 Context 参数，确保闭包引用是最新的，同时不中断动画逻辑
    // Shallow update Context parameters to ensure latest references without interrupting animation logic
    if (ctx) {
      ctx.friction = value?.friction ?? DEFAULT_FRICTION
      ctx.dragThreshold = value?.dragThreshold ?? DEFAULT_DRAG_THRESHOLD
      ctx.disableInertia = value?.disableInertia ?? false
      ctx.clickBlockThreshold =
        value?.clickBlockThreshold ?? SAFE_CLICK_VELOCITY
      ctx.rotation = value?.rotation ?? 0
      ctx.disableEdgeDetection = value?.disableEdgeDetection ?? false

      // 同步最新的回调函数引用 / Sync latest callback references
      ctx.onScrollStart = value?.onScrollStart
      ctx.onScrollEnd = value?.onScrollEnd
    }
  },
  unmounted(el) {
    cleanup(el)
  },
}

// ─── 初始化 / Initialization ───────────────────────────────────────────

/**
 * 初始化或更新指令实例 / Initializes or updates the directive instance
 * @param el - 指令所在 DOM 元素 / Target DOM element
 * @param binding - 指令绑定配置 / Directive binding configuration
 */
function initOrUpdate(
  el: HTMLElement,
  binding: DirectiveBinding<TableTouchScrollOptions>
) {
  if (typeof window === 'undefined') return

  const options = binding.value || {}
  const { enabled = true } = options
  const ctx = contexts.get(el)

  if (!enabled) {
    if (ctx) cleanup(el)
    return
  }

  if (ctx) cleanup(el)
  initDirective(el, options)
}

/**
 * 核心初始化：根据设备类型选择策略，按需劫持 DOM 样式并绑定事件
 * Core initialization: selects strategy based on device type, hijacks DOM styles and binds events on demand
 *
 * 策略分流 / Strategy routing:
 * - mode='always': 无条件进入 Active（向后兼容）/ Unconditionally enter Active (backward compatible)
 * - desktop: Dormant，静默退出 / Dormant, silent exit
 * - mobile: 立即 Active / Immediate Active
 * - hybrid: Standby，懒接管 / Standby, lazy hijacking
 */
function initDirective(el: HTMLElement, options: TableTouchScrollOptions) {
  // 优先级: selector > preset > 默认(el 本身) / Priority: selector > preset > default (el itself)
  let targetSelector: string | undefined
  if (options.selector) {
    targetSelector = options.selector
  } else if (options.preset) {
    targetSelector = getSelectorByPreset(options.preset)
  }

  const scrollEl = (
    targetSelector ? el.querySelector(targetSelector) : el
  ) as HTMLElement
  if (!scrollEl) return

  const mode = options.mode ?? 'auto'
  const deviceType: DeviceType =
    mode === 'always' ? 'mobile' : detectDeviceType()

  // 备份原始样式（所有路径都需要，以便 cleanup 能正确还原）
  // Backup original styles (needed by all paths for proper cleanup restoration)
  const originalStyles = new Map<string, string>()
  STYLE_PROPS.forEach((prop) => {
    originalStyles.set(prop, (scrollEl.style as any)[prop])
  })

  const sentinelAbort = new AbortController()

  const ctx: ScrollContext = {
    el,
    scrollEl,
    originalStyles,
    deviceType,
    hijackState: 'dormant',
    sentinelAbort,
    activeAbort: null,
    pendingStartX: 0,
    pendingStartY: 0,
    touchStartX: 0,
    touchStartY: 0,
    lastTouchX: 0,
    lastTouchY: 0,
    lastTouchTime: 0,
    lastFrameTime: 0,
    gestureDirection: null,
    lockedDirection: null,
    velocity: 0,
    rafId: null,
    friction: options.friction ?? DEFAULT_FRICTION,
    dragThreshold: options.dragThreshold ?? DEFAULT_DRAG_THRESHOLD,
    disableInertia: options.disableInertia ?? false,
    clickBlockThreshold: options.clickBlockThreshold ?? SAFE_CLICK_VELOCITY,
    onScrollStart: options.onScrollStart,
    onScrollEnd: options.onScrollEnd,
    isTouching: false,
    targetScrollLeft: 0,
    targetScrollTop: 0,
    isMoved: false,
    isNativeScroll: false,
    shouldBlockClick: false,
    isMultiTouching: false,
    activeTouchId: null,
    touchTracker: [],
    rotation: options.rotation ?? 0,
    disableEdgeDetection: options.disableEdgeDetection ?? false,
  }

  contexts.set(el, ctx)

  if (deviceType === 'desktop') {
    // 纯 PC：Dormant，不做任何操作 / Pure PC: Dormant, no-op
    ctx.hijackState = 'dormant'
    return
  }

  if (deviceType === 'mobile') {
    // 纯移动端：立即进入 Active / Pure mobile: immediate Active
    activateHijacking(ctx)
  } else {
    // 混合设备：进入 Standby，挂哨兵事件 / Hybrid: enter Standby, attach sentinels
    enterStandby(ctx)
  }
}

// ─── 懒接管状态管理 / Lazy Hijacking State Management ──────────────────

/**
 * 进入 Standby 模式：挂载哨兵事件，不改变 DOM 样式
 * Enter Standby mode: attach sentinel events without modifying DOM styles
 *
 * 哨兵事件包括 / Sentinel events:
 * - touchstart: 进入 pending-active 中间态 / Enter pending-active intermediate state
 * - touchmove: 超过阈值则激活 / Activate if threshold exceeded
 * - touchend/cancel: 未超阈值则静默回退 / Silent rollback if threshold not reached
 * - wheel: 从 Active 强制夺回控制权 / Force reclaim control from Active
 */
function enterStandby(ctx: ScrollContext) {
  ctx.hijackState = 'standby'

  const { signal } = ctx.sentinelAbort

  ctx.el.addEventListener('touchstart', (e) => onSentinelTouchStart(e, ctx), {
    passive: false,
    signal,
  })
  ctx.el.addEventListener('touchmove', (e) => onSentinelTouchMove(e, ctx), {
    passive: false,
    signal,
  })
  ctx.el.addEventListener('touchend', () => onSentinelTouchEnd(ctx), { signal })
  ctx.el.addEventListener('touchcancel', () => onSentinelTouchEnd(ctx), {
    signal,
  })
  ctx.el.addEventListener('wheel', () => onSentinelWheel(ctx), {
    passive: true,
    signal,
  })
}

/**
 * 哨兵 touchstart：进入 pending-active，只记录坐标不劫持样式
 * Sentinel touchstart: enter pending-active, record coords without hijacking styles
 */
function onSentinelTouchStart(e: TouchEvent, ctx: ScrollContext) {
  if (ctx.hijackState !== 'standby' && ctx.hijackState !== 'pending-active')
    return
  if (e.touches.length !== 1) return

  ctx.hijackState = 'pending-active'
  const t = e.touches[0]
  const { x, y } = transformCoords(t.clientX, t.clientY, ctx.rotation)
  ctx.pendingStartX = x
  ctx.pendingStartY = y

  // 初始化手势追踪状态，但此时 scrollEl 样式未改变
  // Initialize gesture tracking state, but scrollEl styles remain untouched
  onTouchStart(e, ctx)
}

/**
 * 哨兵 touchmove：超过 dragThreshold 则确认为真实拖拽，执行 activateHijacking
 * Sentinel touchmove: confirm as real drag when exceeding threshold, execute activateHijacking
 */
function onSentinelTouchMove(e: TouchEvent, ctx: ScrollContext) {
  if (ctx.hijackState !== 'pending-active') return

  const t = e.touches[0]
  if (!t) return

  const { x, y } = transformCoords(t.clientX, t.clientY, ctx.rotation)
  const dx = Math.abs(x - ctx.pendingStartX)
  const dy = Math.abs(y - ctx.pendingStartY)

  if (dx > ctx.dragThreshold || dy > ctx.dragThreshold) {
    // 确认为真实拖拽 → 劫持样式，正式进入 Active
    // Confirmed as real drag → hijack styles, officially enter Active
    activateHijacking(ctx)
    onTouchMove(e, ctx)
  }
  // pending-active 下不 preventDefault，不干扰原生行为
  // Don't preventDefault in pending-active, don't interfere with native behavior
}

/**
 * 哨兵 touchend/cancel：如果还在 pending-active，说明是纯点击，静默回到 standby
 * Sentinel touchend/cancel: if still pending-active, it's a pure click, silently return to standby
 */
function onSentinelTouchEnd(ctx: ScrollContext) {
  if (ctx.hijackState === 'pending-active') {
    ctx.hijackState = 'standby'
    // 清理 onTouchStart 设置的追踪状态 / Clean up tracking state set by onTouchStart
    ctx.isTouching = false
    ctx.activeTouchId = null
  }
}

/**
 * 哨兵 wheel：从 Active 立即夺回控制权（最高优先级）
 * Sentinel wheel: immediately reclaim control from Active (highest priority)
 *
 * 策略：强制中止惯性动画 → 同步位置 → 还原样式 → 回到 standby
 * Strategy: force stop inertia → sync position → restore styles → return to standby
 */
function onSentinelWheel(ctx: ScrollContext) {
  if (ctx.hijackState === 'active') {
    stopAnimation(ctx)
    deactivateHijacking(ctx)
  }
}

/**
 * 激活接管：劫持 DOM 样式，绑定全套触摸事件
 * Activate hijacking: hijack DOM styles, bind full touch event set
 *
 * 使用独立的 activeAbort 控制器管理 Active 状态事件，
 * 与 sentinelAbort 隔离，确保 deactivate 时不误杀哨兵事件。
 * Uses a separate activeAbort controller for Active-state events,
 * isolated from sentinelAbort to prevent killing sentinel events on deactivate.
 */
function activateHijacking(ctx: ScrollContext) {
  ctx.hijackState = 'active'

  // 劫持样式 / Hijack styles
  ctx.scrollEl.style.setProperty('overflow', 'hidden', 'important')
  ctx.scrollEl.style.willChange = 'scroll-position'
  if (ctx.scrollEl.style.touchAction === 'none') {
    ctx.scrollEl.style.touchAction = 'auto'
  }

  // 创建 Active 状态的独立事件控制器 / Create isolated event controller for Active state
  ctx.activeAbort = new AbortController()
  const { signal } = ctx.activeAbort

  ctx.el.addEventListener('touchstart', (e) => onTouchStart(e, ctx), {
    passive: false,
    signal,
  })
  ctx.el.addEventListener('touchmove', (e) => onTouchMove(e, ctx), {
    passive: false,
    signal,
  })
  ctx.el.addEventListener('touchend', (e) => onTouchEnd(e, ctx), { signal })
  ctx.el.addEventListener('touchcancel', (e) => onTouchEnd(e, ctx), { signal })

  // 在捕获阶段拦截点击事件 / Intercept click events in the capture phase
  ctx.el.addEventListener(
    'click',
    (e) => {
      if (ctx.isMoved || ctx.shouldBlockClick) {
        e.stopImmediatePropagation()
        e.preventDefault()
        ctx.isMoved = false
        ctx.shouldBlockClick = false
      }
    },
    { capture: true, signal }
  )
}

/**
 * 反激活：同步位置防闪烁，还原样式，清理 Active 事件，回到 Standby
 * Deactivate: sync position to prevent snap, restore styles, clean Active events, return to Standby
 */
function deactivateHijacking(ctx: ScrollContext) {
  // 1. 强制同步位置，消除舍入偏差防闪烁 / Force sync position to eliminate rounding errors
  ctx.scrollEl.scrollLeft = ctx.targetScrollLeft
  ctx.scrollEl.scrollTop = ctx.targetScrollTop

  // 2. 在同一帧内还原样式 / Restore styles in the same frame
  ctx.originalStyles.forEach((val, prop) => {
    ;(ctx.scrollEl.style as any)[prop] = val
  })

  // 3. 清理 Active 状态事件 / Clean up Active-state events
  ctx.activeAbort?.abort()
  ctx.activeAbort = null

  // 4. 重置触摸状态 / Reset touch state
  ctx.isTouching = false
  ctx.activeTouchId = null
  ctx.isMoved = false
  ctx.shouldBlockClick = false
  ctx.gestureDirection = null

  ctx.hijackState = 'standby'
}

// ─── 清理 / Cleanup ───────────────────────────────────────────────────

/**
 * 还原样式并销毁所有动画帧和监听器 / Restores styles and destroys all animation frames and listeners
 * 恢复 DOM 原生样式，销毁 Raf 动画循环，释放内存 / Restore original styles, stop RAF loop, free memory
 * @param el - 指令绑定的元素 / Element bound to the directive
 */
function cleanup(el: HTMLElement) {
  const ctx = contexts.get(el)
  if (!ctx) return

  // 如果组件卸载时正在滚动，需要触发 onScrollEnd 回调 / If scrolling during unmount, trigger onScrollEnd
  const wasScrolling = ctx.rafId !== null

  if (ctx.rafId) cancelAnimationFrame(ctx.rafId)

  // 销毁所有事件：哨兵 + Active / Destroy all events: sentinel + Active
  ctx.sentinelAbort.abort()
  ctx.activeAbort?.abort()

  // 仅在 Active 状态下才需要还原样式（Dormant/Standby 从未改变过样式）
  // Only restore styles if in Active state (Dormant/Standby never modified styles)
  if (ctx.hijackState === 'active') {
    const { scrollEl, originalStyles } = ctx
    originalStyles.forEach((val, prop) => {
      ;(scrollEl.style as any)[prop] = val
    })
  }

  contexts.delete(el)

  // 在清理完成后触发 onScrollEnd，避免回调中访问已销毁的资源 / Trigger callback after cleanup
  if (wasScrolling && ctx.onScrollEnd) {
    ctx.onScrollEnd()
  }
}

// ─── 动画引擎 / Animation Engine ──────────────────────────────────────

/**
 * 主动画循环：处理手动追踪阶段和离开后的物理惯性仿真阶段
 * Main animation loop: handles manual tracking phase and post-release physics simulation phase
 * 处理双阶段状态 / Handles dual-phase state:
 * 1. 手动追踪：手指接触期间的位移跟随 / Manual Tracking: position follows finger movement
 * 2. 惯性仿真：手指松开后的物理阻尼运动 / Inertial Simulation: physical damping after release
 * @param ctx - 滚动上下文 / Scroll context
 */
function animationStep(ctx: ScrollContext) {
  if (!ctx.scrollEl || !ctx.lockedDirection) return

  const el = ctx.scrollEl
  const now = performance.now()
  // 基于 Delta Time 归一化，解决不同刷新率屏幕下的速度差异
  // Normalize based on Delta Time to solve speed differences across refresh rates
  const rawDt = ctx.lastFrameTime ? now - ctx.lastFrameTime : 16.67
  const dt = Math.min(rawDt, MAX_DT)
  ctx.lastFrameTime = now

  let shouldContinue = false

  // 记录本帧开始前的位置，用于脏值检测 / Record pre-frame position for dirty checking
  const prevX = el.scrollLeft
  const prevY = el.scrollTop

  if (ctx.isTouching) {
    // 阶段一：手动跟随 / Phase 1: Manual follow
    if (ctx.lockedDirection === 'horizontal')
      el.scrollLeft = ctx.targetScrollLeft
    else el.scrollTop = ctx.targetScrollTop
    shouldContinue = true
  } else {
    // 阶段二：惯性模拟 / Phase 2: Inertial simulation
    const adjustedDecay = ctx.friction ** (dt / 16.67)
    ctx.velocity *= adjustedDecay
    const delta = ctx.velocity * dt

    if (Math.abs(ctx.velocity) > MIN_VELOCITY) {
      if (ctx.lockedDirection === 'horizontal') {
        el.scrollLeft += delta
        // 只有位置发生实质性变化（未撞墙）时才继续动画 / Continue only if position actually changed
        if (Math.abs(el.scrollLeft - prevX) > 0.1) shouldContinue = true
      } else {
        el.scrollTop += delta
        if (Math.abs(el.scrollTop - prevY) > 0.1) shouldContinue = true
      }
    }
  }

  // 手动同步分发 scroll 事件，强制触发外部组件（如表头）的即时位置同步
  // Manually dispatch scroll event to force immediate sync for external components (e.g. headers)
  // 配合脏值检测，既解决了原生 scroll 异步导致的"表头滞后撕裂"问题，又避免过多的性能损耗
  // Combined with dirty checking, this fixes sync lag without excessive performance cost
  if (el.scrollLeft !== prevX || el.scrollTop !== prevY) {
    ctx.scrollEl.dispatchEvent(new Event('scroll'))
  }

  if (shouldContinue) {
    ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
  } else {
    stopAnimation(ctx)
  }
}

/**
 * 终止动画并触发生命周期钩子 / Terminates animation and triggers lifecycle hooks
 * 强制打断滚动动画，并根据当前速度判断是否拦截点击
 * Interrupts animation and determines if click should be blocked based on velocity
 * @param ctx - 滚动上下文 / Scroll context
 */
function stopAnimation(ctx: ScrollContext) {
  const hadAnimation = ctx.rafId !== null

  if (ctx.rafId) {
    cancelAnimationFrame(ctx.rafId)
    ctx.rafId = null
  }

  // 先清理内部状态 / Clean up internal state first
  ctx.velocity = 0
  ctx.lastFrameTime = 0

  // 再触发回调，此时回调函数读取到的是"已停止"的状态 / Trigger callback after state is "stopped"
  if (hadAnimation && ctx.onScrollEnd) {
    ctx.onScrollEnd()
  }
}

// ─── 触摸事件处理 / Touch Event Handlers ──────────────────────────────

/**
 * 处理触摸开始 (touchstart) / Handles touch start
 * 重置手势上下文并初始化同步坐标 / Resets gesture context and initializes sync coordinates
 * 初始化追踪参数，确定本次手势的活跃 ID (activeTouchId) / Initializes tracking and active ID
 * @param e - 触摸事件 / Touch event
 * @param ctx - 滚动上下文 / Scroll context
 */
function onTouchStart(e: TouchEvent, ctx: ScrollContext) {
  if (e.touches.length > 1) {
    // 多指检测：进入"多指锁定"模式，彻底装死，将控制权完全交给浏览器
    // 不调用 preventDefault，允许原生缩放等手势正常工作
    // Multi-touch detected: enter multi-touch lock, go completely silent,
    // hand full control to browser. No preventDefault — allow native pinch-to-zoom etc.
    ctx.isMultiTouching = true
    if (ctx.rafId) stopAnimation(ctx)
    return
  }

  // 单指起始：重置多指锁定 / Single finger start: clear multi-touch lock
  ctx.isMultiTouching = false

  // 智能急停判定：在强制停止前，检查当前是否在高速滚动。如果是，则开启拦截保护
  // Intelligent brake: check if scrolling at high speed before stopping; if so, enable click block.
  if (ctx.rafId && Math.abs(ctx.velocity) > ctx.clickBlockThreshold) {
    ctx.shouldBlockClick = true
  } else {
    ctx.shouldBlockClick = false
  }

  stopAnimation(ctx)

  ctx.isTouching = true
  ctx.isMoved = false
  ctx.isNativeScroll = false

  const t = e.touches[0]
  // 记录当前激活的手指 ID，防止发生多指接替时的坐标瞬间跳变
  // Record active touch ID to prevent coordinate jumps during finger handover
  ctx.activeTouchId = t.identifier

  const { x, y } = transformCoords(t.clientX, t.clientY, ctx.rotation)
  ctx.touchStartX = ctx.lastTouchX = x
  ctx.touchStartY = ctx.lastTouchY = y

  ctx.targetScrollLeft = ctx.scrollEl.scrollLeft
  ctx.targetScrollTop = ctx.scrollEl.scrollTop

  ctx.lastTouchTime = performance.now()
  ctx.lastFrameTime = 0
  ctx.gestureDirection = null

  // 初始化历史轨迹队列 / Initialize historical trajectory queue
  ctx.touchTracker = [{ time: ctx.lastTouchTime, x, y }]
}

/**
 * 处理触摸移动 (touchmove) / Handles touch move
 * 核心逻辑 / Core Logic:
 * 1. 方向轴锁定 (Axis Locking)
 * 2. 原生边缘检测 (Edge Detection)
 * 3. 基于历史采样窗口的速度计算 (Velocity Calculation via Sampling Window)
 * @param e - 触摸事件 / Touch event
 * @param ctx - 滚动上下文 / Scroll context
 */
function onTouchMove(e: TouchEvent, ctx: ScrollContext) {
  // 多指锁定：完全不干预，让浏览器原生处理 / Multi-touch lock: do nothing, let browser handle
  if (ctx.isMultiTouching) return

  // 如果已决定交由原生处理，则完全静默 / If native scroll is handled, stay silent
  if (ctx.isNativeScroll || !ctx.isTouching || !e.touches.length) return

  // 从事件中找出最初按下的那根手指，忽略其他手指的干扰 / Find original finger, ignore others
  const t = Array.from(e.touches).find(
    (touch) => touch.identifier === ctx.activeTouchId
  )
  if (!t) return

  const now = performance.now()
  const { x, y } = transformCoords(t.clientX, t.clientY, ctx.rotation)
  const dx = x - ctx.touchStartX
  const dy = y - ctx.touchStartY

  // 1. 初始方向锁定判定 / Initial axis locking determination
  if (!ctx.gestureDirection) {
    const currentThreshold = ctx.dragThreshold
    if (Math.abs(dx) > currentThreshold || Math.abs(dy) > currentThreshold) {
      const isHorizontal = Math.abs(dx) > Math.abs(dy)
      const el = ctx.scrollEl

      // 核心：边缘检测 (Edge Detection)
      // 若在边界且手势方向朝向边界外，则放弃接管，允许冒泡给浏览器触发原生行为
      // If at boundary and moving outward, hand control back for native browser behavior
      let isAtEdge = false
      if (isHorizontal) {
        const maxScrollLeft = el.scrollWidth - el.clientWidth
        const atLeft = el.scrollLeft <= 1 && dx > 0
        const atRight = el.scrollLeft >= maxScrollLeft - 1 && dx < 0
        const noScrollNeeded = el.scrollWidth <= el.clientWidth
        if (atLeft || atRight || noScrollNeeded) isAtEdge = true
      } else {
        const maxScrollTop = el.scrollHeight - el.clientHeight
        const atTop = el.scrollTop <= 1 && dy > 0
        const atBottom = el.scrollTop >= maxScrollTop - 1 && dy < 0
        const noScrollNeeded = el.scrollHeight <= el.clientHeight
        if (atTop || atBottom || noScrollNeeded) isAtEdge = true
      }

      if (isAtEdge && !ctx.disableEdgeDetection) {
        ctx.isNativeScroll = true
        return
      }

      // 正式锁定方向，接管滚动 / Lock direction and take over scrolling
      ctx.gestureDirection = isHorizontal ? 'horizontal' : 'vertical'
      ctx.lockedDirection = ctx.gestureDirection
      ctx.isMoved = true
      ctx.lastFrameTime = performance.now()

      // 调用 onScrollStart 生命周期钩子 / Call onScrollStart hook
      ctx.onScrollStart?.()

      if (!ctx.rafId) {
        ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
      }
    } else {
      return
    }
  }

  // 2. 接管之后阻止默认页面滚动行为 / Prevent default page scroll after hijacking
  if (e.cancelable) {
    e.preventDefault()
  }

  const incX = x - ctx.lastTouchX
  const incY = y - ctx.lastTouchY

  // 3. 计算目标位移增量 (阶段一：手动跟随) / Calculate displacement increment (Phase 1: Manual Follow)
  if (ctx.gestureDirection === 'horizontal') {
    const max = ctx.scrollEl.scrollWidth - ctx.scrollEl.clientWidth
    ctx.targetScrollLeft = Math.max(
      0,
      Math.min(max, ctx.targetScrollLeft - incX)
    )
  } else {
    const max = ctx.scrollEl.scrollHeight - ctx.scrollEl.clientHeight
    ctx.targetScrollTop = Math.max(0, Math.min(max, ctx.targetScrollTop - incY))
  }

  // 4. 采用历史轨迹队列法计算真实惯性速度（阶段二：为松手后的惯性做准备）
  // Calculate real inertial velocity (Phase 2: Preparing for release)
  ctx.touchTracker.push({ time: now, x, y })
  // 仅保留最近 50ms 内的触摸点，过滤掉低端机硬件采样抖动，且无惧 60/120Hz 差异
  // Keep points within 50ms to filter jitter and handle varying refresh rates (60/120Hz)
  ctx.touchTracker = ctx.touchTracker.filter((p) => now - p.time <= 50)

  if (ctx.touchTracker.length > 1) {
    const oldestPoint = ctx.touchTracker[0]
    const historyDt = Math.max(1, now - oldestPoint.time) // 防止除以 0 / Prevent div by zero

    if (ctx.gestureDirection === 'horizontal') {
      ctx.velocity = -(x - oldestPoint.x) / historyDt
    } else {
      ctx.velocity = -(y - oldestPoint.y) / historyDt
    }
  }

  ctx.lastTouchX = x
  ctx.lastTouchY = y
  ctx.lastTouchTime = now
}

/**
 * 处理触摸结束 (touchend / touchcancel) / Handles touch end
 * 验证手势完整性，依据最终速度决定进入惯性滑动或强制结束
 * Validates gesture; enters inertia phase or stops based on final velocity
 * @param e - 原生触摸事件 / Native touch event
 * @param ctx - 滚动上下文 / Scroll context
 */
function onTouchEnd(e: TouchEvent, ctx: ScrollContext) {
  // 多指锁定处理 / Multi-touch lock handling
  if (e.touches.length === 0) {
    // 所有手指都离开屏幕，解除多指锁定 / All fingers left, release multi-touch lock
    ctx.isMultiTouching = false
  }
  if (ctx.isMultiTouching) {
    // 仍有手指在屏幕上且处于多指模式，直接忽略 / Still in multi-touch mode, ignore
    return
  }

  // 检查当前抬起的手指中，是否包含我们正在追踪的那根手指 / Check if tracked finger is lifted
  if (ctx.activeTouchId !== null) {
    // changedTouches 代表当前正离开屏幕的所有手指 / Fingers currently leaving the screen
    const isTrackedFingerLifted = Array.from(e.changedTouches).some(
      (t) => t.identifier === ctx.activeTouchId
    )
    // 如果抬起的是其他无关手指，直接忽略不打断滑动 / Ignore if an unrelated finger is lifted
    if (!isTrackedFingerLifted) return
  }

  ctx.isTouching = false
  ctx.activeTouchId = null // 释放追踪 / Release tracking

  if (ctx.isNativeScroll) {
    ctx.isNativeScroll = false
    stopAnimation(ctx)
    return
  }

  const now = performance.now()
  // 惯性保护：若用户按住手指停留超过 80ms 再松开，则视为不想滑动，速度清零
  // Inertia protection: if held still > 80ms, clear velocity as no intent to scroll
  if (now - ctx.lastTouchTime > INERTIA_STOP_DELAY) {
    ctx.velocity = 0
  }

  // 判定是否不符合开启惯性动画的条件 / Determine if inertia conditions are not met
  if (
    ctx.disableInertia ||
    Math.abs(ctx.velocity) <= MIN_VELOCITY ||
    !ctx.lockedDirection
  ) {
    // 只要不进惯性动画循环，就必须调用 stopAnimation / Must stop if not entering inertia loop
    stopAnimation(ctx)
    return
  }

  // 开启惯性模拟 / Start inertial simulation
  if (!ctx.rafId) {
    ctx.lastFrameTime = performance.now()
    ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
  }
}
