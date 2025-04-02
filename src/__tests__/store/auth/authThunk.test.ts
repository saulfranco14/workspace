import { registerUserThunk, loginUserThunk, logoutUserThunk } from '@/store/auth/thunk/authThunk';
import * as authService from '@/services/authService';
import { User } from '@supabase/supabase-js';

jest.mock('@/services/authService');

describe('AuthThunks', () => {
  const mockUser = { id: 'user123', email: 'test@example.com' } as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUserThunk', () => {
    const registerData = {
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'Test',
      lastName: 'User',
      acceptTerms: true,
    };

    test('debe crear un usuario con éxito', async () => {
      (authService.registerUser as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          session: null,
        },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await registerUserThunk(registerData)(dispatch, getState, undefined);

      expect(authService.registerUser).toHaveBeenCalledWith(registerData);
      expect(result.payload).toEqual({
        user: mockUser,
        session: null,
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores de registro', async () => {
      const errorMessage = 'Error en el registro';
      (authService.registerUser as jest.Mock).mockResolvedValue({
        success: false,
        error: errorMessage,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await registerUserThunk(registerData)(dispatch, getState, undefined);

      expect(authService.registerUser).toHaveBeenCalledWith(registerData);
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });

    test('debe manejar excepciones', async () => {
      const errorMessage = 'Error de red';
      (authService.registerUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await registerUserThunk(registerData)(dispatch, getState, undefined);

      expect(authService.registerUser).toHaveBeenCalledWith(registerData);
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('loginUserThunk', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Password123',
    };

    test('debe iniciar sesión con éxito', async () => {
      (authService.loginUser as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          session: null,
        },
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await loginUserThunk(loginData)(dispatch, getState, undefined);

      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(result.payload).toEqual({
        user: mockUser,
        session: null,
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores de inicio de sesión', async () => {
      const errorMessage = 'Credenciales inválidas';
      (authService.loginUser as jest.Mock).mockResolvedValue({
        success: false,
        error: errorMessage,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await loginUserThunk(loginData)(dispatch, getState, undefined);

      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });

    test('debe manejar excepciones', async () => {
      const errorMessage = 'Error de red';
      (authService.loginUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await loginUserThunk(loginData)(dispatch, getState, undefined);

      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('logoutUserThunk', () => {
    test('debe cerrar sesión con éxito', async () => {
      (authService.logoutUser as jest.Mock).mockResolvedValue({
        success: true,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await logoutUserThunk()(dispatch, getState, undefined);

      expect(authService.logoutUser).toHaveBeenCalled();
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores al cerrar sesión', async () => {
      const errorMessage = 'Error al cerrar sesión';
      (authService.logoutUser as jest.Mock).mockResolvedValue({
        success: false,
        error: errorMessage,
      });

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await logoutUserThunk()(dispatch, getState, undefined);

      expect(authService.logoutUser).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });

    test('debe manejar excepciones', async () => {
      const errorMessage = 'Error de red';
      (authService.logoutUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await logoutUserThunk()(dispatch, getState, undefined);

      expect(authService.logoutUser).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });
});
