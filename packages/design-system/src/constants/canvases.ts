import { markRaw } from 'vue';
import VConceptualEdge from '@auraflux/design-system/components/organisms/canvases/VConceptualEdge.vue';
import VConceptualNode from '@auraflux/design-system/components/organisms/canvases/VConceptualNode.vue';
import type { NodeType, EdgeType } from '@auraflux/design-system/interfaces/conceptual-map';

export const nodeTypes: Record<NodeType, any> = {
  EVENT: markRaw(VConceptualNode),
  OUTCOME: markRaw(VConceptualNode),
  BOUNDARY: markRaw(VConceptualNode),
  ENTITY: markRaw(VConceptualNode),
  FOCUS: markRaw(VConceptualNode),
  RESOURCE: markRaw(VConceptualNode),
  CONCEPT: markRaw(VConceptualNode),
  INSIGHT: markRaw(VConceptualNode),
  QUERY: markRaw(VConceptualNode),
  NAVIGATION: markRaw(VConceptualNode),
  GROUP: markRaw(VConceptualNode),
};

export const edgeTypes: Record<EdgeType, any> = {
  VALIDATES: markRaw(VConceptualEdge),
  CONSTRAINS: markRaw(VConceptualEdge),
  TRIGGERS: markRaw(VConceptualEdge),
  REF: markRaw(VConceptualEdge),
  LINK: markRaw(VConceptualEdge),
};
