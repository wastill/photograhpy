import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  getProfile: () => Promise<User | null>;
  updateProfile: (profileData: any) => Promise<User>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<any>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // 登录
      login: async (username, password) => {
        set({ loading: true });
        
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || '登录失败');
          }

          if (data.code !== 200) {
            throw new Error(data.message || '登录失败');
          }

          const { token, user } = data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          return data.data;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // 登出
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // 获取用户信息
      getProfile: async () => {
        const { token } = get();
        if (!token) return null;

        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.code === 200) {
            set({ user: data.data });
            return data.data;
          } else {
            // Token可能已过期
            get().logout();
            return null;
          }
        } catch (error) {
          console.error('获取用户信息失败:', error);
          get().logout();
          return null;
        }
      },

      // 更新用户信息
      updateProfile: async (profileData) => {
        const { token } = get();
        if (!token) throw new Error('未登录');

        try {
          const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
          });

          const data = await response.json();

          if (!response.ok || data.code !== 200) {
            throw new Error(data.message || '更新失败');
          }

          set({ user: data.data });
          return data.data;
        } catch (error) {
          throw error;
        }
      },

      // 修改密码
      changePassword: async (oldPassword, newPassword) => {
        const { token } = get();
        if (!token) throw new Error('未登录');

        try {
          const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              old_password: oldPassword,
              new_password: newPassword,
            }),
          });

          const data = await response.json();

          if (!response.ok || data.code !== 200) {
            throw new Error(data.message || '修改密码失败');
          }

          return data;
        } catch (error) {
          throw error;
        }
      },

      // 检查认证状态
      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const user = await get().getProfile();
          if (user) {
            set({ isAuthenticated: true });
            return true;
          } else {
            set({ isAuthenticated: false });
            return false;
          }
        } catch (error) {
          set({ isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);