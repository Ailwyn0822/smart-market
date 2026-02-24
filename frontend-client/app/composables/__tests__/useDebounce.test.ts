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

  it('returns the initial value immediately', () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)
    expect(debounced.value).toBe('hello')
  })

  it('does not update before the delay elapses', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)
    source.value = 'world'
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(debounced.value).toBe('hello')
  })

  it('updates after the delay elapses', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)
    source.value = 'world'
    await nextTick()
    vi.advanceTimersByTime(300)
    expect(debounced.value).toBe('world')
  })

  it('debounces rapid changes and only applies the last value', async () => {
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

  it('accepts a plain value as the source', async () => {
    const debounced = useDebounce('static', 300)
    expect(debounced.value).toBe('static')
  })

  it('works with a getter function as the source', async () => {
    const inner = ref(42)
    const debounced = useDebounce(() => inner.value, 300)
    expect(debounced.value).toBe(42)
    inner.value = 99
    await nextTick()
    vi.advanceTimersByTime(300)
    expect(debounced.value).toBe(99)
  })
})
