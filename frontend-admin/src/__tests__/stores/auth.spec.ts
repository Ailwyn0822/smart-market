import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@smartmarket.com',
  avatar: null,
  role: 'admin' as const,
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts unauthenticated when localStorage is empty', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('login() sets token and user', () => {
    const store = useAuthStore()
    store.login('test-token', mockUser)
    expect(store.token).toBe('test-token')
    expect(store.user?.email).toBe('admin@smartmarket.com')
    expect(store.isAuthenticated).toBe(true)
  })

  it('login() persists to localStorage', () => {
    const store = useAuthStore()
    store.login('test-token', mockUser)
    expect(localStorage.getItem('admin_token')).toBe('test-token')
    expect(JSON.parse(localStorage.getItem('admin_user')!).email).toBe('admin@smartmarket.com')
  })

  it('logout() clears token and user', () => {
    const store = useAuthStore()
    store.login('test-token', mockUser)
    store.logout()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('logout() removes data from localStorage', () => {
    const store = useAuthStore()
    store.login('test-token', mockUser)
    store.logout()
    expect(localStorage.getItem('admin_token')).toBeNull()
    expect(localStorage.getItem('admin_user')).toBeNull()
  })

  it('isAdmin is true when role is admin', () => {
    const store = useAuthStore()
    store.login('test-token', mockUser)
    expect(store.isAdmin).toBe(true)
  })

  it('isAdmin is false when role is not admin', () => {
    const store = useAuthStore()
    store.login('test-token', { ...mockUser, role: 'user' as any })
    expect(store.isAdmin).toBe(false)
  })
})
