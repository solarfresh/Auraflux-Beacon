export { ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import type { NodeType, Point2D } from '@auraflux/design-system/interfaces/conceptual-map';

export interface CreateNodeRequest {
  label: string;
  type: NodeType;
  position: Point2D;
  content?: string;
}
