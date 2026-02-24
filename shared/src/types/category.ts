// API 返回的分類資訊
export interface ApiCategory {
  id: number
  name: string
  slug: string
  icon: string | null
  createdAt: string
}

// 建立分類請求（POST /categories）
export interface CreateCategoryRequest {
  name: string
  slug: string
  icon?: string
}

// 更新分類請求（PATCH /categories/:id）
export interface UpdateCategoryRequest {
  name?: string
  slug?: string
  icon?: string
}
