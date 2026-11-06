import type { CanvasViewInstance } from '@auraflux/design-system/interfaces/conceptual-map';
import type { ConceptualMapContext } from '@auraflux/shared-core/interfaces/conceptual-map';
import type { InjectionKey } from 'vue';

export const DEFAULT_CONCEPTUAL_MAP_CONTEXT: ConceptualMapContext = {
  instance: {
    conceptualNodes: new Map(),
    conceptualEdges: [],
    isDragging: false,
    isDragOver: false,
    draggedNode: null,
    isInterceptionActive: false,
    interceptorAction: '',
    interceptorPosition: { x: 0, y: 0 },
    pendingConnection: null,
    localEdgeData: { id: '', source: '', target: '', type: 'LINK', weight: 1 },
    viewport: { x: 0, y: 0, zoom: 1 }
  },
  addNode: () => {},
  removeNode: () => {},
  updateNode: () => {},
  addEdge: () => {}
};

export const ConceptualMapContextKey: InjectionKey<ConceptualMapContext> = Symbol('ConceptualMapContext');
