import { registerUserThunk, loginUserThunk, logoutUserThunk } from '@/store/auth/thunk/authThunk';
import * as authService from '@/services/authService';
import { User } from '@supabase/supabase-js';

// Mock del servicio de autenticación
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
      // Configurar el mock
      (authService.registerUser as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          session: null,
        },
      });

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await registerUserThunk(registerData)(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.registerUser).toHaveBeenCalledWith(registerData);
      expect(result.payload).toEqual({
        user: mockUser,
        session: null,
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores de registro', async () => {
      // Configurar el mock para simular un error
      const errorMessage = 'Error en el registro';
      (authService.registerUser as jest.Mock).mockResolvedValue({
        success: false,
        error: errorMessage,
      });

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await registerUserThunk(registerData)(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.registerUser).toHaveBeenCalledWith(registerData);
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });

    test('debe manejar excepciones', async () => {
      // Configurar el mock para lanzar una excepción
      const errorMessage = 'Error de red';
      (authService.registerUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await registerUserThunk(registerData)(dispatch, getState, undefined);

      // Verificaciones
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
      // Configurar el mock
      (authService.loginUser as jest.Mock).mockResolvedValue({
        success: true,
        data: {
          user: mockUser,
          session: null,
        },
      });

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await loginUserThunk(loginData)(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(result.payload).toEqual({
        user: mockUser,
        session: null,
      });
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores de inicio de sesión', async () => {
      // Configurar el mock para simular un error
      const errorMessage = 'Credenciales inválidas';
      (authService.loginUser as jest.Mock).mockResolvedValue({
        success: false,
        error: errorMessage,
      });

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await loginUserThunk(loginData)(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });

    test('debe manejar excepciones', async () => {
      // Configurar el mock para lanzar una excepción
      const errorMessage = 'Error de red';
      (authService.loginUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await loginUserThunk(loginData)(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.loginUser).toHaveBeenCalledWith(loginData);
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('logoutUserThunk', () => {
    test('debe cerrar sesión con éxito', async () => {
      // Configurar el mock
      (authService.logoutUser as jest.Mock).mockResolvedValue({
        success: true,
      });

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await logoutUserThunk()(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.logoutUser).toHaveBeenCalled();
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    test('debe manejar errores al cerrar sesión', async () => {
      // Configurar el mock para simular un error
      const errorMessage = 'Error al cerrar sesión';
      (authService.logoutUser as jest.Mock).mockResolvedValue({
        success: false,
        error: errorMessage,
      });

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await logoutUserThunk()(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.logoutUser).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });

    test('debe manejar excepciones', async () => {
      // Configurar el mock para lanzar una excepción
      const errorMessage = 'Error de red';
      (authService.logoutUser as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Ejecutar el thunk
      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await logoutUserThunk()(dispatch, getState, undefined);

      // Verificaciones
      expect(authService.logoutUser).toHaveBeenCalled();
      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });
});
