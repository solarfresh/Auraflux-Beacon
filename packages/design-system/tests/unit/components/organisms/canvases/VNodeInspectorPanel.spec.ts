import VNodeInspectorPanel from '@auraflux/design-system/components/organisms/canvases/VNodeInspectorPanel.vue';
import VActionGroup from '@auraflux/design-system/components/organisms/navs/VActionGroup.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('VNodeInspectorPanel', () => {
  it('renders correctly with a node', () => {
    const node = { id: '1', label: 'Test Node', type: 'CONCEPT' as const, status: 'DRAFT' as const, content: 'Test Content', rationale: 'Test Rationale' };
    const wrapper = mount(VNodeInspectorPanel, {
      props: { node },
      global: {
        stubs: {
          VFormField: { template: '<div><slot /></div>' },
          VInput: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          VSelect: {
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>',
            props: ['modelValue']
          },
          VTextarea: {
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
            props: ['modelValue']
          },
          VButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          VBox: { template: '<div><slot /></div>' },
          VEmptyState: { template: '<div class="empty-state">{{ title }}</div>', props: ['title', 'description', 'icon'] }
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('renders placeholder when node is null', () => {
    const wrapper = mount(VNodeInspectorPanel, {
      props: { node: null },
      global: {
        stubs: {
          VFormField: true,
          VInput: true,
          VSelect: true,
          VTextarea: true,
          VButton: true,
          VBox: { template: '<div><slot /></div>' },
          VEmptyState: { template: '<div class="empty-state">{{ title }}</div>', props: ['title', 'description', 'icon'] }
        }
      }
    });
    expect(wrapper.text()).toContain('No Node Selected');
  });

  it('emits update:node when updated', async () => {
    const node = { id: '1', label: 'Test Node', type: 'CONCEPT' as const, status: 'DRAFT' as const, content: 'Test Content', rationale: 'Test Rationale' };
    const wrapper = mount(VNodeInspectorPanel, {
      props: { node },
      global: {
        stubs: {
          VFormField: { template: '<div><slot /></div>' },
          VInput: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          VSelect: {
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><slot /></select>',
            props: ['modelValue']
          },
          VTextarea: {
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
            props: ['modelValue']
          },
          VButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          VBox: { template: '<div><slot /></div>' },
          VEmptyState: true
        }
      }
    });

    const input = wrapper.find('input');
    await input.setValue('Updated Node');

    const textarea = wrapper.find('textarea');
    await textarea.setValue('Updated Content');

    const button = wrapper.find('button');
    await button.trigger('click');

    const events = wrapper.emitted('update:node');
    expect(events).toBeTruthy();
    const emittedNode = (events as any)[0][0];
    expect(emittedNode.label).toBe('Updated Node');
    expect(emittedNode.content).toBe('Updated Content');
  });

  it('does not emit update:node when label is empty', async () => {
    const node = { id: '1', label: 'Test Node', type: 'CONCEPT' as const };
    const wrapper = mount(VNodeInspectorPanel, {
      props: { node },
      global: {
        stubs: {
          VFormField: { template: '<div><slot /></div>' },
          VInput: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          VSelect: true,
          VTextarea: true,
          VButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          VBox: { template: '<div><slot /></div>' },
          VEmptyState: true
        }
      }
    });

    const input = wrapper.find('input');
    await input.setValue('');

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.emitted('update:node')).toBeFalsy();
  });

  it('emits duplicate:node and delete:node when buttons are clicked', async () => {
    const node = { id: '1', label: 'Test Node', type: 'CONCEPT' as const, status: 'DRAFT' as const };
    const wrapper = mount(VNodeInspectorPanel, {
      props: { node },
      global: {
        stubs: {
          VFormField: { template: '<div><slot /></div>' },
          VInput: true,
          VSelect: true,
          VTextarea: true,
          VButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
          VBox: { template: '<div><slot /></div>' },
          VCluster: { template: '<div><slot /></div>' },
          VEmptyState: true
        }
      }
    });

    const buttons = wrapper.findAll('button');
    await buttons[1].trigger('click');
    expect(wrapper.emitted('duplicate:node')).toBeTruthy();
    expect(wrapper.emitted('duplicate:node')![0][0]).toEqual(node);

    await buttons[2].trigger('click');
    expect(wrapper.emitted('delete:node')).toBeTruthy();
    expect(wrapper.emitted('delete:node')![0][0]).toEqual('1');
  });

  it('renders VActionGroup and supports action events correctly', async () => {
    const node = { id: '1', label: 'Action Node', type: 'CONCEPT' as const, status: 'DRAFT' as const };
    const wrapper = mount(VNodeInspectorPanel, {
      props: { node },
      global: {
        stubs: {
          VFormField: { template: '<div><slot /></div>' },
          VInput: true,
          VSelect: true,
          VTextarea: true,
          VBox: { template: '<div><slot /></div>' },
          VCluster: { template: '<div><slot /></div>' },
          VEmptyState: true
        }
      }
    });

    const actionGroup = wrapper.findComponent(VActionGroup);
    expect(actionGroup.exists()).toBe(true);
    const actionsProp = actionGroup.props('actions') as any[];
    expect(actionsProp.length).toBe(3);
    expect(actionsProp[0].id).toBe('update');
    expect(actionsProp[1].id).toBe('duplicate');
    expect(actionsProp[2].id).toBe('delete');

    await actionGroup.vm.$emit('action', 'update');
    expect(wrapper.emitted('update:node')).toBeTruthy();
  });

  it('disables update action when label becomes empty (Edge Case)', async () => {
    const node = { id: '1', label: 'Valid Label', type: 'CONCEPT' as const, status: 'DRAFT' as const };
    const wrapper = mount(VNodeInspectorPanel, {
      props: { node },
      global: {
        stubs: {
          VFormField: { template: '<div><slot /></div>' },
          VInput: {
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue']
          },
          VSelect: true,
          VTextarea: true,
          VBox: { template: '<div><slot /></div>' },
          VCluster: { template: '<div><slot /></div>' },
          VEmptyState: true
        }
      }
    });

    const input = wrapper.find('input');
    await input.setValue('');

    const actionGroup = wrapper.findComponent(VActionGroup);
    const actionsProp = actionGroup.props('actions') as any[];
    const updateAction = actionsProp.find(a => a.id === 'update');
    expect(updateAction.disabled).toBe(true);
  });
});
