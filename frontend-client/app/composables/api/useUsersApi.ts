export function useUsersApi() {
  const $api = useApi()

  return {
    getProfile: () =>
      $api('/users/profile'),

    updateProfile: (body: { name?: string; avatar?: string }) =>
      $api('/users/profile', { method: 'PATCH', body }),

    uploadAvatar: (formData: FormData) =>
      $api('/users/avatar', { method: 'POST', body: formData }),

    getStore: (id: number | string) =>
      $api(`/users/${id}/store`),

    getProducts: (id: number | string, params?: { page?: number; limit?: number }) =>
      $api(`/users/${id}/products`, { params }),

    search: (q: string) =>
      $api('/users/search', { params: { q } }),
  }
}
