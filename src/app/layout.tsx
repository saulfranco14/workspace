import type { Metadata } from 'next';
import './globals.css';
import { SupabaseProvider } from './providers/SupabaseProvider';
import StoreProvider from './providers/StoreProvider';
import { AuthProvider } from './contexts/AuthContext';
import CartDrawer from './components/cart/CartDrawer';
import Header from './components/layout/Header';

export const metadata: Metadata = {
  title: 'E-commerce App',
  description: 'Aplicación de e-commerce con Next.js, TypeScript y Supabase',
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
              <Header />
              {children}
              <CartDrawer />
            </AuthProvider>
          </SupabaseProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
