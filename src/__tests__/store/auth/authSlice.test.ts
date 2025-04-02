import { User } from '@supabase/supabase-js';
import authReducer, { resetAuthState, logoutUser, setUser } from '@/store/auth/slices/authSlice';
import { initialState } from '@/store/auth/initialState';
import { registerUserThunk, loginUserThunk, logoutUserThunk } from '@/store/auth/thunk/authThunk';

describe('AuthSlice reducers', () => {
  test('debe devolver el estado inicial', () => {
    expect(authReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('resetAuthState debe restablecer errores y éxito', () => {
    const previousState = {
      ...initialState,
      error: 'Error previo',
      success: true,
    };

    expect(authReducer(previousState, resetAuthState())).toEqual({
      ...previousState,
      error: null,
      success: false,
    });
  });

  test('logoutUser debe restablecer el estado del usuario', () => {
    const previousState = {
      ...initialState,
      user: { id: 'user123' } as User,
      success: true,
      error: 'Error previo',
      loading: true,
    };

    expect(authReducer(previousState, logoutUser())).toEqual({
      ...initialState,
    });
  });

  test('setUser debe actualizar el usuario y estado de autenticación', () => {
    const mockUser = { id: 'user123', email: 'test@example.com' } as User;

    expect(authReducer(initialState, setUser(mockUser))).toEqual({
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
    });

    const stateWithUser = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
    };

    expect(authReducer(stateWithUser, setUser(null))).toEqual({
      ...initialState,
      user: null,
      isAuthenticated: false,
    });
  });
});

describe('AuthSlice extraReducers', () => {
  test('registerUserThunk.pending debe establecer loading y resetear errores', () => {
    const action = { type: registerUserThunk.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  test('registerUserThunk.fulfilled debe actualizar el estado con éxito', () => {
    const mockUser = { id: 'user123', email: 'test@example.com' } as User;
    const action = {
      type: registerUserThunk.fulfilled.type,
      payload: { user: mockUser, session: null },
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      user: mockUser,
      success: true,
    });
  });

  test('registerUserThunk.rejected debe manejar errores', () => {
    const action = {
      type: registerUserThunk.rejected.type,
      payload: 'Error de registro',
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Error de registro',
    });
  });

  test('loginUserThunk.pending debe establecer loading y resetear errores', () => {
    const action = { type: loginUserThunk.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  test('loginUserThunk.fulfilled debe actualizar el estado con éxito', () => {
    const mockUser = { id: 'user123', email: 'test@example.com' } as User;
    const action = {
      type: loginUserThunk.fulfilled.type,
      payload: { user: mockUser, session: null },
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      user: mockUser,
      success: true,
    });
  });

  test('loginUserThunk.rejected debe manejar errores', () => {
    const action = {
      type: loginUserThunk.rejected.type,
      payload: 'Error de inicio de sesión',
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Error de inicio de sesión',
    });
  });

  test('logoutUserThunk.pending debe establecer loading', () => {
    const action = { type: logoutUserThunk.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
    });
  });

  test('logoutUserThunk.fulfilled debe restablecer el usuario', () => {
    const stateWithUser = {
      ...initialState,
      user: { id: 'user123' } as User,
    };

    const action = { type: logoutUserThunk.fulfilled.type };
    const state = authReducer(stateWithUser, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      user: null,
      success: true,
    });
  });

  test('logoutUserThunk.rejected debe manejar errores', () => {
    const action = {
      type: logoutUserThunk.rejected.type,
      payload: 'Error al cerrar sesión',
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Error al cerrar sesión',
    });
  });
});
