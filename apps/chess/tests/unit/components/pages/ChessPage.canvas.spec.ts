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
});
