import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartItem from '@/components/cart/CartItem';
import { CartItem as CartItemType } from '@/interfaces/cart.interface';

const mockUpdateQuantity = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    updateQuantity: mockUpdateQuantity,
    removeItem: mockRemoveItem,
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('CartItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockItem: CartItemType = {
    id: 'item1',
    cart_id: 'cart123',
    product_id: 'prod1',
    quantity: 2,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    product: {
      id: 'prod1',
      name: 'Planta Monstera',
      price: 29.99,
      image_url: '/images/monstera.jpg',
      stock: 10,
    },
  };

  const mockItemWithoutImage: CartItemType = {
    ...mockItem,
    product: {
      ...mockItem.product!,
      image_url: null,
    },
  };

  test('debe renderizar correctamente un item del carrito', () => {
    render(<CartItem item={mockItem} />);

    expect(screen.getByText('Planta Monstera')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    const image = screen.getByAltText('Planta Monstera');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/monstera.jpg');
  });

  test('debe mostrar un placeholder cuando no hay imagen', () => {
    render(<CartItem item={mockItemWithoutImage} />);
    expect(screen.getByText('Sin imagen')).toBeInTheDocument();
  });

  test('debe llamar updateQuantity al hacer click en los botones de cantidad', () => {
    render(<CartItem item={mockItem} />);
    const buttons = screen.getAllByRole('button');
    const decrementButton = buttons[0];
    const incrementButton = buttons[1];

    fireEvent.click(incrementButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('item1', 3);

    fireEvent.click(decrementButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('item1', 1);
  });

  test('debe llamar removeItem al hacer click en el botón de eliminar', () => {
    render(<CartItem item={mockItem} />);
    const buttons = screen.getAllByRole('button');
    const removeButton = buttons[2];

    fireEvent.click(removeButton);
    expect(mockRemoveItem).toHaveBeenCalledWith('item1');
  });

  test('debe deshabilitar el botón de decremento cuando la cantidad es 1', () => {
    const itemWithMinQuantity: CartItemType = {
      ...mockItem,
      quantity: 1,
    };

    render(<CartItem item={itemWithMinQuantity} />);
    const buttons = screen.getAllByRole('button');
    const decrementButton = buttons[0];

    expect(decrementButton).toBeDisabled();
  });

  test('debe deshabilitar el botón de incremento cuando la cantidad es igual al stock', () => {
    const itemWithMaxQuantity: CartItemType = {
      ...mockItem,
      quantity: 10,
    };

    render(<CartItem item={itemWithMaxQuantity} />);
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons[1];

    expect(incrementButton).toBeDisabled();
  });
});
