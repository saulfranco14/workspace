import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SupabaseProvider, useSupabase } from '@/providers/SupabaseProvider';
import { supabase } from '@/config/supabaseClient';
import { getSession } from '@/services/authService';

jest.mock('@/config/supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: jest.fn().mockResolvedValue({}),
      onAuthStateChange: jest.fn().mockImplementation(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
  },
}));

jest.mock('@/services/authService', () => ({
  getSession: jest.fn(),
}));

function TestComponent() {
  const { user, session, isLoading, signOut } = useSupabase();
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'No user'}</div>
      <div data-testid="session">{session ? 'Has session' : 'No session'}</div>
      <button data-testid="sign-out" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}

describe('SupabaseProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe inicializar el contexto con valores por defecto', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    await act(async () => {
      render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('session')).toHaveTextContent('No session');
  });

  test('debe establecer usuario y sesión cuando están disponibles', async () => {
    const mockUser = { id: 'user123', email: 'user@example.com' };
    const mockSession = { user: mockUser, access_token: 'token123', expires_at: 12345 };

    (getSession as jest.Mock).mockResolvedValue(mockSession);

    await act(async () => {
      render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
    expect(screen.getByTestId('session')).toHaveTextContent('Has session');
  });

  test('debe configurar el listener de onAuthStateChange', async () => {
    await act(async () => {
      render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
  });

  test('debe llamar a signOut correctamente', async () => {
    await act(async () => {
      render(
        <SupabaseProvider>
          <TestComponent />
        </SupabaseProvider>
      );
    });

    await act(async () => {
      screen.getByTestId('sign-out').click();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
