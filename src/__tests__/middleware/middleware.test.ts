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

import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware/middleware';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

describe('Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

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

    (createMiddlewareClient as jest.Mock).mockReturnValue(mockSupabase);

    (NextResponse.next as jest.Mock).mockReturnValue(mockResponse);
  });

  test('debe permitir el acceso a rutas no protegidas sin sesión', async () => {
    mockRequest.nextUrl.pathname = '/productos';

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const result = await middleware(mockRequest);

    expect(createMiddlewareClient).toHaveBeenCalledWith({
      req: mockRequest,
      res: expect.any(Object),
    });

    expect(mockSupabase.auth.getSession).not.toHaveBeenCalled();

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe(mockResponse);
  });

  test('debe redireccionar a /login cuando se accede a una ruta protegida sin sesión', async () => {
    mockRequest.nextUrl.pathname = '/profile';

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    await middleware(mockRequest);

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/login?redirect=%2Fprofile'),
      })
    );
  });

  test('debe permitir el acceso a rutas protegidas con sesión válida', async () => {
    mockRequest.nextUrl.pathname = '/favorites';

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'user123' } } },
    });

    const result = await middleware(mockRequest);

    expect(mockSupabase.auth.getSession).toHaveBeenCalled();

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe(mockResponse);
  });

  test('debe verificar cada ruta protegida', async () => {
    const protectedRoutes = ['/profile', '/checkout', '/favorites'];

    for (const route of protectedRoutes) {
      jest.clearAllMocks();

      mockRequest.nextUrl.pathname = route;

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
      });

      await middleware(mockRequest);

      expect(mockSupabase.auth.getSession).toHaveBeenCalled();

      expect(NextResponse.redirect).toHaveBeenCalled();
    }
  });
});
