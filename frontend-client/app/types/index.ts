// ApiProduct 等共用型別從 shared 套件匯出（前後端共用型別）
import type {
    ApiProduct,
    ApiDiscountCode,
    ApiUser,
    ApiOrder,
    ApiOrderItem
} from '@smart-market/shared'
export type {
    ApiProduct,
    ApiDiscountCode,
    ApiUser,
    ApiOrder,
    ApiOrderItem
}

// 以下為前端 UI 專用型別或擴充型別

export interface ProductItem extends Partial<Omit<ApiProduct, 'id' | 'price' | 'category'>> {
    id?: number | string;
    title: string;
    price: string;
    condition: string;
    description: string;
    image: string;
    borderColorClass: string;
    priceColor: string;
    btnHoverBg: string;
    btnHoverText: string;
    category: { name: string } | string | null;
}

export interface CategoryItem {
    name: string;
    icon: string;
    bgColor: string;
    iconColor?: string;
}

export interface IllustrationItem {
    icon: string;
    title: string;
    description: string;
    bgColor: string;
    borderColor: string;
    shadowColor: string;
    textColor: string;
}

export interface AuthUser extends Omit<ApiUser, 'provider' | 'role' | 'createdAt' | 'updatedAt'> {
    avatarUrl?: string
    // OAuth 提供者（Google / LINE）可能回傳的額外爛位
    picture?: string
    username?: string
}

export interface ChatContact {
    id: string
    name: string
    avatar: string
    lastMessage?: string
    unreadCount?: number
}

export interface ChatMessage {
    id: number
    content: string
    senderId: string
    receiverId: string
    createdAt: string
    isRead: boolean
}

export interface CartItem {
    product: ApiProduct
    quantity: number
}

export interface ProductResponse extends Partial<Omit<ApiProduct, 'price' | 'category'>> {
    id: number;
    title?: string;
    price: string | number;
    image?: string;
    category?: { name: string } | string;
    [key: string]: any;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export interface AppNotification {
    id: string | number;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: 'order_update' | 'new_review' | 'product_deactivated' | string;
    referenceId?: string | number;
}

export interface FavoriteProduct extends Omit<ApiProduct, 'categoryId' | 'category' | 'createdAt'> {
    categoryId: number;
}

export interface Coupon extends Omit<ApiDiscountCode, 'createdAt' | 'updatedAt'> {
    // 繼承自 ApiDiscountCode，若前端需擴充可寫在這裡
}

export interface EditProductData extends Partial<Omit<ApiProduct, 'price' | 'category'>> {
    price?: string | number;
    category?: { id: number; name: string };
    [key: string]: any;
}

export interface SellerGroup {
    sellerId: string;
    sellerName: string;
    items: CartItem[];
}

export interface AppOrderItem extends Omit<ApiOrderItem, 'orderId' | 'sellerId' | 'productId' | 'productImageUrl'> {
    // 前端對部分欄位做了可選化，維持 UI 元件不報錯
    productId?: number;
    productImageUrl?: string;
}

export interface AppOrder extends Omit<ApiOrder, 'userId' | 'items' | 'recipientName' | 'recipientEmail' | 'shippingAddress'> {
    // 將 items 覆蓋為前端特化的 AppOrderItem，並重新定義可能為 optional 的欄位
    items: AppOrderItem[];
    isReviewed?: boolean;
    recipientName?: string;
    recipientEmail?: string;
    shippingAddress?: string;
}

export interface SellerInfo extends Partial<ApiUser> {
    id: string;
    name: string;
    avatar: string;
    joinedAt: string;
    rating: number;
    totalProducts: number;
}

export interface StoreData {
    seller: SellerInfo;
    products: ApiProduct[];
    hasMore: boolean;
}

export interface SellerReview {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface DashboardTopProduct {
    productId: string | number;
    productName: string;
    productImage?: string;
    totalSold: number;
}

export interface DashboardLowStockItem {
    productId: string | number;
    productName: string;
    productImage?: string;
    stock: number;
}

export interface DashboardData {
    monthlyRevenue: number;
    currentMonthSales: number;
    topProducts: DashboardTopProduct[];
    lowStockAlerts: DashboardLowStockItem[];
}

export interface UserProfile extends Omit<Partial<ApiUser>, 'id'> {
    id?: number | string;
    username?: string;
    picture?: string;
    [key: string]: any;
}

export interface ProductDetail extends Partial<Omit<ApiProduct, 'price'>> {
    id: number;
    title?: string;
    price?: string | number;
    image?: string;
    seller?: any;
    user?: any;
    [key: string]: any;
}

export interface ReviewItem {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewsResponse {
    items: ReviewItem[];
    total: number;
    page: number;
    hasMore: boolean;
}

export interface ProductReviewItem {
    productId: number | undefined;
    productName: string;
    productImageUrl: string | undefined;
    rating: number;
    comment: string;
}
