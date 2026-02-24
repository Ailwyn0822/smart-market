import type { UserRole } from '../enums'

// 本地登入請求
export interface LoginRequest {
  email: string
  password: string
}

// 註冊請求
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// 認證回應（登入/註冊成功後）
export interface AuthResponse {
  access_token: string
  user: AuthUser
}

// JWT 解碼後的使用者資訊
export interface JwtPayload {
  email: string
  sub: string      // userId
  role: UserRole
  iat?: number
  exp?: number
}

// 認證後的使用者摘要（不含密碼）
export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string | null
  role?: UserRole
}
