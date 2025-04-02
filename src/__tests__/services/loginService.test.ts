import { mockSupabase, resetMocks } from '../__mocks__/supabaseMock';
import { AuthError } from '@supabase/supabase-js';

console.error = jest.fn();

const originalWindow = { ...window };
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://example.com',
  },
  writable: true,
});

jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase,
}));

import { signUp, signIn, signInWithProvider, signOut, resetPassword, updatePassword } from '@/services/loginService';

describe('Login Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMocks();
    (console.error as jest.Mock).mockClear();

    mockSupabase.auth.signUp.mockReset();
    mockSupabase.auth.signInWithPassword.mockReset();
    mockSupabase.auth.signInWithOAuth.mockReset();
    mockSupabase.auth.signOut.mockReset();
    mockSupabase.auth.resetPasswordForEmail.mockReset();
    mockSupabase.auth.updateUser.mockReset();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { value: originalWindow.location });
  });

  describe('signUp', () => {
    it('debe registrar un usuario correctamente', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockUser = { id: 'user123', email: userData.email };
      const mockData = { user: mockUser, session: null };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await signUp(userData);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores durante el registro', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockError = { message: 'El correo ya está registrado' } as AuthError;

      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await signUp(userData);

      expect(mockSupabase.auth.signUp).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error durante el registro:', mockError);
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('signIn', () => {
    it('debe iniciar sesión correctamente', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      const mockUser = { id: 'user123', email: credentials.email };
      const mockSession = { user: mockUser, access_token: 'token123' };
      const mockData = { user: mockUser, session: mockSession };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await signIn(credentials);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: credentials.email,
        password: credentials.password,
      });
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores durante el inicio de sesión', async () => {
      const credentials = {
        email: 'user@example.com',
        password: 'WrongPassword',
      };

      const mockError = { message: 'Credenciales inválidas' } as AuthError;

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await signIn(credentials);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error durante el inicio de sesión:', mockError);
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('signInWithProvider', () => {
    it('debe iniciar sesión con proveedor correctamente', async () => {
      const provider = 'google';

      const mockAuthUrl = 'https://auth.provider.com';
      const mockData = { url: mockAuthUrl };

      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await signInWithProvider(provider);

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider,
        options: {
          redirectTo: 'https://example.com/auth/callback',
        },
      });
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores durante el inicio de sesión con proveedor', async () => {
      const provider = 'facebook';

      const mockError = { message: 'Error de autenticación con proveedor' } as AuthError;

      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await signInWithProvider(provider);

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(`Error durante el inicio de sesión con ${provider}:`, mockError);
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('signOut', () => {
    it('debe cerrar sesión correctamente', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it('debe manejar errores durante el cierre de sesión', async () => {
      const mockError = { message: 'Error al cerrar sesión' } as AuthError;

      mockSupabase.auth.signOut.mockResolvedValue({
        error: mockError,
      });

      const result = await signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error durante el cierre de sesión:', mockError);
      expect(result.error).toBe(mockError);
    });
  });

  describe('resetPassword', () => {
    it('debe enviar email de restablecimiento correctamente', async () => {
      const email = 'user@example.com';
      const mockData = {};

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await resetPassword(email);

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email, {
        redirectTo: 'https://example.com/auth/reset-password',
      });
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores al enviar email de restablecimiento', async () => {
      const email = 'invalid@example.com';
      const mockError = { message: 'Usuario no encontrado' } as AuthError;

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await resetPassword(email);

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error al enviar email de restablecimiento:', mockError);
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('updatePassword', () => {
    it('debe actualizar la contraseña correctamente', async () => {
      const newPassword = 'NewPassword123!';
      const mockUser = { id: 'user123' };
      const mockData = { user: mockUser };

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await updatePassword(newPassword);

      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: newPassword,
      });
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('debe manejar errores al actualizar la contraseña', async () => {
      const newPassword = 'weak';
      const mockError = { message: 'La contraseña no cumple los requisitos de seguridad' } as AuthError;

      mockSupabase.auth.updateUser.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await updatePassword(newPassword);

      expect(mockSupabase.auth.updateUser).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error al actualizar contraseña:', mockError);
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });
});
