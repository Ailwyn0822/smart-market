import { ref, watch, onScopeDispose, getCurrentScope, toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

/**
 * 防抖 composable - 接受任意 ref、computed 或 getter 作為輸入
 * @param source 要防抖的值（支援純值、ref、computed、getter function）
 * @param delay  防抖延遲毫秒數，預設 300ms
 */
export function useDebounce<T>(source: MaybeRefOrGetter<T>, delay: number = 300) {
    const sourceRef = toRef(source)
    const debouncedValue = ref<T>(sourceRef.value) as ReturnType<typeof ref<T>>

    let timer: ReturnType<typeof setTimeout> | null = null

    watch(sourceRef, (val) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            debouncedValue.value = val as T
        }, delay)
    })

    if (getCurrentScope()) {
        onScopeDispose(() => {
            if (timer) clearTimeout(timer)
        })
    }

    return debouncedValue
}
