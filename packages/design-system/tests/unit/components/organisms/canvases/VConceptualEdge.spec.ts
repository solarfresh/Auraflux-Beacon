import VConceptualEdge from '@auraflux/design-system/components/organisms/canvases/VConceptualEdge.vue';
import { ConceptualMapContextKey } from '@auraflux/design-system/constants/injection-keys';
import { Position } from '@vue-flow/core';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

describe('VConceptualEdge', () => {
  it('should fallback and render correctly when used without ConceptualMapContext', () => {
    // Suppress console warning/error if any
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const wrapper = mount(VConceptualEdge as any, {
      props: {
        id: 'e1',
        source: '1',
        target: '2',
        sourceX: 0,
        sourceY: 0,
        targetX: 100,
        targetY: 100,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        selected: false,
        data: {
          type: 'LINK',
          status: 'DRAFT',
          weight: 1,
          evidence: 'Evidence text'
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    spy.mockRestore();
  });

  it('should render correctly when provided with valid context', () => {
    const wrapper = mount(VConceptualEdge as any, {
      props: {
        id: 'e1',
        source: '1',
        target: '2',
        sourceX: 0,
        sourceY: 0,
        targetX: 100,
        targetY: 100,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        selected: false,
        data: {
          type: 'LINK',
          status: 'DRAFT',
          weight: 1,
          evidence: 'Evidence text'
        }
      },
      global: {
        provide: {
          [ConceptualMapContextKey]: {
            // Mock context object
          }
        },
        stubs: {
          BaseEdge: true,
          EdgeLabelRenderer: true,
          VBox: true,
          VTypography: true
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
