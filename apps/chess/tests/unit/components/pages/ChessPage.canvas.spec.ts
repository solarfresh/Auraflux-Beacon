import { defaultStubs, mockConceptualMapContext } from './ChessPage.setup';

import ChessPage from '@/components/pages/ChessPage.vue';
import { canvasService } from '@/services/canvasService';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('ChessPage.canvas.spec.ts', () => {

  it('queues node position on drag stop', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;
    const node = { id: '1', position: { x: 100, y: 100 } };

    vm.onNodeDragStop(node);

    expect(mockConceptualMapContext.queueNodePosition).toHaveBeenCalledWith('1', { x: 100, y: 100 });
  });

  it('calls canvasService and context on edge deletion', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;
    const edgeId = 'edge-1';

    vi.spyOn(canvasService, 'deleteEdge').mockResolvedValue(true);

    await vm.onDeleteEdge(edgeId);

    expect(canvasService.deleteEdge).toHaveBeenCalledWith(edgeId, expect.anything(), expect.anything(), expect.anything());
  });

  it('calls canvasService and context on node deletion', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;
    const nodeId = '1';

    vi.spyOn(canvasService, 'deleteNode').mockResolvedValue(true);
    mockConceptualMapContext.removeNode = vi.fn();

    await vm.onDeleteNode(nodeId);

    expect(canvasService.deleteNode).toHaveBeenCalledWith(nodeId, expect.anything(), expect.anything(), expect.anything());
  });
});
