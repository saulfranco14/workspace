import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/profile', '/checkout', '/favorites'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*', '/favorites/:path*', '/login', '/registrarse'],
};
