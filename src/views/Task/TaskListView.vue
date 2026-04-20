<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useTaskStore } from '@/stores/task'
import TaskFormModal from '@/components/Task/TaskFormModal.vue'
import ConfirmDialog from '@/components/Common/ConfirmDialog.vue'
import type { Task, TaskFormData } from '@/types/task'

const taskStore = useTaskStore()

const search = ref('')
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedTask = ref<Task | null>(null)

// Load tasks on mount
onMounted(() => {
  taskStore.fetchTasks()
})

// Debounced search
let timeout: ReturnType<typeof setTimeout> | undefined
watch(search, (newVal) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    taskStore.fetchTasks(1, newVal)
  }, 500)
})

const handleCreate = () => {
  selectedTask.value = null
  isFormModalOpen.value = true
}

const handleEdit = (task: Task) => {
  selectedTask.value = task
  isFormModalOpen.value = true
}

const handleDeleteClick = (task: Task) => {
  selectedTask.value = task
  isDeleteModalOpen.value = true
}

const handleFormSubmit = async (data: TaskFormData) => {
  try {
    if (selectedTask.value) {
      await taskStore.updateTask(selectedTask.value.id, data)
    } else {
      await taskStore.createTask(data)
    }
    isFormModalOpen.value = false
  } catch {
    // Error handled by store
  }
}

const confirmDelete = async () => {
  if (selectedTask.value) {
    try {
      await taskStore.deleteTask(selectedTask.value.id)
      isDeleteModalOpen.value = false
    } catch {
      // Error handled by store
    }
  }
}

const changePage = (page: number) => {
  if (page < 1 || (taskStore.pagination && page > taskStore.pagination.last_page)) return
  taskStore.fetchTasks(page, search.value)
}

const getStatusClass = (status: string) => {
  return {
    'status-pending': status === 'pending',
    'status-done': status === 'done',
  }
}
</script>

<template>
  <div class="task-page">
    <div class="page-header">
      <div>
        <h1>Tasks</h1>
        <p>Manage your daily activities and progress</p>
      </div>
      <button class="add-btn" @click="handleCreate">
        <span>+</span> New Task
      </button>
    </div>

    <div class="table-container">
      <div class="table-controls">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            v-model="search" 
            type="text" 
            placeholder="Search tasks..."
          />
        </div>
      </div>

      <div class="table-wrapper">
        <table v-if="!taskStore.loading || taskStore.tasks.length > 0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Created At</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in taskStore.tasks" :key="task.id">
              <td class="task-title">{{ task.title }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(task.status)">
                  {{ task.status.replace('_', ' ') }}
                </span>
              </td>
              <td>
                <div class="user-info">
                  <span class="user-name">{{ task.creator.name }}</span>
                </div>
              </td>
              <td class="text-muted">{{ new Date(task.created_at).toLocaleDateString() }}</td>
              <td class="text-right">
                <div class="action-buttons">
                  <button class="icon-btn edit" @click="handleEdit(task)" title="Edit">✏️</button>
                  <button class="icon-btn delete" @click="handleDeleteClick(task)" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Loading Overlay -->
        <div v-if="taskStore.loading" class="loading-overlay">
          <div class="loader-large"></div>
        </div>

        <!-- Empty State -->
        <div v-if="!taskStore.loading && taskStore.tasks.length === 0" class="empty-state">
          <span>📁</span>
          <p>No tasks found. Start by creating one!</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="taskStore.pagination && taskStore.pagination.last_page > 1" class="pagination">
        <button 
          :disabled="!taskStore.pagination.prev_page_url || taskStore.loading"
          @click="changePage(taskStore.pagination.current_page - 1)"
        >
          Previous
        </button>
        <div class="page-numbers">
          <button 
            v-for="link in taskStore.pagination.links.filter(l => !isNaN(Number(l.label)))"
            :key="link.label"
            :class="{ active: link.active }"
            :disabled="taskStore.loading"
            @click="changePage(Number(link.label))"
          >
            {{ link.label }}
          </button>
        </div>
        <button 
          :disabled="!taskStore.pagination.next_page_url || taskStore.loading"
          @click="changePage(taskStore.pagination.current_page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modals -->
    <TaskFormModal 
      :show="isFormModalOpen"
      :task="selectedTask"
      :loading="taskStore.loading"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <ConfirmDialog 
      :show="isDeleteModalOpen"
      title="Delete Task"
      :message="`Are you sure you want to delete '${selectedTask?.title}'? This action cannot be undone.`"
      :loading="taskStore.loading"
      @cancel="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.task-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #6b7280;
  font-size: 1.1rem;
}

.add-btn {
  background: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
}

.add-btn:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.table-container {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  overflow: hidden;
}

.table-controls {
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.search-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  border-radius: 12px;
  border: 2px solid #f3f4f6;
  outline: none;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.search-wrapper input:focus {
  border-color: #6366f1;
}

.table-wrapper {
  position: relative;
  min-height: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
}

tr:hover td {
  background: #f9fafb;
}

.task-title {
  font-weight: 600;
  max-width: 300px;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-pending { background: #fef3c7; color: #d97706; }
.status-done { background: #d1fae5; color: #059669; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.icon-btn {
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn.edit:hover { background: #e0e7ff; color: #4f46e5; }
.icon-btn.delete:hover { background: #fee2e2; color: #ef4444; }

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid #f3f4f6;
}

.pagination button {
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4b5563;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-numbers button {
  padding: 0.6rem 1rem;
}

.page-numbers button.active {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loader-large {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s linear infinite;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  color: #9ca3af;
}

.empty-state span {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.text-right { text-align: right; }
.text-muted { color: #6b7280; font-size: 0.875rem; }

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .add-btn { width: 100%; justify-content: center; }
  
  .table-wrapper { overflow-x: auto; }
}
</style>
