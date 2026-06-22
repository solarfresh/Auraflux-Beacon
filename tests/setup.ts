import { config } from '@vue/test-utils'
import { vi } from 'vitest'

/**
 * Polyfill for ResizeObserver which is essential for Vue Flow layouts
 * but absent in standard jsdom environments.
 */
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

/**
 * Safe Polyfill for DOMMatrix.
 * Must include both 2D (a-f) and 3D (m11-m44) properties to prevent
 * matrix-calculators inside UI libraries from falling into infinite loops.
 */
global.DOMMatrix = vi.fn().mockImplementation(() => {
  const matrix = {
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
    m11: 1, m12: 0, m13: 0, m14: 0,
    m21: 0, m22: 1, m23: 0, m24: 0,
    m31: 0, m32: 0, m33: 1, m34: 0,
    m41: 0, m42: 0, m43: 0, m44: 1,
    multiply: vi.fn().mockImplementation(() => matrix),
    translate: vi.fn().mockImplementation(() => matrix),
    scale: vi.fn().mockImplementation(() => matrix),
    transformPoint: vi.fn().mockImplementation(() => ({ x: 0, y: 0 })),
  }
  return matrix
}) as any

/**
 * Mock global SVG element methods safely using Object.defineProperty.
 * Avoids prototype pollution that triggers infinite recursions in jsdom.
 */
if (typeof window !== 'undefined') {
  SVGElement.prototype.getBBox = vi.fn().mockReturnValue({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  SVGElement.prototype.getCTM = vi.fn().mockReturnValue({
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
  })

  SVGElement.prototype.getScreenCTM = vi.fn().mockReturnValue({
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
  })

  // 🟢 安全地用 Getter 模擬 ownerSVGElement，絕對不要賦值一個實體 DOM 給 Prototype
  Object.defineProperty(SVGElement.prototype, 'ownerSVGElement', {
    get() {
      return {
        createSVGPoint: vi.fn().mockImplementation(() => ({
          x: 0,
          y: 0,
          matrixTransform: vi.fn().mockImplementation(() => ({ x: 0, y: 0 })),
        }))
      }
    },
    configurable: true,
  })
}

/**
 * Vue Test Utils Global Configuration
 */
config.global.stubs = {}

/**
 * Global Reset Hook
 */
afterEach(() => {
  vi.clearAllMocks()
})