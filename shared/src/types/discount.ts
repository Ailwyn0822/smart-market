// API 返回的折扣碼資訊
export interface ApiDiscountCode {
  id: number
  code: string
  discountAmount: number
  maxUsages: number
  currentUsages: number
  validUntil: string | null
  createdAt: string
  updatedAt: string
}

// 驗證折扣碼請求（POST /discount-codes/validate）
export interface ValidateDiscountRequest {
  code: string
}

// 驗證折扣碼回應
export interface ValidateDiscountResponse {
  id: number
  code: string
  discountAmount: number
  validUntil: string | null
}
