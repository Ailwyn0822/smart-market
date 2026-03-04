# Vue 3 + Vitest 單元測試基礎教學

這是一份針對 Vue 3 (Composition API) 與 Vitest 的單元測試教戰手冊。

## 1. 核心觀念：3A 原則

寫任何測試之前，請把這個流程刻在心裡，你的測試碼就不會亂。

- **Arrange (準備)**：準備好測試環境。包含假資料 (Mock Data)、把 Store 清空、掛載 (Mount) 元件。
- **Act (執行)**：觸發你想測試的動作。例如呼叫 `store.addToCart()`，或是模擬使用者點擊按鈕 `wrapper.find('button').trigger('click')`。
- **Assert (斷言)**：檢查結果是否符合預期。這就是 `expect(...)` 出場的時候。

---

## 2. 測試檔案的基本架構

通常測試檔名會取作 `xxx.test.ts` 或 `xxx.spec.ts`。

```typescript
// 必備的四個工具
import { describe, it, expect, beforeEach } from "vitest";

// describe：這是一個大群組，用來把相關的測試包在一起
describe("購物車功能測試", () => {
  // beforeEach：每個小測試 (it) 開始前，都會先跑一次這裡面的程式碼
  // 用途：確保環境乾淨，避免上一個測試的垃圾資料留下來感染下一個測試
  beforeEach(() => {
    // 例如：重置 Pinia、清空資料庫等
  });

  // it (或 test)：這是一個具體的測試案例 (Test Case)
  it("初始狀態應該是零", () => {
    // 你的 3A 邏輯寫在這裡
  });

  it("加入商品後數量應該加一", () => {
    // 你的 3A 邏輯寫在這裡
  });
});
```

---

## 3. 四大常用斷言 (Assert)

這是法官用來判斷測試有沒有通過的武器。

| 用法                             | 白話翻譯 | 適用情境                      | 範例                                 |
| :------------------------------- | :------- | :---------------------------- | :----------------------------------- |
| `.toBe(預期值)`                  | 精準比對 | 數字、字串、布林值            | `expect(price).toBe(100)`            |
| `.toHaveLength(數字)`            | 量長度   | 陣列、字串                    | `expect(cart.items).toHaveLength(2)` |
| `.toEqual(物件)`                 | 長相一樣 | 物件、陣列內容                | `expect(user).toEqual({ id: 1 })`    |
| `.toBeTruthy()` / `.toBeFalsy()` | 測真假   | 判斷有沒有值 / 或是否為布林值 | `expect(errorMsg).toBeTruthy()`      |

---

## 4. 測試 Vue Store (純邏輯測試)

這類測試最簡單，因為不需要牽扯到畫面 (DOM)。

```typescript
import { setActivePinia, createPinia } from "pinia";
import { useCartStore } from "../cart";

describe("測試 Cart Store", () => {
  beforeEach(() => {
    // 1. Arrange: 建立全新 Pinia 實體
    setActivePinia(createPinia());
  });

  it("能夠新增商品", () => {
    const store = useCartStore();

    // 2. Act: 執行你想測的 function
    store.addToCart({ id: 99, name: "測試商品", price: 100 });

    // 3. Assert: 檢查結果對不對
    expect(store.items).toHaveLength(1);
    expect(store.items[0].price).toBe(100);
  });
});
```

---

## 5. 測試 Vue 元件 (DOM 操作)

當你要測試畫面上的按鈕、輸入框，以及它們觸發的事件時，就需要用到 `@vue/test-utils` 提供的 `mount`。

### 常用技巧列表

- `mount(元件)`：把元件渲染成一個虛擬 DOM (回傳值通常叫 `wrapper`)。
- `wrapper.find('CSS選擇器')`：用選擇器把網頁元素抓出來。
- `元件.exists()`：檢查這個元素到底在不在畫面上 (回傳 true/false)。
- `元件.text()`：把元素裡面的文字扒出來。
- `await 元件.trigger('click')`：模擬使用者點擊 (記得加 `await` 因為畫面更新需要時間)。

### 實戰範例

假設我們測試一個 `Counter.vue` 元件 (按了數字會加 1)：

```typescript
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Counter from "../Counter.vue";

describe("Counter 元件測試", () => {
  it("點擊按鈕後，如果數字改變，畫面要跟著變", async () => {
    // 1. Arrange: 掛載元件到虛擬環境
    const wrapper = mount(Counter);

    // 抓出畫面上的元素 (假設我們有給它 class)
    const display = wrapper.find(".number-display");
    const btn = wrapper.find(".add-btn");

    // 確定一開始數字是 0
    expect(display.text()).toBe("0");

    // 2. Act: 模擬使用者點擊
    await btn.trigger("click");

    // 3. Assert: 檢查畫面上的字有沒有變成 1
    expect(display.text()).toBe("1");
  });
});
```

> **💡 業界實戰撇步**
> 尋找 DOM 元素時，盡量不要用 `.class` 來找 (因為設計師改 CSS 可能會不小心改掉)。
> 最好的做法是給測試用的 HTML 標籤加上 `data-testid` 屬性。
> 例如：`<button data-testid="submit-btn" class="..."></button>`
> 測試碼就可以寫：`wrapper.find('[data-testid="submit-btn"]')` ，保證永遠不會抓錯人。
