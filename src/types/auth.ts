export interface User {
  id: string;
  email: string;
  name: string;
  company_id: string;
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
}

// Product DTO with RLS fields
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  company_id: string; // RLS field
  created_by: string; // RLS field
}

// Customer DTO with RLS fields
export interface Customer {
  id?: string;
  name: string;
  location: string;
  budget: number;
  interests: string[];
  whatsapp_number: string;
  group: "Premium" | "Rural" | "Budget Buyers";
  last_contact: string;
  created_by: string; // RLS field
}

// WhatsApp Blast DTO with RLS fields
export interface WhatsAppBlast {
  id: string;
  title: string;
  message: string;
  recipients: string[];
  status: 'draft' | 'sent' | 'scheduled';
  scheduled_at?: string;
  sent_at?: string;
  company_id: string; // RLS field
  created_by: string; // RLS field
}