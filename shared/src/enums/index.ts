// 訂單狀態（抽離自 backend/src/orders/entities/order.entity.ts）
export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCEL_REQUESTED = 'cancel_requested',
  CANCELLED = 'cancelled',
}

// 付款方式（抽離自 backend/src/orders/entities/order.entity.ts）
export enum PaymentMethod {
  COD = 'cod',
  ONLINE = 'online',
}

// 用戶登入來源（抽離自 backend/src/users/entities/user.entity.ts）
export enum UserProvider {
  GOOGLE = 'google',
  LINE = 'line',
  LOCAL = 'local',
}

// 用戶角色（新增，配合後台管理員功能）
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
