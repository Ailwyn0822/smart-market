import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    const { toasts } = useToast()
    toasts.value = []
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('新增成功 toast', () => {
    const { toasts, success } = useToast()
    success('操作成功')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].type).toBe('success')
    expect(toasts.value[0].message).toBe('操作成功')
  })

  it('新增錯誤 toast', () => {
    const { toasts, error } = useToast()
    error('發生錯誤')
    expect(toasts.value[0].type).toBe('error')
    expect(toasts.value[0].message).toBe('發生錯誤')
  })

  it('新增資訊 toast', () => {
    const { toasts, info } = useToast()
    info('提示訊息')
    expect(toasts.value[0].type).toBe('info')
  })

  it('新增警告 toast', () => {
    const { toasts, warning } = useToast()
    warning('警告訊息')
    expect(toasts.value[0].type).toBe('warning')
  })

  it('每個 toast 應有唯一的 id', () => {
    const { toasts, success } = useToast()
    success('first')
    success('second')
    const ids = toasts.value.map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('toast 應在指定時間後自動移除', () => {
    const { toasts, success } = useToast()
    success('auto-remove', 1000)
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(toasts.value).toHaveLength(0)
  })

  it('可依 id 手動移除指定 toast', () => {
    const { toasts, success, removeToast } = useToast()
    success('remove me')
    const id = toasts.value[0].id
    removeToast(id)
    expect(toasts.value).toHaveLength(0)
  })

  it('duration 為 0 時不應自動移除', () => {
    const { toasts, success } = useToast()
    success('永久訊息', 0)
    vi.advanceTimersByTime(99999)
    expect(toasts.value).toHaveLength(1)
  })
})
