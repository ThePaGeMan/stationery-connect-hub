export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user' | 'manager';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Company DTO
export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Product DTO with RLS fields
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  companyId: string; // RLS field
  createdBy: string; // RLS field
  createdAt: string;
  updatedAt: string;
}

// Customer DTO with RLS fields
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyId: string; // RLS field
  createdBy: string; // RLS field
  createdAt: string;
  updatedAt: string;
}

// WhatsApp Blast DTO with RLS fields
export interface WhatsAppBlast {
  id: string;
  title: string;
  message: string;
  recipients: string[];
  status: 'draft' | 'sent' | 'scheduled';
  scheduledAt?: string;
  sentAt?: string;
  companyId: string; // RLS field
  createdBy: string; // RLS field
  createdAt: string;
  updatedAt: string;
}