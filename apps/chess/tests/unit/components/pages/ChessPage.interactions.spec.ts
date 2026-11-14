import { defaultStubs, mockConceptualMapContext } from './ChessPage.setup';

import ChessPage from '@/components/pages/ChessPage.vue';
import { ConceptualNode } from '@auraflux/design-system/interfaces/conceptual-map';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('ChessPage.interactions.spec.ts', () => {
  it('selects and deselects nodes correctly', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;

    vm.selectNode({ id: '1' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');
    expect(mockConceptualMapContext.isNodeSelected('1')).toBe(true);

    mockConceptualMapContext.deselectAllNodes();
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);
    expect(mockConceptualMapContext.isNodeSelected('1')).toBe(false);
  });

  it('handles non-existent node selection gracefully', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;

    vm.selectNode({ id: 'non-existent' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('non-existent');
    expect(vm.selectedNode).toBe(null);
  });

  it('handles edge selection and mutual exclusion with node selection in ChessPage', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;

    vm.selectNode({ id: '1' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');

    vm.selectEdge({ id: 'e1-2' });
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe('e1-2');
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);

    vm.selectNode({ id: '2' });
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('2');
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe(null);

    vm.deselectAll();
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe(null);
  });

  it('controls panel expansion based on node selection and pane clicks', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;

    expect(vm.isPanelExpanded).toBe(true);

    vm.deselectAllAndClosePanel();
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(false);

    mockConceptualMapContext.selectNode('1');
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(true);
  });

  it('toggles panel expansion via collapse button', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;

    vm.isPanelExpanded = false;
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(false);

    vm.isPanelExpanded = true;
    await wrapper.vm.$nextTick();
    expect(vm.isPanelExpanded).toBe(true);
  });

  it('removes selected node and cascades edge removal via keyboard shortcut', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    mockConceptualMapContext.instance.conceptualNodes.set('1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualNodes.set('2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'LINK', weight: 1 }];

    mockConceptualMapContext.selectNode('1');
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(true);
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(1);

    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(deleteEvent);
    await wrapper.vm.$nextTick();

    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(false);
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(0);
    expect(mockConceptualMapContext.selectedNodeId.value).toBe(null);
  });

  it('removes selected edge via keyboard shortcut without affecting nodes', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    mockConceptualMapContext.instance.conceptualNodes.set('1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualNodes.set('2', { id: '2', type: 'CONCEPT', label: 'C2', position: { x: 10, y: 10 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.instance.conceptualEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'LINK', weight: 1 }];

    mockConceptualMapContext.selectEdge('e1-2');
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe('e1-2');
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(1);

    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(deleteEvent);
    await wrapper.vm.$nextTick();

    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(0);
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(true);
    expect(mockConceptualMapContext.instance.conceptualNodes.has('2')).toBe(true);
    expect(mockConceptualMapContext.selectedEdgeId.value).toBe(null);
  });

  it('guards against node deletion when typing inside input or textarea', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    mockConceptualMapContext.instance.conceptualNodes.set('1', { id: '1', type: 'CONCEPT', label: 'C1', position: { x: 0, y: 0 }, status: 'ACTIVE' } as ConceptualNode);
    mockConceptualMapContext.selectNode('1');

    const input = document.createElement('input');
    document.body.appendChild(input);

    const deleteEvent = new KeyboardEvent('keydown', { key: 'Delete' });
    Object.defineProperty(deleteEvent, 'target', { value: input, enumerable: true });

    window.dispatchEvent(deleteEvent);
    await wrapper.vm.$nextTick();

    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(true);
    expect(mockConceptualMapContext.selectedNodeId.value).toBe('1');

    document.body.removeChild(input);
  });
});
