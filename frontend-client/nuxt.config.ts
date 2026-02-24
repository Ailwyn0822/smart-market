export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxtjs/sitemap'],
  sitemap: {
    sitemaps: true,
    sources: ['/api/__sitemap__/urls'],
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@smart-market/shared': ['../../shared/src/index.ts'],
          '@smart-market/shared/*': ['../../shared/src/*'],
        },
      },
    },
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
        lang: 'en'
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})