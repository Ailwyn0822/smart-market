<template>
    <div class="bg-white p-4 rounded-2xl border-4 border-gray-100 flex flex-col gap-3">
        <!-- Image Skeleton -->
        <div class="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>

        <div class="flex flex-col gap-2 mt-1">
            <!-- Title & Price Skeleton -->
            <div class="flex justify-between items-start gap-4">
                <div class="h-6 bg-gray-200 rounded-md w-2/3 animate-pulse"></div>
                <div class="h-6 bg-gray-200 rounded-md w-1/4 animate-pulse"></div>
            </div>

            <!-- Description Skeleton (2 lines) -->
            <div class="flex flex-col gap-1.5 mt-2">
                <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
            </div>
        </div>

        <!-- Button Skeleton -->
        <div class="mt-auto w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
</template>

<script setup lang="ts">
// Skeleton component for ProductCard
</script>
