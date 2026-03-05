import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxt/test-utils/module'],
  sitemap: {
    sitemaps: true,
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@smart-market/shared': ['../../shared/src/index.ts'],
        },
      },
    },
  },
  imports: {
    dirs: ['composables/api']
  },
  css: ['~/assets/css/main.css'],
  image: {
    domains: ['lh3.googleusercontent.com', 'panda-map.com', 'api.panda-map.com']
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080'
    }
  },
  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'zh-TW', file: 'zh_TW.json' },
      { code: 'vi', file: 'vi.json' }
    ],
    langDir: './language',
    defaultLocale: 'zh-TW',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'smart_market_lang',
      redirectOn: 'root'
    }
  },
  app: {
    head: {
      titleTemplate: '%s | Smart Market',
      title: 'Smart Market',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '安全、環保的二手玩具、衣物與裝備交易平台。' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Smart Market' },
        { property: 'og:title', content: 'Smart Market｜二手好物市集' },
        { property: 'og:description', content: '安全、環保的二手玩具、衣物與裝備交易平台。' },
        { property: 'og:image', content: 'https://panda-map.com/og-image.webp' },
        { property: 'og:url', content: 'https://panda-map.com' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preload', as: 'image', href: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXLcieLcgLm6DKGq9M-t4SdKUmyFKVce_mrJ0Ks00z8qJMrinJtppYKN6QNCyHLeBN7i8hwsKIseQbT9AF6fItEf43UejpuirKEF_vy6M8nAoKhSxQ2rsewKiwyYHG3coQsZDXplbk0Bv56G7y5467HZFxwpBMUNeXKfZu8qU20gbziRKA2Iovf9ZLPQ_ljuHY0B82waI3FqKNyZ0Yx_xvc9JpEXR9YPQt1y5IoaAx6MYkjaNu-pOk5PLj8OWeSWiz01YYoOj6K0kt=w800-h600-rw', fetchpriority: 'high' },
        { rel: 'preconnect', href: 'https://lh3.googleusercontent.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // 刻意使用 media="print" 讓瀏覽器非同步載入字體，載入完成後轉為 "all"
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Spline+Sans:wght@300;400;500;600;700&family=Permanent+Marker&family=Courier+Prime&display=swap', media: 'print', onload: "this.media='all'" }
      ]
    }
  },
  routeRules: {
    // 全站靜態資源設定 Cache-Control (一年)，解決 Lighthouse 的 Leverage Browser Caching 警告
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },

    // SSG：FAQ 內容幾乎不變，build 時預渲染放 CDN
    '/faq': { prerender: true },

    // CSR：需要登入的個人化頁面，SEO 沒意義
    '/cart': { ssr: false },
    '/checkout': { ssr: false },
    '/buy_order/**': { ssr: false },
    '/sell_order/**': { ssr: false },
    '/profile': { ssr: false },
    '/favorite': { ssr: false },
    '/upload': { ssr: false },
    '/invoice/**': { ssr: false },
    '/commodity/**': { ssr: false },
    '/dashboard': { ssr: false },
  },
  vite: {
    resolve: {
      alias: {
        '@smart-market/shared': fileURLToPath(new URL('../../shared/src/index.ts', import.meta.url))
      }
    },
    plugins: [
      visualizer({
        open: false,
        filename: '.output/stats.html',
        gzipSize: true,
        brotliSize: true
      }) as any
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Nuxt/Vue 核心庫
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            // 其他較大的依賴可以獨立分包
            'socket-client': ['socket.io-client'],
            'dayjs': ['dayjs']
          }
        }
      }
    }
  }
})