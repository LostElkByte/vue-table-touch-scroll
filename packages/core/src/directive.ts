/**
 * @file vTableTouchScroll.ts
 * @author lostElk
 * @license MIT
 *
 * @description 高性能移动端触摸滚动引擎（专为 PC 端 Table 组件适配）
 *
 * 【业务背景】
 * 在移动端直接使用 PC 端的 Table 组件时，原生滚动往往存在交互不跟手、惯性反馈缺失、同步表头撕裂等问题。
 * 本指令旨在通过精确的触摸流劫持与物理引擎仿真，实现“原生级”的滚动体感。
 *
 * 【核心解决的问题】
 * 1. 同步表头延迟：通过同步事件派发机制，确保移动端表体与表头在同帧渲染，杜绝滚动错位。
 * 2. 惯性阻尼不一致：消除不同手机刷新率（60/120Hz）带来的滑动速度差异，提供统一的物理阻尼手感。
 * 3. 触摸冲突与干扰：通过多指 ID 追踪与边缘探测，解决复杂嵌套列表下的手势误触与断触问题。
 * 4. 移动端兼容性：让不支持触摸滑动的 PC 表格，获得如同原生 App 的流畅交互。
 *
 * 【核心技术特性】
 * - 方向轴锁定：自动判定手势意图，过滤对角线抖动，保障滚动方向的纯粹性。
 * - 智能边缘感知：自动探测滚动边界，当触及尽头时平滑交还控制权，支持 iOS 侧滑返回。
 * - 物理仿真引擎：采用“历史轨迹队列法”计算惯性，彻底解决采样抖动导致的滚动异常（如：列表飞出）。
 * - 零冗余性能开销：内置脏值检测，确保仅在位置变更时触发渲染，保障长列表渲染的流畅度。
 */

import { getSelectorByPreset } from './presets'

import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { ScrollContext, TableTouchScrollOptions } from './types'

/** 物理引擎默认参数配置 */
const DEFAULT_FRICTION = 0.95 // 默认摩擦力/衰减率 (值越低摩擦力越大)
const MIN_VELOCITY = 0.05 // 停止动画的速度阈值
const MAX_DT = 32 // 最大帧间隔限制，防止掉帧后产生大幅度位移跳变
const DEFAULT_DRAG_THRESHOLD = 5 // 默认判定阈值
const INERTIA_STOP_DELAY = 80 // 惯性保护延迟：手指停顿超过此时间再松开，则不触发惯性
const SAFE_CLICK_VELOCITY = 0.5 // 安全点击速度阈值 (px/ms) 作用于用户点击正在滚动的列表进行“刹车”时
const STYLE_PROPS = ['overflow', 'willChange', 'touchAction'] as const // 需要接管并还原的 CSS 属性列表

/** 全局映射：维护元素与内部滚动上下文的弱引用关系，防止内存泄漏 */
const contexts = new WeakMap<HTMLElement, ScrollContext>()

/**
 * @directive v-table-touch-scroll
 * @description 移动端表格滚动增强指令。
 *
 * @example
 * <div v-table-touch-scroll="{ selector: '.table-body', friction: 0.9 }"></div>
 */
export const vTableTouchScroll: ObjectDirective<
  HTMLElement,
  TableTouchScrollOptions
> = {
  mounted(el, binding) {
    initOrUpdate(el, binding)
  },
  updated(el, binding) {
    const { value, oldValue } = binding
    const ctx = contexts.get(el)

    // 检测配置变化，若涉及滚动容器变更则重置实例
    if (
      value?.enabled !== oldValue?.enabled ||
      value?.selector !== oldValue?.selector ||
      value?.preset !== oldValue?.preset
    ) {
      initOrUpdate(el, binding)
      return
    }

    // 浅更新 Context 参数，确保闭包引用是最新的，同时不中断动画逻辑
    if (ctx) {
      ctx.friction = value?.friction ?? DEFAULT_FRICTION
      ctx.dragThreshold = value?.dragThreshold ?? DEFAULT_DRAG_THRESHOLD
      ctx.disableInertia = value?.disableInertia ?? false
      ctx.clickBlockThreshold =
        value?.clickBlockThreshold ?? SAFE_CLICK_VELOCITY

      // 同步最新的回调函数引用
      ctx.onScrollStart = value?.onScrollStart
      ctx.onScrollEnd = value?.onScrollEnd
    }
  },
  unmounted(el) {
    cleanup(el)
  },
}

