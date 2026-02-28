/**
 * 基礎 API 實例
 * 自動帶入 baseURL 和 Authorization header
 * 在所有 composables/api/*.ts 中使用
 */
export function useApi() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (authStore.token) {
        options.headers = new Headers(options.headers as HeadersInit)
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
    },
  })
}
