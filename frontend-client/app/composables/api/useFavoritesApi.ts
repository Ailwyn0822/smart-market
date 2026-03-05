export function useFavoritesApi() {
  const $api = useApi()

  return {
    getAll: () =>
      $api('/favorites/my'),

    check: (productId: number | string) =>
      $api(`/favorites/check/${productId}`),

    add: (productId: number | string) =>
      $api(`/favorites/${productId}/favorite`, { method: 'POST' }),

    remove: (productId: number | string) =>
      $api(`/favorites/${productId}/favorite`, { method: 'DELETE' }),
  }
}
