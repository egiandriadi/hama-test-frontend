import { apiService } from './api.service'
import type { Task, TaskPagination, ApiResponse, TaskFormData } from '@/types/task'

export const taskService = {
  async getAll(page: number = 1, search: string = ''): Promise<ApiResponse<TaskPagination>> {
    return apiService.get<ApiResponse<TaskPagination>>('/tasks', { page, search })
  },

  async create(data: TaskFormData): Promise<ApiResponse<Task>> {
    return apiService.post<ApiResponse<Task>>('/tasks', data)
  },

  async update(id: string, data: TaskFormData): Promise<ApiResponse<Task>> {
    return apiService.put<ApiResponse<Task>>(`/tasks/${id}`, data)
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiService.delete<ApiResponse<null>>(`/tasks/${id}`)
  }
}
