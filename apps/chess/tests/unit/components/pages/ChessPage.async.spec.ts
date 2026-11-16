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

import ChessPage from '@/components/pages/ChessPage.vue';
import { canvasService } from '@/services/canvasService';
import VConceptualMapCanvas from '@auraflux/design-system/components/organisms/canvases/VConceptualMapCanvas.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ChessPage.async.spec.ts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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

    expect(vm.selectedNode.label).toBe('C1');
    consoleErrorSpy.mockRestore();
  });

  it('should debounce node drag stop events and trigger batch update', async () => {
    vi.mocked(canvasService.batchUpdateNodePositions).mockResolvedValueOnce(true);

    const wrapper = mount(ChessPage, {
      global: {
        stubs: {
          ...defaultStubs,
          VConceptualMapCanvas: {
            template: '<div @node-drag-stop="$emit(\'node-drag-stop\', { id: \'1\', position: { x: 50, y: 50 } })"></div>'
          }
        }
      }
    });

    await wrapper.vm.$nextTick();

    const canvas = wrapper.findComponent(VConceptualMapCanvas);
    expect(canvas.exists()).toBe(true);

    canvas.vm.$emit('node-drag-stop', { id: '1', position: { x: 10, y: 10 } });
    canvas.vm.$emit('node-drag-stop', { id: '1', position: { x: 20, y: 20 } });
    canvas.vm.$emit('node-drag-stop', { id: '1', position: { x: 50, y: 50 } });

    expect(canvasService.batchUpdateNodePositions).not.toHaveBeenCalled();

    // Use explicit advance timers and trigger flush
    vi.runAllTimers();
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(canvasService.batchUpdateNodePositions).toHaveBeenCalledTimes(1);
  });
});

