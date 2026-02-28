export function useDiscountCodesApi() {
  const $api = useApi()

  return {
    getAll: () =>
      $api('/discount-codes'),

    validate: (code: string) =>
      $api('/discount-codes/validate', { method: 'POST', body: { code } }),

    create: (body: { code: string; discountAmount: number; expiresAt?: string }) =>
      $api('/discount-codes', { method: 'POST', body }),

    update: (id: number | string, body: { code?: string; discountAmount?: number; expiresAt?: string; isActive?: boolean }) =>
      $api(`/discount-codes/${id}`, { method: 'PATCH', body }),

    remove: (id: number | string) =>
      $api(`/discount-codes/${id}`, { method: 'DELETE' }),
  }
}
