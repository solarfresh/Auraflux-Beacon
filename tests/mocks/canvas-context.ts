import { vi } from 'vitest'
import { ref } from 'vue'

/**
 * Generates a mock structure conforming to the ConceptualMapContext
 * to fullfill component injection key contracts during mount workflows.
 */
export const createMockCanvasContext = (overrides = {}) => {
  return {
    isNodeEditActive: ref(false),
    viewport: {
      zoom: 1,
      x: 0,
      y: 0
    },
    conceptualEdges: ref([
      { id: 'edge-1', status: 'AI_EXTRACTED', type: 'LINK' },
      { id: 'edge-2', status: 'LOCKED', type: 'TRIGGERS' }
    ]),
    openInterceptor: vi.fn(),
    updateConceptualMapEdge: vi.fn().mockResolvedValue(true),
    ...overrides
  }
}