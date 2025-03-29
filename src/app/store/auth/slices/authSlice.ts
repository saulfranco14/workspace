import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState } from '@/app/interfaces/auth.interface';
import { registerUserThunk } from '@/app/store/auth/thunk/authThunk';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

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
      state.success = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.success = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAuthState, logoutUser } = authSlice.actions;
export default authSlice.reducer;
