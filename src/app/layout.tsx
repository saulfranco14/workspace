import type { Metadata } from 'next';
import './globals.css';

import { AuthProvider } from '@/contexts/AuthContext';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { CartProvider } from '@/providers/CartProvider';
import StoreProvider from '@/providers/StoreProvider';
import CartDrawer from '@/components/cart/CartDrawer';
import Header from '@/app/layout/Header';

export const metadata: Metadata = {
  title: 'PlantaShop',
  description: 'PlantaShop es una tienda en línea para plantas y productos de jardinería',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <SupabaseProvider>
            <AuthProvider>
              <CartProvider>
                <Header />
                {children}
                <CartDrawer />
              </CartProvider>
            </AuthProvider>
          </SupabaseProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
