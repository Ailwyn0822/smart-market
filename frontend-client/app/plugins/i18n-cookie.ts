/**
 * 手動管理 i18n 語言 cookie，避免 Nitro SWR 背景重渲染時
 * 因寫入 cookie 而觸發 ERR_HTTP_HEADERS_SENT 衝突。
 *
 * - Server 端：從 request header 讀 cookie → 設定正確 locale
 * - Client 端：監聽 locale 變化 → 寫入 cookie（不在 SSR 流程中）
 */
export default defineNuxtPlugin(() => {
  const { locale, setLocale } = useI18n()
  const COOKIE_KEY = 'smart_market_lang'

  if (import.meta.server) {
    // Server：從 request Cookie header 讀取語言偏好
    const headers = useRequestHeaders(['cookie'])
    const cookieHeader = headers.cookie ?? ''
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_KEY}=([^;]+)`))
    if (match?.[1]) {
      setLocale(match[1] as 'zh-TW' | 'en' | 'vi')
    }
  }

  if (import.meta.client) {
    // Client：locale 改變時寫入 cookie（1 年有效）
    watch(locale, (newLocale) => {
      document.cookie = `${COOKIE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    }, { immediate: true })
  }
})
