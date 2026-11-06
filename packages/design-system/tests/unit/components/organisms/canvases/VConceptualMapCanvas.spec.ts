import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import VConceptualMapCanvas from '@auraflux/design-system/components/organisms/canvases/VConceptualMapCanvas.vue';

describe('ConceptualMapCanvas.vue', () => {
  it('renders correctly with nodes and edges', () => {
    const warnSpy = vi.spyOn(console, 'warn');
    const wrapper = mount(VConceptualMapCanvas, {
      props: {
        nodes: [{ id: '1', label: 'Test', type: 'CONCEPT' }],
        edges: []
      }
    });
    expect(wrapper.find('.conceptual-map-canvas').exists()).toBe(true);

    const warningCalls = warnSpy.mock.calls.filter(call =>
      call[0].toString().includes('The Vue Flow parent container needs a width and a height')
    );
    expect(warningCalls.length).toBe(1);
    warnSpy.mockRestore();
  });
});

