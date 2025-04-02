import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartEmpty from '@/components/cart/CartEmpty';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return (
      <a href={href} data-testid="mock-link">
        {children}
      </a>
    );
  };
});

jest.mock('react-icons/fi', () => ({
  FiShoppingBag: () => <span data-testid="icon-shopping-bag">ShoppingBag</span>,
  FiArrowLeft: () => <span data-testid="icon-arrow-left">ArrowLeft</span>,
}));

describe('CartEmpty', () => {
  test('debe renderizar correctamente el componente de carrito vacío', () => {
    render(<CartEmpty />);

    expect(screen.getByText('Mi Carrito')).toBeInTheDocument();
    expect(screen.getByTestId('icon-shopping-bag')).toBeInTheDocument();
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    expect(screen.getByText('Parece que aún no has agregado productos a tu carrito.')).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');

    expect(screen.getByText('Continuar comprando')).toBeInTheDocument();
    expect(screen.getByTestId('icon-arrow-left')).toBeInTheDocument();
  });
});
