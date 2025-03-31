import { AuthState } from '@/app/interfaces/auth.interface';

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  session: null,
};
