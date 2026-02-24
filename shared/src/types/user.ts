import type { UserProvider, UserRole } from '../enums'

// API 返回的完整使用者資訊
export interface ApiUser {
  id: string
  name: string
  email: string
  avatar: string | null
  provider: UserProvider
  role: UserRole
  createdAt: string
  updatedAt: string
}

// 使用者個人資料（GET /users/profile）
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string | null
  provider: UserProvider
  role: UserRole
  createdAt: string
}

// 更新個人資料請求（PATCH /users/profile）
export interface UpdateProfileRequest {
  name?: string
  avatar?: string
}

// 使用者搜尋結果
export interface UserSearchResult {
  id: string
  name: string
  avatar: string | null
  email: string
}

// 賣家店面資訊（GET /users/:id/store）
export interface SellerStore {
  id: string
  name: string
  avatar: string | null
  products: import('./product').ApiProduct[]
}
