import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url'

// Use an alias so unplugin-auto-import generates clean import paths
// (avoids Windows backslash path issues with absolute paths)
const NUXT_STUBS_ALIAS = '#nuxt-stubs'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        {
          [NUXT_STUBS_ALIAS]: ['useState', 'useCookie'],
        },
      ],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '@smart-market/shared': fileURLToPath(new URL('../shared/src/index.ts', import.meta.url)),
      [NUXT_STUBS_ALIAS]: fileURLToPath(new URL('./vitest-nuxt-stubs.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['app/**/*.{test,spec}.ts'],
  },
})
