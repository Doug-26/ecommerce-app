export interface User {
  id?: number | string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}