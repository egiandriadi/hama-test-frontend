export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface RegisterRequest extends LoginRequest {
  name: string
}

export interface RegisterResponse {
  message: string
  user: User
}

