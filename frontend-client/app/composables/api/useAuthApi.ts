export function useAuthApi() {
  const $api = useApi()

  return {
    login: (body: { email: string; password: string }) =>
      $api('/auth/login', { method: 'POST', body }),

    register: (body: { username: string; email: string; password: string }) =>
      $api('/auth/register', { method: 'POST', body }),
  }
}
