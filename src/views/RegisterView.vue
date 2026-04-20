<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { RegisterRequest } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<RegisterRequest>({
  name: '',
  email: '',
  password: ''
})

const confirmPassword = ref('')

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)

const validate = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.name.trim()) {
    errors.name = 'Full name is required'
    isValid = false
  }

  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (form.password !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validate()) return

  try {
    await authStore.register(form)
    // After registration, redirect to login so they can sign in
    router.push({ name: 'login' })
  } catch {
    // Error is handled by the store
  }
}
</script>

<template>
  <div class="register-container">
    <div class="glass-card">
      <div class="register-header">
        <h1>Create Account</h1>
        <p>Join us to start managing your tasks</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <div class="input-wrapper" :class="{ 'has-error': errors.name }">
            <input 
              id="name"
              v-model="form.name"
              type="text" 
              placeholder="John Doe"
            />
          </div>
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <div class="input-wrapper" :class="{ 'has-error': errors.email }">
            <input 
              id="email"
              v-model="form.email"
              type="email" 
              placeholder="john@example.com"
            />
          </div>
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper" :class="{ 'has-error': errors.password }">
            <input 
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••"
            />
          </div>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-wrapper" :class="{ 'has-error': errors.confirmPassword }">
            <input 
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
        </div>

        <div v-if="authStore.error" class="alert-error">
          {{ authStore.error }}
        </div>

        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="loader"></span>
          <span v-else>Register</span>
        </button>
      </form>

      <div class="register-footer">
        <p>Already have an account? <router-link to="/login">Sign In</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.glass-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: #666;
  font-size: 0.95rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a4a4a;
}

.input-wrapper input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e1e1e1;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-wrapper.has-error input {
  border-color: #ff4d4f;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
}

.input-wrapper {
  position: relative;
}

.error-text {
  color: #ff4d4f;
  font-size: 0.75rem;
}

.alert-error {
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
}

.submit-btn {
  margin-top: 1rem;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:hover:not(:disabled) {
  background: #5a6fd6;
}

.submit-btn:disabled {
  opacity: 0.7;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.register-footer a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}
</style>
