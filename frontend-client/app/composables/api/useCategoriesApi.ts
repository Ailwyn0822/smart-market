export function useCategoriesApi() {
  const $api = useApi()

  return {
    getAll: () =>
      $api('/categories'),

    getTop: () =>
      $api('/categories/top'),
  }
}
