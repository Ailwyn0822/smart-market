import type { CategoryItem, IllustrationItem } from '~/types'

export const useHomeData = () => {
    const { t } = useI18n()

    const categories = computed<CategoryItem[]>(() => [
        { name: t('home.categories.toys'), icon: 'toys', bgColor: 'bg-accent-red' },
        { name: t('home.categories.clothes'), icon: 'checkroom', bgColor: 'bg-accent-blue' },
        { name: t('home.categories.books'), icon: 'menu-book', bgColor: 'bg-primary', iconColor: 'text-content' },
        { name: t('home.categories.art'), icon: 'palette', bgColor: 'bg-accent-purple' },
        { name: t('home.categories.gear'), icon: 'sports-soccer', bgColor: 'bg-orange-400' },
        { name: t('home.categories.outdoor'), icon: 'pedal-bike', bgColor: 'bg-green-400' },
    ])

    const illustrate = computed<IllustrationItem[]>(() => [
        { icon: 'verified-user', title: t('home.illustrate.verified.title'), description: t('home.illustrate.verified.description'), bgColor: 'bg-amber-100', borderColor: 'border-amber-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.amber.600")]', textColor: 'text-amber-600' },
        { icon: 'recycling', title: t('home.illustrate.eco.title'), description: t('home.illustrate.eco.description'), bgColor: 'bg-green-100', borderColor: 'border-green-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.green.600")]', textColor: 'text-green-600' },
        { icon: 'lock', title: t('home.illustrate.secure.title'), description: t('home.illustrate.secure.description'), bgColor: 'bg-sky-100', borderColor: 'border-sky-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.sky.600")]', textColor: 'text-sky-600' },
        { icon: 'sentiment-satisfied', title: t('home.illustrate.happiness.title'), description: t('home.illustrate.happiness.description'), bgColor: 'bg-pink-100', borderColor: 'border-pink-600', shadowColor: 'shadow-[2px_2px_0_theme("colors.pink.600")]', textColor: 'text-pink-600' }
    ])

    return {
        categories,
        illustrate
    }
}
