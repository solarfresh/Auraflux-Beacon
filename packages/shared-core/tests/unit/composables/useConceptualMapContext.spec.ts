/**
 * @file useConceptualMapContext.spec.ts
 * @description Unit tests for useConceptualMapContext composable in shared-core.
 */

import { describe, it, expect } from 'vitest';
import { useConceptualMapContext } from '@auraflux/shared-core/composables/useConceptualMapContext';

describe('useConceptualMapContext', () => {
  it('should initialize with default empty or base state', () => {
    const { instance } = useConceptualMapContext();
    expect(instance.conceptualNodes).toBeDefined();
    expect(instance.conceptualEdges).toEqual([]);
    expect(instance.isDragging).toBe(false);
  });

  it('should successfully add and remove nodes', () => {
    const { instance, addNode, removeNode } = useConceptualMapContext();
    const testNode = {
      id: 'node-1',
      type: 'CONCEPT',
      position: { x: 100, y: 200 },
      data: { label: 'Test Node', state: 'DRAFT' as const },
    };

    addNode(testNode as any);
    expect(instance.conceptualNodes.size).toBe(1);
    expect(instance.conceptualNodes.get('node-1')).toEqual(testNode);

    removeNode('node-1');
    expect(instance.conceptualNodes.size).toBe(0);
  });

  it('should successfully update existing nodes', () => {
    const { instance, addNode, updateNode } = useConceptualMapContext();
    const testNode = {
      id: 'node-1',
      label: 'Original',
      type: 'CONCEPT'
    };
    const updatedNode = {
      id: 'node-1',
      label: 'Updated',
      type: 'CONCEPT'
    };

    addNode(testNode as any);
    updateNode('node-1', updatedNode as any);
    expect(instance.conceptualNodes.get('node-1')?.label).toBe('Updated');
  });

  it('should successfully add edges', () => {
    const { instance, addEdge } = useConceptualMapContext();
    const testEdge = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'LINK',
    };

    addEdge(testEdge as any);
    expect(instance.conceptualEdges.length).toBe(1);
    expect(instance.conceptualEdges[0]).toEqual(testEdge);
  });
});
