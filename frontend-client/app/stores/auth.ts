import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
    // 1. 定義 State (資料)
    // useCookie 會自動連結瀏覽器的 Cookie，重新整理也不會不見！
    const token = useCookie<string | null>('auth_token');
    const user = useCookie<any>('auth_user'); // 暫時把個資也存 Cookie，之後會改用 Token 換取

    // 2. 定義 Actions (動作)

    // 登入：把資料存起來
    const login = (newToken: string, userData: any) => {
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