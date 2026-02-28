export function useReviewsApi() {
  const $api = useApi()

  return {
    create: (body: { orderId: number; rating: number; comment: string; productId?: number }) =>
      $api('/reviews', { method: 'POST', body }),

    createBulk: (body: { orderId: number; items: object[] }) =>
      $api('/reviews/bulk', { method: 'POST', body }),

    checkByOrderId: (orderId: number | string) =>
      $api(`/reviews/check/${orderId}`),

    getBySeller: (sellerId: number | string, params?: { page?: number; limit?: number }) =>
      $api(`/reviews/seller/${sellerId}`, { params }),

    getByProduct: (productId: number | string, params?: { page?: number; limit?: number }) =>
      $api(`/reviews/product/${productId}`, { params }),
  }
}
