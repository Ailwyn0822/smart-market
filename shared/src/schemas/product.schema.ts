import { z } from 'zod'

// 建立商品 schema
export const createProductSchema = z.object({
  name: z.string().min(1, '請輸入商品名稱').max(100, '名稱最多 100 個字元'),
  description: z.string().min(1, '請輸入商品描述').max(2000, '描述最多 2000 個字元'),
  price: z.number().positive('價格必須大於 0').max(999999, '價格過高'),
  categoryId: z.number().int().positive('請選擇分類'),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair', 'Poor']).optional(),
  stock: z.number().int().min(1, '庫存至少為 1').optional(),
  imageUrl: z.string().url('請提供有效的圖片 URL').min(1, '請上傳商品圖片'),
})

// 更新商品 schema（所有欄位可選）
export const updateProductSchema = createProductSchema.partial()

// 查詢商品參數 schema
export const productQuerySchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
})

export type CreateProductSchema = z.infer<typeof createProductSchema>
export type UpdateProductSchema = z.infer<typeof updateProductSchema>
export type ProductQuerySchema = z.infer<typeof productQuerySchema>
