/**
 * ChessPage.async.spec.ts
 *
 * Purpose:
 * Tests asynchronous behaviors, API interaction handling,
 * and error recovery scenarios for ChessPage.
 *
 * Notes:
 * - Uses shared mocks from ChessPage.setup.ts.
 * - Handles API failure rollbacks and canvas loading errors.
 */

import { defaultStubs } from './ChessPage.setup';

import { canvasService } from '@/services/canvasService';
import ChessPage from '@/components/pages/ChessPage.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('ChessPage.async.spec.ts', () => {
  it('rolls back label on API failure (Edge Case)', async () => {
    vi.mocked(canvasService.updateNode).mockRejectedValueOnce(new Error('API Failure'));

    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          ...defaultStubs,
          VNodeInspectorPanel: {
            template: `
              <div class="inspector">
                <input class="label-input" :value="node.label" @blur="$emit('update:node', { ...node, label: $event.target.value })" />
              </div>`,
            props: ['node']
          }
        }
      }
    });

    const vm = wrapper.vm as any;
    vm.selectNode({ id: '1' });
    await wrapper.vm.$nextTick();

    const input = wrapper.find('.label-input');
    await input.setValue('Attempted Update');

    // Suppress unhandled rejection from the mocked async failure during trigger
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await input.trigger('blur');
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(vm.selectedNode.label).toBe('C1');
    consoleErrorSpy.mockRestore();
  });
});
