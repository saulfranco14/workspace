import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartDrawer from '@/components/cart/CartDrawer';
import { CartItem as CartItemType } from '@/interfaces/cart.interface';

const mockHideCart = jest.fn();
const mockClearCart = jest.fn();
const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    items: [],
    isOpen: true,
    hideCart: mockHideCart,
    totalItems: 0,
    totalPrice: 0,
    clearCart: mockClearCart,
  }),
}));

jest.mock('@/components/cart/CartItem', () => {
  return jest.fn(({ item }) => (
    <div data-testid={`cart-item-${item.id}`}>
      {item.product?.name} - {item.quantity} x ${item.product?.price}
    </div>
  ));
});

jest.mock('react-icons/fi', () => ({
  FiX: () => <span data-testid="icon-close">X</span>,
  FiTrash2: () => <span data-testid="icon-trash">Trash</span>,
  FiShoppingBag: () => <span data-testid="icon-bag">Bag</span>,
}));

describe('CartDrawer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrar el carrito vacío cuando no hay items', () => {
    render(<CartDrawer />);
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    const continuarButton = screen.getByText('Continuar comprando');
    expect(continuarButton).toBeInTheDocument();
    fireEvent.click(continuarButton);
    expect(mockHideCart).toHaveBeenCalled();
  });

  test('debe mostrar items y opciones de checkout cuando hay items en el carrito', () => {
    const mockItems: CartItemType[] = [
      {
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
      },
      {
        id: 'item2',
        cart_id: 'cart123',
        product_id: 'prod2',
        quantity: 1,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        product: {
          id: 'prod2',
          name: 'Maceta Cerámica',
          price: 15.99,
          image_url: '/images/pot.jpg',
          stock: 5,
        },
      },
    ];

    jest.spyOn(require('@/hooks/useCart'), 'useCart').mockReturnValue({
      items: mockItems,
      isOpen: true,
      hideCart: mockHideCart,
      totalItems: 3,
      totalPrice: 75.97,
      clearCart: mockClearCart,
    });

    render(<CartDrawer />);
    expect(screen.getByTestId('cart-item-item1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-item2')).toBeInTheDocument();
    const priceElements = screen.getAllByText(/75\.97/);
    expect(priceElements.length).toBe(2);
    const vaciarButton = screen.getByText(/Vaciar carrito/i);
    expect(vaciarButton).toBeInTheDocument();
    fireEvent.click(vaciarButton);
    expect(mockClearCart).toHaveBeenCalled();
    const closeButton = screen.getByTestId('icon-close').closest('button');
    fireEvent.click(closeButton!);
    expect(mockHideCart).toHaveBeenCalled();
  });

  test('debe redirigir a la página de checkout al hacer click en Proceder al pago', () => {
    jest.spyOn(require('@/hooks/useCart'), 'useCart').mockReturnValue({
      items: [
        {
          id: 'item1',
          cart_id: 'cart123',
          product_id: 'prod1',
          quantity: 1,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          product: {
            id: 'prod1',
            name: 'Planta',
            price: 10,
            image_url: '/image.jpg',
            stock: 5,
          },
        },
      ],
      isOpen: true,
      hideCart: mockHideCart,
      totalItems: 1,
      totalPrice: 10,
      clearCart: mockClearCart,
    });

    render(<CartDrawer />);
    const checkoutButton = screen.getByText('Proceder al pago');
    expect(checkoutButton).toBeInTheDocument();
    fireEvent.click(checkoutButton);
    expect(mockHideCart).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/checkout');
  });

  test('debe cerrar el drawer al hacer click fuera de él', () => {
    render(<CartDrawer />);
    const overlay = document.querySelector('.sc-686bcedb-11');
    expect(overlay).not.toBeNull();
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockHideCart).toHaveBeenCalled();
    }
  });

  test('no debe renderizar nada cuando isOpen es false', () => {
    jest.spyOn(require('@/hooks/useCart'), 'useCart').mockReturnValue({
      items: [],
      isOpen: false,
      hideCart: mockHideCart,
      totalItems: 0,
      totalPrice: 0,
      clearCart: mockClearCart,
    });

    const { container } = render(<CartDrawer />);
    expect(container).toBeEmptyDOMElement();
  });
});
