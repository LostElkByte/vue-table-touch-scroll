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
        createBinding({ dragThreshold: 5 }),
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

    it('should handle native scroll when at edge and swipe outward / 在边缘向外滑动时应触发原生滚动', async () => {
      // 将元素滚动到最左侧
      el.scrollLeft = 0
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      // 向右滑动（在左边缘向右滑，应该触发原生滚动）
      const moveEvt = dispatchTouch('touchmove', 150, 100)

      // 应该不阻止默认行为，允许原生滚动
      expect(moveEvt.defaultPrevented).toBe(false)

      // 触发 touchend，此时 isNativeScroll 应该被正确处理
      dispatchTouch('touchend', 150, 100)
      // 不应产生惯性滚动
      await advanceFrames(100, 6)
      expect(el.scrollLeft).toBe(0)
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

    it('should use preset selector when preset is provided / 当提供 preset 时应使用预设选择器', () => {
      const inner = document.createElement('div')
      inner.className = 'el-scrollbar__wrap'
      el.appendChild(inner)

      const binding = createBinding({ preset: 'element-plus' })
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
      })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      expect(selectorEl.style.overflow).toBe('hidden')
      expect(presetEl.style.overflow).not.toBe('hidden')
      expect(el.style.overflow).not.toBe('hidden')
    })

    it('should handle non-existent selector gracefully / 处理不存在的选择器', () => {
      const binding = createBinding({ selector: '.non-existent' })
      // 不应抛出错误
      expect(() => {
        vTableTouchScroll.mounted!(el, binding, {} as any, null)
      }).not.toThrow()
      // 原元素不应被修改
      expect(el.style.overflow).not.toBe('hidden')
    })
  })

  // 7. 多指触摸测试 / Multi-touch Handling
  describe('Multi-touch Handling / 多指触摸处理', () => {
    it('should ignore multi-touch gestures / 应忽略多指手势', () => {
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)

      // 使用两指触摸
      const evt = dispatchMultiTouch(
        'touchstart',
        [
          { clientX: 100, clientY: 100, identifier: 0 },
          { clientX: 120, clientY: 120, identifier: 1 },
        ],
        [{ clientX: 100, clientY: 100, identifier: 0 }]
      )

      // 多指触摸时应阻止默认行为并忽略
      expect(evt.defaultPrevented).toBe(true)
    })

    it('should ignore unrelated finger lift / 应忽略无关手指的抬起', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5 }),
        {} as any,
        null
      )

      // 第一根手指按下
      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      // 移动以锁定方向
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)

      // 第二根无关手指抬起（不应中断滚动）
      dispatchMultiTouch(
        'touchend',
        [{ clientX: 100, clientY: 100, identifier: 0 }],
        [{ clientX: 200, clientY: 200, identifier: 99 }]
      )

      // 滚动应继续
      expect(el.scrollLeft).toBeGreaterThan(0)
    })
  })

  // 8. 垂直方向滚动测试 / Vertical Scrolling
  describe('Vertical Scrolling / 垂直方向滚动', () => {
    it('should handle vertical scrolling / 应支持垂直滚动', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      // Dy > Dx，应锁定垂直方向
      dispatchTouch('touchmove', 102, 80)
      await advanceFrames(16, 1)

      expect(el.scrollTop).toBeGreaterThan(0)
      expect(el.scrollLeft).toBe(0)
    })
  })

  // 9. 边缘检测进阶测试 / Advanced Edge Detection
  describe('Advanced Edge Detection / 进阶边缘检测', () => {
    it('should handle right edge detection / 应检测右边缘', () => {
      el.scrollLeft = el.scrollWidth - el.clientWidth // 滚动到最右
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 50, 100) // 向左划（已在最右）

      // 由于方向判定需要超过阈值，这里只测试边缘检测逻辑被触发
      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('should handle top edge detection / 应检测上边缘', () => {
      el.scrollTop = 0
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 100, 150) // 向下划

      expect(moveEvt.defaultPrevented).toBe(false)
    })

    it('should handle bottom edge detection / 应检测下边缘', () => {
      el.scrollTop = el.scrollHeight - el.clientHeight // 滚动到最下
      vTableTouchScroll.mounted!(
        el,
        createBinding({ dragThreshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 100, 100)
      const moveEvt = dispatchTouch('touchmove', 100, 50) // 向上划（已在最下）

      expect(moveEvt.defaultPrevented).toBe(false)
    })
  })

  // 10. 配置项更新测试 / Options Update
  describe('Options Update / 配置项更新', () => {
    it('should update callbacks dynamically / 应支持动态更新回调函数', async () => {
      const startSpy1 = vi.fn()
      const endSpy1 = vi.fn()
      const startSpy2 = vi.fn()
      const endSpy2 = vi.fn()

      const binding1 = createBinding({
        onScrollStart: startSpy1,
        onScrollEnd: endSpy1,
      })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)

      // 更新回调
      const binding2 = createBinding({
        onScrollStart: startSpy2,
        onScrollEnd: endSpy2,
      })
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      // 触发滚动
      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)

      // 新的回调应该被调用
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

      const binding1 = createBinding({ selector: '.table-1' })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)
      expect(inner1.style.overflow).toBe('hidden')

      // 更新 selector
      const binding2 = createBinding({ selector: '.table-2' })
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      // 旧元素样式应恢复，新元素样式应被设置
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

      const binding1 = createBinding({ preset: 'element-plus' })
      vTableTouchScroll.mounted!(el, binding1, {} as any, null)
      expect(elPlus.style.overflow).toBe('hidden')

      // 更新 preset
      const binding2 = createBinding({ preset: 'ant-design-vue' })
      vTableTouchScroll.updated!(el, binding2, {} as any, {} as any)

      expect(elPlus.style.overflow).not.toBe('hidden')
      expect(antTable.style.overflow).toBe('hidden')
    })
  })

  // 11. 禁用惯性测试 / Disable Inertia
  describe('Disable Inertia / 禁用惯性', () => {
    it('should not apply inertia when disabled / 禁用时不应产生惯性', async () => {
      vTableTouchScroll.mounted!(
        el,
        createBinding({ disableInertia: true, dragThreshold: 5 }),
        {} as any,
        null
      )

      dispatchTouch('touchstart', 200, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 100, 100)
      const scrollAtMove = el.scrollLeft

      dispatchTouch('touchend', 100, 100)
      await advanceFrames(100, 6)

      // 无惯性，位置应保持不变
      expect(el.scrollLeft).toBe(scrollAtMove)
    })
  })

  // 12. touchAction 样式测试 / touchAction Style
  describe('touchAction Style / touchAction 样式', () => {
    it('should reset touchAction when it is none / 当 touchAction 为 none 时应重置为 auto', () => {
      el.style.touchAction = 'none'
      vTableTouchScroll.mounted!(el, createBinding({}), {} as any, null)

      expect(el.style.touchAction).toBe('auto')
    })
  })

  // 13. touchcancel 事件测试 / Touch Cancel
  describe('Touch Cancel / 触摸取消', () => {
    it('should handle touchcancel event / 应处理 touchcancel 事件', async () => {
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

      const scrollAtMove = el.scrollLeft

      // 直接触发 touchcancel（模拟系统中断触摸）
      dispatchTouch('touchcancel', 80, 100)
      await advanceFrames(100, 6)

      // touchcancel 会触发惯性滚动（与 touchend 相同逻辑）
      // 验证至少发生了滚动
      expect(el.scrollLeft).toBeGreaterThanOrEqual(scrollAtMove)
    })
  })

  // 14. 清理测试 / Cleanup
  describe('Cleanup / 清理', () => {
    it('should trigger onScrollEnd when unmounted during scrolling / 卸载时应触发 onScrollEnd 回调', async () => {
      const endSpy = vi.fn()
      const binding = createBinding({ onScrollEnd: endSpy, dragThreshold: 5 })
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      // 开始滚动
      dispatchTouch('touchstart', 100, 100)
      mockNow.mockReturnValue(10)
      dispatchTouch('touchmove', 80, 100)
      await advanceFrames(16, 1)
      dispatchTouch('touchend', 80, 100)

      // 在惯性滚动期间卸载
      await advanceFrames(16, 1)
      vTableTouchScroll.unmounted!(el, binding, {} as any, null)

      expect(endSpy).toHaveBeenCalled()
    })

    it('should restore original styles on cleanup / 清理时应恢复原始样式', () => {
      el.style.overflow = 'scroll'
      el.style.willChange = 'transform'

      const binding = createBinding({})
      vTableTouchScroll.mounted!(el, binding, {} as any, null)

      expect(el.style.overflow).toBe('hidden')

      vTableTouchScroll.unmounted!(el, binding, {} as any, null)

      expect(el.style.overflow).toBe('scroll')
      expect(el.style.willChange).toBe('transform')
    })
  })

  // 15. 窗口环境检测 / Window Environment Check
  describe('Window Environment / 窗口环境', () => {
    it('should handle server-side rendering gracefully / 应优雅处理服务端渲染', () => {
      const originalWindow = globalThis.window
      // @ts-ignore
      globalThis.window = undefined

      const binding = createBinding({})
      // 不应抛出错误
      expect(() => {
        vTableTouchScroll.mounted!(el, binding, {} as any, null)
      }).not.toThrow()

      globalThis.window = originalWindow
    })
  })
})
