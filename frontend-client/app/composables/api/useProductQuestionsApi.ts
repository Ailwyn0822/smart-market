export function useProductQuestionsApi() {
  const $api = useApi()

  return {
    getByProduct: (productId: number | string) =>
      $api(`/product-questions/product/${productId}`),

    create: (body: { productId: number; question: string }) =>
      $api('/product-questions', { method: 'POST', body }),

    answer: (id: number | string, body: { answer: string }) =>
      $api(`/product-questions/${id}/answer`, { method: 'POST', body }),

    remove: (id: number | string) =>
      $api(`/product-questions/${id}`, { method: 'DELETE' }),
  }
}
