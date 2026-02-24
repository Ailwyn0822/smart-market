import type { OrderStatus, PaymentMethod } from '../enums'

// 訂單項目
export interface ApiOrderItem {
  id: number
  orderId: number
  productId: number | null
  productName: string
  productImageUrl: string | null
  quantity: number
  price: number
  sellerId: string | null
}

// API 返回的完整訂單
export interface ApiOrder {
  id: number
  orderNumber: string
  userId: string
  status: OrderStatus
  totalAmount: number
  paymentMethod: PaymentMethod
  recipientName: string
  recipientEmail: string
  shippingAddress: string
  items: ApiOrderItem[]
  createdAt: string
}

// 建立訂單 - 訂單項目
export interface CreateOrderItemRequest {
  productId?: number
  name: string
  imageUrl?: string
  quantity: number
  price: number
  sellerId?: string
}

// 建立訂單請求（POST /orders）
export interface CreateOrderRequest {
  recipientName: string
  recipientEmail: string
  shippingAddress: string
  paymentMethod: PaymentMethod
  amount: number
  items: CreateOrderItemRequest[]
}

// 更新訂單狀態請求（PATCH /orders/:id/status）
export interface UpdateOrderStatusRequest {
  status: OrderStatus
}
