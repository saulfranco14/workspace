import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useSession } from '@/hooks/useSession';
import authReducer from '@/store/auth/slices/authSlice';

jest.mock('@/config/supabaseClient', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn().mockImplementation((callback) => {
        return {
          data: {
            subscription: {
              unsubscribe: jest.fn(),
            },
          },
        };
      }),
    },
  },
}));

jest.mock('@/services/cart/cartService', () => ({
  migrateCart: jest.fn(),
}));

jest.mock('@/services/deviceService', () => ({
  getFingerprint: jest.fn().mockResolvedValue('device123'),
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        session: null,
        loading: false,
        error: null,
        success: false,
        ...initialState,
      },
    },
  });
};

const wrapper = ({ children }: { children: React.ReactNode }, store: any) => (
  <Provider store={store}>{children}</Provider>
);

describe('useSession', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe devolver session y user correctamente', () => {
    const mockSession = {
      user: { id: 'user123', email: 'user@example.com' },
      access_token: 'token123',
    };

    const store = createTestStore({
      session: mockSession,
    });

    const { result } = renderHook(() => useSession(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.session).toEqual(mockSession);
    expect(result.current.user).toEqual(mockSession.user);
  });

  test('debe devolver user como null cuando no hay session', () => {
    const store = createTestStore();

    const { result } = renderHook(() => useSession(), {
      wrapper: (props) => wrapper(props, store),
    });

    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  test('debe configurar el listener de onAuthStateChange al montar', () => {
    const store = createTestStore();

    renderHook(() => useSession(), {
      wrapper: (props) => wrapper(props, store),
    });

    const { supabase } = require('@/config/supabaseClient');
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
  });
});
