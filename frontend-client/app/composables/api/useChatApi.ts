export function useChatApi() {
  const $api = useApi()

  return {
    getContacts: () =>
      $api('/chat/contacts'),

    getHistory: (targetId: string) =>
      $api(`/chat/history/${targetId}`),
  }
}
