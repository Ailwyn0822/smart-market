import type { CategoryItem, ProductItem, IllustrationItem } from '~/types'

export const useHomeData = () => {
    const categories: CategoryItem[] = [
        { name: 'Toys', icon: 'toys', bgColor: 'bg-accent-red' },
        { name: 'Clothes', icon: 'checkroom', bgColor: 'bg-accent-blue' },
        { name: 'Books', icon: 'menu-book', bgColor: 'bg-primary', iconColor: 'text-content' },
        { name: 'Art', icon: 'palette', bgColor: 'bg-accent-purple' },
        { name: 'Gear', icon: 'sports-soccer', bgColor: 'bg-orange-400' },
        { name: 'Outdoor', icon: 'pedal-bike', bgColor: 'bg-green-400' },
    ]

    const featuredItems: ProductItem[] = [
        {
            title: 'Classic Red Racer',
            price: '$15',
            condition: 'Used - Good',
            description: 'Vintage style metal pedal car, slightly scratched but runs fast!',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPB3dGs-oKxc75etMaToQGn0skAAjAeBZnWv5T5HwOeTHYcZ-gXZMNAdHDsCt48KIPL9ZMYQ9Q8I9gmdfU14ROgReXqaHiR8CJuY59CjOQs6j-lp94D8dxZtBFTKYZM4xE7Jtn0-4NIbaVOXJRN0DN-IE-DuNHh6xPVDydKCiCt85nC9TWQa0Ijxrp0kcYZuqYAvEddxq_vlrsPTuvfR-zmOPg86fU4LkTzJ9vM4pThtlE_lICxatASb8O2_duSXHuZX6gxOkJPOuQ',
            borderColorClass: 'crayon-border-red',
            priceColor: 'text-accent-red',
            btnHoverBg: 'bg-accent-red',
            btnHoverText: 'text-white'
        },
        {
            title: 'Wooden Block Set',
            price: '$24',
            condition: 'Like New',
            description: 'Complete set of 50 blocks. Great for building castles.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Gb6q0aM6_Jn46xxTtF07VC8s9kY2NQ55MVDqfqcR1WRTr__E1Yn7eo9jQcEeeve0VrjcNHnPcK4QROkPBXnA07HHOhDf1nPOz9Nxle82uKW0epPYTcm2m-00BAV5tEdC00124Zq4ZuOPAHecaTddJSfaJmBxz86hx4gj8-JAZH7jv6HbOiSRrnaAFA6uVkpwtR7AflAIKr3RfDOHmuYBpZqW2w1rBkY-nVP4iNOvLUyMkjeyfFHg-_lzjHZ7_N7SBhNDoJa66QDP',
            borderColorClass: 'crayon-border-blue',
            priceColor: 'text-accent-blue',
            btnHoverBg: 'bg-accent-blue',
            btnHoverText: 'text-white'
        },
        {
            title: 'Mr. Cuddles Bear',
            price: '$8',
            condition: 'Used - Fair',
            description: 'Looking for a new home. Very soft, just needs a wash.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTd1ik66Od35XTgQfdYh2vHG2rRP2Q_ffVtYApvmOgGQtkw6nmZ7z7ILo1qddTQQgErO0PgC1pMdlsrXdxXunxySlqJ_EecKCrVrGWJWNOis2NDDa6PeSWW71iLhPWGDvXk37DjlyjBCbV4mcsNydgqcVTDlS9J7dmgExOMguko9yflrdbAgG1G3V946vzyua4M2csQSx3mc3raqd74CsYFmz2wi5DlVcoOWP0s06O2PPHkCb5NR70UtK9TeZ7XcFQf5sTkYZ22A5x',
            borderColorClass: 'crayon-border-yellow',
            priceColor: 'text-primary',
            btnHoverBg: 'bg-primary',
            btnHoverText: 'text-content'
        },
        {
            title: 'Artist Starter Kit',
            price: '$30',
            condition: 'New',
            description: 'Never opened. Includes canvas, easel, and acrylics.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2BqY4axIOd2zsQ0sXt702dJjPyc2uW61HdaIrnz7GQWvAE07wwmVEo6ZLgqC3p8oXeX2htk2TvIuMQDOSBmnzh9NDKghVHuaHNQJaHcC8LpJV4oXVe6PaAuMlyyP8GbNXksjIZuyYxbt80zGREEITHsQn0M_GIW160ynsSuSepavdT4JPZr5dznyJIfO0uJ4obBSxNx_LaQeX1X3HII50qoChfxSdyjepE3S7ZNKyREI8hHeP8n4QoV7SUIcPERI_H2yRYtg97aH7',
            borderColorClass: 'crayon-border-purple',
            priceColor: 'text-accent-purple',
            btnHoverBg: 'bg-accent-purple',
            btnHoverText: 'text-white'
        }
    ]

    const illustrate: IllustrationItem[] = [
        { icon: 'verified-user', title: 'Parent Verified', description: 'All sellers are checked', bgColor: 'bg-amber-100', borderColor: 'border-amber-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.amber.600")]', textColor: 'text-amber-600' },
        { icon: 'recycling', title: 'Eco-Friendly', description: 'Good for the planet', bgColor: 'bg-green-100', borderColor: 'border-green-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.green.600")]', textColor: 'text-green-600' },
        { icon: 'lock', title: 'Secure Pay', description: 'Money safe guarantee', bgColor: 'bg-sky-100', borderColor: 'border-sky-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.sky.600")]', textColor: 'text-sky-600' },
        { icon: 'sentiment-satisfied', title: 'Happiness', description: 'Returns made easy', bgColor: 'bg-pink-100', borderColor: 'border-pink-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.pink.600")]', textColor: 'text-pink-600' }
    ]

    return {
        categories,
        featuredItems,
        illustrate
    }
}
