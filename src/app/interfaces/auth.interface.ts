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
}
