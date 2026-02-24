import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from '../App.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

describe('App', () => {
  it('mounts without error', () => {
    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
