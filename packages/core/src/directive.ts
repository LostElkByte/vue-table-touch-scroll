/**
 * @file vTableTouchScroll.ts
 * @description 高性能 Vue 移动端自定义触摸滚动引擎。
 *
 * 本指令旨在解决复杂移动端 UI（如嵌套滚动、同步表头表格）中的滚动痛点。
 *
 * 核心特性：
 * - 方向锁定：防止手势过程中的对角线偏移，每次手势只锁定在一个轴向。
 * - 智能边缘检测：当滚动触达容器边界时，自动将控制权交还给浏览器，支持 iOS 侧滑返回或父容器滚动。
 * - 智能急停保护：区分“用户想点击”还是“用户想刹车”。仅在列表高速惯性滑动时拦截点击事件。
 * - 帧率归一化物理引擎：通过 Delta Time (dt) 计算，确保在 60Hz/90Hz/120Hz 等不同刷新率屏幕上具有一致的惯性体感。
 */

import { getSelectorByPreset } from './presets'

import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { ScrollContext, TableTouchScrollOptions } from './types'

// 物理引擎参数配置
const DEFAULT_FRICTION = 0.95 // 默认摩擦力/衰减率 (值越低摩擦力越大)
const MIN_VELOCITY = 0.05 // 停止动画的速度阈值
const MAX_DT = 32 // 最大帧间隔限制，防止掉帧后产生大幅度位移跳变
const DEFAULT_DRAG_THRESHOLD = 5 // 默认判定阈值
const INERTIA_STOP_DELAY = 80 // 惯性保护延迟：手指停顿超过此时间再松开，则不触发惯性
const CLICK_BLOCK_DELAY = 10 // 缓冲时间：用于在触摸结束后捕获并拦截点击事件
const SAFE_CLICK_VELOCITY = 0.5 // 安全点击速度阈值 (px/ms) 作用于用户点击正在滚动的列表进行“刹车”时
const STYLE_PROPS = ['overflow', 'willChange'] as const // 需要接管并还原的 CSS 属性列表

// 存储元素与对应上下文的映射关系
const contexts = new WeakMap<HTMLElement, ScrollContext>()

/**
 * 自定义 Vue 指令：v-table-touch-scroll
 * @param el - 指令绑定的元素
 * @param binding - 指令绑定对象
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
    if (
      value?.enabled !== oldValue?.enabled ||
      value?.selector !== oldValue?.selector ||
      value?.preset !== oldValue?.preset ||
      value?.friction !== oldValue?.friction
    ) {
      initOrUpdate(el, binding)
    }
  },
  unmounted(el) {
    cleanup(el)
  },
}

/**
 * 负责指令的初始化与动态配置更新
 * @param el - 指令绑定的元素
 * @param binding - 指令绑定对象
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
  if (el.style.touchAction === 'none') {
    el.style.touchAction = 'auto'
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
    onScrollStart: options.onScrollStart,
    onScrollEnd: options.onScrollEnd,
    isTouching: false,
    targetScrollLeft: 0,
    targetScrollTop: 0,
    isMoved: false,
    isNativeScroll: false,
    shouldBlockClick: false,
  }

  contexts.set(el, ctx)

  const dragThreshold = options.dragThreshold ?? DEFAULT_DRAG_THRESHOLD

  // 3. 事件绑定：必须关闭 passive 模式以允许 preventDefault 拦截原生滚动
  el.addEventListener('touchstart', (e) => onTouchStart(e, ctx), {
    passive: false,
    signal,
  })
  el.addEventListener('touchmove', (e) => onTouchMove(e, ctx, dragThreshold), {
    passive: false,
    signal,
  })
  el.addEventListener('touchend', () => onTouchEnd(ctx), { signal })
  el.addEventListener('touchcancel', () => onTouchEnd(ctx), { signal })

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
        // 在下一帧重置标记，允许后续正常点击
        setTimeout(() => {
          ctx.shouldBlockClick = false
        }, 0)
      }
    },
    { capture: true, signal }
  )
}

/**
 * 还原样式并销毁所有动画帧和监听器
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
        const prev = el.scrollLeft
        el.scrollLeft += delta
        // 只有位置发生实质性变化（未撞墙）时才继续动画
        if (Math.abs(el.scrollLeft - prev) > 0.1) shouldContinue = true
      } else {
        const prev = el.scrollTop
        el.scrollTop += delta
        if (Math.abs(el.scrollTop - prev) > 0.1) shouldContinue = true
      }
    }
  }

  // 手动分发 scroll 事件以确保外部同步（如吸顶表头）
  el.dispatchEvent(new Event('scroll'))

  if (shouldContinue) {
    ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
  } else {
    stopAnimation(ctx)
  }
}

/**
 * 强制打断滚动动画，并根据当前速度判断是否拦截点击
 * @param ctx - 滚动上下文
 */
