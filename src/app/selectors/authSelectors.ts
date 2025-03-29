import { RootState } from '@/app/store/store';

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthSuccess = (state: RootState) => state.auth.success;
export const selectAuthUser = (state: RootState) => state.auth.user;
