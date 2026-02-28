export function useFavoritesApi() {
  const $api = useApi()

  return {
    getAll: () =>
      $api('/favorites'),

    check: (productId: number | string) =>
      $api(`/favorites/check/${productId}`),

    add: (productId: number | string) =>
      $api('/favorites', { method: 'POST', body: { productId } }),

    remove: (productId: number | string) =>
      $api(`/favorites/${productId}`, { method: 'DELETE' }),
  }
}
