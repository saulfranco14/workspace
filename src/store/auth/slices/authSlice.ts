import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthData } from '@/interfaces/auth.interface';
import { registerUserThunk, loginUserThunk, logoutUserThunk } from '@/store/auth/thunk/authThunk';
import { User, Session } from '@supabase/supabase-js';
import { initialState } from '@/store/auth/initialState';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.success = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.session = null;
      state.success = false;
      state.error = null;
      state.loading = false;
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.user = action.payload?.user || null;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data?.user || null;
        state.session = action.payload?.data?.session || null;
        state.success = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action: PayloadAction<AuthData | null | undefined>) => {
        state.loading = false;
        state.user = action.payload?.user || null;
        state.session = action.payload?.session || null;
        state.success = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.session = null;
        state.success = true;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuthState, logoutUser, setUser, setSession } = authSlice.actions;
export default authSlice.reducer;
