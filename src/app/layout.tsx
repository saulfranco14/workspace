import type { Metadata } from 'next';
import './globals.css';
import { SupabaseProvider } from '@/app/providers/SupabaseProvider';
import StoreProvider from '@/app/providers/StoreProvider';
import { AuthProvider } from '@/app/contexts/AuthContext';
import CartDrawer from '@/app/components/cart/CartDrawer';
import { CartProvider } from '@/app/providers/CartProvider';
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
