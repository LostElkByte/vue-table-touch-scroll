import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { detectDeviceType, vTableTouchScroll } from '../index'

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
      mockNow.mockReturnValue(performance.now() + frameTime)
      vi.advanceTimersByTime(frameTime)
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

  // --- Utility: Dispatch Touch Events with multiple touches / 工具函数：分发多指触摸事件 ---
  function dispatchMultiTouch(
    type: string,
    touches: { clientX: number; clientY: number; identifier?: number }[],
    changedTouches: { clientX: number; clientY: number; identifier?: number }[],
    target: HTMLElement = el
  ) {
    const event = new TouchEvent(type, {
      cancelable: true,
      bubbles: true,
      touches: touches.map(
        (t, i) => ({ ...t, identifier: t.identifier ?? i }) as any
      ),
      changedTouches: changedTouches.map(
        (t, i) => ({ ...t, identifier: t.identifier ?? i }) as any
      ),
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

  // ═══════════════════════════════════════════════════════════════════════
  // 1. 生命周期与配置测试（使用 mode:'always' 保持向后兼容验证）
  // Lifecycle & Configuration (using mode:'always' for backward-compatible assertions)
  // ═══════════════════════════════════════════════════════════════════════
  describe('Basic Lifecycle / 基础生命周期', () => {
    it('should hijack styles on mounted with mode=always / 挂载时应正确劫持 CSS 样式', () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )
      expect(el.style.overflow).toBe('hidden')
      expect(el.style.willChange).toBe('scroll-position')
    })

    it('should restore styles on unmounted / 卸载时应还原元素原始样式', () => {
      el.style.overflow = 'auto'
      const binding = createBinding({ mode: 'always' })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)
      vTableTouchScroll.unmounted!(el, binding, {} as any, null)
      expect(el.style.overflow).toBe('auto')
    })

    it('should enable/disable dynamically via options / 应支持通过配置项动态启用或禁用', () => {
      const bindingEnabled = createBinding({ enabled: true, mode: 'always' })
      vTableTouchScroll.mounted!(el, bindingEnabled, {} as any, null)
      expect(el.style.overflow).toBe('hidden')

      const bindingDisabled = createBinding({ enabled: false, mode: 'always' })
      vTableTouchScroll.updated!(el, bindingDisabled, {} as any, {} as any)
      expect(el.style.overflow).not.toBe('hidden')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 2. 轴向锁定功能测试 / Direction Locking
  // ═══════════════════════════════════════════════════════════════════════
  describe('Direction Locking / 轴向锁定', () => {
    it('should lock to Horizontal and ignore Y axis / 水平偏移优先时应锁定水平轴，忽略垂直移动', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 110)
      await advanceFrames(16, 1)

      expect(el.scrollLeft).toBeGreaterThan(0)
      expect(el.scrollTop).toBe(0)
    })

    it('should ignore movement below threshold before direction lock / 未超过阈值前应直接返回不接管', () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 20, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 95, 96)

      expect(moveEvt.defaultPrevented).toBe(false)
      expect(el.scrollLeft).toBe(0)
      expect(el.scrollTop).toBe(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 3. 智能边缘检测测试 / Edge Detection
  // ═══════════════════════════════════════════════════════════════════════
  describe('Edge Detection / 边缘检测', () => {
    it('should not preventDefault at left edge swiping right / 在最左侧向右划动应交还控制权', () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )
      el.scrollLeft = 0

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 150, 100)
      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('should keep hijacking at edge when disableEdgeDetection is true / 禁用边缘检测后在边缘应继续由指令接管', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always', disableEdgeDetection: true }),
        {} as any,
        null
      )
      el.scrollLeft = 0

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      const moveEvt = dispatchTouch('touchmove', 150, 100)
      await advanceFrames(16, 1)

      expect(moveEvt.defaultPrevented).toBe(true)
      expect(el.scrollLeft).toBe(0)
    })

    it('should apply updated disableEdgeDetection option at runtime / 运行时更新 disableEdgeDetection 应立即生效', () => {
      const binding1 = createBinding({
        mode: 'always',
        disableEdgeDetection: false,
      })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)

      el.scrollLeft = 0
      dispatchTouch('touchstart', 100, 100)
      const moveEvt1 = dispatchTouch('touchmove', 150, 100)
      expect(moveEvt1.defaultPrevented).toBe(false)
      dispatchTouch('touchend', 150, 100)

      const binding2 = createBinding({
        mode: 'always',
        disableEdgeDetection: true,
      })
      ;(binding2 as any).oldValue = {
        mode: 'always',
        disableEdgeDetection: false,
      }
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      dispatchTouch('touchstart', 100, 100)
      const moveEvt2 = dispatchTouch('touchmove', 150, 100)
      expect(moveEvt2.defaultPrevented).toBe(true)
    })

    it('should not take control when content fits container / 内容无需滚动时，不应接管手势', () => {
      const smallEl = createMockElement({
        width: 500,
        height: 500,
        scrollWidth: 500,
        scrollHeight: 500,
      })
      vTableTouchScroll.mounted!(
        smallEl,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100, smallEl)
      const moveEvt = dispatchTouch('touchmove', 50, 50, smallEl)
      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('should handle native scroll when at edge and swipe outward / 在边缘向外滑动时应触发原生滚动', async () => {
      el.scrollLeft = 0
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      const moveEvt = dispatchTouch('touchmove', 150, 100)
      expect(moveEvt.defaultPrevented).toBe(false)

      dispatchTouch('touchend', 150, 100)
      await advanceFrames(100, 6)
      expect(el.scrollLeft).toBe(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 4. 物理惯性与帧率归一化测试 / Physics & Frame Normalization
  // ═══════════════════════════════════════════════════════════════════════
  describe('Physics Engine / 物理引擎', () => {
    it('should simulate inertia displacement after release / 手指释放后应产生物理惯性位移', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 200, 100)
      mockNow.mockReturnValue(20)
      dispatchTouch('touchmove', 100, 100)

      mockNow.mockReturnValue(25)
      dispatchTouch('touchend', 100, 100)

      const scrollAtEnd = el.scrollLeft
      await advanceFrames(100, 6)
      expect(el.scrollLeft).toBeGreaterThan(scrollAtEnd)
    })

    it('should start inertia animation on touchend when no RAF is active / touchend 时若未有 RAF 应启动惯性动画', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always', dragThreshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 240, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 180, 100)

      // 在抬手前先推进一帧，让手动跟随阶段的 RAF 结束，确保触发 touchend 内的「!ctx.rafId」分支
      await advanceFrames(16, 1)

      const beforeEnd = el.scrollLeft
      mockNow.mockReturnValue(20)
      dispatchTouch('touchend', 180, 100)

      await advanceFrames(16, 1)
      expect(el.scrollLeft).toBeGreaterThan(beforeEnd)
    })

    it('should stop inertia if paused for too long before release / 惯性保护：若停顿超过阈值再松手，不应触发惯性', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 200, 100)
      dispatchTouch('touchmove', 100, 100)

      mockNow.mockReturnValue(performance.now() + 200)
      vi.advanceTimersByTime(200)

      dispatchTouch('touchend', 100, 100)
      const scrollAtEnd = el.scrollLeft

      await advanceFrames(100, 5)
      expect(el.scrollLeft).toBe(scrollAtEnd)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 5. 点击拦截逻辑测试 / Interaction Blocking
  // ═══════════════════════════════════════════════════════════════════════
  describe('Smart Click Blocking / 智能点击拦截', () => {
    it('should block click events after a successful drag / 正常拖拽结束后，应拦截接下来的点击事件防止误触', async () => {
      const clickSpy = vi.fn()
      el.addEventListener('click', clickSpy)
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      dispatchTouch('touchmove', 50, 100)
      dispatchTouch('touchend', 50, 100)

      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
      expect(clickSpy).not.toHaveBeenCalled()
    })

    it('should block click when braking during inertia / 在惯性滑动中点击"刹车"应被拦截', async () => {
      const clickSpy = vi.fn()
      el.addEventListener('click', clickSpy)
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 200, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 50, 100)
      dispatchTouch('touchend', 50, 100)

      await advanceFrames(16, 1)
      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
      expect(clickSpy).not.toHaveBeenCalled()
    })

    it('should enable brake-click protection and trigger onScrollEnd on second touchstart / 二次 touchstart 刹车应开启点击保护并触发 onScrollEnd', async () => {
      const clickSpy = vi.fn()
      const endSpy = vi.fn()
      el.addEventListener('click', clickSpy)

      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always', onScrollEnd: endSpy }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 240, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 120, 100)
      dispatchTouch('touchend', 120, 100)

      // 惯性进行中时再次 touchstart，触发刹车逻辑
      mockNow.mockReturnValue(20)
      dispatchTouch('touchstart', 120, 100)

      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )

      expect(endSpy).toHaveBeenCalled()
      expect(clickSpy).not.toHaveBeenCalled()
    })

    it('should allow normal click without movement / 没有产生位移的单纯点击不应被拦截', () => {
      const clickSpy = vi.fn()
      el.addEventListener('click', clickSpy)
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      dispatchTouch('touchend', 100, 100)

      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
      expect(clickSpy).toHaveBeenCalled()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 6. 复杂 DOM 选择器测试 / Selectors
  // ═══════════════════════════════════════════════════════════════════════
  describe('Selector Support / 选择器支持', () => {
    it('should target sub-element if selector is provided / 若提供选择器，应滚动子元素而非绑定元素', () => {
      const inner = document.createElement('div')
      inner.className = 'my-table'
      el.appendChild(inner)

      const binding = createBinding({ selector: '.my-table', mode: 'always' })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      expect(inner.style.overflow).toBe('hidden')
      expect(el.style.overflow).not.toBe('hidden')
    })

    it('should use preset selector when preset is provided / 当提供 preset 时应使用预设选择器', () => {
      const inner = document.createElement('div')
      inner.className = 'el-scrollbar__wrap'
      el.appendChild(inner)

      const binding = createBinding({ preset: 'element-plus', mode: 'always' })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      expect(inner.style.overflow).toBe('hidden')
      expect(el.style.overflow).not.toBe('hidden')
    })

    it('should prioritize selector over preset / selector 应优先于 preset', () => {
      const presetEl = document.createElement('div')
      presetEl.className = 'el-scrollbar__wrap'
      const selectorEl = document.createElement('div')
      selectorEl.className = 'custom-selector'
      el.appendChild(presetEl)
      el.appendChild(selectorEl)

      const binding = createBinding({
        preset: 'element-plus',
        selector: '.custom-selector',
        mode: 'always',
      })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      expect(selectorEl.style.overflow).toBe('hidden')
      expect(presetEl.style.overflow).not.toBe('hidden')
      expect(el.style.overflow).not.toBe('hidden')
    })

    it('should handle non-existent selector gracefully / 处理不存在的选择器', () => {
      const binding = createBinding({
        selector: '.non-existent',
        mode: 'always',
      })
      expect(() => {
        vTableTouchScroll.mounted!(el, binding, {} as any, null)
      }).not.toThrow()
      expect(el.style.overflow).not.toBe('hidden')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 7. 多指触摸测试 / Multi-touch Handling
  // ═══════════════════════════════════════════════════════════════════════
  describe('Multi-touch Handling / 多指触摸处理', () => {
    it('should not preventDefault on multi-touch to allow native pinch-to-zoom / 多指时不阻止默认行为以允许原生缩放', () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      const evt = dispatchMultiTouch(
        'touchstart',
        [
          { clientX: 100, clientY: 100, identifier: 0 },
          { clientX: 120, clientY: 120, identifier: 1 },
        ],
        [{ clientX: 100, clientY: 100, identifier: 0 }]
      )

      expect(evt.defaultPrevented).toBe(false)
    })

    it('should stop ongoing animation when multi-touch starts / 多指开始时应停止正在进行的动画', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      // 单指拖拽产生滚动 / Single-finger drag to scroll
      dispatchTouch('touchstart', 200, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 100, 100)
      await advanceFrames(16, 1)
      dispatchTouch('touchend', 100, 100)

      // 第二根手指按下，触发多指模式 / Second finger down, enter multi-touch
      dispatchMultiTouch(
        'touchstart',
        [
          { clientX: 100, clientY: 100, identifier: 0 },
          { clientX: 200, clientY: 200, identifier: 1 },
        ],
        [{ clientX: 200, clientY: 200, identifier: 1 }]
      )

      // 惯性动画应被停止，后续帧不再改变 scrollLeft
      // Inertia animation should be stopped, subsequent frames should not change scrollLeft
      const scrollAfterMultiTouch = el.scrollLeft
      await advanceFrames(16, 3)
      expect(el.scrollLeft).toBe(scrollAfterMultiTouch)
    })

    it('should ignore touchmove during multi-touch mode / 多指模式下应忽略 touchmove', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      // 先用单指触摸 / Start single touch
      dispatchTouch('touchstart', 100, 100)

      // 第二根手指按下，进入多指模式 / Second finger enters multi-touch mode
      dispatchMultiTouch(
        'touchstart',
        [
          { clientX: 100, clientY: 100, identifier: 0 },
          { clientX: 200, clientY: 200, identifier: 1 },
        ],
        [{ clientX: 200, clientY: 200, identifier: 1 }]
      )

      mockNow.mockReturnValue(10)
      // 多指模式下的 touchmove 不应产生任何滚动 / touchmove in multi-touch should not scroll
      dispatchTouch('touchmove', 50, 100)
      await advanceFrames(16, 1)

      expect(el.scrollLeft).toBe(0)
    })

    it('should release multi-touch lock only when all fingers leave / 所有手指离开后才解除多指锁定', () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )

      // 两指按下 / Two fingers down
      dispatchMultiTouch(
        'touchstart',
        [
          { clientX: 100, clientY: 100, identifier: 0 },
          { clientX: 200, clientY: 200, identifier: 1 },
        ],
        [{ clientX: 100, clientY: 100, identifier: 0 }]
      )

      // 抬起一根手指，仍然在多指模式中 / Lift one finger, still in multi-touch mode
      dispatchMultiTouch(
        'touchend',
        [{ clientX: 200, clientY: 200, identifier: 1 }],
        [{ clientX: 100, clientY: 100, identifier: 0 }]
      )

      // 最后一根手指也抬起，多指锁定解除 / Last finger up, multi-touch lock released
      dispatchMultiTouch(
        'touchend',
        [],
        [{ clientX: 200, clientY: 200, identifier: 1 }]
      )

      // 验证后续单指操作可以正常工作 / Verify single-finger operation works afterwards
      dispatchTouch('touchstart', 100, 100)
      // 不应抛出异常且手势追踪应正常初始化 / Should not throw and tracking should initialize
    })

    it('should ignore unrelated finger lift / 应忽略无关手指的抬起', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)

      dispatchMultiTouch(
        'touchend',
        [{ clientX: 100, clientY: 100, identifier: 0 }],
        [{ clientX: 200, clientY: 200, identifier: 99 }]
      )

      expect(el.scrollLeft).toBeGreaterThan(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 8. 垂直方向滚动测试 / Vertical Scrolling
  // ═══════════════════════════════════════════════════════════════════════
  describe('Vertical Scrolling / 垂直方向滚动', () => {
    it('should handle vertical scrolling / 应支持垂直滚动', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 102, 80)
      await advanceFrames(16, 1)

      expect(el.scrollTop).toBeGreaterThan(0)
      expect(el.scrollLeft).toBe(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 9. 边缘检测进阶测试 / Advanced Edge Detection
  // ═══════════════════════════════════════════════════════════════════════
  describe('Advanced Edge Detection / 进阶边缘检测', () => {
    it('should handle right edge detection / 应检测右边缘', () => {
      el.scrollLeft = el.scrollWidth - el.clientWidth
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 50, 100)
      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('should handle top edge detection / 应检测上边缘', () => {
      el.scrollTop = 0
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 100, 150)
      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('should handle bottom edge detection / 应检测下边缘', () => {
      el.scrollTop = el.scrollHeight - el.clientHeight
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 100, 50)
      expect(moveEvt.defaultPrevented).toBe(false)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 10. 配置项更新测试 / Options Update
  // ═══════════════════════════════════════════════════════════════════════
  describe('Options Update / 配置项更新', () => {
    it('should update callbacks dynamically / 应支持动态更新回调函数', async () => {
      const startSpy1 = vi.fn()
      const endSpy1 = vi.fn()
      const startSpy2 = vi.fn()
      const endSpy2 = vi.fn()

      const binding1 = createBinding({
        onScrollStart: startSpy1,
        onScrollEnd: endSpy1,
        mode: 'always',
      })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)

      const binding2 = createBinding({
        onScrollStart: startSpy2,
        onScrollEnd: endSpy2,
        mode: 'always',
      })
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)

      expect(startSpy2).toHaveBeenCalled()
      expect(startSpy1).not.toHaveBeenCalled()
    })

    it('should reinitialize when selector changes / selector 改变时应重新初始化', () => {
      const inner1 = document.createElement('div')
      inner1.className = 'table-1'
      const inner2 = document.createElement('div')
      inner2.className = 'table-2'
      el.appendChild(inner1)
      el.appendChild(inner2)

      const binding1 = createBinding({ selector: '.table-1', mode: 'always' })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)
      expect(inner1.style.overflow).toBe('hidden')

      const binding2 = createBinding({ selector: '.table-2', mode: 'always' })
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      expect(inner1.style.overflow).not.toBe('hidden')
      expect(inner2.style.overflow).toBe('hidden')
    })

    it('should reinitialize when preset changes / preset 改变时应重新初始化', () => {
      const elPlus = document.createElement('div')
      elPlus.className = 'el-scrollbar__wrap'
      const antTable = document.createElement('div')
      antTable.className = 'ant-table-body'
      el.appendChild(elPlus)
      el.appendChild(antTable)

      const binding1 = createBinding({ preset: 'element-plus', mode: 'always' })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)
      expect(elPlus.style.overflow).toBe('hidden')

      const binding2 = createBinding({
        preset: 'ant-design-vue',
        mode: 'always',
      })
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      expect(elPlus.style.overflow).not.toBe('hidden')
      expect(antTable.style.overflow).toBe('hidden')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 11. 禁用惯性测试 / Disable Inertia
  // ═══════════════════════════════════════════════════════════════════════
  describe('Disable Inertia / 禁用惯性', () => {
    it('should not apply inertia when disabled / 禁用时不应产生惯性', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({
          disableInertia: true,
          dragThreshold: 5,
          mode: 'always',
        }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 200, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 100, 100)
      const scrollAtMove = el.scrollLeft

      dispatchTouch('touchend', 100, 100)
      await advanceFrames(100, 6)
      expect(el.scrollLeft).toBe(scrollAtMove)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 12. touchAction 样式测试 / touchAction Style
  // ═══════════════════════════════════════════════════════════════════════
  describe('touchAction Style / touchAction 样式', () => {
    it('should reset touchAction when it is none / 当 touchAction 为 none 时应重置为 auto', () => {
      el.style.touchAction = 'none'
      vTableTouchScroll.mounted!(
        el,
        createBinding({ mode: 'always' }),
        {} as any,
        null
      )
      expect(el.style.touchAction).toBe('auto')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 13. touchcancel 事件测试 / Touch Cancel
  // ═══════════════════════════════════════════════════════════════════════
  describe('Touch Cancel / 触摸取消', () => {
    it('should handle touchcancel event / 应处理 touchcancel 事件', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always' }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)

      const scrollAtMove = el.scrollLeft
      dispatchTouch('touchcancel', 80, 100)
      await advanceFrames(100, 6)

      expect(el.scrollLeft).toBeGreaterThanOrEqual(scrollAtMove)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 14. 清理测试 / Cleanup
  // ═══════════════════════════════════════════════════════════════════════
  describe('Cleanup / 清理', () => {
    it('should trigger onScrollEnd when unmounted during scrolling / 卸载时应触发 onScrollEnd 回调', async () => {
      const endSpy = vi.fn()
      const binding = createBinding({
        onScrollEnd: endSpy,
        dragThreshold: 5,
        mode: 'always',
      })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)
      dispatchTouch('touchend', 80, 100)

      await advanceFrames(16, 1)
      vTableTouchScroll.unmounted!(el, binding, {} as any, null)
      expect(endSpy).toHaveBeenCalled()
    })

    it('should restore original styles on cleanup / 清理时应恢复原始样式', () => {
      el.style.overflow = 'scroll'
      el.style.willChange = 'transform'

      const binding = createBinding({ mode: 'always' })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)
      expect(el.style.overflow).toBe('hidden')

      vTableTouchScroll.unmounted!(el, binding, {} as any, null)
      expect(el.style.overflow).toBe('scroll')
      expect(el.style.willChange).toBe('transform')
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 15. 窗口环境检测 / Window Environment Check
  // ═══════════════════════════════════════════════════════════════════════
  describe('Window Environment / 窗口环境', () => {
    it('should handle server-side rendering gracefully / 应优雅处理服务端渲染', () => {
      const originalWindow = globalThis.window
      // @ts-ignore
      globalThis.window = undefined

      const binding = createBinding({})
      expect(() => {
        vTableTouchScroll.mounted!(el, binding, {} as any, null)
      }).not.toThrow()

      globalThis.window = originalWindow
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 16. 懒接管模式测试 / Lazy Hijacking Mode
  // ═══════════════════════════════════════════════════════════════════════
  describe('Lazy Hijacking Mode / 懒接管模式', () => {
    describe('Device Detection / 设备检测', () => {
      it('should return a valid device type / 应返回有效的设备类型', () => {
        const result = detectDeviceType()
        expect(['desktop', 'mobile', 'hybrid']).toContain(result)
      })

      it('should detect desktop when SSR / SSR 环境应检测为 desktop', () => {
        const originalWindow = globalThis.window
        // @ts-ignore
        globalThis.window = undefined
        expect(detectDeviceType()).toBe('desktop')
        globalThis.window = originalWindow
      })

      it('should detect desktop when no touch support / 无触摸能力应检测为 desktop', () => {
        const originalMaxTouchPoints = navigator.maxTouchPoints
        const originalOntouchstart = 'ontouchstart' in window
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: 0,
          configurable: true,
        })
        if (originalOntouchstart) {
          // @ts-ignore
          delete window.ontouchstart
        }
        expect(detectDeviceType()).toBe('desktop')
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: originalMaxTouchPoints,
          configurable: true,
        })
        if (originalOntouchstart) {
          // @ts-ignore
          window.ontouchstart = null
        }
      })
    })

    describe('Dormant State (Pure PC) / 休眠状态（纯 PC）', () => {
      it('should not modify styles in auto mode on desktop / 纯 PC 下 auto 模式不应改变任何样式', () => {
        const originalOverflow = el.style.overflow
        vTableTouchScroll.mounted!(
          el,
          createBinding({ mode: 'auto' }),
          {} as any,
          null
        )
        expect(el.style.overflow).toBe(originalOverflow)
        expect(el.style.willChange).not.toBe('scroll-position')
      })

      it('should not modify styles with default mode on desktop / 默认模式在 desktop 不应改变样式', () => {
        vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)
        expect(el.style.overflow).not.toBe('hidden')
      })

      it('should cleanup gracefully from dormant state / 休眠状态下也应正常清理', () => {
        const binding = createBinding({})
        vTableTouchScroll.mounted!(el, binding, {} as any, null)
        expect(() => {
          vTableTouchScroll.unmounted!(el, binding, {} as any, null)
        }).not.toThrow()
      })
    })

    describe('mode=always Backward Compatibility / mode=always 向后兼容', () => {
      it('should always activate regardless of device type / 无论设备类型都应激活', () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ mode: 'always' }),
          {} as any,
          null
        )
        expect(el.style.overflow).toBe('hidden')
        expect(el.style.willChange).toBe('scroll-position')
      })

      it('should reinitialize when mode changes / mode 改变时应重新初始化', () => {
        const binding1 = createBinding({ mode: 'always' })
        vTableTouchScroll.mounted!(el, binding1, {} as any, null)
        expect(el.style.overflow).toBe('hidden')

        // 从 always 切换到 auto（在 JSDOM 中会进入 dormant）
        const binding2 = createBinding({ mode: 'auto' })
        ;(binding2 as any).oldValue = { mode: 'always' }
        vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)
        expect(el.style.overflow).not.toBe('hidden')
      })
    })

    describe('Hybrid Standby → PendingActive → Active / 混合设备状态流转', () => {
      /**
       * 模拟混合设备环境
       * Mock hybrid device environment by simulating maxTouchPoints
       */
      let originalMaxTouchPoints: number
      let originalMatchMedia: typeof window.matchMedia

      beforeEach(() => {
        originalMaxTouchPoints = navigator.maxTouchPoints
        originalMatchMedia = window.matchMedia
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: 10,
          configurable: true,
        })
        // hybrid: 有触摸能力但 pointer 不是 coarse / Touch-capable but fine pointer
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
          matches: query === '(pointer: coarse)' ? false : false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }))
      })

      afterEach(() => {
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: originalMaxTouchPoints,
          configurable: true,
        })
        window.matchMedia = originalMatchMedia
      })

      it('should detect hybrid device correctly / 应正确检测混合设备', () => {
        expect(detectDeviceType()).toBe('hybrid')
      })

      it('should enter standby without hijacking styles / 进入 standby 不应劫持样式', () => {
        vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)
        expect(el.style.overflow).not.toBe('hidden')
        expect(el.style.willChange).not.toBe('scroll-position')
      })

      it('should remain in standby on pure click (touchstart → touchend) / 纯点击不应激活', () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 5 }),
          {} as any,
          null
        )
        expect(el.style.overflow).not.toBe('hidden')

        // 点击：touchstart → touchend，中间无 touchmove
        dispatchTouch('touchstart', 100, 100)
        expect(el.style.overflow).not.toBe('hidden')

        dispatchTouch('touchend', 100, 100)
        expect(el.style.overflow).not.toBe('hidden')
      })

      it('should reset pending-active tracking on touchend / pending-active 结束时应清理 activeTouchId', () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 8 }),
          {} as any,
          null
        )

        // 进入 pending-active 但不触发激活
        dispatchTouch('touchstart', 100, 100)
        dispatchTouch('touchend', 100, 100)

        // 再次 touchstart/touchmove（低于阈值）应仍可正常工作，侧面验证状态已被清理
        const moveEvt = dispatchTouch('touchstart', 120, 120)
        expect(moveEvt.defaultPrevented).toBe(false)
        const moveEvt2 = dispatchTouch('touchmove', 123, 120)
        expect(moveEvt2.defaultPrevented).toBe(false)
      })

      it('should remain in standby on small movement below threshold / 小幅移动未超阈值不应激活', () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 10 }),
          {} as any,
          null
        )

        dispatchTouch('touchstart', 100, 100)
        // 移动 3px，未超过 10px 阈值
        dispatchTouch('touchmove', 103, 100)
        expect(el.style.overflow).not.toBe('hidden')

        dispatchTouch('touchend', 103, 100)
        expect(el.style.overflow).not.toBe('hidden')
      })

      it('should activate when touchmove exceeds threshold / touchmove 超阈值应激活', async () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 5 }),
          {} as any,
          null
        )
        expect(el.style.overflow).not.toBe('hidden')

        dispatchTouch('touchstart', 100, 100)
        mockNow.mockReturnValue(10)
        // 移动 20px > 5px 阈值
        dispatchTouch('touchmove', 80, 100)
        expect(el.style.overflow).toBe('hidden')
        expect(el.style.willChange).toBe('scroll-position')

        await advanceFrames(16, 1)
        expect(el.scrollLeft).toBeGreaterThan(0)
      })

      it('should deactivate on wheel and restore styles / wheel 应夺回控制权并还原样式', async () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 5 }),
          {} as any,
          null
        )

        // 先激活
        dispatchTouch('touchstart', 100, 100)
        mockNow.mockReturnValue(10)
        dispatchTouch('touchmove', 80, 100)
        await advanceFrames(16, 1)
        dispatchTouch('touchend', 80, 100)

        expect(el.style.overflow).toBe('hidden')

        // wheel 夺权
        el.dispatchEvent(new WheelEvent('wheel', { bubbles: true }))
        expect(el.style.overflow).not.toBe('hidden')
      })

      it('should stop inertia immediately on wheel / wheel 应立即停止惯性动画', async () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 5 }),
          {} as any,
          null
        )

        dispatchTouch('touchstart', 200, 100)
        mockNow.mockReturnValue(10)
        dispatchTouch('touchmove', 50, 100)
        mockNow.mockReturnValue(15)
        dispatchTouch('touchend', 50, 100)

        // 惯性进行中
        await advanceFrames(16, 1)

        // wheel 强制中止
        el.dispatchEvent(new WheelEvent('wheel', { bubbles: true }))
        const scrollAfterWheel = el.scrollLeft

        // 惯性应该已停止，后续帧不应再产生额外位移
        await advanceFrames(100, 6)
        expect(el.scrollLeft).toBe(scrollAfterWheel)
        expect(el.style.overflow).not.toBe('hidden')
      })

      it('should sync scroll position on deactivate to prevent snap / deactivate 时应同步位置防闪烁', async () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 5 }),
          {} as any,
          null
        )

        dispatchTouch('touchstart', 100, 100)
        mockNow.mockReturnValue(10)
        dispatchTouch('touchmove', 80, 100)
        await advanceFrames(16, 1)

        const scrollPos = el.scrollLeft
        dispatchTouch('touchend', 80, 100)

        // wheel 夺权
        el.dispatchEvent(new WheelEvent('wheel', { bubbles: true }))
        // 位置应保持一致，不应有跳变
        expect(el.scrollLeft).toBeGreaterThanOrEqual(scrollPos)
      })

      it('should allow re-activation after wheel deactivation / wheel 退出后应允许再次激活', async () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ dragThreshold: 5 }),
          {} as any,
          null
        )

        // 第一轮：激活 → wheel 退出
        dispatchTouch('touchstart', 100, 100)
        mockNow.mockReturnValue(10)
        dispatchTouch('touchmove', 80, 100)
        await advanceFrames(16, 1)
        dispatchTouch('touchend', 80, 100)
        el.dispatchEvent(new WheelEvent('wheel', { bubbles: true }))
        expect(el.style.overflow).not.toBe('hidden')

        // 第二轮：再次触摸应能重新激活
        mockNow.mockReturnValue(100)
        dispatchTouch('touchstart', 100, 100)
        mockNow.mockReturnValue(110)
        dispatchTouch('touchmove', 70, 100)
        expect(el.style.overflow).toBe('hidden')
      })

      it('should cleanup correctly from standby state / standby 状态下应正确清理', () => {
        const binding = createBinding({ dragThreshold: 5 })
        vTableTouchScroll.mounted!(el, binding, {} as any, null)
        expect(el.style.overflow).not.toBe('hidden')

        expect(() => {
          vTableTouchScroll.unmounted!(el, binding, {} as any, null)
        }).not.toThrow()
      })

      it('should cleanup correctly from active state / active 状态下应正确清理', async () => {
        const binding = createBinding({ dragThreshold: 5 })
        vTableTouchScroll.mounted!(el, binding, {} as any, null)

        dispatchTouch('touchstart', 100, 100)
        mockNow.mockReturnValue(10)
        dispatchTouch('touchmove', 80, 100)
        await advanceFrames(16, 1)

        expect(el.style.overflow).toBe('hidden')
        vTableTouchScroll.unmounted!(el, binding, {} as any, null)
        expect(el.style.overflow).not.toBe('hidden')
      })
    })

    describe('Mobile Device Direct Activation / 移动端直接激活', () => {
      let originalMaxTouchPoints: number
      let originalMatchMedia: typeof window.matchMedia

      beforeEach(() => {
        originalMaxTouchPoints = navigator.maxTouchPoints
        originalMatchMedia = window.matchMedia
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: 5,
          configurable: true,
        })
        // mobile: pointer: coarse
        window.matchMedia = vi.fn().mockImplementation((query: string) => ({
          matches: query === '(pointer: coarse)' ? true : false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }))
      })

      afterEach(() => {
        Object.defineProperty(navigator, 'maxTouchPoints', {
          value: originalMaxTouchPoints,
          configurable: true,
        })
        window.matchMedia = originalMatchMedia
      })

      it('should detect mobile device correctly / 应正确检测移动设备', () => {
        expect(detectDeviceType()).toBe('mobile')
      })

      it('should hijack styles immediately in auto mode / auto 模式移动端应立即劫持样式', () => {
        vTableTouchScroll.mounted!(
          el,
          createBinding({ mode: 'auto' }),
          {} as any,
          null
        )
        expect(el.style.overflow).toBe('hidden')
        expect(el.style.willChange).toBe('scroll-position')
      })

      it('should hijack styles immediately with default mode / 默认模式移动端应立即劫持样式', () => {
        vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)
        expect(el.style.overflow).toBe('hidden')
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════
  // 17. CSS 旋转横屏支持测试 / CSS Rotation Support
  // ═══════════════════════════════════════════════════════════════════════
  describe('CSS Rotation Support / CSS 旋转横屏支持', () => {
    it('rotation=0 时行为不变（回归保护）/ rotation=0 should not change behavior', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always', rotation: 0 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 110)
      await advanceFrames(16, 1)

      expect(el.scrollLeft).toBeGreaterThan(0)
      expect(el.scrollTop).toBe(0)
    })

    it('rotation=90 时水平触摸映射到垂直滚动 / rotation=90 maps horizontal swipe to vertical scroll', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always', rotation: 90 }),
        {} as any,
        null
      )

      // rotation=90 变换: x=clientY, y=-clientX
      // touchStart(100, 100) → { x:100, y:-100 }
      // touchMove(120, 100)  → { x:100, y:-120 } → dy=-20 (垂直方向)
      // incY = -120-(-100) = -20 → targetScrollTop = 0 - (-20) = 20
      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 120, 100)
      await advanceFrames(16, 1)

      expect(el.scrollTop).toBeGreaterThan(0)
      expect(el.scrollLeft).toBe(0)
    })

    it('rotation=-90 时水平触摸映射到反向垂直滚动 / rotation=-90 maps horizontal swipe to reversed vertical scroll', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always', rotation: -90 }),
        {} as any,
        null
      )

      // rotation=-90: x=-clientY, y=clientX
      // touchStart: x=-100, y=100
      // touchMove:  x=-100, y=80  → dy=-20 (垂直方向)
      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)

      // 水平触摸被映射为垂直滚动（反向）
      expect(el.scrollTop).toBeGreaterThan(0)
      expect(el.scrollLeft).toBe(0)
    })

    it('rotation=180 时触摸方向完全反转 / rotation=180 reverses both axes', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always', rotation: 180 }),
        {} as any,
        null
      )

      // rotation=180: x=-clientX, y=-clientY
      // 手指向右滑（clientX 增加）→ x 减少 → dx<0 → scrollLeft 减少
      // 手指向左滑（clientX 减少）→ x 增加 → dx>0 → scrollLeft 应增加（反转）
      // 先把 scrollLeft 设到中间位置，再向右滑，scrollLeft 应减少
      el.scrollLeft = 400
      const initialScroll = el.scrollLeft

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      // 手指向左滑 → rotation=180 后 dx 为正 → 对 scrollLeft 产生正向位移
      dispatchTouch('touchmove', 80, 102)
      await advanceFrames(16, 1)

      expect(el.scrollLeft).toBeLessThan(initialScroll)
    })

    it('旋转状态下边缘检测仍正确工作 / edge detection works correctly under rotation', () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always', rotation: 90 }),
        {} as any,
        null
      )

      // rotation=90: x=clientY, y=-clientX
      // 将 scrollTop 设为 0（顶部边缘）
      el.scrollTop = 0

      // touchStart(100, 100) → { x:100, y:-100 }
      // touchMove(80, 100)   → { x:100, y:-80 }  → dy=20 (向正方向, 即向上滑)
      // scrollTop=0 且 dy>0 → 顶部边缘向上 → 应放行给原生
      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 80, 100)
      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('旋转状态下惯性方向正确 / inertia direction is correct under rotation', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5, mode: 'always', rotation: 90 }),
        {} as any,
        null
      )

      // rotation=90: x=clientY, y=-clientX
      // 快速水平向右滑（clientX 增大）→ y=-clientX 减小 → 垂直方向惯性使 scrollTop 增加
      dispatchTouch('touchstart', 50, 100)
      mockNow.mockReturnValue(20)
      dispatchTouch('touchmove', 200, 100)

      mockNow.mockReturnValue(25)
      dispatchTouch('touchend', 200, 100)

      const scrollAtEnd = el.scrollTop
      await advanceFrames(100, 6)

      // 惯性应在垂直方向继续
      expect(el.scrollTop).toBeGreaterThan(scrollAtEnd)
      expect(el.scrollLeft).toBe(0)
    })

    it('运行时更新 rotation 值后坐标变换立即生效 / runtime rotation update takes effect immediately', async () => {
      const binding1 = createBinding({
        dragThreshold: 5,
        mode: 'always',
        rotation: 0,
      })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)

      // rotation=0 时，水平滑动应产生水平滚动
      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)
      expect(el.scrollLeft).toBeGreaterThan(0)

      dispatchTouch('touchend', 80, 100)
      // 等待动画停止
      mockNow.mockReturnValue(500)
      vi.advanceTimersByTime(500)
      await Promise.resolve()

      // 重置位置用于后续验证
      el.scrollLeft = 0
      el.scrollTop = 0

      // 动态更新 rotation 为 90
      const binding2 = createBinding({
        dragThreshold: 5,
        mode: 'always',
        rotation: 90,
      })
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      // rotation=90: x=clientY, y=-clientX
      // 手指向右滑（clientX 增大）→ y=-clientX 减小 → scrollTop 增加
      mockNow.mockReturnValue(600)
      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(610)
      dispatchTouch('touchmove', 120, 100)
      await advanceFrames(16, 1)

      expect(el.scrollTop).toBeGreaterThan(0)
    })
  })
})
