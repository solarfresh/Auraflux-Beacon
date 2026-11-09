import VConceptualEdge from '@auraflux/design-system/components/organisms/canvases/VConceptualEdge.vue';
import { Position } from '@vue-flow/core';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('VConceptualEdge', () => {
  it('should render correctly when selected is false', () => {
    const wrapper = mount(VConceptualEdge as any, {
      props: {
        id: 'e1',
        source: '1',
        target: '2',
        sourceNode: { id: '1', label: 'Node 1', type: 'CONCEPT' },
        targetNode: { id: '2', label: 'Node 2', type: 'CONCEPT' },
        type: 'default',
        markerStart: '',
        markerEnd: '',
        events: {},
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

  it('should render correctly when selected is true', () => {
    const wrapper = mount(VConceptualEdge as any, {
      props: {
        id: 'e1',
        source: '1',
        target: '2',
        sourceNode: { id: '1', label: 'Node 1', type: 'CONCEPT' },
        targetNode: { id: '2', label: 'Node 2', type: 'CONCEPT' },
        type: 'default',
        markerStart: '',
        markerEnd: '',
        events: {},
        sourceX: 0,
        sourceY: 0,
        targetX: 100,
        targetY: 100,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        selected: true,
        data: {
          type: 'LINK',
          status: 'DRAFT',
          weight: 1,
          evidence: 'Evidence text'
        }
      },
      global: {
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
