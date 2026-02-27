import { config } from '@vue/test-utils'

config.global.stubs = {}

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 16) as unknown as number
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}

Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: () => Date.now(),
  },
})
