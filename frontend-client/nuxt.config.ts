import { visualizer } from 'rollup-plugin-visualizer'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxtjs/sitemap', '@nuxt/test-utils/module'],
  sitemap: {
    sitemaps: true,
    sources: ['/api/__sitemap__/urls'],
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
    domains: ['lh3.googleusercontent.com']
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
      htmlAttrs: {
        lang: 'zh-TW'
      },
      titleTemplate: '%s - Smart Market',
      title: 'Home',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A playful marketplace for buying and selling pre-loved toys, clothes, and gear.' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ]
    }
  },
  routeRules: {
    // SSG：FAQ 內容幾乎不變，build 時預渲染放 CDN
    '/faq': { prerender: true },

    // ISR：優惠券由後台 CRUD 管理，可能隨時更新，最多延遲 60 秒
    '/coupons': { swr: 60 },

    // CSR：需要登入的個人化頁面，SEO 沒意義
    '/cart': { ssr: false },
    '/checkout': { ssr: false },
    '/buy_order/**': { ssr: false },
    '/sell_order/**': { ssr: false },
    '/profile': { ssr: false },
    '/favorite': { ssr: false },
    '/upload': { ssr: false },
    '/invoice/**': { ssr: false },
  },
  vite: {
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