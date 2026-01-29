<script setup>
const { locale, setLocale, locales } = useI18n()
</script>

<template>
    <div class="relative group z-50">
        <button
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors border-2 border-transparent hover:border-black/5">
            <Icon name="material-symbols:language" class="text-xl" />
            <span class="uppercase font-bold text-sm whitespace-nowrap">{{ locale }}</span>
            <Icon name="material-symbols:keyboard-arrow-down-rounded"
                class="text-lg transition-transform group-hover:rotate-180" />
        </button>

        <div
            class="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-content rounded-xl shadow-stitch-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right overflow-hidden flex flex-col">
            <button v-for="l in locales" :key="l.code" @click="setLocale(l.code)"
                class="w-full text-left px-4 py-3 hover:bg-gray-100 hover:font-bold transition-all flex items-center justify-between text-sm border-b border-gray-100 last:border-0"
                :class="{ 'font-bold bg-gray-50 text-primary': locale === l.code }">
                <span class="flex items-center gap-2">
                    <span class="text-xl leading-none">
                        {{ l.code }}
                    </span>
                </span>
                <Icon v-if="locale === l.code" name="material-symbols:check" class="text-primary text-lg" />
            </button>
        </div>
    </div>
</template>
