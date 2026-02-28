# Pinia vs Vuex — 完整比較與使用情境

---

## 一句話定位

- **Vuex**：Vue 2 時代的官方狀態管理，Vue 3 仍可用但已不推薦
- **Pinia**：Vue 3 官方現在推薦的狀態管理，更簡單、TypeScript 友善

---

## 優缺點比較表

| | Vuex 4 | Pinia |
|---|---|---|
| **Vue 版本** | Vue 2 / 3 | Vue 3 專用 |
| **TypeScript 支援** | 很差，要大量 type hack | 原生支援，自動型別推斷 |
| **寫法複雜度** | 高（mutation + action + getter 分開） | 低（只有 state + action + computed） |
| **Mutation** | 必須有 | 不需要，直接改 state |
| **DevTools** | ✅ | ✅（更好用） |
| **模組化** | 要手動設定 namespace | 每個 store 天生獨立 |
| **SSR 支援** | 一般 | 好 |
| **Bundle Size** | 較大 | 較小（約 1KB） |
| **官方維護狀態** | 維護中但不再新增功能 | 積極維護，持續更新 |

---

## 寫法對比

### 定義 Store

**Vuex（Options 風格，繁瑣）**
```typescript
// store/index.ts
import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    token: null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  mutations: {
    SET_USER(state, user) { state.user = user },
    SET_TOKEN(state, token) { state.token = token },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
    },
  },
  actions: {
    login({ commit }, { token, user }) {
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
  },
})
```

**Pinia（Setup Store 風格，簡潔）**
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', { default: () => null })
  const user  = useCookie<User | null>('auth_user',   { default: () => null })

  const isAuthenticated = computed(() => !!token.value)

  function login(newToken: string, userData: User) {
    token.value = newToken
    user.value  = userData
  }

  function logout() {
    token.value = null
    user.value  = null
    navigateTo('/')
  }

  return { token, user, isAuthenticated, login, logout }
})
```

---

### 在元件中使用

**Vuex**
```typescript
// 元件裡要用 mapState、mapActions 或 this.$store
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['user', 'token']),
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['login', 'logout']),
  },
}

// 或直接用 this.$store（更囉嗦）
this.$store.commit('SET_USER', user)
this.$store.dispatch('login', { token, user })
```

**Pinia**
```typescript
// 元件裡直接用，簡單清楚
const authStore = useAuthStore()

authStore.login(token, user)   // 呼叫 action
authStore.token                // 讀取 state
authStore.isAuthenticated      // 讀取 computed
```

---

## Vuex 為什麼要有 Mutation？

Vuex 設計上規定**不能直接修改 state**，必須透過 mutation：

```typescript
// ❌ Vuex 不允許
state.user = newUser

// ✅ Vuex 必須這樣
commit('SET_USER', newUser)
```

**原因：** 讓所有狀態改變都可追蹤（DevTools 記錄每一次 mutation）

**問題：** 每個 state 都要配一個 mutation，程式碼量爆炸，TypeScript 支援很差

Pinia 解決了這個問題：直接修改 state，DevTools 一樣追蹤得到。

---

## 什麼資料適合放 Store？

### 判斷標準

> **「這個資料，有沒有超過一個地方需要存取或修改？」**
>
> 有 → 放 Store
> 沒有 → 放在元件的 `ref` 裡就好

---

### Smart Market 的三個 Store

#### Auth Store（認證狀態）

```
放進 Store 的理由：
  Header → 讀取 isAuthenticated 決定顯示登入/登出
  每個需要 JWT 的 API → 讀取 token
  中介層（Middleware）→ 讀取 isAuthenticated 決定是否跳轉

跨越 Header、所有頁面、Middleware → 需要 Store
```

#### Cart Store（購物車）

```
放進 Store 的理由：
  Header → 讀取 c_totalItems 顯示 badge 數字
  cart.vue → 讀寫商品清單
  checkout.vue → 讀取商品清單和金額
  商品詳情頁 → 寫入（加入購物車）

