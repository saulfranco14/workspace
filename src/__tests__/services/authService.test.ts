import { mockSupabase, resetMocks } from '../__mocks__/supabaseMock';
import { RegisterFormData, LoginFormData } from '@/validations/authValidation';

console.error = jest.fn();

jest.mock('@/config/supabaseClient', () => ({
  supabase: mockSupabase,
}));

import { getSession, getCurrentUser, registerUser, loginUser, logoutUser } from '@/services/authService';

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetMocks();
    (console.error as jest.Mock).mockClear();

    mockSupabase.auth.getSession.mockReset();
    mockSupabase.auth.signUp.mockReset();
    mockSupabase.auth.signInWithPassword.mockReset();
    mockSupabase.auth.signOut.mockReset();
  });

  describe('getSession', () => {
    it('debe retornar la sesión cuando es exitosa', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'user@example.com',
        },
        access_token: 'token123',
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await getSession();

      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });

    it('debe retornar null y registrar error cuando falla', async () => {
      const mockError = { message: 'Error al obtener sesión' };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: mockError,
      });

      const result = await getSession();

      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Error al obtener la sesión:', mockError.message);
      expect(result).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('debe retornar el usuario de la sesión actual', async () => {
      const mockUser = { id: 'user123', email: 'user@example.com' };
      const mockSession = { user: mockUser, access_token: 'token123' };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await getCurrentUser();

      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('debe retornar null cuando no hay sesión', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await getCurrentUser();

      expect(mockSupabase.auth.getSession).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('debe registrar un usuario correctamente', async () => {
      const userData: RegisterFormData = {
        email: 'newuser@example.com',
        password: 'Password123!',
      };

      const mockUser = { id: 'newuser123', email: userData.email };
      const mockData = { user: mockUser, session: null };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await registerUser(userData);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('debe manejar errores durante el registro', async () => {
      const userData: RegisterFormData = {
        email: 'existinguser@example.com',
        password: 'Password123!',
      };

      const mockError = { message: 'El correo ya está registrado' };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await registerUser(userData);

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError.message);
    });

    it('debe manejar errores inesperados', async () => {
      const userData: RegisterFormData = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      mockSupabase.auth.signUp.mockRejectedValue(new Error('Error inesperado de red'));

      const result = await registerUser(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error inesperado de red');
    });
  });

  describe('loginUser', () => {
    it('debe iniciar sesión correctamente', async () => {
      const userData: LoginFormData = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      const mockUser = { id: 'user123', email: userData.email };
      const mockSession = { user: mockUser, access_token: 'token123' };
      const mockData = { user: mockUser, session: mockSession };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await loginUser(userData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('debe manejar errores durante el inicio de sesión', async () => {
      const userData: LoginFormData = {
        email: 'user@example.com',
        password: 'WrongPassword',
      };

      const mockError = { message: 'Credenciales inválidas' };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const result = await loginUser(userData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: userData.email,
        password: userData.password,
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError.message);
    });

    it('debe manejar errores inesperados', async () => {
      const userData: LoginFormData = {
        email: 'user@example.com',
        password: 'Password123!',
      };

      mockSupabase.auth.signInWithPassword.mockRejectedValue(new Error('Error de conexión'));

      const result = await loginUser(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de conexión');
    });
  });

  describe('logoutUser', () => {
    it('debe cerrar sesión correctamente', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      });

      const result = await logoutUser();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('debe manejar errores durante el cierre de sesión', async () => {
      const mockError = { message: 'Error al cerrar sesión' };

      mockSupabase.auth.signOut.mockResolvedValue({
        error: mockError,
      });

      const result = await logoutUser();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError.message);
    });

    it('debe manejar errores inesperados', async () => {
      mockSupabase.auth.signOut.mockRejectedValue(new Error('Error de timeout'));

      const result = await logoutUser();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error de timeout');
    });
  });
});
