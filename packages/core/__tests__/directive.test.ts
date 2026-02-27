import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { vTableTouchScroll } from '../index'

import type { TableTouchScrollOptions } from '../src/types'
import type { DirectiveBinding } from 'vue'

/**
 * vTableTouchScroll 指令全功能测试套件
 * Full functional test suite for vTableTouchScroll directive
 */
describe('vTableTouchScroll Directive', () => {
  let el: HTMLElement
  const mockNow = vi.spyOn(performance, 'now')

  // --- Utility: Create Mock Binding / 工具函数：创建模拟 Vue 指令绑定对象 ---
  function createBinding(
    value: TableTouchScrollOptions
  ): DirectiveBinding<TableTouchScrollOptions> {
    return {
      value,
      oldValue: null,
      arg: undefined,
      modifiers: {},
      instance: null,
      dir: vTableTouchScroll,
    } as DirectiveBinding<TableTouchScrollOptions>
  }

  // --- Utility: Layout Mocking / 工具函数：模拟 JSDOM 中缺失的布局属性与滚动限制 ---
  function createMockElement(
    options = { width: 200, height: 200, scrollWidth: 1000, scrollHeight: 1000 }
  ) {
    const element = document.createElement('div')
    let _left = 0
    let _top = 0

    Object.defineProperties(element, {
      clientWidth: { value: options.width, configurable: true },
      clientHeight: { value: options.height, configurable: true },
      scrollWidth: { value: options.scrollWidth, configurable: true },
      scrollHeight: { value: options.scrollHeight, configurable: true },
      scrollLeft: {
        get: () => _left,
        set: (v) => {
          // 模拟浏览器边界：不能小于0，不能超过最大可滚动宽度
          _left = Math.max(0, Math.min(options.scrollWidth - options.width, v))
        },
        configurable: true,
      },
      scrollTop: {
        get: () => _top,
        set: (v) => {
          _top = Math.max(0, Math.min(options.scrollHeight - options.height, v))
        },
        configurable: true,
      },
    })
    return element
  }

  // --- Utility: Frame-by-frame Animation Simulation / 工具函数：逐帧模拟物理动画 ---
  async function advanceFrames(ms: number, frames: number) {
    const frameTime = ms / frames
    for (let i = 0; i < frames; i++) {
      // 同步 performance.now 与虚拟时钟，确保物理引擎 dt 计算正确
      mockNow.mockReturnValue(performance.now() + frameTime)
      vi.advanceTimersByTime(frameTime)
      // 刷新微任务队列，使 requestAnimationFrame 回调得以执行
      await Promise.resolve()
    }
  }

  // --- Utility: Dispatch Touch Events / 工具函数：分发触摸事件 ---
  function dispatchTouch(
    type: string,
    x: number,
    y: number,
    target: HTMLElement = el
  ) {
    const event = new TouchEvent(type, {
      cancelable: true,
      bubbles: true,
      touches: type === 'touchend' ? [] : [{ clientX: x, clientY: y } as any],
      changedTouches: [{ clientX: x, clientY: y } as any],
    })
    target.dispatchEvent(event)
    return event
  }

  beforeEach(() => {
    vi.useFakeTimers()
    mockNow.mockReturnValue(0)
    el = createMockElement()
    document.body.appendChild(el)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  // 1. 生命周期与配置测试 / Lifecycle & Configuration
  describe('Basic Lifecycle / 基础生命周期', () => {
    it('should hijack styles on mounted / 挂载时应正确劫持 CSS 样式', () => {
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)
      expect(el.style.overflow).toBe('hidden')
      expect(el.style.willChange).toBe('scroll-position')
    })

    it('should restore styles on unmounted / 卸载时应还原元素原始样式', () => {
      el.style.overflow = 'auto'
      const binding = createBinding({})
      vTableTouchScroll.mounted!(el, binding, {} as any, null)
      vTableTouchScroll.unmounted!(el, binding, {} as any, null)
      expect(el.style.overflow).toBe('auto')
    })

    it('should enable/disable dynamically via options / 应支持通过配置项动态启用或禁用', () => {
      const bindingEnabled = createBinding({ enabled: true })
      vTableTouchScroll.mounted!(el, bindingEnabled, {} as any, null)
      expect(el.style.overflow).toBe('hidden')

      const bindingDisabled = createBinding({ enabled: false })
      vTableTouchScroll.updated!(el, bindingDisabled, {} as any, {} as any)
      expect(el.style.overflow).not.toBe('hidden')
    })
  })

  // 2. 轴向锁定功能测试 / Direction Locking
  describe('Direction Locking / 轴向锁定', () => {
    it('should lock to Horizontal and ignore Y axis / 水平偏移优先时应锁定水平轴，忽略垂直移动', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ threshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)

      // Dx=20, Dy=10 -> 水平偏移更大，锁定 X 轴
      dispatchTouch('touchmove', 80, 110)
      await advanceFrames(16, 1)

      expect(el.scrollLeft).toBeGreaterThan(0)
      expect(el.scrollTop).toBe(0) // Y 轴应保持不动
    })
  })

  // 3. 智能边缘检测测试 / Edge Detection
  describe('Edge Detection / 边缘检测', () => {
    it('should not preventDefault at left edge swiping right / 在最左侧向右划动应交还控制权（支持 iOS 侧滑返回）', () => {
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)
      el.scrollLeft = 0

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 150, 100)

      // defaultPrevented 为 false 表示指令没有拦截，交由浏览器处理
      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('should not take control when content fits container / 内容无需滚动时，不应接管手势', () => {
      const smallEl = createMockElement({
        width: 500,
        height: 500,
        scrollWidth: 500,
        scrollHeight: 500,
      })
      vTableTouchScroll.mounted!(smallEl, createBinding({}), {} as any, null)

      dispatchTouch('touchstart', 100, 100, smallEl)
      const moveEvt = dispatchTouch('touchmove', 50, 50, smallEl)
      expect(moveEvt.defaultPrevented).toBe(false)
    })
  })

  // 4. 物理惯性与帧率归一化测试 / Physics & Frame Normalization
  describe('Physics Engine / 物理引擎', () => {
    it('should simulate inertia displacement after release / 手指释放后应产生物理惯性位移', async () => {
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)

      dispatchTouch('touchstart', 200, 100)
      mockNow.mockReturnValue(20)
      dispatchTouch('touchmove', 100, 100) // 产生 5px/ms 的初速度

      mockNow.mockReturnValue(25)
      dispatchTouch('touchend', 100, 100)

      const scrollAtEnd = el.scrollLeft
      // 模拟接下来的 100ms (约 6 帧)
      await advanceFrames(100, 6)

      expect(el.scrollLeft).toBeGreaterThan(scrollAtEnd) // 惯性带来了额外位移
    })

    it('should stop inertia if paused for too long before release / 惯性保护：若停顿超过阈值再松手，不应触发惯性', async () => {
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)

      dispatchTouch('touchstart', 200, 100)
      dispatchTouch('touchmove', 100, 100)

      // 模拟停顿 200ms (超过 INERTIA_STOP_DELAY)
      mockNow.mockReturnValue(performance.now() + 200)
      vi.advanceTimersByTime(200)

      dispatchTouch('touchend', 100, 100)
      const scrollAtEnd = el.scrollLeft

      await advanceFrames(100, 5)
      expect(el.scrollLeft).toBe(scrollAtEnd) // 位移未增加
    })
  })

  // 5. 点击拦截逻辑测试 / Interaction Blocking
  describe('Smart Click Blocking / 智能点击拦截', () => {
    it('should block click events after a successful drag / 正常拖拽结束后，应拦截接下来的点击事件防止误触', async () => {
      const clickSpy = vi.fn()
      el.addEventListener('click', clickSpy)
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)

      // 1. 执行一次拖拽
      dispatchTouch('touchstart', 100, 100)
      dispatchTouch('touchmove', 50, 100)
      dispatchTouch('touchend', 50, 100)

      // 2. 模拟浏览器紧随其后派发的 click 事件
      const clickEvt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
      el.dispatchEvent(clickEvt)

      expect(clickSpy).not.toHaveBeenCalled() // 拦截成功
    })

    it('should block click when braking during inertia / 在惯性滑动中点击“刹车”应被拦截', async () => {
      const clickSpy = vi.fn()
      el.addEventListener('click', clickSpy)
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)

      // 1. 产生高速惯性
      dispatchTouch('touchstart', 200, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 50, 100)
      dispatchTouch('touchend', 50, 100)

      // 2. 在第一帧动画运行中点击（刹车行为）
      await advanceFrames(16, 1)
      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )

      expect(clickSpy).not.toHaveBeenCalled() // 刹车不应误触列表项点击
    })

    it('should allow normal click without movement / 没有产生位移的单纯点击不应被拦截', () => {
      const clickSpy = vi.fn()
      el.addEventListener('click', clickSpy)
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)

      dispatchTouch('touchstart', 100, 100)
      dispatchTouch('touchend', 100, 100)

      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
      expect(clickSpy).toHaveBeenCalled() // 允许点击
    })
  })

  // 6. 复杂 DOM 选择器测试 / Selectors
  describe('Selector Support / 选择器支持', () => {
    it('should target sub-element if selector is provided / 若提供选择器，应滚动子元素而非绑定元素', () => {
      const inner = document.createElement('div')
      inner.className = 'my-table'
      el.appendChild(inner)

      const binding = createBinding({ selector: '.my-table' })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      expect(inner.style.overflow).toBe('hidden')
      expect(el.style.overflow).not.toBe('hidden')
    })
  })
})
