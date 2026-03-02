import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('應該立即回傳初始值', () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)
    expect(debounced.value).toBe('hello')
  })

  it('延遲時間未到前不應更新值', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)
    source.value = 'world'
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('hello')
  })

  it('延遲時間到後應更新為新值', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)
    source.value = 'world'
    await nextTick()
    vi.advanceTimersByTime(300)
    expect(debounced.value).toBe('world')
  })

  it('快速連續變更時只套用最後一個值', async () => {
    const source = ref('a')
    const debounced = useDebounce(source, 300)

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(100)

    source.value = 'c'
    await nextTick()
    vi.advanceTimersByTime(300)

    expect(debounced.value).toBe('c')
  })

  it('接受純值（非 ref）作為來源', async () => {
    const debounced = useDebounce('static', 300)
    expect(debounced.value).toBe('static')
  })

  it('接受 getter 函式作為來源', async () => {
    const inner = ref(42)
    const debounced = useDebounce(() => inner.value, 300)
    expect(debounced.value).toBe(42)
    inner.value = 99
    await nextTick()
    vi.advanceTimersByTime(300)
    expect(debounced.value).toBe(99)
  })
})
