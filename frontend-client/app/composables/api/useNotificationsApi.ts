export function useNotificationsApi() {
  const $api = useApi()

  return {
    getAll: () =>
      $api('/notifications'),

    markAllRead: () =>
      $api('/notifications/read', { method: 'PATCH' }),

    markOneRead: (id: number | string) =>
      $api(`/notifications/${id}/read`, { method: 'PATCH' }),
  }
}
