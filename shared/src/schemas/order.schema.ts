import { z } from 'zod'
import { PaymentMethod } from '../enums'

// 訂單項目 schema
export const createOrderItemSchema = z.object({
  productId: z.number().int().positive().optional(),
  name: z.string().min(1, '請輸入商品名稱'),
  imageUrl: z.string().url().optional(),
  quantity: z.number().int().positive('數量至少為 1'),
  price: z.number().positive('價格必須大於 0'),
  sellerId: z.string().uuid().optional(),
})

// 建立訂單 schema
export const createOrderSchema = z.object({
  recipientName: z.string().min(1, '請輸入收件人姓名'),
  recipientEmail: z.string().email('請輸入有效的 Email'),
  shippingAddress: z.string().min(5, '請輸入完整地址'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  amount: z.number().positive('金額必須大於 0'),
  items: z.array(createOrderItemSchema).min(1, '訂單至少要有一個商品'),
})

export type CreateOrderItemSchema = z.infer<typeof createOrderItemSchema>
export type CreateOrderSchema = z.infer<typeof createOrderSchema>
