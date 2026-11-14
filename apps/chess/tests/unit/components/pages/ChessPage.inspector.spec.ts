import { mockConceptualMapContext } from './ChessPage.setup';

import ChessPage from '@/components/pages/ChessPage.vue';
import { canvasService } from '@/services/canvasService';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('ChessPage.inspector.spec.ts', () => {
  it('renders horizontal dual-pane layout and renders VInspectorPanel', async () => {
    mockConceptualMapContext.selectedNodeId.value = '1';
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
          VInspectorPanel: {
            template: '<aside class="inspector-panel"><slot /></aside>',
            props: ['isExpanded']
          }
        },
      },
    });

    const mainContainer = wrapper.find('.flex-row');
    expect(mainContainer.exists()).toBe(true);
    expect(wrapper.find('aside.inspector-panel').exists()).toBe(true);
  });

  it('renders VEdgeInspectorPanel when edge is selected', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    expect(wrapper.findComponent({ name: 'VEdgeInspectorPanel' }).exists()).toBe(false);

    mockConceptualMapContext.selectEdge('e1-2');
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ name: 'VEdgeInspectorPanel' }).exists()).toBe(true);
  });

  it('updates edge properties when VEdgeInspectorPanel emits update:edge', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: true,
          VEdgeInspectorPanel: true,
        },
      },
    });

    const vm = wrapper.vm as any;
    vm.instance.conceptualEdges.push({
      id: 'e1-2',
      source: '1',
      target: '2',
      weight: 1,
      type: 'LINK'
    });

    mockConceptualMapContext.selectEdge('e1-2');
    await wrapper.vm.$nextTick();

    const inspector = wrapper.findComponent({ name: 'VEdgeInspectorPanel' });
    const updatedEdgeData = { id: 'e1-2', weight: 3, type: 'ASSOCIATION' };
    inspector.vm.$emit('update:edge', updatedEdgeData);
    await wrapper.vm.$nextTick();

    expect(vm.selectedEdge.weight).toBe(3);
    expect(vm.selectedEdge.type).toBe('ASSOCIATION');
  });

  it('duplicates node and deletes node/edge via inspector panel events', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          Background: true,
          Controls: true,
          MiniMap: true,
          VNodeInspectorPanel: {
            template: '<div><button class="dup-btn" @click="$emit(\'duplicate:node\', node)"></button><button class="del-btn" @click="$emit(\'delete:node\', node.id)"></button></div>',
            props: ['node']
          },
          VEdgeInspectorPanel: {
            template: '<div><button class="del-edge-btn" @click="$emit(\'delete:edge\', edge.id)"></button></div>',
            props: ['edge']
          },
        },
      },
    });

    mockConceptualMapContext.selectNode('1');
    await wrapper.vm.$nextTick();
    await wrapper.find('.dup-btn').trigger('click');
    expect(mockConceptualMapContext.addNode).toHaveBeenCalled();

    await wrapper.find('.del-btn').trigger('click');
    expect(mockConceptualMapContext.instance.conceptualNodes.has('1')).toBe(false);

    mockConceptualMapContext.selectEdge('e1-2');
    mockConceptualMapContext.instance.conceptualEdges = [{ id: 'e1-2', source: '2', target: '2', type: 'LINK', weight: 1 }];
    await wrapper.vm.$nextTick();
    await wrapper.find('.del-edge-btn').trigger('click');
    expect(mockConceptualMapContext.instance.conceptualEdges.length).toBe(0);
  });

  it('updates node label successfully via updateNode (Merged)', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          VueFlow: true,
          VNodeInspectorPanel: {
            template: `
              <div class="inspector">
                <input class="label-input" :value="node ? node.label : ''" @blur="$emit('update:node', { ...node, label: $event.target.value })" />
              </div>`,
            props: ['node']
          }
        }
      }
    });

    const vm = wrapper.vm as any;

    mockConceptualMapContext.selectNode('1');
    await wrapper.vm.$nextTick();
    expect(vm.selectedNode).not.toBeNull();
    expect(vm.selectedNodeId).toBe('1');

    const input = wrapper.find('.label-input');
    await input.setValue('Updated Conceptual Node');
    await input.trigger('blur');

    expect(canvasService.updateNode).toHaveBeenCalled();
    expect(canvasService.updateNode).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ label: 'Updated Conceptual Node' }),
      expect.objectContaining({ label: 'C1' }),
      expect.anything()
    );
  });
});
