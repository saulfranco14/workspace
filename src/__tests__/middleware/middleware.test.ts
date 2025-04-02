// Mock los módulos antes de importarlos
jest.mock('next/server', () => {
  return {
    NextRequest: jest.fn().mockImplementation(function () {
      return {
        nextUrl: { pathname: '' },
        url: '',
      };
    }),
    NextResponse: {
      next: jest.fn().mockReturnValue({
        headers: new Headers(),
      }),
      redirect: jest.fn().mockImplementation((url) => ({
        url: url.toString(),
        headers: new Headers(),
      })),
    },
  };
});

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createMiddlewareClient: jest.fn(),
}));

// Importar después de los mocks
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware/middleware';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

describe('Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockSupabase: any;

  beforeEach(() => {
    // Restablecer mocks
    jest.clearAllMocks();

    // Preparar mocks para cada test
    mockRequest = {
      nextUrl: new URL('http://localhost:3000'),
      url: 'http://localhost:3000',
    };

    mockResponse = {
      headers: new Headers(),
    };

    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
    };

    // Configurar el mock de createMiddlewareClient
    (createMiddlewareClient as jest.Mock).mockReturnValue(mockSupabase);

    // Mock de NextResponse.next
    (NextResponse.next as jest.Mock).mockReturnValue(mockResponse);
  });

  test('debe permitir el acceso a rutas no protegidas sin sesión', async () => {
    // Configurar una ruta no protegida
    mockRequest.nextUrl.pathname = '/productos';

    // Configurar respuesta de getSession (no hay sesión)
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const result = await middleware(mockRequest);

    // Verificar que createMiddlewareClient fue llamado
    expect(createMiddlewareClient).toHaveBeenCalledWith({
      req: mockRequest,
      res: expect.any(Object),
    });

    // Verificar que no se llamó a getSession para una ruta no protegida
    expect(mockSupabase.auth.getSession).not.toHaveBeenCalled();

    // Verificar que se devolvió NextResponse.next()
    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe(mockResponse);
  });

  test('debe redireccionar a /login cuando se accede a una ruta protegida sin sesión', async () => {
    // Configurar una ruta protegida
    mockRequest.nextUrl.pathname = '/profile';

    // Configurar respuesta de getSession (no hay sesión)
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    await middleware(mockRequest);

    // Verificar que getSession fue llamado
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();

    // Verificar que NextResponse.redirect fue llamado con la URL correcta
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/login?redirect=%2Fprofile'),
      })
    );
  });

  test('debe permitir el acceso a rutas protegidas con sesión válida', async () => {
    // Configurar una ruta protegida
    mockRequest.nextUrl.pathname = '/favorites';

    // Configurar respuesta de getSession (hay sesión)
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user123' } } },
    });

    const result = await middleware(mockRequest);

    // Verificar que getSession fue llamado
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();

    // Verificar que se devolvió NextResponse.next()
    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe(mockResponse);
  });

  test('debe verificar cada ruta protegida', async () => {
    const protectedRoutes = ['/profile', '/checkout', '/favorites'];

    for (const route of protectedRoutes) {
      jest.clearAllMocks();

      // Configurar una ruta protegida
      mockRequest.nextUrl.pathname = route;

      // Configurar respuesta de getSession (no hay sesión)
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      await middleware(mockRequest);

      // Verificar que getSession fue llamado
      expect(mockSupabase.auth.getSession).toHaveBeenCalled();

      // Verificar que NextResponse.redirect fue llamado
      expect(NextResponse.redirect).toHaveBeenCalled();
    }
  });
});
