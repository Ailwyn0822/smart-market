<template>
    <div class="lg:absolute transition-transform hover:scale-[1.02] z-10"
        :class="[positionClass, rotationClass, widthClass]">
        <!-- Tape / Pin Decoration -->
        <div v-if="decoration === 'tape'" class="tape-strip -top-3 left-1/2 -translate-x-1/2" :class="tapeRotation">
        </div>
        <div v-else-if="decoration === 'pin'" class="push-pin top-2 right-2 !left-auto"></div>

        <!-- Paper Content -->
        <div :class="[colorClass, 'p-6 shadow-paper rounded-sm h-full relative', clipTag ? 'clip-tag' : '']">
            <!-- Tag Hole (for Price tag) -->
            <div v-if="clipTag"
                class="absolute top-1/2 right-4 w-4 h-4 bg-background-light dark:bg-background-dark rounded-full shadow-inner">
            </div>

            <label :class="[textColorClass, 'block font-bold text-lg mb-2 flex items-center gap-2']">
                <Icon :name="icon" />
                {{ label }}
            </label>

            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    color: {
        type: String, // 'blue', 'pink', 'yellow', 'green'
        required: true
    },
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    positionClass: {
        type: String,
        default: ''
    },
    rotationClass: {
        type: String,
        default: ''
    },
    widthClass: {
        type: String,
        default: 'w-full'
    },
    decoration: {
        type: String, // 'tape', 'pin', 'none'
        default: 'tape'
    },
    tapeRotation: {
        type: String,
        default: '-rotate-2'
    },
    clipTag: {
        type: Boolean,
        default: false
    }
});

const colorClass = computed(() => {
    switch (props.color) {
        case 'blue': return 'bg-paper-blue';
        case 'pink': return 'bg-paper-pink';
        case 'yellow': return 'bg-paper-yellow';
        case 'green': return 'bg-paper-green';
        default: return 'bg-white';
    }
});

const textColorClass = computed(() => {
    switch (props.color) {
        case 'blue': return 'text-blue-900';
        case 'pink': return 'text-pink-900';
        case 'yellow': return 'text-yellow-900';
        case 'green': return 'text-green-900';
        default: return 'text-gray-900';
    }
});
</script>

<style scoped>
.tape-strip {
    position: absolute;
    width: 80px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    z-index: 10;
    backdrop-filter: blur(1px);
}

.push-pin {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #f4c025, #b48c15);
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
}

.push-pin::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    filter: blur(1px);
}
</style>
