import axios from 'axios'

const BASE_URL = 'http://localhost/api/v1'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add the bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    // Log out user if 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(new Error(message))
  }
)

export const apiService = {
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const response = await apiClient.get<T>(endpoint, { params })
    return response.data
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await apiClient.post<T>(endpoint, data)
    return response.data
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await apiClient.put<T>(endpoint, data)
    return response.data
  },

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await apiClient.patch<T>(endpoint, data)
    return response.data
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await apiClient.delete<T>(endpoint)
    return response.data
  },
}