function stopAnimation(ctx: ScrollContext) {
  const hadAnimation = ctx.rafId !== null

  if (ctx.rafId) {
    cancelAnimationFrame(ctx.rafId)
    ctx.rafId = null

    // 智能急停逻辑：如果速度过快，视为"刹车"而非"点击按钮"
    if (Math.abs(ctx.velocity) > SAFE_CLICK_VELOCITY) {
      ctx.shouldBlockClick = true
    } else {
      ctx.shouldBlockClick = false
    }
  } else {
    ctx.shouldBlockClick = false
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
 * touchstart 处理器：重置手势上下文并初始化同步坐标
 * @param e - 触摸事件
 * @param ctx - 滚动上下文
 */
function onTouchStart(e: TouchEvent, ctx: ScrollContext) {
  if (e.touches.length > 1) return // 忽略多指手势

  stopAnimation(ctx)

  ctx.isTouching = true
  ctx.isMoved = false
  ctx.isNativeScroll = false

  const t = e.touches[0]
  ctx.touchStartX = ctx.lastTouchX = t.clientX
  ctx.touchStartY = ctx.lastTouchY = t.clientY

  ctx.targetScrollLeft = ctx.scrollEl.scrollLeft
  ctx.targetScrollTop = ctx.scrollEl.scrollTop

  ctx.lastTouchTime = performance.now()
  ctx.lastFrameTime = 0
  ctx.gestureDirection = null
}

/**
 * touchmove 处理器：管理方向锁定、边缘检测决策以及输入平滑处理
 * @param e - 触摸事件
 * @param ctx - 滚动上下文
 * @param dragThreshold - 触摸移动阈值
 */
function onTouchMove(e: TouchEvent, ctx: ScrollContext, dragThreshold: number) {
  // 如果已决定交由原生处理，则完全静默
  if (ctx.isNativeScroll || !ctx.isTouching || !e.touches.length) return

  const t = e.touches[0]
  const now = performance.now()
  const dx = t.clientX - ctx.touchStartX
  const dy = t.clientY - ctx.touchStartY

  // 1. 初始方向锁定判定
  if (!ctx.gestureDirection) {
    if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
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
  const dt = Math.max(1, now - ctx.lastTouchTime)

  // 3. 计算目标位移增量与经过平滑处理的速度
  if (ctx.gestureDirection === 'horizontal') {
    const max = ctx.scrollEl.scrollWidth - ctx.scrollEl.clientWidth
    ctx.targetScrollLeft = Math.max(
      0,
      Math.min(max, ctx.targetScrollLeft - incX)
    )
    const instantV = -incX / dt
    // 使用加权平均平滑抖动
    ctx.velocity = ctx.velocity * 0.2 + instantV * 0.8
  } else {
    const max = ctx.scrollEl.scrollHeight - ctx.scrollEl.clientHeight
    ctx.targetScrollTop = Math.max(0, Math.min(max, ctx.targetScrollTop - incY))
    const instantV = -incY / dt
    ctx.velocity = ctx.velocity * 0.2 + instantV * 0.8
  }

  ctx.lastTouchX = t.clientX
  ctx.lastTouchY = t.clientY
  ctx.lastTouchTime = now
}

/**
 * touchend 处理器：评估是否需要开启物理惯性动画
 * @param ctx - 滚动上下文
 */
function onTouchEnd(ctx: ScrollContext) {
  ctx.isTouching = false

  if (ctx.isNativeScroll) {
    ctx.isNativeScroll = false
    return
  }

  const now = performance.now()
  // 惯性保护：若用户按住手指停留超过 80ms 再松开，则视为不想滑动，速度清零
  if (now - ctx.lastTouchTime > INERTIA_STOP_DELAY) {
    ctx.velocity = 0
  }

  // 判定是否符合开启惯性动画的物理条件
  if (
    !ctx.rafId &&
    Math.abs(ctx.velocity) > MIN_VELOCITY &&
    ctx.lockedDirection
  ) {
    ctx.lastFrameTime = performance.now()
    ctx.rafId = requestAnimationFrame(() => animationStep(ctx))
  } else if (!ctx.rafId) {
    // 极小延迟重置位移标记，以兼容 trailing click 事件判定
    setTimeout(() => {
      ctx.isMoved = false
    }, CLICK_BLOCK_DELAY)
  }
}
