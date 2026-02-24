import { ref } from 'vue'

/**
 * Lightweight stubs for Nuxt composables used in unit tests.
 * These replace the real Nuxt implementations to avoid requiring
 * the full Nuxt runtime when running Vitest.
 */

export function useState<T>(key: string, init?: () => T) {
  return ref<T>(init ? init() : (undefined as unknown as T))
}

export function useCookie<T>(key: string, options?: { default?: () => T; [k: string]: unknown }) {
  return ref<T>(options?.default?.() ?? (null as unknown as T))
}
