import type { User } from './auth'

export interface Task {
  id: string
  title: string
  status: 'pending' | 'done'
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
  creator: User
  updater: User | null
}

export interface TaskPagination {
  current_page: number
  data: Task[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface TaskFormData {
  title: string
  status: string
}
