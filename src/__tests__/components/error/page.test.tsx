import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthErrorPage from '@/components/error/page';

const mockPush = jest.fn();
const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

jest.mock('next/link', () => {
  return function MockedLink({ children, href }: { children: React.ReactNode; href: string }) {
    return (
      <a href={href} data-testid={`link-to-${href}`}>
        {children}
      </a>
    );
  };
});

describe('AuthErrorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockGet.mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('debe mostrar el mensaje de error por defecto cuando no hay query parameter', () => {
    render(<AuthErrorPage />);
    expect(screen.getByText('Ha ocurrido un error durante la autenticación')).toBeInTheDocument();
  });

  test('debe mostrar el mensaje de error personalizado cuando se proporciona en los query parameters', () => {
    const errorMessage = 'Error personalizado de prueba';
    mockGet.mockReturnValue(encodeURIComponent(errorMessage));
    render(<AuthErrorPage />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('debe redirigir al usuario después de 5 segundos', async () => {
    render(<AuthErrorPage />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('debe mostrar enlaces para ir a la página de inicio de sesión y la página principal', () => {
    render(<AuthErrorPage />);
    expect(screen.getByText('Volver a iniciar sesión')).toBeInTheDocument();
    expect(screen.getByTestId('link-to-/auth/login')).toBeInTheDocument();
    expect(screen.getByText('Volver a la página de inicio')).toBeInTheDocument();
    expect(screen.getByTestId('link-to-/')).toBeInTheDocument();
  });

  test('debe mostrar el mensaje de redirección', () => {
    render(<AuthErrorPage />);
    expect(screen.getByText('Serás redirigido a la página de inicio en 5 segundos...')).toBeInTheDocument();
  });

  test('debe limpiar el timeout cuando el componente se desmonta', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<AuthErrorPage />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
