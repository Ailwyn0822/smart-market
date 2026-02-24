import { z } from 'zod'

// 登入 schema（前端表單驗證 / 後端 pipe 驗證）
export const loginSchema = z.object({
  email: z.string().email('請輸入有效的 Email').min(1, '請輸入 Email'),
  password: z.string().min(6, '密碼至少 6 個字元').max(100, '密碼過長'),
})

// 註冊 schema
export const registerSchema = z.object({
  username: z
    .string()
    .min(2, '名稱至少 2 個字元')
    .max(50, '名稱最多 50 個字元'),
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(6, '密碼至少 6 個字元').max(100, '密碼過長'),
})

// 更新個人資料 schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, '請輸入名稱').max(50, '名稱最多 50 個字元').optional(),
  avatar: z.string().url('請輸入有效的 URL').optional(),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
