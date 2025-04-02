import { Session, User } from '@supabase/supabase-js';
import { RegisterFormData, LoginFormData } from '@/validations/authValidation';

export interface BaseCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends BaseCredentials {
  firstName?: string;
  lastName?: string;
}

export type SignInCredentials = BaseCredentials;

interface BaseAuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface AuthState extends BaseAuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated?: boolean;
}

export interface AuthContextType extends BaseAuthState {
  user: User | null;
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

interface BaseResponse {
  success: boolean;
  error?: string | null;
}

export interface AuthData {
  user: User | null;
  session: Session | null;
}

export interface AuthResponse extends BaseResponse {
  data?: AuthData | null;
}

export type LogoutResponse = BaseResponse;
