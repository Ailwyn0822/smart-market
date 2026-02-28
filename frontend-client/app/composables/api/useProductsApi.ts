export function useProductsApi() {
  const $api = useApi()

  return {
    getAll: (params?: Record<string, any>) =>
      $api('/products', { params }),

    getLatest: () =>
      $api('/products/latest'),

    getById: (id: number | string) =>
      $api(`/products/${id}`),

    getMyListings: () =>
      $api('/products/my-listings'),

    create: (body: object) =>
      $api('/products', { method: 'POST', body }),

    toggleActiveStatus: (id: number | string, body: { isActive: boolean }) =>
      $api(`/products/${id}/active_status`, { method: 'PATCH', body }),

    analyze: (formData: FormData) =>
      $api('/products/analyze', { method: 'POST', body: formData }),
  }
}
