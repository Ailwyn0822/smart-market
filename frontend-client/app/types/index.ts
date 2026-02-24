export interface ApiProduct {
    id: number
    name: string
    price: string | number
    imageUrl?: string
    image?: string
    description?: string
    condition?: string
    category?: string
    stock?: number
    sellerId?: string
}

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
