// 通用 API 回應包裝
export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode?: number
}

// 分頁參數
export interface PaginationParams {
  page?: number
  limit?: number
}

// 分頁結果
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
