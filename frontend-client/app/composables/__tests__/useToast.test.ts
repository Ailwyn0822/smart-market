import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a success toast', () => {
    const { toasts, success } = useToast()
    success('操作成功')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].type).toBe('success')
    expect(toasts.value[0].message).toBe('操作成功')
  })

  it('adds an error toast', () => {
    const { toasts, error } = useToast()
    error('發生錯誤')
    expect(toasts.value[0].type).toBe('error')
    expect(toasts.value[0].message).toBe('發生錯誤')
  })

  it('adds an info toast', () => {
    const { toasts, info } = useToast()
    info('提示訊息')
    expect(toasts.value[0].type).toBe('info')
  })

  it('adds a warning toast', () => {
    const { toasts, warning } = useToast()
    warning('警告訊息')
    expect(toasts.value[0].type).toBe('warning')
  })

  it('assigns a unique id to each toast', () => {
    const { toasts, success } = useToast()
    success('first')
    success('second')
    const ids = toasts.value.map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('auto-removes toast after duration', () => {
    const { toasts, success } = useToast()
    success('auto-remove', 1000)
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(toasts.value).toHaveLength(0)
  })

  it('manually removes a toast by id', () => {
    const { toasts, success, removeToast } = useToast()
    success('remove me')
    const id = toasts.value[0].id
    removeToast(id)
    expect(toasts.value).toHaveLength(0)
  })
})
