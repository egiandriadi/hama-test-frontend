<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task, TaskFormData } from '@/types/task'

const props = defineProps<{
  show: boolean
  task?: Task | null
  loading?: boolean
}>()

const emit = defineEmits(['close', 'submit'])

const form = ref<TaskFormData>({
  title: '',
  status: 'pending'
})

const errors = ref({
  title: ''
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title,
      status: newTask.status
    }
  } else {
    form.value = {
      title: '',
      status: 'pending'
    }
  }
  errors.value.title = ''
}, { immediate: true })

const validate = () => {
  let isValid = true
  errors.value.title = ''
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = () => {
  if (!validate()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ task ? 'Edit Task' : 'Create New Task' }}</h3>
        <button class="close-btn" @click="emit('close')">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            id="title"
            v-model="form.title"
            type="text"
            placeholder="What needs to be done?"
            :class="{ 'has-error': errors.title }"
          />
          <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="form.status">
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" :disabled="loading" @click="emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loader"></span>
            <span v-else>{{ task ? 'Update Task' : 'Create Task' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalEnter {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

input, select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

input:focus, select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

input.has-error {
  border-color: #ef4444;
}

.error-text {
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.btn-primary {
  background: #6366f1;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
