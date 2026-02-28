export function useOrdersApi() {
  const $api = useApi()

  return {
    getMyOrders: () =>
      $api('/orders/my'),

    getSellingOrders: () =>
      $api('/orders/selling'),

    getById: (id: number | string) =>
      $api(`/orders/${id}`),

    create: (body: object) =>
      $api('/orders', { method: 'POST', body }),

    updateStatus: (id: number | string, body: { status: string }) =>
      $api(`/orders/${id}/status`, { method: 'PATCH', body }),

    requestCancellation: (id: number | string) =>
      $api(`/orders/${id}/cancel-request`, { method: 'POST' }),

    respondCancellation: (id: number | string, body: { approve: boolean }) =>
      $api(`/orders/${id}/cancel-respond`, { method: 'POST', body }),

    getSellerDashboard: () =>
      $api('/orders/seller/dashboard'),

    ecpayCheckout: (body: object) =>
      $api('/ecpay/checkout', { method: 'POST', body }),
  }
}
