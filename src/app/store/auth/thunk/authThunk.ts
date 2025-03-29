import { registerUser } from '@/app/services/authService';
import { RegisterFormData } from '@/app/validations/authValidation';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      if (!response.success) {
        return rejectWithValue(response.error);
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Error desconocido durante el registro');
    }
  }
);
