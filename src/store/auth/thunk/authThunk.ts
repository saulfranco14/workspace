import { registerUser, loginUser, logoutUser } from '@/services/authService';
import { RegisterFormData, LoginFormData } from '@/validations/authValidation';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido durante el registro');
    }
  }
);

export const loginUserThunk = createAsyncThunk('auth/login', async (userData: LoginFormData, { rejectWithValue }) => {
  try {
    const response = await loginUser(userData);
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Error desconocido durante el inicio de sesión');
  }
});

export const logoutUserThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await logoutUser();
    if (!response.success) {
      return rejectWithValue(response.error);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Error desconocido al cerrar sesión');
  }
});