/**
 * 初始化或更新指令实例
 * @param el - 指令所在 DOM 元素
 * @param binding - 指令绑定配置
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
 * 核心初始化：劫持 DOM 样式、初始化状态并绑定事件
 * @param el - 指令绑定的元素
 * @param options - 指令配置选项
 *
 * 1. 备份 DOM 原生样式
 * 2. 注入接管样式的 CSS 变量
 * 3. 挂载事件总线与上下文管理
 */
function initDirective(el: HTMLElement, options: TableTouchScrollOptions) {
  // 优先级: selector > preset > 默认(el 本身)
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

  // 1. 备份原始样式
  const originalStyles = new Map<string, string>()
  STYLE_PROPS.forEach((prop) => {
    originalStyles.set(prop, (scrollEl.style as any)[prop])
  })

  // 2. 接管样式：禁用原生滚动条，开启硬件加速提升渲染性能
  scrollEl.style.setProperty('overflow', 'hidden', 'important')
  scrollEl.style.willChange = 'scroll-position'

  // 允许原生 touch-action 以便边缘检测逻辑能顺利交还控制权
  if (scrollEl.style.touchAction === 'none') {
    scrollEl.style.touchAction = 'auto'
  }

  const abortController = new AbortController()
  const { signal } = abortController

  const ctx: ScrollContext = {
    scrollEl,
    abortController,
    originalStyles,
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
    activeTouchId: null, // 初始化追踪 ID
    touchTracker: [], // 初始化历史轨迹
  }

  contexts.set(el, ctx)

  // 3. 事件绑定：必须关闭 passive 模式以允许 preventDefault 拦截原生滚动
  el.addEventListener('touchstart', (e) => onTouchStart(e, ctx), {
    passive: false,
    signal,
  })
  el.addEventListener('touchmove', (e) => onTouchMove(e, ctx), {
    passive: false,
    signal,
  })

  el.addEventListener('touchend', (e) => onTouchEnd(e, ctx), { signal })
  el.addEventListener('touchcancel', (e) => onTouchEnd(e, ctx), { signal })

  /**
   * 在捕获阶段拦截点击事件。
   * 如果判定为拖拽或由于高速急停触发，则彻底阻止事件冒泡和默认行为。
   */
  el.addEventListener(
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
 * 还原样式并销毁所有动画帧和监听器
 * 恢复 DOM 原生样式，销毁 Raf 动画循环，释放内存
 * @param el - 指令绑定的元素
 */
function cleanup(el: HTMLElement) {
  const ctx = contexts.get(el)
  if (!ctx) return

  // 如果组件卸载时正在滚动，需要触发 onScrollEnd 回调
  const wasScrolling = ctx.rafId !== null

  if (ctx.rafId) cancelAnimationFrame(ctx.rafId)
  ctx.abortController.abort() // 一键注销所有事件

  const { scrollEl, originalStyles } = ctx
  originalStyles.forEach((val, prop) => {
    ;(scrollEl.style as any)[prop] = val
  })

  contexts.delete(el)

  // 在清理完成后触发 onScrollEnd，避免回调中访问已销毁的资源
  if (wasScrolling && ctx.onScrollEnd) {
    ctx.onScrollEnd()
  }
}

/**
 * 主动画循环：处理手动追踪阶段和离开后的物理惯性仿真阶段
 * 处理双阶段状态：
 * 1. 手动追踪：手指接触期间的位移跟随
 * 2. 惯性仿真：手指松开后的物理阻尼运动
 * @param ctx - 滚动上下文
 */
function animationStep(ctx: ScrollContext) {
  if (!ctx.scrollEl || !ctx.lockedDirection) return

  const el = ctx.scrollEl
  const now = performance.now()
  // 基于 Delta Time 归一化，解决不同刷新率屏幕下的速度差异
  const rawDt = ctx.lastFrameTime ? now - ctx.lastFrameTime : 16.67
  const dt = Math.min(rawDt, MAX_DT)
  ctx.lastFrameTime = now

  let shouldContinue = false

  // 记录本帧开始前的位置，用于脏值检测
  const prevX = el.scrollLeft
  const prevY = el.scrollTop

  if (ctx.isTouching) {
    // 阶段一：手动跟随
    if (ctx.lockedDirection === 'horizontal')
      el.scrollLeft = ctx.targetScrollLeft
    else el.scrollTop = ctx.targetScrollTop
    shouldContinue = true
  } else {
    // 阶段二：惯性模拟
    const adjustedDecay = ctx.friction ** (dt / 16.67)
    ctx.velocity *= adjustedDecay
    const delta = ctx.velocity * dt

    if (Math.abs(ctx.velocity) > MIN_VELOCITY) {
      if (ctx.lockedDirection === 'horizontal') {
        el.scrollLeft += delta
        // 只有位置发生实质性变化（未撞墙）时才继续动画
        if (Math.abs(el.scrollLeft - prevX) > 0.1) shouldContinue = true
      } else {
        el.scrollTop += delta
        if (Math.abs(el.scrollTop - prevY) > 0.1) shouldContinue = true
      }
    }
  }

  // 手动同步分发 scroll 事件，强制触发外部组件（如表头）的即时位置同步
  // 配合脏值检测，既解决了原生 scroll 异步导致的“表头滞后撕裂”问题，又避免过多的性能损耗
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
 * 终止动画并触发生命周期钩子
 * 强制打断滚动动画，并根据当前速度判断是否拦截点击
 * @param ctx - 滚动上下文
 */
function stopAnimation(ctx: ScrollContext) {
  const hadAnimation = ctx.rafId !== null

  if (ctx.rafId) {
    cancelAnimationFrame(ctx.rafId)
    ctx.rafId = null
  }

  // 先清理内部状态
  ctx.velocity = 0
  ctx.lastFrameTime = 0

  // 再触发回调，此时回调函数读取到的是"已停止"的状态
  if (hadAnimation && ctx.onScrollEnd) {
    ctx.onScrollEnd()
  }
}

/**
 * 处理触摸开始 (touchstart)
 * 重置手势上下文并初始化同步坐标
 * 初始化追踪参数，确定本次手势的活跃 ID (activeTouchId)
 * @param e - 触摸事件
 * @param ctx - 滚动上下文
 */
function onTouchStart(e: TouchEvent, ctx: ScrollContext) {
  if (e.touches.length > 1) {
    // 明确阻止原生滚动行为
    if (e.cancelable) {
      e.preventDefault()
    }
    return // 忽略多指手势
  }

  // 智能急停判定：在强制停止前，检查当前是否在高速滚动。如果是，则开启拦截保护
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
  ctx.activeTouchId = t.identifier

  ctx.touchStartX = ctx.lastTouchX = t.clientX
  ctx.touchStartY = ctx.lastTouchY = t.clientY

  ctx.targetScrollLeft = ctx.scrollEl.scrollLeft
  ctx.targetScrollTop = ctx.scrollEl.scrollTop

  ctx.lastTouchTime = performance.now()
  ctx.lastFrameTime = 0
  ctx.gestureDirection = null

  // 初始化历史轨迹队列
  ctx.touchTracker = [{ time: ctx.lastTouchTime, x: t.clientX, y: t.clientY }]
}

/**
 * 处理触摸移动 (touchmove)
 * 核心逻辑：
 * 1. 方向轴锁定 (Axis Locking)
 * 2. 原生边缘检测 (Edge Detection)
 * 3. 基于历史采样窗口的速度计算 (Velocity Tracker)
 * @param e - 触摸事件
 * @param ctx - 滚动上下文
 */
function onTouchMove(e: TouchEvent, ctx: ScrollContext) {
  // 如果已决定交由原生处理，则完全静默
  if (ctx.isNativeScroll || !ctx.isTouching || !e.touches.length) return

  // 从事件中找出最初按下的那根手指，忽略其他手指的干扰
  const t = Array.from(e.touches).find(
    (touch) => touch.identifier === ctx.activeTouchId
  )
  if (!t) return

  const now = performance.now()
  const dx = t.clientX - ctx.touchStartX
  const dy = t.clientY - ctx.touchStartY

  // 1. 初始方向锁定判定
  if (!ctx.gestureDirection) {
    const currentThreshold = ctx.dragThreshold
    if (Math.abs(dx) > currentThreshold || Math.abs(dy) > currentThreshold) {
      const isHorizontal = Math.abs(dx) > Math.abs(dy)
      const el = ctx.scrollEl

      // 核心：边缘检测 (Edge Detection)
      // 若在边界且手势方向朝向边界外，则放弃接管，允许冒泡给浏览器触发原生行为
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

      if (isAtEdge) {
        ctx.isNativeScroll = true
        return
      }

      // 正式锁定方向，接管滚动
      ctx.gestureDirection = isHorizontal ? 'horizontal' : 'vertical'
      ctx.lockedDirection = ctx.gestureDirection
      ctx.isMoved = true
      ctx.lastFrameTime = performance.now()

      // 调用 onScrollStart 生命周期钩子
      ctx.onScrollStart?.()

      if (!ctx.rafId) {
        ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
      }
    } else {
      return
    }
  }

  // 2. 接管之后阻止默认页面滚动行为
  if (e.cancelable) {
    e.preventDefault()
  }

  const incX = t.clientX - ctx.lastTouchX
  const incY = t.clientY - ctx.lastTouchY

  // 3. 计算目标位移增量 (阶段一：手动跟随)
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
  ctx.touchTracker.push({ time: now, x: t.clientX, y: t.clientY })
  // 仅保留最近 50ms 内的触摸点，过滤掉低端机硬件采样抖动，且无惧 60/120Hz 差异
  ctx.touchTracker = ctx.touchTracker.filter((p) => now - p.time <= 50)

  if (ctx.touchTracker.length > 1) {
    const oldestPoint = ctx.touchTracker[0]
    const historyDt = Math.max(1, now - oldestPoint.time) // 防止除以 0

    if (ctx.gestureDirection === 'horizontal') {
      ctx.velocity = -(t.clientX - oldestPoint.x) / historyDt
    } else {
      ctx.velocity = -(t.clientY - oldestPoint.y) / historyDt
    }
  }

  ctx.lastTouchX = t.clientX
  ctx.lastTouchY = t.clientY
  ctx.lastTouchTime = now
}

/**
 * 处理触摸结束 (touchend / touchcancel)
 * 验证手势完整性，依据最终速度决定进入惯性滑动或强制结束
 * @param e - 原生触摸事件
 * @param ctx - 滚动上下文
 */
function onTouchEnd(e: TouchEvent, ctx: ScrollContext) {
  // 检查当前抬起的手指中，是否包含我们正在追踪的那根手指
  if (ctx.activeTouchId !== null) {
    // changedTouches 代表当前正离开屏幕的所有手指
    const isTrackedFingerLifted = Array.from(e.changedTouches).some(
      (t) => t.identifier === ctx.activeTouchId
    )
    // 如果抬起的是其他无关手指（例如第二根意外放上的手指被拿开），直接忽略不打断滑动
    if (!isTrackedFingerLifted) return
  }

  ctx.isTouching = false
  ctx.activeTouchId = null // 释放追踪

  if (ctx.isNativeScroll) {
    ctx.isNativeScroll = false
    stopAnimation(ctx)
    return
  }

  const now = performance.now()
  // 惯性保护：若用户按住手指停留超过 80ms 再松开，则视为不想滑动，速度清零
  if (now - ctx.lastTouchTime > INERTIA_STOP_DELAY) {
    ctx.velocity = 0
  }

  // 判定是否不符合开启惯性动画的条件
  if (
    ctx.disableInertia ||
    Math.abs(ctx.velocity) <= MIN_VELOCITY ||
    !ctx.lockedDirection
  ) {
    // 只要不进惯性动画循环，就必须调用 stopAnimation 以确保：
    // 1. 触发 onScrollEnd (如果之前移动过)
    // 2. 处理急停点击拦截逻辑
    stopAnimation(ctx)
    return
  }

  // 开启惯性模拟
  if (!ctx.rafId) {
    ctx.lastFrameTime = performance.now()
    ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
  }
}
