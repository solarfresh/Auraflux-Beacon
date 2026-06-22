import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Position } from '@vue-flow/core'
import { ConceptualMapContextKey } from '@/constants/injection-keys'
import type { ConceptualEdge } from '@/interfaces/conceptual-map'

// Import centralized testing infrastructure mocks
import {
  mockVueFlowCore,
  mockGraphNode,
  mockEdgeEvents
} from '@/tests/mocks/vue-flow'
import { createMockCanvasContext } from '@/tests/mocks/canvas-context'
import VConceptualEdge from '@/components/organisms/canvases/VConceptualEdge.vue'

// Initialize global Vue Flow API routing intercepts
mockVueFlowCore()

describe('VConceptualEdge.vue', () => {
  let contextMock: any

  // Define global component stubs to bypass rendering noise from nested dependencies
  const globalStubs = {
    VBox: { template: '<div class="v-box-stub"><slot /></div>' },
    VCluster: { template: '<div class="v-cluster-stub"><slot /></div>' },
    VIcon: { template: '<i class="v-icon-stub"></i>' },
    VTypography: { template: '<span class="v-typography-stub"><slot /></span>' },
    VBadge: { template: '<span class="v-badge-stub"><slot /></span>' },
    VEntityCanvasQuickActions: { template: '<div class="quick-actions-stub"></div>' }
  }

  const factory = (propsData = {}) => {
    return mount(VConceptualEdge, {
      props: {
        // --- 1. Vue Flow Core Required Attributes ---
        id: 'edge-123',
        source: 'node-source',
        target: 'node-target',
        sourceNode: mockGraphNode,
        targetNode: mockGraphNode,
        sourceX: 0,
        sourceY: 0,
        targetX: 300,
        targetY: 300,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: 'custom',
        markerStart: '',
        markerEnd: '',
        events: mockEdgeEvents,

        // --- 2. Auraflux Custom Domain Payload (ConceptualEdge) ---
        data: {
          id: 'edge-123',
          source: 'node-source',
          target: 'node-target',
          type: 'LINK',
          status: 'USER_DRAFT',
          weight: 1.0,
          label: 'Test Edge Link'
        } as ConceptualEdge,

        ...propsData
      },
      global: {
        provide: {
          [ConceptualMapContextKey as any]: contextMock
        },
        stubs: globalStubs
      }
    })
  }

  beforeEach(() => {
    // Spin up a fresh sandbox context before each test to guarantee mutation isolation
    contextMock = createMockCanvasContext()
  })

  describe('Architectural Integrity', () => {
    it('should throw an explicit error if rendered outside of a ConceptualMapCanvas provider tree', () => {
      // Suppress console error output momentarily during purposeful crash evaluation
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        mount(VConceptualEdge, {
          props: {
            id: 'edge-err',
            source: 'node-source',
            target: 'node-target',
            sourceNode: mockGraphNode,
            targetNode: mockGraphNode,
            sourceX: 0, sourceY: 0, targetX: 100, targetY: 100,
            sourcePosition: Position.Right, targetPosition: Position.Left,
            type: 'custom',
            markerStart: '',
            markerEnd: '',
            events: mockEdgeEvents,
            data: {
              id: 'edge-err',
              source: 'node-source',
              target: 'node-target',
              type: 'REF',
              status: 'USER_DRAFT',
              weight: 1.0
            } as ConceptualEdge
          },
          global: { stubs: globalStubs }
        })
      }).toThrowError('[Architectural Violation] VConceptualEdge must be rendered within the tree of a <ConceptualMapCanvas>.')

      consoleSpy.mockRestore()
    })
  })

  describe('Adaptive Geometry Routing Strategies', () => {
    it('should fall back to getStraightPath routing mechanics when nodes are tightly adjacent (< 120px)', () => {
      // Place target node coordinates closely to fallback threshold
      const wrapper = factory({
        targetX: 50,
        targetY: 50
      })

      // Path data returned from getStraightPath stub is 'M 0 0 L 100 100'
      expect(wrapper.find('.v-conceptual-edge').attributes('path')).toBe('M 0 0 L 100 100')
    })

    it('should utilize getSmoothStepPath layout orchestration under normal distances', () => {
      const wrapper = factory({
        targetX: 400,
        targetY: 400
      })

      // Path data returned from getSmoothStepPath stub is 'M 0 0 H 50 V 100 H 100'
      expect(wrapper.find('.v-conceptual-edge').attributes('path')).toBe('M 0 0 H 50 V 100 H 100')
    })
  })

  describe('Context-Driven Toolbars & Proposal Modals', () => {
    it('should render the "Connect?" onboarding pill for unselected AI suggested proposals', () => {
      const wrapper = factory({
        selected: false,
        data: {
          id: 'edge-123', source: 'node-source', target: 'node-target', weight: 1.0,
          status: 'AI_EXTRACTED', type: 'LINK'
        } as ConceptualEdge
      })

      expect(wrapper.html()).toContain('Connect?')
      expect(wrapper.find('.v-conceptual-edge').classes()).toContain('suggested-glow-animation')
    })

    it('should toggle and mount VEntityCanvasQuickActions panel when edge is explicitly selected', () => {
      contextMock.isNodeEditActive.value = false
      const wrapper = factory({
        selected: true,
        data: {
          id: 'edge-123', source: 'node-source', target: 'node-target', weight: 1.0,
          status: 'AI_EXTRACTED', type: 'LINK'
        } as ConceptualEdge
      })

      // Action group should supersede the "Connect?" standalone pill when active
      expect(wrapper.findComponent({ name: 'VEntityCanvasQuickActions' }).exists()).toBe(true)
      expect(wrapper.html()).not.toContain('Connect?')
    })
  })

  describe('Interactive Gesture Dispatches', () => {
    it('should proxy midpoint label double-click events directly into the map interceptor layer', async () => {
      const wrapper = factory({
        data: {
          id: 'edge-123', source: 'node-source', target: 'node-target', weight: 1.0,
          status: 'LOCKED', type: 'LINK'
        } as ConceptualEdge
      })

      // Simulate a user double-clicking the label container region
      await wrapper.find('.nodrag').trigger('dblclick')

      // Assert that midpoints injected via mocking are bridged correctly to the open command
      expect(contextMock.openInterceptor).toHaveBeenCalledWith(
        null,
        { x: 50, y: 50 }, // Spatial values emitted from global path mock stubs
        expect.objectContaining({ id: 'edge-123' })
      )
    })
  })

  describe('Dynamic Badge and Stroke Theming Matrix', () => {
    it('should assign appropriate color variants matching backend semantics data definitions', () => {
      const wrapper = factory({
        data: {
          id: 'edge-123', source: 'node-source', target: 'node-target', weight: 1.0,
          status: 'LOCKED', type: 'TRIGGERS'
        } as ConceptualEdge
      })

      const badge = wrapper.findComponent({ name: 'VBadge' })
      expect(badge.exists()).toBe(true)
      expect(wrapper.text()).toContain('TRIGGERS')
    })
  })
})