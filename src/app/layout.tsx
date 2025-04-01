import type { Metadata } from 'next';
import './globals.css';
import { SupabaseProvider } from './providers/SupabaseProvider';
import StoreProvider from './providers/StoreProvider';
import { AuthProvider } from './contexts/AuthContext';
import CartDrawer from './components/cart/CartDrawer';
import Header from './components/layout/Header';
import { CartProvider } from './providers/CartProvider';

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
