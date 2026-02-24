// ApiProduct 從 shared 套件匯出（前後端共用型別）
export type { ApiProduct } from '@smart-market/shared'

// 以下為前端 UI 專用型別，不放入 shared

export interface ProductItem {
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
