import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports: ['vue', 'vue-router'], // 自動引入 ref, reactive, useRoute 等
      resolvers: [ElementPlusResolver()], // 自動引入 Element Plus 的 API (如 ElMessage)
      dts: 'src/auto-imports.d.ts', // 自動產生型別宣告檔
    }),
    Components({
      resolvers: [ElementPlusResolver()], // 自動引入 Element Plus 元件 (如 <el-button>)
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 4000
  }
})
