import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddToCartButton from '@/components/cart/AddToCartButton';

const mockAddProductToCart = jest.fn();
const mockShowCart = jest.fn();

jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    addProductToCart: mockAddProductToCart,
    showCart: mockShowCart,
  }),
}));

jest.mock('react-icons/fi', () => ({
  FiShoppingCart: () => <span data-testid="icon-cart">Cart</span>,
}));

describe('AddToCartButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrar "Agregar al carrito" cuando hay stock disponible', () => {
    render(<AddToCartButton productId="prod1" stock={10} />);

    const button = screen.getByRole('button', { name: /agregar al carrito/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(screen.getByTestId('icon-cart')).toBeInTheDocument();
  });

  test('debe mostrar "Agotado" y estar deshabilitado cuando no hay stock', () => {
    render(<AddToCartButton productId="prod1" stock={0} />);

    const button = screen.getByRole('button', { name: /agotado/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  test('debe llamar a addProductToCart y showCart cuando se hace clic', async () => {
    mockAddProductToCart.mockResolvedValue(true);

    render(<AddToCartButton productId="prod1" stock={10} />);

    const button = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(button);

    expect(mockAddProductToCart).toHaveBeenCalledWith('prod1');

    await waitFor(() => {
      expect(mockShowCart).toHaveBeenCalled();
    });
  });

  test('debe mostrar estado de carga mientras añade el producto', async () => {
    mockAddProductToCart.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(true), 100);
        })
    );

    render(<AddToCartButton productId="prod1" stock={10} />);

    const button = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(button);

    expect(screen.getByText('Agregando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
    });
  });

  test('debe mostrar mensaje de error cuando falla la adición al carrito', async () => {
    mockAddProductToCart.mockRejectedValue(new Error('Error de prueba'));

    render(<AddToCartButton productId="prod1" stock={10} />);

    const button = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    });
  });

  test('debe mostrar mensaje de error cuando addProductToCart devuelve false', async () => {
    mockAddProductToCart.mockResolvedValue(false);

    render(<AddToCartButton productId="prod1" stock={10} />);

    const button = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('No se pudo añadir el producto al carrito')).toBeInTheDocument();
    });
  });
});
