import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '@/types/auth'
import { apiService } from '@/services/api.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginRequest) {
    loading.value = true
    error.value = null
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials)
      
      user.value = response.user
      token.value = response.access_token
      localStorage.setItem('token', response.access_token)
      
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterRequest) {
    loading.value = true
    error.value = null
    try {
      const response = await apiService.post<RegisterResponse>('/auth/register', data)
      return response
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await apiService.post('/auth/logout', {})
    } catch {
      // Ignore logout errors, still clear local session
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  }
})
