import { defaultStubs, mockConceptualMapContext } from './ChessPage.setup';

import ChessPage from '@/components/pages/ChessPage.vue';
import { canvasService } from '@/services/canvasService';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('ChessPage.canvas.spec.ts', () => {

  it('updates node position with default {x:0, y:0} when drag event has invalid position', async () => {
    const wrapper = mount(ChessPage, {
      global: {
        stubs: defaultStubs,
      },
    });

    const vm = wrapper.vm as any;

    vm.onNodeDragStop({ id: '1', position: null });

    await wrapper.vm.$nextTick();

    expect(mockConceptualMapContext.updateNode).toHaveBeenCalledWith('1', { position: { x: 0, y: 0 } });
  });
});
