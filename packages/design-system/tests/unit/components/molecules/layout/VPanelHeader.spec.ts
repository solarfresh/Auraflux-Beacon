import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import VPanelHeader from '@auraflux/design-system/components/molecules/layout/VPanelHeader.vue'
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue'

describe('VPanelHeader', () => {
  it('renders title correctly', () => {
    const wrapper = mount(VPanelHeader, {
      props: {
        title: 'Test Panel',
        isExpanded: true
      }
    })
    expect(wrapper.find('.v-panel-title').text()).toBe('Test Panel')
  })

  it('renders empty title correctly', () => {
    const wrapper = mount(VPanelHeader, {
      props: {
        title: '',
        isExpanded: true
      }
    })
    expect(wrapper.find('.v-panel-title').text()).toBe('')
  })

  it('emits toggle event on button click', async () => {
    const wrapper = mount(VPanelHeader, {
      props: {
        title: 'Test Panel',
        isExpanded: true
      },
      global: {
        components: { VButton }
      }
    })
    await wrapper.findComponent(VButton).trigger('click')
    expect(wrapper.emitted()).toHaveProperty('toggle')
  })

  it('updates aria-expanded attribute based on isExpanded prop', async () => {
    const wrapper = mount(VPanelHeader, {
      props: {
        title: 'Test Panel',
        isExpanded: false
      },
      global: {
        components: { VButton }
      }
    })

    expect(wrapper.findComponent(VButton).attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ isExpanded: true })
    expect(wrapper.findComponent(VButton).attributes('aria-expanded')).toBe('true')
  })
})
