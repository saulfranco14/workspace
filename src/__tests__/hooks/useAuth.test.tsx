import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/selectors/authSelectors', () => ({
  selectAuthUser: jest.fn((state) => state.auth.user),
  selectAuthLoading: jest.fn((state) => state.auth.loading),
  selectAuthError: jest.fn((state) => state.auth.error),
  selectAuthSuccess: jest.fn((state) => state.auth.success),
  selectAuthIsAuthenticated: jest.fn((state) => state.auth.isAuthenticated),
  selectAuthSession: jest.fn((state) => state.auth.session),
  selectAuthState: jest.fn((state) => state.auth),
}));

const mockLogoutUserThunk = jest.fn().mockImplementation(() => () => Promise.resolve());

jest.mock('@/store/auth/thunk/authThunk', () => ({
  registerUserThunk: jest.fn().mockImplementation(() => () => Promise.resolve()),
  loginUserThunk: jest.fn().mockImplementation(() => () => Promise.resolve()),
  logoutUserThunk: jest.fn().mockImplementation(() => {
    return mockLogoutUserThunk();
  }),
  checkUserAuthThunk: jest.fn().mockImplementation(() => () => Promise.resolve()),
}));

jest.mock('@/store/auth/slices/authSlice', () => {
  const originalModule = jest.requireActual('@/store/auth/slices/authSlice');
  return {
    ...originalModule,
    resetAuthState: jest.fn(() => ({ type: 'auth/resetAuthState' })),
  };
});

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  isAuthenticated: boolean;
}

const mockAuthReducer = (
  state: AuthState = {
    user: null,
    session: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
  },
  action: { type: string }
) => {
  switch (action.type) {
    case 'auth/resetAuthState':
      return {
        ...state,
        error: null,
        success: false,
      };
    default:
      return state;
  }
};

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: mockAuthReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        session: null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: false,
        ...initialState,
      },
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }, store: any) => (
  <Provider store={store}>{children}</Provider>
);

describe('useAuth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe devolver el estado inicial correcto cuando no hay usuario', () => {
    const store = createTestStore();

    const { result } = renderHook(() => useAuth(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('debe devolver isAuthenticated como true cuando hay un usuario', () => {
    const store = createTestStore({
      user: { id: 'user123', email: 'user@example.com' },
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.user).toEqual({ id: 'user123', email: 'user@example.com' });
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('debe llamar a logoutUserThunk al hacer logout', async () => {
    const store = createTestStore({
      user: { id: 'user123', email: 'user@example.com' },
      isAuthenticated: true,
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const { result } = renderHook(() => useAuth(), {
      wrapper: (props) => wrapper(props, store),
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(dispatchSpy).toHaveBeenCalled();

    dispatchSpy.mockRestore();
  });

  test('debe llamar a resetAuthState al resetear el estado de autenticación', () => {
    const store = createTestStore({
      error: 'Error de autenticación',
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const { result } = renderHook(() => useAuth(), {
      wrapper: (props) => wrapper(props, store),
    });

    act(() => {
      result.current.resetAuth();
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'auth/resetAuthState',
      })
    );

    dispatchSpy.mockRestore();
  });
});
