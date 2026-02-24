export interface ProductItem {
    title: string;
    price: string;
    condition: string;
    description: string;
    image: string;
    borderColorClass: string;
    priceColor: string;
    btnHoverBg: string;
    btnHoverText: string;
    category: string;
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
