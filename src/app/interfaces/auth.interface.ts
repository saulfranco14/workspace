import { Session } from '@supabase/supabase-js';
import { RegisterFormData } from '../validations/authValidation';
import { LoginFormData } from '../validations/authValidation';

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  session: Session | null;
  isAuthenticated?: boolean;
}

export interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  resetAuth: () => void;
}

export interface FormFieldsProps<T> {
  onSubmit: (data: T) => void;
  loading: boolean;
  success: boolean;
}

export type LoginFormFieldsProps = FormFieldsProps<LoginFormData>;
export type RegisterFormFieldsProps = FormFieldsProps<RegisterFormData>;