跨越 4+ 個頁面/元件 → 需要 Store
額外需要 Cookie 持久化（F5 不消失）
```

#### Chat Store（聊天）

```
放進 Store 的理由：
  Header 通知鈴鐺 → 讀取未讀訊息數
  ChatWidget → 讀寫訊息列表、連線狀態
  商品詳情「聊聊」按鈕 → 呼叫 openChat()
  賣家頁「聊聊」按鈕 → 呼叫 openChat()

Socket.io 連線是全域唯一的，不能每個元件各自連 → 需要 Store
```

---

### 不適合放 Store 的資料

```typescript
// ❌ 不需要 Store，用元件 ref 就好

// 彈窗開關（只有這個元件用）
const isModalOpen = ref(false)

// 表單資料（只有這個頁面用）
const form = reactive({ name: '', email: '', password: '' })

// API 回來的頁面資料（用 useFetch 就好）
const { data: products } = await useFetch('/api/products')

// 頁面 loading 狀態
const isLoading = ref(false)
```

---

## 特殊情境：篩選參數放哪？

### 選項 A：URL query（Smart Market 的做法）

```typescript
// 篩選參數存在 URL
router.push({ query: { keyword, category, page } })
const keyword = computed(() => route.query.keyword)
```

**優點：**
- 使用者可以複製 URL 分享篩選結果
- F5 重整不遺失條件
- 瀏覽器上一頁/下一頁正常

**適合：** 商品搜尋、篩選、分頁

---

### 選項 B：Store

```typescript
// 篩選參數存在 store
const keyword = ref('')
const category = ref('')
watch([keyword, category], () => fetchProducts())
```

**優點：**
- 多個元件直接讀寫，不需要 props 傳遞
- 適合複雜的多層元件結構

**適合：** 不需要反映在 URL 的全域狀態（如：全站語言、主題設定）

---

## Pinia 的持久化

Pinia 本身 **F5 就清空**，需要額外持久化：

```typescript
// ❌ 沒有持久化（F5 後 token 消失）
const token = ref<string | null>(null)

// ✅ 用 useCookie 持久化（F5 後從 cookie 讀回）
const token = useCookie<string | null>('auth_token', { default: () => null })
```

### 為什麼用 Cookie 而不是 localStorage？

| | Cookie | localStorage |
|---|---|---|
| SSR 可讀 | ✅（伺服器可從 Request Header 讀到） | ❌（Node.js 沒有 localStorage） |
| F5 保留 | ✅ | ✅ |
| 水合閃爍 | ❌ 不會（伺服器就知道登入狀態） | ✅ 會（SSR 時是空的，水合後才有） |

**Nuxt 的 `useCookie()` 是 SSR-safe 的，是 Nuxt 專案的標準做法。**

---

## 面試常見問題

### Q：Pinia 和 Vuex 最大的差別？

> Pinia 不需要 mutation，可以直接修改 state，寫法更簡潔。TypeScript 支援也好很多，不需要各種 type hack。同時 Pinia 是 Vue 官方現在推薦的解法，Vuex 已不再積極開發新功能。

### Q：什麼時候用 Store，什麼時候用元件 ref？

> 判斷標準是「這個資料有沒有超過一個地方需要存取或修改」。像登入狀態、購物車、Socket 連線這種跨越多個元件的全域狀態適合放 Store。表單資料、UI 開關、頁面資料這種只有一個元件用的，直接用 ref 就好。

### Q：Pinia 如何在 F5 後保留資料？

> Pinia 本身是記憶體狀態，F5 會清空。在 Nuxt 專案裡用 `useCookie()` 搭配 Pinia，把 token 和購物車存進 cookie，F5 後從 cookie 讀回。選 cookie 而不是 localStorage 是因為 SSR 時伺服器也能讀取 cookie，避免水合閃爍問題。
