import { RootState } from '@/store/store';

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthSuccess = (state: RootState) => state.auth.success;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthSession = (state: RootState) => state.auth.session;
export const selectAuthIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthState = (state: RootState) => state.auth;
