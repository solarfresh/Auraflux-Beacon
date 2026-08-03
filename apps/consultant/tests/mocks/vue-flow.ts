import { vi } from 'vitest'

export const mockGraphNode = {
  id: 'mock-node-id',
  type: 'custom',
  position: { x: 0, y: 0 },
  dimensions: { width: 100, height: 100 },
  computedPosition: { x: 0, y: 0 },
  handleBounds: { source: [], target: [] },
  data: {},
} as any

export const mockEdgeEvents = {
  click: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  doubleClick: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  mouseEnter: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  mouseMove: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  mouseLeave: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  contextMenu: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  updateStart: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  update: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
  updateEnd: { on: vi.fn(), off: vi.fn(), trigger: vi.fn() },
} as any

/**
 * Centralized mock for @vue-flow/core to isolate visual geometric
 * calculations from memory-based unit testing environments.
 */
export const mockVueFlowCore = () => {
  vi.mock('@vue-flow/core', () => ({
    // Stubs for internal structural wrappers
    BaseEdge: {
      template: '<div class="base-edge-stub" :id="id"><slot /></div>',
      props: ['id', 'path', 'markerEnd', 'style']
    },
    EdgeLabelRenderer: {
      template: '<div class="label-renderer-stub"><slot /></div>'
    },

    // Geometric path mathematical calculators
    getStraightPath: vi.fn((info) => ['M 0 0 L 100 100', 50, 50]),
    getBezierPath: vi.fn((info) => ['M 0 0 C 25 25, 75 75, 100 100', 50, 50]),
    getSmoothStepPath: vi.fn((info) => ['M 0 0 H 50 V 100 H 100', 50, 50]),

    // Structural coordinate vectors
    Position: {
      Right: 'right',
      Left: 'left',
      Top: 'top',
      Bottom: 'bottom'
    }
  }))
}