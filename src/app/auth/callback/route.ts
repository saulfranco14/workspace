import { NextRequest, NextResponse } from 'next/server';

import { supabase } from '@/app/config/supabaseClient';
import { getFingerprint } from '@/app/services/deviceService';
import { migrateCart } from '@/app/services/cart/cartService';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error al intercambiar código por sesión:', error);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    if (data.user) {
      const fingerprint = await getFingerprint();
      if (fingerprint) {
        await migrateCart(data.user.id, fingerprint);
      }
    }
  }

  return NextResponse.redirect(new URL('/', request.url));
}
