import { defineStore } from 'pinia';

export interface AuthUser {
    id: string
    name: string
    email: string
    avatarUrl?: string
    // OAuth 提供者（Google / LINE）可能回傳的欄位
    picture?: string
    avatar?: string
    username?: string
}

export const useAuthStore = defineStore('auth', () => {
    // 1. 定義 State (資料)
    // useCookie 會自動連結瀏覽器的 Cookie，重新整理也不會不見！
    const token = useCookie<string | null>('auth_token');
    const user = useCookie<AuthUser | null>('auth_user');

    // 2. 定義 Actions (動作)

    // 登入：把資料存起來
    const login = (newToken: string, userData: AuthUser) => {
        token.value = newToken;
        user.value = userData;
    };

    // 登出：把 Cookie 清空
    const logout = () => {
        token.value = null;
        user.value = null;
        // 登出後強制重新整理或導回首頁，避免殘留狀態
        navigateTo('/');
    };

    // 檢查是否已登入 (只要有 Token 就算登入)
    const isAuthenticated = computed(() => !!token.value);

    return {
        token,
        user,
        isAuthenticated,
        login,
        logout,
    };
});