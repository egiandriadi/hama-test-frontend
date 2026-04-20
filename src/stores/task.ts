import { defineStore } from 'pinia'
import { ref } from 'vue'
import { taskService } from '@/services/task.service'
import type { Task, TaskPagination, TaskFormData } from '@/types/task'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const pagination = ref<TaskPagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTasks(page: number = 1, search: string = '') {
    loading.value = true
    error.value = null
    try {
      const response = await taskService.getAll(page, search)
      if (response.success) {
        tasks.value = response.data.data
        pagination.value = response.data
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  async function createTask(data: TaskFormData) {
    loading.value = true
    try {
      await taskService.create(data)
      await fetchTasks(pagination.value?.current_page || 1)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to create task'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id: string, data: TaskFormData) {
    loading.value = true
    try {
      await taskService.update(id, data)
      await fetchTasks(pagination.value?.current_page || 1)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to update task'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTask(id: string) {
    loading.value = true
    try {
      await taskService.delete(id)
      await fetchTasks(pagination.value?.current_page || 1)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    pagination,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
})
